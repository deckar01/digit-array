var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');

gulp.task('js', function() {
  gulp.src('./src/DigitArray.js')
      .pipe(browserify({standalone: 'DigitArray'}))
      .pipe(gulp.dest('./'));
});

gulp.task('uglify', ['js'], function() {
  gulp.src('./DigitArray.js')
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./'));
});

gulp.task('test', ['js', 'uglify'], function(){
  gulp.src(['./test/*.tests.js'])
      .pipe(mocha({reporter: 'spec'}));
})

gulp.task('default', ['js', 'uglify'], function(){
  gulp.watch('./src/*.js', function(){
    gulp.run('js');
    gulp.run('uglify');
  });
});
