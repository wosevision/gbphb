import $ from 'jquery';

import { styles } from './map-styles.constant';

export class GoogleMap {
	constructor(selector, center) {
		this.scriptFetched = !!(window.google) || false;
		this.mapContainer = $(selector)[0];
		this.center = center;
		this.fetchScript();
	}
	fetchScript() {
		if (window.google || !this.mapContainer) return;
		$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBWioYrnIcLeRyOR5cvgRPji_xsNx4USos')
		  .done(this.init.bind(this))
		  .fail(this.handleError);
	}
	init() {
		const center = this.center = new google.maps.LatLng(this.center);
    this.map = new google.maps.Map(this.mapContainer, {
      scrollwheel: false,
		  disableDefaultUI: true,
		  gestureHandling: 'none',
		  disableDoubleClickZoom: true,
      zoom: 11,
      center,
      styles
    });
    this.setMarker();
  }
  setMarker() {
  	const animation = this.animation = google.maps.Animation.DROP;
  	const position = this.center;
  	const icon = {
		  url: 'assets/img/map-pin.png',
		  scaledSize: new google.maps.Size(48, 48)
		};
		const marker = new google.maps.Marker({
	    title: 'GBPH headquarters',
	    animation,
	    position,
	    icon
		});
		marker.setMap(this.map);
  }
  handleError() {
		console.error('Error loading Google Maps!');
	}
}