var gulp = require('gulp');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var del = require('del');
var gulpYate = require('./gulp-plugins/gulp-yate');
var filelog = require("gulp-filelog");
var open = require('open');
var gulpGrunt = require('gulp-grunt');
var gruntTasks = gulpGrunt.tasks();
// add all the gruntfile tasks to gulp
var insert = require('gulp-insert');
gulpGrunt(gulp);

var SRC = {
    yate: '*.yate',
    icons: './src/icons/*/',
    static: '[!G]*.@(html|js)'
};
var DEST = './out/';
var INDEX_PAGE = DEST + 'index.html';
var DEST_ICONS = DEST + 'icons/';
var DEST_SVG_ICONS = DEST_ICONS + '**/*.svg';
var DEST_SVG_ICONS_YATE_SAFE = DEST_ICONS + 'yate_safe/';

gulp.task('clean', function(cb) {
    del([
        'out/**'
    ], cb);
});

gulp.task('build:static', function() {
    return gulp.src(SRC.static)
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST));
});

gulp.task('build:yate', ['grunt-svg_fallback'], function() {
    return gulp.src(SRC.yate)
        .pipe(gulpYate())
        .pipe(rename({
            suffix: "-yate",
            extname: ".js"
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('build', ['build:static', 'build:yate']);

gulp.task('default', ['build']);

gulp.task('watch', function() {
    gulp.watch(SRC.static, ['build:static']);
    gulp.watch(SRC.yate, ['build:yate']);
});

gulp.task('open-index-page', function() {
    open(INDEX_PAGE);
});

/**
 * Wrapping svg-sprites with `:::` to seamlessly inline those in yate templates.
 * Needed because svg files can contain inline styles which can be misinterpreted by yate.
 *
 * @see https://github.com/pasaran/yate/commit/843cba7b2b3d85362961a95f04674a233f991c48
 */
gulp.task('svg-yate-safe', function() {
    return gulp.src(DEST_SVG_ICONS)
        .pipe(insert.wrap(':::', ':::'))
        .pipe(gulp.dest(DEST_SVG_ICONS_YATE_SAFE));
});

