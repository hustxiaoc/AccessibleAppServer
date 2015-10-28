module.exports = function(app) {
    Object.defineProperty(app.context, 'json', {
        set: function(data) {
            if (data === false) {
                this.body = {
                    success: false
                };
            } else {
                this.body = {
                    success: true,
                    data: data
                };
            }
        }
    });
};