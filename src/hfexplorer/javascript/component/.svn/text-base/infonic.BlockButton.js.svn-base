infonic.BlockButton = Class.create();
Object.extend(infonic.BlockButton.prototype,{
	initialize: function(element, callback, option) {
		this.element = element;
		this.callback = callback;
		this.set_default(element);
		this.disabled = option.disabled || false;
		Object.extend(this.style, option);
		this.set_event();
	},
	set_event: function() {
		Event.observe(this.element, 'mouseover', this.mouseover());
		Event.observe(this.element, 'mousedown', this.mousedown());
		Event.observe(this.element, 'mouseout', this.mouseout());
		Event.observe(this.element, 'mouseup', this.mouseup());
	},
	set_default: function(element) {
		this.style = {};
		var def = this.style['default'] = {};
		def.border = Element.getStyle(element,'border') || '1px solid transparent';
		def.backgroundColor = Element.getStyle(element,'backgroundColor') || 'transparent';
	},
	mouseover: function() {
		return function(e) {
			if (!this.disabled && this.style['over']){ Element.setStyle(this.element, this.style['over']); }
		}.bindAsEventListener(this);
	},
	mouseout: function() {
		return function(e) {
			if (!this.disabled){ Element.setStyle(this.element, this.style['default']); }
		}.bindAsEventListener(this);
	},
	mousedown: function() {
		return function(e) {
			if (!this.disabled, this.style['down']){ Element.setStyle(this.element, this.style['down']); }
		}.bindAsEventListener(this);
	},
	mouseup: function() {
		return function(e) {
			if (!this.disabled){
				this.mouseover()();
				this.callback(this.element);
			}
		}.bindAsEventListener(this);
	}
});

infonic.BlockSwitch = infonic.BlockButton.extend({
	initialize: function(element, callback, option) {
		this.superclass.initialize.apply(this, arguments);
		this.active = option.active || false;
	},
	set_event: function() {
		Event.observe(this.element, 'click', this.click());
	},
	click: function() {
		return function(e) {
			if (!this.disabled) {
				this.active = this.active ? false : true;
				if (this.active){ this.mousedown()();} 
				else { this.mouseout()(); }
				this.callback(this.element, this.active);
			}
		}.bindAsEventListener(this);
	},
	setActive: function(flg) {
		this.active = flg;
		if (this.active){ this.mousedown()();} 
		else { this.mouseout()(); }
		this.callback(this.element, this.active);
	}
});