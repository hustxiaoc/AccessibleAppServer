var secret = process.env.LC_APP_KEY;
var utils = require('../libs/utils');

module.exports = function(app) {
    app.use(function*(next) {
        if (this.method === 'POST' && this.path != '/api/user/signup') {
          var token = this.get('token');
          if (!token) {
            this.throw(403);
          }
          token = utils.decrypt(token, secret);
          var time = token.split('$')[0];
          var userId = token.split('$')[1];
          if (Date.now()-time > 30 * 24 * 60 * 60 * 1000) {
            this.throw(403);
          }
          this.userId = userId;
        }

        return yield next;

        var header = this.request.header,
            appkey = header.key,
            timestamp = header.t * 1,
            signature = header.sig,
            now = Date.now();

        var error;
        if (!timestamp || now - timestamp > 10 * 1000 || now < timestamp) {
            error = new Error('request expired');
            error.code = 405;
            throw error;
        }

        var _signature = utils.md5(appkey + this.req.path + secret + timestamp);

        if (_signature !== signature) {
            error = new Error('unauthorized access');
            error.code = 401;
            throw error;
        }
        yield next;
    });
};
