var mocha = require('gulp-mocha');
module.exports = function(gulp, plugins, growl) {
  gulp.task('mocha', function() {
    return gulp.src('./test/**/*.js', {read: false})
      .pipe(mocha({reporter: 'nyan'}))
      .pipe(plugins.if(growl, plugins.notify({ message: 'Mocha task complete' })));
  });
};
