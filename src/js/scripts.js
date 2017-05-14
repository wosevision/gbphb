//=require jquery/dist/jquery.js 
//=require swiper/dist/js/swiper.js 

(function ($, Swiper, window, document, undefined) {

  'use strict';

  var galleryConfigs = {
    '.gallery-large .gallery-images': {
      loop: true,
      nextButton: '.gallery-large .swiper-button-next',
      prevButton: '.gallery-large .swiper-button-prev',
      pagination: '.gallery-large .swiper-pagination',
      paginationType: 'custom',
      paginationCustomRender: paginationCustomRender,
      spaceBetween: 10,
      a11y: true
    },
    '.gallery-large .gallery-cards': {
      loop: true,
      parallax: true,
      touchRatio: 0.6,
      effect: 'fade',
      a11y: true
    },
    '.gallery-small .gallery-cards': {
      grabCursor: true,
      nextButton: '.gallery-small .swiper-button-next',
      prevButton: '.gallery-small .swiper-button-prev',
      pagination: '.gallery-small .swiper-pagination',
      slidesPerView: 'auto',
      paginationClickable: true,
      paginationType: 'custom',
      paginationCustomRender: paginationCustomRender,
      spaceBetween: 16
    }
  };

  function prependZero(digit) {
    return digit < 10 ? ('0' + digit) : digit;
  }

  function paginationCustomRender(swiper, current, total) {
    return prependZero(current) + ' / ' + prependZero(total);
  }

  function initStuff() {
    var galleries = {};
    for (var config in galleryConfigs) {
      galleries[config] = new Swiper(config, galleryConfigs[config]);
    }

    galleries['.gallery-large .gallery-images'].params.control = galleries['.gallery-large .gallery-cards'];
    galleries['.gallery-large .gallery-cards'].params.control = galleries['.gallery-large .gallery-images'];
  }

  // document ready
  $(initStuff);

})(jQuery, Swiper, window, document);
