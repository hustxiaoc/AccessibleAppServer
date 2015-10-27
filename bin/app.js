#!/usr/bin/env node
'use strict';

require('module-unique').init();

var app = require('../app'),
    graceful = require('graceful');

var AV = require('leanengine');

var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

var port = parseInt(process.env.LC_APP_PORT || 3000);

var server = app.listen(port, function() {
    console.info('server listening on port ' + server.address().port);
});

graceful({
    server: server,
    killTimeout: 30 * 1000,
    error: function(err, throwErrorCount) {
        if (err.message) {
            err.message +=
                ' (uncaughtException throw ' + throwErrorCount +
                ' times on pid:' + process.pid + ')';
        }
        console.error(err);
    }
});
