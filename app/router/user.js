var router = new(require('koa-router'))();

router.get('/', function*() {
    this.body = 'Node.js';
});

module.exports = router;