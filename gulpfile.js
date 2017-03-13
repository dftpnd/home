var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var htmlmin = require('gulp-htmlmin');
var fs = require('fs');
var performanceBudget = require('performance-budget');
var data = require('./src/style/variables.json');
var watch = require('gulp-watch');

gulp.task('default', ['pages-style', 'minify-scripts', 'sections-style', 'assets', 'sections', 'pages', 'img']);

gulp.task('critical-style', function(done) {
    return gulp
    .src('./src/style/critical.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(gulp.dest('./dest'));
});

gulp.task('pages-style', function() {
    return gulp.src('./src/templats/pages/**/*.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./dest'));
});

gulp.task('sections-style', function() {
    gulp.src('./src/sections/**/*.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./dest/style'));
});

gulp.task('pages', ['critical-style'], function() {
    var criticalStyle = fs.readFileSync('./dest/critical.css', 'utf8');
    return gulp.src('./src/pages/**/*.ejs')
    .pipe(ejs({ criticalStyle: criticalStyle }, { ext: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dest'));
});

gulp.task('sections', ['critical-style'], function() {
    var criticalStyle = fs.readFileSync('./dest/critical.css', 'utf8');
    return gulp.src('./src/sections/**/*.ejs')
    .pipe(ejs({ criticalStyle: criticalStyle }, { ext: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./dest'));
});
// gulp.task('budget', function() {
//     gulp.src('./**/*.html')
//     .pipe(performanceBudget({ dest: './performance-budget.json' }))
//     .pipe(gulp.dest('./'));
// });

gulp.task('minify-scripts', function(){
  gulp.src('./src/scripts/**/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify().on('error', function(e){
        console.log(e);
     }))
    .pipe(gulp.dest('./dest/scripts/'));
});

gulp.task('assets', function() {
    gulp.src(['./src/blocks/**/*.svg'])
    .pipe(gulp.dest('./dest/assets'));
});

gulp.task('img', function() {
    gulp.src(['./img/**/*'])
    .pipe(gulp.dest('./dest/img'));
});

gulp.task('watch', ['default'],function () {
	gulp.watch('./src/**/*', ['default']);
});

