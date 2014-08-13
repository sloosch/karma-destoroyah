var gulp = require('gulp');
var coffee = require('gulp-coffee');

var scripts = {
  karma : './src/*.coffee'
};

gulp.task('build', function() {
  return gulp.src(scripts.karma)
  .pipe(coffee({bare : true}))
  .pipe(gulp.dest('./lib'));
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function() {
  gulp.watch(scripts.karma, ['build']);
});
