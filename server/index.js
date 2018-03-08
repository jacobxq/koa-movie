const Koa = require('koa')
const views = require('koa-views')
const app = new Koa()
const {resolve} = require('path')

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