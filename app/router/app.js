var _ = require('lodash');
var AV = require('leanengine');
var App = AV.Object.extend('app');
var Category = AV.Object.extend('category');
var Petition = AV.Object.extend('petition');
var User = AV.User;

var router = new(require('koa-router'))({
    prefix: '/api/app'
});

router.post('/:id/petition', function*() {
  var params = this.params,
      id = params.id;

  var user = new User({
      objectId: this.userId,
  });
  var app = new App({
      objectId: id,
  });

  var petitionQuery = new AV.Query(Petition);
  petitionQuery.limit(1);
  petitionQuery.equalTo('userId', user);
  petitionQuery.equalTo('appId', app);

  var count = yield petitionQuery.count();
  if (count) {
    this.throw(403);
  }

  var petition = new Petition();
  petition.set('userId', user);
  petition.set('appId', app);
  app.increment('petition');
  yield [app.save(), petition.save()];
  var app = yield new AV.Query(App).get(id);
  this.json = app.get('petition');
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
        ret = yield ret.map(function(item){
          return new AV.Query(App).get(item.id);
        });
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


    appQuery.addAscending('rank');
    appQuery.addDescending('score');
    
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

    var app = yield new AV.Query(App).get(id);
    var cate = yield  new AV.Query(Category).get(app.get('cateId').id);
    var parentCate;
    var parentId = String(cate.get('parentId')||'');
    if(parentId && parentId != '0') {
        parentCate = yield new AV.Query(Category).get(parentId);
    }
    var data = _.extend({}, app.attributes,{id: id, cateId: cate});
    if(parentCate) {
        data.parentCateId = parentCate;
    }
    this.json = data;
});

module.exports = router;
