module.exports = `
doctype html
html
  head
    meta(charset='UTF-8')
    meta(name='viewport' content='width=device-width, initial-scale=1, user-scalable=no')
    meta(http-equiv='X-UA-Compatible' content='ie=edge')
    title Koa Server Pug
    link(href='https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css' rel='stylesheet')
    script(src='https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js')
    script(src='https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.bundle.min.js')
  body
    .container
      .row
        .col-md-8
          h1 Hi #{name}
          p #{des}
        .col-md-4
          p 测试动态 Pug 模版引擎
`
