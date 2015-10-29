var secret = process.env.LC_APP_KEY;
var utils = require('../libs/utils');

module.exports = function(app) {
    if (1) {
        return;
    }
    app.use(function*(next) {
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