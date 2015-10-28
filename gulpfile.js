var gulp = require('gulp');
var beautify = require('gulp-jsbeautify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var nodeInspector = require('gulp-node-inspector');
var _ = require('lodash');
var env = {}
try{
    env = require('./env.json');
}catch(err){
    console.log(err)
}

gulp.task('lint', function () {
    return gulp.src('./app/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
});


gulp.task('pretty', function() {
  gulp.src('./app/**/*.js')
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest('./app/'));
});

var opt = {
      nodeEnv  : 'local',
      rootPath : './',
      serverJS : './bin/app.js',
      assets   : './public',
      port: {
          'node'      : 3000,
          'debug'     : 5856,
          'inspector' : 8596
      }
};

gulp.task('run', function () {

  nodemon({
    script: opt.serverJS,
    ext: 'js, json, conf',
    watch    : ['./app','./app.js','express.js'],
    ignore   : ['node_modules/**'],
    nodeArgs : ['--harmony', '--debug='+opt.port.debug],
    env: _.assign({
        LC_APP_PORT     : opt.port.node,
        NODE_ENV : opt.nodeEnv
    }, env),
    callback: function(nodemon) {
        nodemon.on('log', function(event) {
            console.log(event.colour);
        });
        // refreshes browser when server reboots
        nodemon.on('restart', function() {
            // Delay before server listens on port
            setTimeout(function() {
                require('fs').writeFileSync('.rebooted',
                    'rebooted: ' + new Date()
                );
            }, 1500);
        });
    }
  })
})

gulp.task('start', ['run'], function() {
  gulp.src([])
    .pipe(nodeInspector({
        debugPort: opt.port.debug
    }));
});