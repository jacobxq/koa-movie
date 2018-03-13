const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const cors = require('koa2-cors')
const R = require('ramda')
// const convert = require('koa-convert')
const {join} = require('path')
const {connect, initSchema} = require('./database/init')
const MIDDLEWARES = ['router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}



// console.log(cors())
// app.use(cors({
//   origin: '*',
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))

// app.use(views(resolve(__dirname, './views'), {
//   extension: 'pug'
// }))

// app.use(async (ctx, next) => {
//   await ctx.render('index', {
//     name: "Jacob",
//     des: '搞事情views，还有谁'
//   })
// })

// app.use(async (ctx, next) => {
//   ctx.type = 'text/html;charset=utf-8'
//   ctx.body = pug.render(pugTpl, {
//     name: 'Jocob',
//     des: '搞事情'
//   })
// })

;(async () => {
  const aa = await connect()
  initSchema()

  // require('./tasks/movie')
  // require('./tasks/api')
  require('./tasks/trailer')

  const app = new Koa()
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
  });
  await useMiddlewares(app)

  app.listen(5566)
})()
