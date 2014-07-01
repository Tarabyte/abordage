/*jshint node:true*/
/*global require*/
'use strict';


var gulp = require('gulp');
var mocha = require('gulp-mocha');
var lint = require('gulp-jshint');

var allJs = './src/**/*.js',
    allTests = './test/*.js';

gulp.task('lint', function () {
    return gulp.src(allJs)
            .pipe(lint())
            .pipe(lint.reporter('default'));
});

gulp.task('test', function () {
    return gulp.src(allTests)
            .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function () {
    gulp.watch(allJs, ['lint', 'test']);
    gulp.watch(allTests, ['test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
