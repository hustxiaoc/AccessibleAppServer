var bodyParser = require('koa-bodyparser');

module.exports = function(app) {
    return app.use(bodyParser());
};