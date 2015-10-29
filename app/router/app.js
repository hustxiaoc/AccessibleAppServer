var AV = require('leanengine');
var App = AV.Object.extend('app');
var Category = AV.Object.extend('category');

var router = new(require('koa-router'))({
    prefix: '/api/app'
});


router.get('/', function*() {
    var query = this.query,
        search = query.search,
        cateId = query.cateId,
        page = ~~query.page,
        pageSize = ~~query.pageSize || 20;

    search = search && search.trim();
    cateId = cateId && cateId.trim();

    var ret;
    if (search) {
        var sid = query.sid;
        sid = sid && sid.trim();
        var searchQuery = new AV.SearchQuery('app');
        searchQuery.queryString(search);
        searchQuery.limit(pageSize);
        if (sid) {
            searchQuery.sid(sid);
        }
        ret = yield searchQuery.find();
        this.json = {
            total: searchQuery._hits,
            sid: searchQuery._sid,
            list: ret
        };
        return;
    }
    var appQuery = new AV.Query(App);
    if (cateId) {
        appQuery.equalTo('cateId', new Category({
            objectId: cateId
        }));
    }
    appQuery.skip(page * pageSize);
    appQuery.limit(pageSize);
    var count = yield appQuery.count();
    ret = yield appQuery.find();
    this.json = {
        total: count,
        list: ret
    };
});

router.get('/:id', function*() {
    var params = this.params,
        id = params.id;

    this.json = yield new AV.Query(App).get(id);
});

module.exports = router;