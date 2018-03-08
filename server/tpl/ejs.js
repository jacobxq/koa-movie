module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.bundle.min.js"></script>
</head>
<body>
  <div class="container"> 
    <div class="row">
      <div class="col-md-8">
        <h1><%= name %></h1>
        <p><%= des %></p>
      </div>
      <div class="col-md-4">
        <h1>测试动态 ejs 模版引擎</h1>
      </div>
    </div>
  </div>
</body>
</html>
`
