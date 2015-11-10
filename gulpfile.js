var gulp       = require('gulp');
var jade       = require('gulp-jade');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var uglify     = require('gulp-uglify');
var streamify  = require('gulp-streamify');
var gulpif     = require('gulp-if');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var connect    = require('gulp-connect');

var env        = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

gulp.task('jade', function() {
  return gulp.src('src/templates/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(outputDir));
});


gulp.task('js', function() {
  return browserify('src/js/main.js', { debug: env === 'development' })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(env === 'production',  streamify(uglify())))
        .pipe(gulp.dest(outputDir + '/js'));
});

gulp.task('css', function() {
  var config = {};

  if (env === 'production') {
    config.outputStyle = 'compressed';
  }

  return gulp.src('src/sass/main.sass')
        .pipe(gulpif(env === 'development', sourcemaps.init()))
        .pipe(sass(config))
        .pipe(gulpif(env === 'development', sourcemaps.write()))
        .pipe(gulp.dest(outputDir + '/css'));
});

gulp.task('connect', connect.server({
  root: outputDir,
  // open: { browser: 'Google Chrome' }
}));

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/sass/**/*.sass', ['css']);
});

gulp.task('default', ['js', 'jade', 'css', 'watch', 'connect']);
