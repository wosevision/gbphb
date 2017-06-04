import $ from 'jquery';

export class Nav {
	constructor(nav, {
		container,
		toggler,
		toggleClass,
		scrolledClass,
		hero
	}) {
		this.$window = $(window);
		this.$nav = $(nav);

		this.$container = $(container);
		this.$toggler = $(toggler);
		this.toggleClass = toggleClass;
		this.scrolledClass = scrolledClass;

		this.hero = {
			$background: $(hero.background),
			$container: $(hero.container),
			speed: hero.speed
		};

		this.bindEvents();
	}

	get isDesktop() {
		return window.matchMedia("(min-width: 992px)").matches;
	}
	get bgOffset() {
		return this.hero.$background.offset().top;
	}
	get scrollTop() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
	get scrollFactor() {
		return (this.scrollTop - this.bgOffset) / this.hero.speed;
	}
	get bgContainerBottom() {
		return this.hero.$container.position().top + this.hero.$container.outerHeight(true);
	}
	get navPassedContainer() {
		return this.scrollTop > (this.isDesktop ? this.bgContainerBottom : 0);
	}
	
	onToggle() {
		this.$container.toggleClass(this.toggleClass);
	}
	onScroll() {
    const scaleFactor = (this.scrollFactor / 2000) + 1;
    const transform = `scale(${scaleFactor}) translateY(${this.scrollFactor}px)`,
    			opacity = 1 - (this.scrollFactor / 100);
		this.hero.$background.css({ transform, opacity });

		if (!this.navScrolled && this.navPassedContainer) {
			this.$nav.addClass(this.scrolledClass);
			this.navScrolled = true;
		}
		if (this.navScrolled && !this.navPassedContainer) {
			this.$nav.removeClass(this.scrolledClass);
			this.navScrolled = false;
		}
	}

	bindEvents() {
		this.onToggle = this.onToggle.bind(this);
		this.onScroll = this.onScroll.bind(this);

		this.$toggler.on('click', this.onToggle);
		this.$window.on('scroll resize', this.onScroll);

		this.onScroll();
	}
}