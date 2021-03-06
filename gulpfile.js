const path = require('path'),
			del = require('del'),
			gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
			browserSync = require('browser-sync'),
			moduleImporter = require('sass-module-importer'),
			frontMatter = require('front-matter'),
			source = require('vinyl-source-stream'),
			buffer = require('vinyl-buffer'),
			browserify = require('browserify'),
			watchify = require('watchify'),
			babelify = require('babelify'),
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
	fonts: path.join(base.src, 'fonts'),
	favicon: path.join(base.src, 'favicon.png'),
	// destinations
	assets: path.join(base.dist, 'assets'),
	html: path.join(base.dist, '*.html')
}
const paths = {
	// sources
	styles: path.join(sources.sass, 'style.scss'),
	scripts: path.join(sources.js, 'scripts.js'),
	html: path.join(sources.pages, '**/*.+(html|njk)'),
	njk: path.join(sources.templates, '**/*.+(html|njk)'),
	img: path.join(sources.img, '**/*.+(jpg|jpeg|gif|png|svg)'),
	fonts: path.join(sources.fonts, '**/*.{eot,svg,ttf,woff,woff2}'),
	// destinations
	styleDest: path.join(sources.assets, 'css'),
	scriptDest: path.join(sources.assets, 'js'),
	imageDest: path.join(sources.assets, 'img'),
	fontsDest: path.join(sources.assets, 'fonts'),
	faviconsDest: path.join(base.dist, 'favicons')
};

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
const bundle = watch => {
  var bundler = watchify(browserify(paths.scripts, {
  	debug: true
  }).transform(babelify, {
		presets: ['env']
	}));
  const rebundle = () => {
    bundler.bundle()
      .on('error', function(err) {
      	console.error(err);
      	this.emit('end');
      })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({
      	loadMaps: true
      }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(paths.scriptDest))
			.pipe($.uglify())
			.pipe($.header(banner, { package : package }))
			.pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.scriptDest))
			.pipe(browserSync.reload({stream:true, once: true}));
  }
  if (watch) {
	  bundler.on('update', () => {
	    console.log('Rebundling...');
	    rebundle();
	  });
	}
  rebundle();
}
const watch = () => bundle(true);
gulp.task('js', () => bundle());

/**
 * Generates static HTML assets from Nunjucks templates. This task:
 * - reads page templates from `src/pages`
 * - reads and injects front-matter data from piped files
 * - renders Nunjucks templates in `src/templates`
 * - writes assets
 */
gulp.task('templates', function() {
	// title-to-URL slugification utility
	const toSlug = text => text
  		.toString()
  		.toLowerCase()
	    .replace(/\s+/g, '-') // Replace spaces with -
	    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
	    .replace(/\-\-+/g, '-') // Replace multiple - with single -
	    .replace(/^-+/, '') // Trim - from start of text
	    .replace(/-+$/, ''); // Trim - from end of text
	// global nav links, i.e. .html pages
	const navLinks = [{
  	title: 'Approach',
  	href: 'index.html'
	},{
		title: 'Services',
		href: 'services.html'
	},{
		title: 'Projects',
		href: 'projects.html'
	},{
		title: 'Blog',
		href: 'blog.html'
	},{
		title: 'Get Started',
		feature: true,
		href: 'contact.html'
	}];
	return gulp.src(paths.html)
		.pipe($.data(file => frontMatter(String(file.contents)).attributes))
		.pipe($.nunjucksRender({
			path: [ sources.templates ],
			manageEnv(environment) {
			  environment.addFilter('slug', toSlug);
			  environment.addGlobal('navLinks', navLinks);
			}
		}))
		.pipe(gulp.dest(base.dist))
		.pipe(browserSync.reload({stream:true}));
});

/**
 * Copy static image assets to `app/assets`
 */
gulp.task('images', function() {
	return gulp.src(paths.img)
		.pipe(gulp.dest(paths.imageDest));
});

/**
 * Generate favicons for all platforms.
 */
gulp.task('generate-favicons', ['templates'], function () {
    return gulp.src(sources.favicon).pipe($.favicons({
      appName: 'GBPH',
      appDescription: 'We build high efficiency homes. Let\'s build one together.',
      background: '#fad030',
      path: 'favicons/',
      display: 'standalone',
      orientation: 'portrait',
      version: 1.0,
      logging: false,
      online: false,
      html: 'favicon.html',
      pipeHTML: true,
      replace: true
    }))
    .on('error', $.notify.onError('Your favicons have insubordinated:\n<%= error.message %>'))
    .pipe(gulp.dest(paths.faviconsDest));
});

/**
 * Inject the generated `favicon.html` into HTML files.
 * Requires the `favicon-generate` task to run first.
 */
const faviconsTemplate = path.join(paths.faviconsDest, 'favicon.html');

gulp.task('inject-favicons', ['generate-favicons'], function() {
  gulp.src(sources.html)
	  .pipe($.inject(gulp.src([faviconsTemplate]), {
	    starttag: '<!-- inject:head:{{ext}} -->',
	    transform(filePath, file) {
	      return file.contents.toString('utf8'); // return file contents as string
	    }
	  }))
	  .pipe(gulp.dest(base.dist));
});

/**
 * Remove the generated favicon.html file.
 * Requires the `inject-favicon` task to run first.
 */
gulp.task('clean-favicons-template', ['inject-favicons'], function() {
  return del([faviconsTemplate]);
});

/**
 * The default task will generate all favicon files, including graphics and
 * configs. It will also build the asset link and meta tags in `favicon.html`,
 * inject them into `index.html`, and remove the generated file.
 */
gulp.task('favicons', ['clean-favicons-template']);

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe($.changed(paths.fontsDest))
    .pipe(gulp.dest(paths.fontsDest))
    .pipe(browserSync.stream());
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

gulp.task('clean', function() {
  return del([base.dist]);
});

gulp.task('default', ['images', 'css', 'fonts', 'js', 'templates', 'browser-sync'], function() {
	gulp.watch(path.join(sources.sass, '**/*.scss'), ['css']);
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch([paths.html, paths.njk], ['templates']);
	watch();
});

gulp.task('build', ['clean'], function () {
	return gulp.run(['images', 'css', 'fonts', 'js', 'templates', 'favicons']);
});
