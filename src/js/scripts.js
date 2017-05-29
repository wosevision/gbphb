import $ from 'jquery';

import { Nav } from './nav.class';
import { Gallery } from './gallery.class';

$(() => {
	const nav = new Nav({
		container: 'body',
		toggler: '#navToggle',
		toggleClass: 'nav-toggled',
		background: '#hero-image',
		bgSpeed: 8
	});

	const gallery = new Gallery({
		grid: {
			container: 'body',
			openClass: 'gallery-grid-display-open',
			opener: '.gallery-grid-image',
			closer: '.gallery-grid-display-close'
		}
	});
});