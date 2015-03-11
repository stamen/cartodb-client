var gulp       = require('gulp'),
    watch      = require('gulp-watch'),
    rename     = require('gulp-rename'),
    copy       = require('gulp-copy'),
    jshint     = require('gulp-jshint'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    wrap       = require('gulp-wrap'),
    concat     = require("gulp-concat"),
    run        = require("gulp-run");

var appName = "cartodb-client";

var paths = {
  js        : './src/*.js',
  dist      : './build'
};

//
// Check quality of Javascript
// warn if errors or style problems are found
//
gulp.task('lint', function() {
  return gulp.src(paths.js)
  .pipe(jshint({
    "predef"       : ["module", "define"],
    "expr"         : true,
    "globalstrict" : true
  }))
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task("uglify", function() {
  return gulp
    .src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat(appName+'.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify({
      mangle: true,
      output: {
        beautify: false
      }
    }).on("error", function(e) {
      console.log("Uglify error:\x07",e.message, " on line: ", e.lineNumber);
      return this.end();
    }))
    .pipe(rename({extname: ".min.js"}))
    .pipe(sourcemaps.write("./")) // Write a sourcemap for browser debugging
    .pipe(gulp.dest(paths.dist));
});

//
// Cleanup
//
gulp.task("cleanup", function() {
  return run("rm -rf ./build/*", {}).exec();
});

//
// Run all default tasks
//
gulp.task('default',function(){
  gulp.start('cleanup');
  gulp.start('lint');
  gulp.start('uglify');
});

//
// Watch directories For Changes
//
gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint','uglify']);
  console.log('watching directory:' + paths.js);
});
