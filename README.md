# GPBHB Frontend

A front-end theme for **GBPH**, based on Bootstrap 4 and built using:
- Gulp
- Sass
- Babel
- Browserify
- Nunjucks

**Original boilerplate docs can be found at: [DOCS.md](https://github.com/HosseinKarami/fastshell/blob/master/DOCS.md)**

## Project setup and Gulp installation

1. Install [Node.js](http://nodejs.org/download), [Sass](http://sass-lang.com/tutorial.html) and [Git](http://git-scm.com) on your machine. If you're a Windows user you'll also need to install [Ruby](http://rubyinstaller.org/downloads) for Sass compilation.
2. *Optional:* [Install Gulp](http://Gulpjs.com/) using `npm install -g gulp`. You may need to use `sudo` in front of the Gulp install command to give it permissions. *Gulp will be installed locally in the project as well, so this is a supplementary step.*
3. Clone (or fork) this repository: `git clone https://github.com/wosevision/gbphb.git`
4. Switch directories to the cloned project – `cd gbphb` – and install the dependencies. You have two options:
	```shell
	npm install # SLOW, womp womp
	# or...
	yarn # FAST! / hipster npm install
	```
5. Confirm the installation by checking for the `node_modules` in your project directory; if everything was installed properly, use one of provided NPM/Yarn scripts to run the project's Gulp tasks.

## Gulp tasks

All tasks can be found in `gulpfile.js`, and include accompanying documentation in comments above the task. The available tasks to be run from NPM scripts are:
- `yarn start` or `npm run start`: starts the [development server](#development-server).

### Development server

Once running, the development server does the following:

1. Mounts the `app` folder onto a local server
2. Listens for changes inside the `src` directory, and compiles the necessary files into the `app` directory, which will then automaticaly livereload or inject changes.
	- CSS changes are injected
	- All other changes force a page reload

## Javascript structure

This project uses [Babel](https://babeljs.io/) and [Browserify](http://browserify.org/) for ES6 Javascript compilation with module bundling. All JS classes can be found in `js/lib` and are suffixed with a `.class.js`; the main script file, `scripts.js` is on the top level of the `js` folder and is responsible for `import`ing and initializing the classes.

### Classes

The JS classes built for this project are:

- `Nav` – handles the collapse/expand animation of the navigation bar, as well as the scroll animation of the hero banner (if it is present).
  ```js
  const nav = new Nav('#header', {
    container: 'body',
    toggler: '#navToggle',
    toggleClass: 'nav-toggled',
    scrolledClass: 'nav-scrolled',
    hero: {
      background: '#hero-image',
      container: '.hero',
      speed: 8
    }
  });
  ```
- `Gallery` – responsible for initializing all galleries (large, small, grid/overlay) available on a page.
  ```js
  const gallery = new Gallery({
    grid: {
      container: 'body',
      gallery: '.gallery-grid-display .swiper-container',
      openClass: 'gallery-grid-display-open',
      opener: '.gallery-grid-image',
      closer: '.gallery-grid-display-close'
    }
  });
  ```
- `Map` - fetches Google Maps and initializes a styled map.
  ```js
  const map = new GoogleMap('#contact-map', {
    lat: 43.6532,
    lng: -79.3832
  });
  ```
- `Parallax` – used exclusively by the `grid` type gallery; tilting perspective effect.
  ```js
  const parallax = new Parallax('.parallax-wrapper');
  ```

## Sass/SCSS structure

This project's Sass files are structured so that:

* `mixins` holds all Sass/SCSS mixins, primarily for helpers
* `modules` holds modules, self-contained components and discrete chunks
* `partials` holds the blueprints for the layout: the header, footer, sidebar, etc.
* `vendor` holds any files that relate to third party dependencies, such as icon imports or framework overrides
* `style.scss` imports all the necessary files from the above folders, when adding new files be sure to add it inside this file.

## Template and partials

The HTML layouts are built dynamically using Gulp and Nunjucks to prevent code duplication, with [YAML front-matter](http://simpleprimate.com/jekyll-for-designers/blog/front-matter/) for data injection. The directory structure, in `src`, is:

```shell
...
└── templates
    ├── block.njk                  ## main "block" rendering macro
    ├── layout.njk                 ## head and script tags, etc
    ├── modules                    ## components rendered by block macro
    │   ├── article.njk            ## blog article
    │   ├── block-intro.njk        ## block title/text (+ number)
    │   ├── blockquote.njk         ## giant quote
    │   ├── contact-form-large.njk ## contact form with map
    │   ├── contact-form.njk       ## mini contact form
    │   ├── gallery-grid.njk       ## masonry-style gallery with overlay
    │   ├── gallery-large.njk      ## large gallery with text bottom
    │   └── gallery-small.njk      ## small card-style gallery
    └── partials                   ## universal page partials
        ├── footer.njk             ## footer block and social links
        ├── header.njk             ## header block with navigation
        └── hero.njk               ## main hero and anchor nav
```

### Pages

The pages themselves are generated from facsimiles inside the `src/pages` directory; though they are `*.html` files, they are mainly composed from YAML front-matter, which dictates the data to be inject into the main rendering construct. The rendering construct appears the bottom of each page and looks like:

```nunjucks
{%- extends "layout.njk" %}
{# Layout injection begins here #}

{%- block content %}
{# Main "block" rendering construct #}

{%- from "block.njk" import renderContentBlock %}
{%- for block in contentBlocks %}
{{ renderContentBlock(block) }} {# Macro; takes block from YAML #}
{%- endfor %}

{# Layout injection ends here #}
{%- endblock %}
```

In order for a page to be build into the final `app` distribution directory, it must be defined in the `src/pages` directory.

## Documentation

A small styleguide for this project can be generated using the included DocumentCSS definitions.

To generate the styleguide, install DocumentJS (`npm install documentjs`) if the optional dependency was not installed along with the project dependencies and run it from the project's root:

```shell
# run the generator
./node_modules/.bin/documentjs -w

# serve the documentation
python -m SimpleHTTPServer 4200

# open the served docs
open http://localhost:4200/styleguide
```