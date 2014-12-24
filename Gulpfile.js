var gulp = require('gulp');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var del = require('del');
var gulpYate = require('./gulp-plugins/gulp-yate');
var filelog = require("gulp-filelog");
var gulpGrunt = require('gulp-grunt');
var gruntTasks = gulpGrunt.tasks();
// add all the gruntfile tasks to gulp
gulpGrunt(gulp);

var SRC = {
    yate: '*.yate',
    icons: './src/icons/*/',
    static: '[!G]*.@(html|js)'
};
var DEST = './out/';

gulp.task('clean', function(cb) {
    del([
        'out/**'
    ], cb);
});

gulp.task('build:static', function() {
    return gulp.src(SRC.static)
        .pipe(filelog())
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
