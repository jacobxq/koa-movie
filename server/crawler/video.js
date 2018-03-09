const puppeteer = require('puppeteer')

const doubanId = 6390825
const base = `https://movie.douban.com/subject/${doubanId}`
const videoBase = `https://movie.douban.com/trailer/226827`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(base, {
    waitUntil: 'networkidle2'
  })

  await sleep(1000)

  const result = await page.evaluate(() => {
    const $ = window.$
    var it = $('.related-pic-video')

    if (it && it.length > 0) {
      var link = it.attr('href')
      var cover = it.find('img').attr('src')

      return {
        link,
        cover
      }
    }  
    return {}
  })

  let video

  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })

    await sleep(2000)

    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if (it && it.length > 0) {
        return it.attr('src')
      }
      return ''
    })
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }

  browser.close()

  // process.send('aa')
  process.send(data)
  await sleep(100)
  process.exit(0)
})()