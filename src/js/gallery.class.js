import $ from 'jquery';
import Swiper from 'swiper';
// import Parallax from 'parallax-js';

import { Parallax } from './parallax.class.js';

const prependZero = (digit) => (digit < 10 && '0') + digit;
const paginationCustomRender = (_, current, total) => {
  return `${prependZero(current)} / ${prependZero(total)}`;
};

const galleryLarge = '.gallery-large',
    	gallerySmall = '.gallery-small',
    	galleryGrid = '.gallery-grid',
    	galleryGridDisplay = `${galleryGrid}-display`,

    	galleryImages = '.gallery-images',
    	galleryCards = '.gallery-cards',

	    nextButton = '.swiper-button-next',
	    prevButton = '.swiper-button-prev',
	    pagination = '.swiper-pagination',
	    container = '.swiper-container',

    	galleryLargeImages = `${galleryLarge} ${galleryImages}`,
    	galleryLargeCards = `${galleryLarge} ${galleryCards}`,
    	gallerySmallCards = `${gallerySmall} ${galleryCards}`,
    	galleryGridDisplayContainer = `${galleryGridDisplay} ${container}`;

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
  },
  [galleryGridDisplayContainer]: {
  	centeredSlides: true,
    grabCursor: true,
    hashnav: true,
    hashnavWatchState: true,
    observer: true,
    observeParents: true,
    nextButton: `${galleryGridDisplay} ${nextButton}`,
    prevButton: `${galleryGridDisplay} ${prevButton}`,
    pagination: `${galleryGridDisplay} ${pagination}`,
    slidesPerView: 'auto',
    paginationClickable: true,	
    paginationType: 'custom',
    paginationCustomRender,
    spaceBetween: 128,
    a11y: true
  }
};

export class Gallery {
	constructor({
		small,
		large,
		grid
	}) {
	  this.galleries = {};
		this.grid = {
			$container: $(grid.container),
			$gallery: $(grid.gallery),
			$opener: $(grid.opener),
			$closer: $(grid.closer),
			openClass: grid.openClass
		};

	  for (const gallery in galleryConfigs) {
	    this.galleries[gallery] = new Swiper(gallery, galleryConfigs[gallery]);
	  }
    this.galleries[galleryLargeImages].params.control = this.galleries[galleryLargeCards];
    this.galleries[galleryLargeCards].params.control = this.galleries[galleryLargeImages];

		this.grid.parallax = new Parallax('.parallax-wrapper');
		console.log(this.grid.parallax);

    this.bindEvents();
	}

	openGridGallery() {
		this.grid.$container.addClass(this.grid.openClass);
		this.grid.parallax.enable();
	}

	closeGridGallery(event) {
		event.stopPropagation();
		this.grid.$container.removeClass(this.grid.openClass);
		this.grid.parallax.disable();
	}

	bindEvents() {
		this.openGridGallery = this.openGridGallery.bind(this);
		this.grid.$opener.on('click', this.openGridGallery);

		this.closeGridGallery = this.closeGridGallery.bind(this);
		this.grid.$closer.on('click', this.closeGridGallery);
	}
}