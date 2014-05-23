var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  gulp.src(['./src/*.js'])
      .pipe(concat('DigitArray.js'))
      .pipe(gulp.dest('./'));
});

gulp.task('uglify', ['js'], function() {
  gulp.src('./DigitArray.js')
      .pipe(concat('DigitArray.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./'));
});

gulp.task('jshint', ['js'], function() {
  gulp.src('./DigitArray.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('default', ['js', 'uglify'], function(){
  gulp.watch('./src/*.js', function(){
    gulp.run('js');
    gulp.run('jshint');
    gulp.run('uglify');
  });
});
