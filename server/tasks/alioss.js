var co = require('co')
var OSS = require('ali-oss')
var nanoid = require('nanoid')
var request = require('request')
var fs = require('mz/fs')
const config = require('../config')
var {resolve} = require('path')

var client = new OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket
})

function downImg(url, key = '') {  
  var opts = {url}
  var streamPath = resolve(__dirname, key)
  return new Promise((resolve, reject) => {  
    request  
      .get(opts)  
      .on('response', (response) => {  
        console.log("type:", response.headers['content-type'])  
      })  
      .pipe(fs.createWriteStream(streamPath))
      .on("error", (e) => {  
        console.log("pipe error", e)  
        resolve('')
      })
      .on("finish", () => {  
        console.log('下载' + key + '成功')
        resolve(key)
      })  
      // .on("close", () => {  
      //   console.log("close")
      // })  
  })  
}

let movies = [
  { 
    doubanId: 3445906,
    title: '古墓丽影：源起之战 Tomb Raider',
    rate: 8.7,
    poster: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2512717509.webp',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2514914002.jpg?1519792621',
    video: 'http://vt1.doubanio.com/201803102157/8c1e56d4569f0e5d0723a2ace86c0fa2/view/movie/M/302270967.mp4'
  },
  {
    doubanId: 20435622,
    title: '环太平洋：雷霆再起 Pacific Rim: Uprising',
    rate: 8.8,
    poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2512983475.webp',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2515687880.jpg?1520483945',
    video: 'http://vt1.doubanio.com/201803102158/5e878e4dc49e4811d88c62a9891b7801/view/movie/M/302280308.mp4'
  }
]

co(function* () {

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    if (movie.video && !movie.videoKey) {
      let poster = yield downImg(movie.poster, nanoid() + '.png')
      let cover = yield downImg(movie.cover, nanoid() + '.png')
      let video = yield downImg(movie.video, nanoid() + '.mp4')
      console.log('下载成功')
  

      var stream = fs.createReadStream(resolve(__dirname, poster))
      var size = fs.statSync(resolve(__dirname, poster)).size
      var posterOss = yield client.putStream(poster, stream, {contentLength: size})
      console.log('上传poster成功')

      var stream = fs.createReadStream(resolve(__dirname, cover))
      var size = fs.statSync(resolve(__dirname, cover)).size
      var coverOss = yield client.putStream(cover, stream, {contentLength: size})
      console.log('上传cover成功')

      // var stream = fs.createReadStream(resolve(__dirname, video))
      // var size = fs.statSync(resolve(__dirname, video)).size
      // var videoOss = yield client.putStream(video, stream, {contentLength: size})
      var result = yield client.multipartUpload(video, resolve(__dirname, video), {
        progress: function* (p) {
          console.log('Progress: ' + p);
        },
        meta: {
          year: 2017,
          people: 'test'
        }
      });
      // var head = yield client.head(video);
      // console.log(head);
      console.log('上传video成功')
      
  
      yield fs.unlink(resolve(__dirname, poster))
      yield fs.unlink(resolve(__dirname, cover))
      yield fs.unlink(resolve(__dirname, video))
  
      movies[i].posterKey = poster
      movies[i].coverKey = cover
      movies[i].videoKey = video
      console.log('删除成功')
    }
  }
}).catch(function (err) {
  console.log(err)
})




