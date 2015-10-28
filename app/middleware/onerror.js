module.exports = function(app) {

    app.context.onerror = function(err) {
        if (null == err) {
            return;
        }

        var res = {
            success: false
        };

        res.code = err.code;
        res.message = err.message;

        this.res.end(JSON.stringify(res));
    };
};