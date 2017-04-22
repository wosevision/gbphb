const gulp = require('gulp'),
			sass = require('gulp-sass'),
			data = require('gulp-data'),
			browserSync = require('browser-sync'),
			autoprefixer = require('gulp-autoprefixer'),
			plumber = require('gulp-plumber'),
			notify = require('gulp-notify'),
			uglify = require('gulp-uglify'),
			jshint = require('gulp-jshint'),
			header  = require('gulp-header'),
			include = require('gulp-include'),
			rename = require('gulp-rename'),
			cssnano = require('gulp-cssnano'),
			sourcemaps = require('gulp-sourcemaps'),
			nunjucksRender = require('gulp-nunjucks-render'),
			moduleImporter = require('sass-module-importer'),
			fm = require('front-matter'),
			package = require('./package.json');

/**
 * Dynamically append package info to top of
 * generated files.
 */
package.contributors = package.contributors.map(author => `${ author.name } <${ author.email }>`);
const banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.contributors.join(\' & \') %>>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');

/**
 * Generate CSS assets from Sass source files. This task:
 * - inits sourcemaps
 * - inits sass-module-importer for node_modules Sass @imports
 * - autoprefixes
 * - writes an unminified .css file
 * - minifies .css and renames to .min.css
 * - injects package info banner
 * - writes minified file with sourcemaps to `app/assets`
 * - launches browserSync
 */
gulp.task('css', function() {
	return gulp.src('src/scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: notify.onError('YOUR SASS IS WACK!\n<%= error.message %>')}))
		.pipe(sass({ importer: moduleImporter() }).on('error', sass.logError))
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

/**
 * Generate main JS file from script source files. This task:
 * - inits sourcemaps
 * - displays warnings in script style with jshint
 * - includes JS from `node_modules` for requiring via annotation
 * - injects package info banner
 * - writes an unminified .js file
 * - minifies .js and renames to .min.js
 * - injects package info banner
 * - writes minified file with sourcemaps to `app/assets`
 * - launches browserSync
 */
gulp.task('js', function() {
	gulp.src('src/js/scripts.js')
		.pipe(sourcemaps.init())
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(include({
	    extensions: 'js',
	    hardFail: true,
	    includePaths: [
	      `${ __dirname }/node_modules`,
	    ]
	  }))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(uglify())
		.pipe(header(banner, { package : package }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

/**
 * Generates static HTML assets from Nunjucks templates. This task:
 * - reads page templates from `src/pages`
 * - reads and injects front-matter data from piped files
 * - renders Nunjucks templates in `src/templates`
 * - writes assets
 */
gulp.task('templates', function() {
	return gulp.src('src/pages/**/*.+(html|nunjucks|njk)')
		.pipe(data(file => fm(String(file.contents)).attributes))
		.pipe(nunjucksRender({
			path: ['src/templates']
		}))
		.pipe(gulp.dest('app'));
});

/**
 * Copy static image assets to `app/assets`
 */
gulp.task('images', function() {
	return gulp.src('src/img/**/*.+(jpg|jpeg|gif|png|svg)')
		.pipe(gulp.dest('app/assets/img'));
});

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: {
			baseDir: 'app'
		}
	});
});

gulp.task('bs-reload', function() {
	browserSync.reload();
});

gulp.task('default', ['images', 'css', 'js', 'templates', 'browser-sync'], function() {
	gulp.watch('src/scss/**/*.scss', ['css']);
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/**/*.html', ['templates', 'bs-reload']);
});
