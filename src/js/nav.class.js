import $ from 'jquery';

export class Nav {
	constructor({
		container,
		toggler,
		toggleClass,
		background,
		bgSpeed
	}) {
		this.$window = $(window);
		this.$container = $(container);
		this.$toggler = $(toggler);
		this.$background = $(background);

		this.toggleClass = toggleClass;
		this.bgSpeed = bgSpeed;
		this.bgOffset = this.$background.offset().top;

		this.bindEvents();
	}

	get scrollTop() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
	get scrollFactor() {
		return (this.scrollTop - this.bgOffset) / this.bgSpeed;
	}
	
	onToggle() {
		this.$container.toggleClass(this.toggleClass);
	}
	onScroll() {
    const scaleFactor = (this.scrollFactor / 2000) + 1;
    let transform = `scale(${scaleFactor}) translateY(${this.scrollFactor}px)`,
    		opacity = 1 - (this.scrollFactor / 100);

		this.$background.css({ transform, opacity });
	}

	bindEvents() {
		this.onToggle = this.onToggle.bind(this);
		this.onScroll = this.onScroll.bind(this);

		this.$toggler.on('click', this.onToggle);
		this.$window.on('scroll resize', this.onScroll);

		this.$window.trigger('scroll');
	}
}