const path = require('path'),
			gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
			browserSync = require('browser-sync'),
			moduleImporter = require('sass-module-importer'),
			frontMatter = require('front-matter'),
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
 * Constants for file path parts and full paths.
 */
const base = {
	src: 'src',
	dist: 'app',
}
const sources = {
	// sources
	pages: path.join(base.src, 'pages'),
	templates: path.join(base.src, 'templates'),
	sass: path.join(base.src, 'scss'),
	js: path.join(base.src, 'js'),
	img: path.join(base.src, 'img'),
	// destinations
	assets: path.join(base.dist, 'assets')
}
const paths = {
	// sources
	styles: path.join(sources.sass, 'style.scss'),
	scripts: path.join(sources.js, 'scripts.js'),
	html: path.join(sources.pages, '**/*.+(html|nunjucks|njk)'),
	img: path.join(sources.img, '**/*.+(jpg|jpeg|gif|png|svg)'),
	// destinations
	styleDest: path.join(sources.assets, 'css'),
	scriptDest: path.join(sources.assets, 'js'),
	imageDest: path.join(sources.assets, 'img'),
}

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
	return gulp.src(paths.styles)
		.pipe($.sourcemaps.init())
		.pipe($.plumber({errorHandler: $.notify.onError('YOUR SASS IS WACK!\n<%= error.message %>')}))
		.pipe($.sass({ importer: moduleImporter() }).on('error', $.sass.logError))
		.pipe($.autoprefixer('last 4 version'))
		.pipe(gulp.dest(paths.styleDest))
		.pipe($.cssnano())
		.pipe($.rename({ suffix: '.min' }))
		.pipe($.header(banner, { package : package }))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(paths.styleDest))
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
	gulp.src(paths.scripts)
		.pipe($.sourcemaps.init())
		.pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter('default'))
		.pipe($.babel({
			presets: ['env']
		}))
		.pipe($.include({
	    extensions: 'js',
	    hardFail: true,
	    includePaths: [
	      `${ __dirname }/node_modules`,
	    ]
	  }))
		.pipe($.header(banner, { package : package }))
		.pipe(gulp.dest(paths.scriptDest))
		.pipe($.uglify())
		.pipe($.header(banner, { package : package }))
		.pipe($.rename({ suffix: '.min' }))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(paths.scriptDest))
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
	return gulp.src(paths.html)
		.pipe($.data(file => frontMatter(String(file.contents)).attributes))
		.pipe($.nunjucksRender({
			path: [ sources.templates ]
		}))
		.pipe(gulp.dest(base.dist));
});

/**
 * Copy static image assets to `app/assets`
 */
gulp.task('images', function() {
	return gulp.src(paths.img)
		.pipe(gulp.dest(paths.imageDest));
});

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: {
			baseDir: base.dist
		}
	});
});

gulp.task('bs-reload', function() {
	browserSync.reload();
});

gulp.task('default', ['images', 'css', 'js', 'templates', 'browser-sync'], function() {
	gulp.watch(path.join(sources.sass, '**/*.scss'), ['css']);
	gulp.watch(path.join(sources.js, '**/*.js'), ['js']);
	gulp.watch(path.join(base.src, '**/*.html'), ['templates', 'bs-reload']);
});
