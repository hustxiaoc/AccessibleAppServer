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
    var data = [now, user.objectId].join('$');
    return {
        value: utils.encrypt(data, secret),
        expired: now + 30 * 24 * 60 * 60 * 1000
    };
}

router.post('/login', function*() {
    var body = this.request.body,
        username = body.username,
        password = body.password;

    username = username && username.trim();
    password = password && password.trim();

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
        email = body.email,
        phone = body.phone,
        username = body.username,
        password = body.password;

    username = username && username.trim();
    password = password && password.trim();
    phone = phone && phone.trim();
    email = email && email.trim();
    if (!(username && password)) {
        this.json = false;
        return;
    }

    var user = new AV.User();
    user.set('username', username);
    user.set('password', password);
    if (email) {
        user.set('email', email);
    }

    if (phone) {
        user.setMobilePhoneNumber(phone);
    }
    user = yield user.signUp();
    user = user.toJSON();
    user.token = getUserToken(user);
    this.json = user;
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