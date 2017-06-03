import $ from 'jquery';

export class Parallax {
	constructor(selector, {
		focalPoint = 'window',
		perspectiveFactor = 10
	} = {}) {
		this.$el = $(selector);
		this.$window = $(window);
		this.doc = document.documentElement,
		this.body = document.body;

		this.elCenterX = null;
		this.elCenterY = null;
		this.elOffset = null;

		this.config = {
      moveX: this.$el.data('moveX'),
      moveY: this.$el.data('moveY'),
      moveZ: this.$el.data('moveZ'),
      rotateZ: this.$el.data('rotateZ')
		};
		this.configs = this.$el
			.toArray()
			.map(el => $(el).data());

		this.options = {
			focalPoint,
			perspectiveFactor
		};

		console.log(
			'configuring perspectallax:',
			this.$el,

			this.options,
			this.configs
		);

		this.bindHandlers();
	}

	bindHandlers() {
    this.initialize = this.initialize.bind(this);
    this.getOffset = this.getOffset.bind(this);
    // this.getMouseXY = this.getMouseXY.bind(this);
    this.applyStyles = this.applyStyles.bind(this);
	}

	enable(index = 0) {
		if (this.options.focalPoint === 'parent') {
			$($(this.$el[index]).parent()[0]).on('mousemove', event => this.applyStyles(event, index));
		} else {
	    this.$window.on('mousemove', event => this.applyStyles(event, index));
		}
		// window.addEventListener('deviceorientation', this.applyStyles);
		this.$window.on('deviceorientation', event => this.applyStyles(event, index));
		this.$window.on('resize', this.initialize);
		this.initialize();
	}

	disable(index = 0) {
		if (this.options.focalPoint === 'parent') {
			$($(this.$el[index]).parent()[0]).off('mousemove', event => this.applyStyles(event, index));
		} else {
	    this.$window.off('mousemove', event => this.applyStyles(event, index));
		}
		this.$window.off('deviceorientation', event => this.applyStyles(event, index));
		this.$window.off('resize', this.initialize);
	}

	initialize() {
		this.elOffset = this.getOffset(this.$el[0]);
		this.elCenterX = this.elOffset.left + (this.$el.prop('clientWidth') / 2);
		this.elCenterY = this.elOffset.top + (this.$el.prop('clientHeight') / 2);
		console.log('perspectallax initialized!')
	}

	getOffset(el) {
    const box = el.getBoundingClientRect();

    const scrollTop = window.pageYOffset || this.doc.scrollTop || this.body.scrollTop;
    const scrollLeft = window.pageXOffset || this.doc.scrollLeft || this.body.scrollLeft;

    const clientTop = this.doc.clientTop || this.body.clientTop || 0;
    const clientLeft = this.doc.clientLeft || this.body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top, left };
	}

	getMouseXY(event) {
    const e = event || window.event;

    let mouse = [];
    mouse.x = e.clientX + (this.doc && this.doc.scrollLeft || this.body && this.body.scrollLeft || 0) - (this.doc.clientLeft || 0);
    mouse.y = e.clientY + (this.doc && this.doc.scrollTop || this.body && this.body.scrollTop || 0) - (this.doc.clientTop || 0);
    return mouse;
	}

	applyStyles(event, index) {
		const transformArgs = this.getTransformArgs(event, index);
		const transformCSS = this.getTransform(transformArgs, index);
    this.$el.css('transform', transformCSS);
    this.$el.css('-o-transform', transformCSS);
    this.$el.css('-moz-transform', transformCSS);
    this.$el.css('-webkit-transform', transformCSS);
    this.$el.css('-ms-transform', transformCSS);
	}

	getTransformArgs(event, index) {
    const mouse = this.getMouseXY(event);
    const parent = this.$el.parent()[0];
    let x, y;

    if (this.options.focalPoint === 'elements') {
      x = this.elCenterX - mouse.x;
      y = this.elCenterY - mouse.y;
    } else if (this.options.focalPoint === 'window') {
      x = window.innerHeight / 2 - mouse.x;
      y = window.innerHeight / 2 - mouse.y;
    } else if (this.options.focalPoint === 'parent') {
      x = parent.offsetLeft + (this.$el.parent()[0].clientWidth / 2) - mouse.x;
      y = parent.offsetTop + (this.$el.parent()[0].clientHeight / 2) - mouse.y;
    }

    if(event.type === 'deviceorientation') {
      y = event.beta *10;  // In degree in the range [-180,180]
      x = event.gamma *10; // In degree in the range [-90,90]
    }

    let args = {};

    args.moveX = this.configs[index].moveZ ? (x * this.configs[index].moveZ) : (x * this.configs[index].moveX);
    args.moveY = this.configs[index].moveZ ? (y * this.configs[index].moveZ) : (y * this.configs[index].moveY);

    args.xRotate = this.configs[index].rotateZ ? (x * this.configs[index].rotateZ) : (x * this.configs[index].moveX);
    args.yRotate = this.configs[index].rotateZ ? (y * this.configs[index].rotateZ) : (y * this.configs[index].moveY);

    // Apply global multiplicator to all elements
    Object.keys(args).map(value => {
      args[value] = args[value] / this.options.perspectiveFactor;
    });

    return args;
	}

	getTransform(args, index) {
    let transformCSS = '';

    if (this.configs[index].rotateZ) {
      transformCSS += 'perspective( 600px ) rotateY( ' + args.xRotate + 'deg ) rotateX( ' + args.yRotate + 'deg )';
    }
    if (this.configs[index].moveZ) {
      transformCSS += 'translate(' + args.moveX + 'px, ' + args.moveY + 'px)';
    }
    if (this.configs[index].moveX && !this.configs[index].moveY && !this.configs[index].moveZ) {
      transformCSS += 'translateX(' + args.moveX + 'px)';
    }
    if (!this.configs[index].moveX && this.configs[index].moveY && !this.configs[index].moveZ) {
      transformCSS += 'translateY(' + args.moveY + 'px)';
    }
    if (this.configs[index].moveX && this.configs[index].moveY && !this.configs[index].moveZ) {
      transformCSS += 'translate(' + args.moveX + 'px, ' + args.moveY + 'px)';
    }
    return transformCSS;
	}
}