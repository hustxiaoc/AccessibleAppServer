var AV = require('leanengine');
var Comment = AV.Object.extend('comment');
var App = AV.Object.extend('app');
var User = AV.User;

var router = new(require('koa-router'))({
    prefix: '/api/comment'
});

router.post('/post', function*() {
    var body = this.request.body,
        appId = body.appId,
        score = ~~body.score,
        content = body.content;

    appId = appId && appId.trim();
    content = content && content.trim();

    if (!(appId && score && score <= 5)) {
        this.throw(401);
    } else {
        var user = new User({
            objectId: this.userId,
        });
        var app = new App({
            objectId: appId,
        });

        var commentQuery = new AV.Query(Comment);
        commentQuery.limit(1);
        commentQuery.equalTo('userId', user);
        commentQuery.equalTo('appId', app);

        var count = yield commentQuery.count();
        if (count) {
          this.throw(403);
        }

        var comment = new Comment();

        comment.set('appId', app);
        comment.set('content', content);
        comment.set('score', score);
        comment.set('userId', user);
        app.increment('comment_count');
        app.increment('score', score);
        var ret = yield comment.save();
        yield app.save();
        this.json = ret;
    }
});


router.get('/app/:id', function*() {
    var params = this.params,
        pageSize = ~~this.query.pageSize || 20,
        page = ~~this.query.page,
        id = params.id;

    var commentQuery = new AV.Query(Comment);
    commentQuery.skip(page * pageSize);
    commentQuery.limit(pageSize);
    commentQuery.equalTo('appId', new App({
        objectId: id
    }));
    var count = yield commentQuery.count();
    var ret = yield commentQuery.find();
    this.json = {
        total: count,
        list: ret
    };
});

router.get('/:id', function*() {
    var params = this.params,
        id = params.id;

    this.json = yield new AV.Query(Comment).get(id);
});

module.exports = router;
