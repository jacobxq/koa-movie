const Koa = require('koa')
const views = require('koa-views')
const cors = require('koa2-cors')
// const convert = require('koa-convert')
const {resolve} = require('path')

const app = new Koa()
// console.log(cors())
// app.use(cors({
//   origin: '*',
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    name: "Jacob",
    des: '搞事情views，还有谁'
  })
})

// app.use(async (ctx, next) => {
//   ctx.type = 'text/html;charset=utf-8'
//   ctx.body = pug.render(pugTpl, {
//     name: 'Jocob',
//     des: '搞事情'
//   })
// })

app.listen(5566)