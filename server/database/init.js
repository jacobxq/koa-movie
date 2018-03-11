const mongoose = require('mongoose')
const glob = require('glob')
const db = 'mongodb://127.0.0.1:27018/koa-movie'
const {resolve} = require('path')
mongoose.Promise = global.Promise

exports.initSchema = () => {
  glob.sync((resolve(__dirname, './schema/', '**/*.js'))).forEach(require)
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw Error('数据库挂了')
      }
    })
  
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw Error('数据库挂了')
      }
    })
  
    mongoose.connection.on('open', err => {
      resolve('ok')
      console.log('MongoDB start success')
    })
  })
}