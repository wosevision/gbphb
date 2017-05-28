import $ from 'jquery';
import Swiper from 'swiper';

const prependZero = (digit) => (digit < 10 && '0') + digit;
const paginationCustomRender = (_, current, total) => {
  return `${prependZero(current)} / ${prependZero(total)}`;
};

const galleryLarge = '.gallery-large',
    	gallerySmall = '.gallery-small',

    	galleryImages = '.gallery-images',
    	galleryCards = '.gallery-cards',

    	galleryLargeImages = `${galleryLarge} ${galleryImages}`,
    	galleryLargeCards = `${galleryLarge} ${galleryCards}`,
    	gallerySmallCards = `${gallerySmall} ${galleryCards}`,

	    nextButton = '.swiper-button-next',
	    prevButton = '.swiper-button-prev',
	    pagination = '.swiper-pagination';

const galleryConfigs = {
	[galleryLargeImages]: {
    loop: true,
    nextButton: `${galleryLarge} ${nextButton}`,
    prevButton: `${galleryLarge} ${prevButton}`,
    pagination: `${galleryLarge} ${pagination}`,
    paginationType: 'custom',
    paginationCustomRender,
    spaceBetween: 10,
    a11y: true
  },
  [galleryLargeCards]: {
    loop: true,
    parallax: true,
    touchRatio: 0.6,
    effect: 'fade',
    a11y: true
  },
	[gallerySmallCards]: {
    grabCursor: true,
    nextButton: `${gallerySmall} ${nextButton}`,
    prevButton: `${gallerySmall} ${prevButton}`,
    pagination: `${gallerySmall} ${pagination}`,
    slidesPerView: 'auto',
    paginationClickable: true,
    paginationType: 'custom',
    paginationCustomRender,
    spaceBetween: 16,
    a11y: true
  }
};

class Page {
	constructor() {
	  this.galleries = {};
	  for (const gallery in galleryConfigs) {
	    this.galleries[gallery] = new Swiper(gallery, galleryConfigs[gallery]);
	  }
    this.galleries[galleryLargeImages].params.control = this.galleries[galleryLargeCards];
    this.galleries[galleryLargeCards].params.control = this.galleries[galleryLargeImages];
	}
}

class Nav {
	constructor({
		container,
		toggler,
		toggleClass,
		background,
		bgSpeed
	}) {
		this.$window = $(window);
		this.$container = $(container);
		this.$toggler = $(toggler);
		this.$background = $(background);

		this.toggleClass = toggleClass;
		this.bgSpeed = bgSpeed;
		this.bgOffset = this.$background.offset().top;

		this.bindEvents();
	}

	get scrollTop() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
	get scrollFactor() {
		return (this.scrollTop - this.bgOffset) / this.bgSpeed;
	}
	
	onToggle() {
		this.$container.toggleClass(this.toggleClass);
	}
	onScroll() {
    const scaleFactor = (this.scrollFactor / 2000) + 1;
    let transform = `scale(${scaleFactor}) translateY(${this.scrollFactor}px)`,
    		opacity = 1 - (this.scrollFactor / 100);

		this.$background.css({ transform, opacity });
	}

	bindEvents() {
		this.onToggle = this.onToggle.bind(this);
		this.onScroll = this.onScroll.bind(this);

		this.$toggler.on('click', this.onToggle);
		this.$window.on('scroll resize', this.onScroll);

		this.$window.trigger('scroll');
	}
}

$(() => {
	const page = new Page();
	const nav = new Nav({
		container: 'body',
		toggler: '#navToggle',
		toggleClass: 'nav-toggled',
		background: '#hero-image',
		bgSpeed: 8
	});

});