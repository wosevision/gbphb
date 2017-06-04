import $ from 'jquery';

import { Nav } from './nav.class';
import { Gallery } from './gallery.class';
import { GoogleMap } from './map.class';

$(() => {
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

	const gallery = new Gallery({
		grid: {
			container: 'body',
			gallery: '.gallery-grid-display .swiper-container',
			openClass: 'gallery-grid-display-open',
			opener: '.gallery-grid-image',
			closer: '.gallery-grid-display-close'
		}
	});

	const map = new GoogleMap('#contact-map', {
		lat: 43.6532,
		lng: -79.3832
	});
});