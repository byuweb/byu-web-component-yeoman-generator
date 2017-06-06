<%- include('_copyright.js'); -%>
'use strict';

const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const rename = require('gulp-rename');
const initWcBuild = require('byu-web-component-build').gulp;

gulp.task('build', ['wc:build'], function () {
  browserSync.reload();
});

initWcBuild(gulp, {
  componentName: '<%= name %>',
  js: {
    input: './<%= name %>.js',
    polyfillUrl: 'https://cdn.byu.edu/web-component-polyfills/latest/web-component-polyfills.min.js'
  },
  css: {
    input: './<%= name %>.scss'
  }
});

gulp.task('watch', ['build'], function (done) {
  browserSync.init({
    server: {
      baseDir: './',
    },
    startPath: '/demo.html',
    notify: false
  }, done);

  gulp.watch(['demo.html', './<%= name %>/**'], ['build']);
});

gulp.task('default', ['watch']);


