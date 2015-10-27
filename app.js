'use strict';
var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    koa = require('koa');

var app = koa();

//load middlewares
try {
    var middlewareDir = path.resolve(__dirname, './app/middleware');
    fs.readdirSync(middlewareDir).forEach(function(filePath){
        require(path.resolve(middlewareDir, filePath))(app);
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
    //console.log(err);
}


var server = new http.Server();
var express_app = require('./express_app');

app.listen = function () {
    var handle = app.callback();
    server.listen.apply(server, arguments);

    server.on('request', function(req, res) {
        var url = req.url;
        if(url.indexOf('/__engine') === 0 || url.indexOf('/1') === 0) {
            return express_app.apply(null, arguments);
        }
        handle.apply(null, arguments);
    });
    return server;
};

module.exports = app;