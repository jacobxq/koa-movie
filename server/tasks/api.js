const rp = require('request-promise-native')

async function fetchMovie (item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

    const res = await rp(url)

    return res
}

;(async () => {
  let movies = [
    { 
      doubanId: 1907966,
      title: '疯狂原始人',
      rate: 8.7,
      poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p1867084027.jpg'
    },
    {
      doubanId: 1291832,
      title: '低俗小说',
      rate: 8.8,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1910902213.jpg'
    }]

    movies.map(async movie => {
      let movieData = await fetchMovie(movie)
  
      try {
        movieData = JSON.parse(movieData)

        console.log(movieData.rating)
      } catch (e) {
        console.log(e)
      }
    })
})()