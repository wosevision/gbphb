//=require jquery/dist/jquery.js 
//=require swiper/dist/js/swiper.js 

(function ($, Swiper, window, document, undefined) {

  'use strict';

  var galleries = {},
      galleryConfigs = {};
  var galleryLarge = '.gallery-large',
      gallerySmall = '.gallery-small';
  var galleryLargeImages = join(galleryLarge, '.gallery-images'),
      galleryLargeCards = join(galleryLarge, '.gallery-cards'),
      gallerySmallCards = join(gallerySmall, '.gallery-cards');
  
  galleryConfigs[galleryLargeImages] = {
    loop: true,
    nextButton: join(galleryLarge, '.swiper-button-next'),
    prevButton: join(galleryLarge, '.swiper-button-prev'),
    pagination: join(galleryLarge, '.swiper-pagination'),
    paginationType: 'custom',
    paginationCustomRender: paginationCustomRender,
    spaceBetween: 10,
    a11y: true
  };
  galleryConfigs[galleryLargeCards] = {
    loop: true,
    parallax: true,
    touchRatio: 0.6,
    effect: 'fade',
    a11y: true
  };
  galleryConfigs[gallerySmallCards] = {
    grabCursor: true,
    nextButton: join(gallerySmall, '.swiper-button-next'),
    prevButton: join(gallerySmall, '.swiper-button-prev'),
    pagination: join(gallerySmall, '.swiper-pagination'),
    slidesPerView: 'auto',
    paginationClickable: true,
    paginationType: 'custom',
    paginationCustomRender: paginationCustomRender,
    spaceBetween: 16
  };

  function join(parts) {
    var args = [];
    for (var i = 0; i < arguments.length; ++i) args[i] = arguments[i];
    return args.join(' ');
  }

  function prependZero(digit) {
    return digit < 10 ? ('0' + digit) : digit;
  }

  function paginationCustomRender(swiper, current, total) {
    return prependZero(current) + ' / ' + prependZero(total);
  }

  function initStuff() {
    for (var config in galleryConfigs) {
      galleries[config] = new Swiper(config, galleryConfigs[config]);
    }
    galleries[galleryLargeImages].params.control = galleries[galleryLargeCards];
    galleries[galleryLargeCards].params.control = galleries[galleryLargeImages];
  }

  // document ready
  $(initStuff);

})(jQuery, Swiper, window, document);
