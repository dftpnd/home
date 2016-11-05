var gulp = require('gulp');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var htmlmin = require('gulp-htmlmin');
var fs = require('fs');
var minify = require('gulp-minify');
var performanceBudget = require('performance-budget');
var data = require('./style/variables.json');

gulp.task('default',
    ['critical-style', 'pages-style', 'minify-scripts', 'block-style', 'assets'],
    function() { gulp.start('templating');}
);

gulp.task('critical-style', function() {
    gulp.src('./style/critical.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('pages-style', function() {
    return gulp.src('./templats/pages/**/*.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./docs'));
});

gulp.task('block-style', function() {
    gulp.src('templats/blocks/**/*.styl')
    .pipe(stylus({
        compress: true,
        rawDefine: { data: data }
    }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./docs/style'));
});

gulp.task('templating', function() {
    var criticalStyle = fs.readFileSync('docs/critical.css', 'utf8');
    return gulp.src('./templats/pages/**/*.ejs')
    .pipe(ejs({ criticalStyle: criticalStyle }, { ext: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function(path) { path.dirname = '';}))
    .pipe(gulp.dest('./docs'));
});

gulp.task('budget', function() {
    gulp.src('./docs/**/*.html')
    .pipe(performanceBudget({ dest: './performance-budget.json' }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('minify-scripts', function() {
    gulp.src('scripts/**/*.js')
    .pipe(minify({ ext: { min: '.min.js' } }))
    .pipe(gulp.dest('./docs/scripts/'));
});

gulp.task('assets', function() {
    gulp.src(['./templats/blocks/**/*.svg'])
    .pipe(gulp.dest('./docs/assets/'));
});
