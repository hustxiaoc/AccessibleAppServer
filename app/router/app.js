var AV = require('leanengine');
var App = AV.Object.extend('app');

var router = new(require('koa-router'))({
    prefix: '/api/app'
});


router.get('/', function*() {
    var query = new AV.Query(App);
    query.limit(50);
    this.json = yield query.find();
});

module.exports = router;