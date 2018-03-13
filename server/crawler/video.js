const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const trailerBase = `https://movie.douban.com/trailer/`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

process.on('message', async (movies) => {
  console.log('Start visit the target page')
  console.log(movies)

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId

    await page.goto(base + doubanId, {
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
  
  
    // process.send('aa')
    console.log(data)
    process.send(data)
  }
  browser.close()
  
  await sleep(100)
  process.exit(0)
})