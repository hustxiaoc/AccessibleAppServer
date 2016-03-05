var AV = require('leanengine');
var User = AV.User;
var secret = process.env.LC_APP_MASTER_KEY;
var utils = require('../libs/utils');

User._saveCurrentUser = function() {};

var router = new(require('koa-router'))({
    prefix: '/api/user'
});


function getUserToken(user) {
    var now = Date.now();
    var data = [now,user.id].join('$');
    return {
        token: utils.encrypt(data, secret),
        expired: now + 30 * 24 * 60 * 60 * 1000
    };
}

router.post('/login', function*() {
    var body = this.request.body,
        username = body.username,
        password = body.password;

    username = username && username.trim();
    password = password && password.trim();

    this.body = body;
    return;
    if (!(username && password)) {
        this.json = false;
    } else {
        var user = yield User.logIn(username, password);
        user = user.toJSON();
        user.token = getUserToken(user);
        this.json = user;
    }
});


router.post('/signup', function*() {
    var body = this.request.body,
        type = ~~body.type;

    var username, headimgurl, openid;
    // 微信登录
    if (type === 1) {
      openid = body.openid;
      username = body.nickname;
      headimgurl = body.headimgurl;
      if (!username) {
        this.json = false;
        return;
      }
      var query = new AV.Query('User');
      query.equalTo('openid', openid);
      query.limit(1);
      var user = yield query.find();
      if (!(user && user.length)) {
        user = new AV.User();
        user.set('openid', openid);
        user.set('type', String(type));
        user.set('username', username);
        user.set('headimgurl',headimgurl);
        user.set('password', '123456');
        user = yield user.signUp();
        user = user.toJSON();
        this.json = getUserToken(user);
      } else {
        this.json = getUserToken(user[0]);
      }
    } else {
        this.json = false;
    }
});

router.post('/mobilePhoneVerify', function*() {
    var body = this.request.body,
        code = body.code;
    if (!/^\d{6}$/.test(code)) {
        this.json = false;
        return;
    }
    this.json = yield AV.User.verifyMobilePhone(code);
});

module.exports = router;
