//=require jquery/dist/jquery.js 
//=require swiper/dist/js/swiper.js 

(function ($, window, document, undefined) {

  'use strict';

  function prependZero(digit) {
    return digit < 10 ? ('0' + digit) : digit;
  }

  function paginationCustomRender(swiper, current, total) {
    return prependZero(current) + ' / ' + prependZero(total);
  }

  function initStuff() {
    var galleryLargeImages = new Swiper('.gallery-large .gallery-images', {
        loop: true,
        nextButton: '.gallery-large .swiper-button-next',
        prevButton: '.gallery-large .swiper-button-prev',
        pagination: '.gallery-large .swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: paginationCustomRender,
        spaceBetween: 10,
        a11y: true,
    });
    var galleryLargeCards = new Swiper('.gallery-large .gallery-cards', {
        loop: true,
        parallax: true,
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
      paginationType: 'custom',
      paginationCustomRender: paginationCustomRender,
      spaceBetween: 16
    });
  }

  // document ready
  $(initStuff);

})(jQuery, window, document);
