var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');

// SERVER

gulp.task('clean', function(){
  return del('dist')
});

gulp.task('build:server', function () {
  var tsProject = ts.createProject('server/tsconfig.json');
  var tsResult = gulp.src('server/**/*.ts')
  .pipe(sourcemaps.init())
  .pipe(ts(tsProject))
  return tsResult.js
  .pipe(concat('server.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'))
});

// CLIENT

var jsNPMDependencies = [
  'rxjs/bundles/Rx.js',
  'reflect-metadata/Reflect.js',
  'zone.js/dist/zone.js',
  'es6-shim/es6-shim.js',
  'systemjs/dist/system.src.js',
  '@angular/**/*',
  'rxjs/**/*.js'
]

gulp.task('build:index', function(){
  var mappedPaths = jsNPMDependencies.map(file => {return path.resolve('node_modules', file)});

  var copyJsNPMDependencies = gulp.src(mappedPaths, {base:'node_modules'})
  .pipe(gulp.dest('dist/libs'));

  var copyIndex = gulp.src('client/index.html')
  .pipe(gulp.dest('dist'));

  return [copyJsNPMDependencies, copyIndex];
});

gulp.task('build:app', function(){
  var tsProject = ts.createProject('client/tsconfig.json');

  var tsApp = gulp.src('client/**/*.ts')
  .pipe(sourcemaps.init())
  .pipe(ts(tsProject)).js
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'));

  return [tsProject, tsApp];
});

gulp.task('build', function(callback){
  runSequence('clean', 'build:server', 'build:index', 'build:app', callback);
});

gulp.task('update', function(callback){
  runSequence('build:index', 'build:app', callback);
});

gulp.task('default', ['update']);
