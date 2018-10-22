var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')

gulp.task('compile-js', function () {
  // app.js is your main JS file with all your module inclusions
  return browserify({
    extensions: ['.js'],
    entries:  ['./src/js/main.js'],
    debug: true
  })
  .transform('babelify', {

    // https://babeljs.io/docs/en/env/
    presets: ['@babel/preset-env']
  })
  .bundle()
  .pipe(source('bundle.min.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('src/js/compiled'))
  .pipe(browserSync.reload({
      stream: true
  }))
})


gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
})

gulp.task('images', function () {
    return gulp.src('src/resources/**/*.+(*)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/resources'))
});

gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
})

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['compile-js','sass', 'useref', 'images'],
        callback
    )
})
//Reload on change
gulp.task('watch', ['browserSync', 'compile-js', 'sass'], function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/*.js',['compile-js']);
});

gulp.task('default', function (callback) {
    runSequence(['compile-js', 'sass', 'browserSync', 'watch'],
        callback
    )
})


//Gulp build for final
//Gulp watch for dev
