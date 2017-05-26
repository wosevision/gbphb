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
	
	toggleNav() {
		$('body').toggleClass('nav-toggled');
	}
}

  // document ready
$(() => {
	const page = new Page();
	const navToggle = document.getElementById('navToggle');
	navToggle.addEventListener('click', page.toggleNav);

	console.log(page);
});

