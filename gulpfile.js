'use strict'

const path = require('path')
const gulp = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')
const replace = require('gulp-replace')

const PATH = {
	src: './src/',
	dest: './dist/',
}
const FILENAME = 'history.state'
const NS = 'historyState'

gulp.task('default', ['clean'], function () {
	gulp.start('js')
})

gulp.task('clean', function (callback) {
	del(path.join(PATH.dest, '*.*'), callback)
})

gulp.task('js', function() {
	gulp.src([
		path.join(PATH.src, FILENAME + '.js'),
		path.join(PATH.src, '_wrapper/auto-polyfill.js'),
	])
		.pipe(concat('temp.js', {newLine: ';'}))
		.pipe(wrap({src: path.join(PATH.src, '_wrapper/umd.ejs')}))
		.pipe(replace(/\{sample}/g, NS))
		.pipe(replace(/\/\*\* DEBUG_INFO_START \*\*\//g, '/*'))
		.pipe(replace(/\/\*\* DEBUG_INFO_END \*\*\//g, '*/'))
		.pipe(rename(FILENAME + '.umd.js'))
		.pipe(gulp.dest(PATH.dest))
})
