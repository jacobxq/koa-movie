var co = require('co')
var OSS = require('ali-oss')
var nanoid = require('nanoid')
var request = require('request')
var fs = require('mz/fs')
const config = require('../config')
var {resolve} = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

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



co(function* () {
  let movies = yield Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  }).exec()
  for (let i = 0; i < movies.length; i++) {
    console.log('总资源数：' + movies.length, '当前个数：' + i)
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

      try {
        var result = yield client.multipartUpload(video, resolve(__dirname, video), {
          progress: function* (p) {
            console.log('Progress: ' + p)
          }
        })
        console.log('上传video成功')
      } catch (e) {
        yield fs.unlink(resolve(__dirname, poster))
        yield fs.unlink(resolve(__dirname, cover))
        yield fs.unlink(resolve(__dirname, video))
        yield client.deleteMulti([poster, cover], {
          quiet: true
        })
        console.log('删除报错资源成功')
        continue;
      }

      
  
      yield fs.unlink(resolve(__dirname, poster))
      yield fs.unlink(resolve(__dirname, cover))
      yield fs.unlink(resolve(__dirname, video))
      console.log('删除成功')
  
      movies[i].posterKey = poster
      movies[i].coverKey = cover
      movies[i].videoKey = video

      yield movie.save()
    }
  }
  console.log('上传资源到阿里oss成功')
}).catch(function (err) {
  console.log(err)
})
