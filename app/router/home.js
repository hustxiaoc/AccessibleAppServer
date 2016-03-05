var _ = require('lodash');
var AV = require('leanengine');
var Banner = AV.Object.extend('banner');
var App = AV.Object.extend('app');
var Top = AV.Object.extend('top');
var Category = AV.Object.extend('category');

var router = new(require('koa-router'))({
    prefix: '/api'
});


router.get('/recommend', function*() {
    var request = {
        banner: new AV.Query(Banner).limit(10).find(),
        top:new AV.Query(Top).limit(3).find()
    }
    var data = yield request;
    var tops = data.top;

    var map = {};
    if(tops && tops.length) {
        tops.forEach(function(top){
            var apps = top.get('apps').split(',');
            if(apps.length) {
                apps.map(function(appId){
                    appId = appId.trim();
                    map[appId] = new AV.Query(App).get(appId);
                });
            }
        });
    }

    var appsInfo = yield map;
    var _tops = [];
    if(tops && tops.length) {
        tops.forEach(function(top){
            var _top = _.extend( {id:top.id},top.attributes);
            var apps = top.get('apps').split(',');
            if(apps.length) {
                _top.apps = apps.map(function(appId){
                    var info = appsInfo[appId.trim()]
                    return info;
                });
            }
            _tops.push(_top);
        });
    }

    data.top = _tops;

    this.json = data;
});


router.get('/category', function*() {
    this.json = yield new AV.Query(Category).find();
});

module.exports = router;