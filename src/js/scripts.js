//=require jquery/dist/jquery.js 
//=require swiper/dist/js/swiper.js 

(function ($, window, document, undefined) {

  'use strict';

  // document ready
  $(function () {

    var galleryLargeImages = new Swiper('.gallery-large .gallery-images', {
	    	loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
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

  });

})(jQuery, window, document);
