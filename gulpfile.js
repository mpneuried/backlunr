var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var header = require('gulp-header');

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('compress', ["compile"], function() {
	return gulp.src('backlunr.js')
		.pipe(uglify())
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(''));
});

gulp.task('compile', function() {
	return gulp.src('_src/backlunr.coffee')
		.pipe(coffee())
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest(''));
});

gulp.task('compile-test', function() {
	return gulp.src('_src/test.coffee')
		.pipe(coffee())
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('test'));
});

gulp.task('release', [ "compile-test", "compress" ] )

gulp.task('default', [ "release" ] )
