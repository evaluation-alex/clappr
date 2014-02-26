var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var exec = require('child_process').exec;

var paths = {
  files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html'],
  main: ['src/main.js'],
  tests: ['test/spec_helper.js', 'test/**/*_spec.js'],
  dist: 'dist'
};

var distFile = 'api.min.js';

var namespace = 'WP3';

gulp.task('default', ['lint', 'build']);

gulp.task('generate-jst', function() {
  exec('node bin/jst_generator.js', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('build', ['generate-jst'], function() {
  gulp.src(paths.main)
    .pipe(browserify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dist))
    .on("error", function(err) {
      throw err;
    });
});

gulp.task('dist', ['generate-jst'], function() {
  gulp.src(paths.main)
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename(distFile))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['build'], function() {
  gulp.src(paths.tests)
    .pipe(mocha({reporter: 'nyan'}))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('coverage', function() {
  gulp.src(paths.files[0])
    .pipe(istanbul())
    .on('end', function() {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});

gulp.task('lint', function() {
  gulp.src(paths.files[0])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(paths.files, function() {
    gulp.run('build');
  });
});
