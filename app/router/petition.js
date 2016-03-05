/*
* 请愿
* */

var AV = require('leanengine');
var Petition = AV.Object.extend('petition');
var App = AV.Object.extend('app');

var router = new(require('koa-router'))({
  prefix: '/api/petition'
});

router.post('/post', function* (){
  var body = this.request.body,
    appId = body.appId,
    userId = body.userId;

  appId = appId && appId.trim();

  if (!(appId && content && score && score <= 5)) {
    this.json = false;
  } else {
    var comment = new Petition();
    var app = new App({
      objectId: appId
    });
    comment.set('appId', app);
    comment.set('content', content);
    comment.set('score', score);
    comment.set('userId', new AV.User({
      objectId: userId
    }));
    app.increment('comment_count');
    app.increment('score', score);
    var ret = yield comment.save();
    yield app.save();
    this.json = ret;
  }
});


module.exports = router;