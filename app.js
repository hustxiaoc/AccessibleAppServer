'use strict';
var fs = require('fs'),
    path = require('path'),
    koa = require('koa'),
    express = require('./express');

var app = koa();

//load middlewares
var middlewares = ['body-parser','json', 'security', 'onerror'];
try {
    var middlewareDir = path.resolve(__dirname, './app/middleware');
    middlewares.forEach(function(file){
        require(path.resolve(middlewareDir, file+'.js'))(app);
    });

}catch(err){
    //console.log(err);
}


//load routes

try{
    var routerDir = path.resolve(__dirname, './app/router');
    fs.readdirSync(routerDir).forEach(function(filePath){
        var router = require(path.resolve(routerDir, filePath));
        app.use(router.routes());
    });
}catch(err){
    console.log(err);
}

app.use(function*(next) {
  if (this.status === 404) {
    this.status = 200;
    return express(this.req, this.res);
  } else {
    yield next;
  }
});

module.exports = app;
