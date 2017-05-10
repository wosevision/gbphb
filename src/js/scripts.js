//=require jquery/dist/jquery.js 
//=require swiper/dist/js/swiper.js 

(function ($, window, document, undefined) {

  'use strict';

  // document ready
  $(function () {

    var galleryLargeImages = new Swiper('.gallery-large .gallery-images', {
	    	loop: true,
        nextButton: '.gallery-large .swiper-button-next',
        prevButton: '.gallery-large .swiper-button-prev',
        pagination: '.gallery-large .swiper-pagination',
        paginationType: 'fraction',
        spaceBetween: 10,
        a11y: true,
    });
    var galleryLargeCards = new Swiper('.gallery-large .gallery-cards', {
	    	loop: true,
        touchRatio: 0.6,
        effect: 'fade',
        a11y: true,
    });
    galleryLargeImages.params.control = galleryLargeCards;
    galleryLargeCards.params.control = galleryLargeImages;

    var gallerySmall = new Swiper('.gallery-small .gallery-cards', {
    	grabCursor: true,
        nextButton: '.gallery-small .swiper-button-next',
        prevButton: '.gallery-small .swiper-button-prev',
        pagination: '.gallery-small .swiper-pagination',
        slidesPerView: 'auto',
        paginationClickable: true,
        paginationType: 'fraction',
        spaceBetween: 16
    });
  });

})(jQuery, window, document);
