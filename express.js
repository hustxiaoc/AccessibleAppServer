var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var AV = require('leanengine');

var app = express();

// 加载云代码方法
app.use(AV.Cloud);

// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({ secret: '09c711c0-7d74-11e5-8379-3c15c2bfa156', maxAge: 3600000, fetchUser: true }));

// 强制使用 https
app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());

app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
//router.post('/login', function(req, res, next) {
//  var username = req.body.username;
//  var password = req.body.password;
//  console.log(req.body);
//  AV.User.logIn(username, password, {
//    success: function(user) {
//      console.log(user);
//      res.send(user);
//    },
//    error: function(user, err) {
//      res.send(err);
//    }
//  })
//});
//
//app.use('/api/user', router);

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  res.status(404).end('Not Found');
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).end(err.toString());
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500).end('internal error');
});

module.exports = app;