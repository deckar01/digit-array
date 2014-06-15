var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');

gulp.task('js', function() {
  gulp.src('./src/DigitArray.js')
      .pipe(browserify())
      .pipe(gulp.dest('./'));
});

gulp.task('uglify', ['js'], function() {
  gulp.src('./DigitArray.js')
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./'));
});

gulp.task('jshint', ['js'], function() {
  gulp.src('./DigitArray.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('test', ['js', 'uglify'], function(){
  gulp.src(['./test/*.tests.js'])
      .pipe(mocha({reporter: 'nyan'}));
})

gulp.task('default', ['js', 'uglify'], function(){
  gulp.watch('./src/*.js', function(){
    gulp.run('js');
    gulp.run('jshint');
    gulp.run('uglify');
  });
});
