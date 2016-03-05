var AV = require('leanengine');
var Banner = AV.Object.extend('banner');


var router = new(require('koa-router'))({
    prefix: '/api/banner'
});


router.get('/', function*() {
    var bannerQuery = new AV.Query(Banner);
    this.json = yield bannerQuery.limit(10).find();
});


module.exports = router;