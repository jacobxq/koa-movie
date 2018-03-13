const cp = require('child_process')
const {resolve} = require('path')
const mongoose = require('mongoose')

const Movie = mongoose.model('Movie')

;(async () => {
  let movies = await Movie.find({
    $or: [
      {video: {$exists: false}},
      {video: null}
    ]
  }).exec()

  let invoked = false
  let script = resolve(__dirname, '../crawler/video')
  let child = cp.fork(script, [])


  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code' + code)
    if (err) console.log(err)
  })

  child.on('message', async data => {
    let doubanId = data.doubanId

    let movie = await Movie.findOne({
      doubanId: doubanId
    })
    
    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      await movie.remove()
    }
  })

  child.send(movies)
})()