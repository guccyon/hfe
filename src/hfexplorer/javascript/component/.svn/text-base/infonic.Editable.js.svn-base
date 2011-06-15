infonic.Editable = Class.create();
infonic.Editable.prototype._set_option = function(options) {
	this._option = Object.extend({
		onComplete: function(editValue){},
		onChange: function(editValue){ return false; },
		onEdit: function(){},
		triggerType: 'click',
		handler: null,
		highLight: {},
		htmlEscape: true,
		defaultValue: ''
	},options);
}
Object.extend(infonic.Editable.prototype, {
	initialize: function(target, options) {
		this._set_option(options || {});
		if (target.nodeType == 3) {
			this._option.defaultValue = target.nodeValue;
			var span = document.createElement('span');
			span.appendChild(target);
			target.parentNode.replaceChild(span, textNode);
			target = span;
		}
		this._target = target;
		if (this._option.highlight != 'none')	this._set_target_effect(this._target);
		this._value = this._edit_value = this._target.innerHTML || '';
		this._trigger_on();
	},
	_trigger_on: function() {
		this._trigger = function(e){
			if (e) Event.stop(e);
			Event.stopObserving($(this._option.handler) || this._target, this._option.triggerType, this._trigger);
			this._value = this._edit_value;
			var input_form = this._create_edit_form(this._value);
			this._target.innerHTML = '';
			this._target.appendChild(input_form);
			
			Event.observe(input_form, 'blur', function(e){ this._on_blur(e); }.bindAsEventListener(this) );
			
			if (this._on_edit_start) this._on_edit_start(input_form);
			input_form.focus();
		}.bindAsEventListener(this);
		Event.observe($(this._option.handler) || this._target, this._option.triggerType, this._trigger);
	},
	update_disp: function() {
		if (arguments[0]) this._edit_value = arguments[0];
		this._target.innerHTML = '';
		var disp_value = this._convert_disp_value(this._edit_value);
		if (this._option.htmlEscape) disp_value = disp_value.escapeHTML();
		this._target.innerHTML = this._allow_tag(disp_value).toLink();
	},
	_on_blur: function(e) {
		var input_form = Event.element(e);
		this._edit_value = 
			input_form.type.toLowerCase() == 'checkbox' ? 
				input_form.checked : input_form.value;
		var flg = true;
		if (this._value != this._edit_value) {
			if (this._option.onChange.bind(this)(this._edit_value)) {
				input_form.focus();
				return;
			}
		}
		this.update_disp();
		this._trigger_on();
		this._option.onComplete(this._edit_value);
	},
	
	setEditFormStyle: function(style) {
		this.style = style;
	},
	active: function() {
		if (this._trigger) this._trigger();
	},
	rollback: function() {
		if (this._target.firstChild && this._target.firstChild.nodeName != 'INPUT') {
			this._target.innerHTML = this._convert_disp_value(this._value);
			this._edit_value = this._value;
		}
	},
	_set_target_effect: function(target) {
		Event.observe(target, 'mouseover', function(e){
           Element.setStyle(this._target, Object.extend({
                                 textDecoration: 'underline'
                                //,backgroundColor: '#FFFFBB'
                                }, this._highlight));
			
		}.bindAsEventListener(this));
		Event.observe(target, 'mouseout', function(e){
           Element.setStyle(this._target, {
                                 textDecoration: 'none'
                                ,backgroundColor: 'transparent'
                                });
			
		}.bindAsEventListener(this));
	},
	_allow_tag: function(value) {return value;},
	/* abstract method */
	_convert_disp_value: function(value) {throw 'not support'},
	_create_edit_form: function(value) {throw 'not support'}
});

// Text	
infonic.Editable.Text = infonic.Editable.extend({
	_create_edit_form: function(value) {
		var input = document.createElement('input');
		input.type = 'text';
		input.value = value;
		Element.setStyle(input, this._set_default_form_style());
		return input;
	},
	_convert_disp_value: function(value) {
		return value;
	},
	_set_default_form_style: function() {
		return Object.extend({
			border: 'solid 1px gray',
			margin: '0',
			width: '100%'
		}, (this.style || {}));
	}
});

// TextArea
infonic.Editable.TextArea = infonic.Editable.extend({
	_create_edit_form: function(value) {
		var textarea = document.createElement('textarea');
		textarea.value = value;
		Element.setStyle(textarea, this._set_default_form_style());
		return textarea;
	},
	_convert_disp_value: function(value) {
		return this._convert_return_code(value);
	},
	_set_default_form_style: function() {
		return Object.extend({
			border: 'solid 1px gray',
			width: '100%',
			margin: '0',
			height: '100%'
		}, (this.style || {}));
	},
	_convert_return_code: function(value) {
		var result = value.split("\r\n");
		result = result.join('<br/>');
		result = result.split("\n");
		result = result.join('<br/>');
		return result;
	},
	_allow_tag: function(value) {
		var result = value;
		var end_tag = "&lt;br/?&gt;";
		result = result.gsub(end_tag, function(value) {
			return '<br/>';
		});
		return result;
	}
});

infonic.Editable.Select = infonic.Editable.extend({
	initialize: function() {
		this.superclass.initialize.apply(this, arguments);
		this._select_items = [];
	},
	addItem: function(dispName, itemValue) {
		if (arguments[0] instanceof Array) {
			arguments[0].each(function(item){
				this._select_items.push({name: item[0], value: item[1]});
			}.bind(this));
		} else {
			this._select_items.push({name: dispName, value: itemValue});
		}
		this._select_items.each(function(item){
			if (this._edit_value == item.name) this._edit_value = item.value;
		}.bind(this));
	},
	_create_edit_form: function(value) {
		var select = document.createElement('select');
		this._select_items.each(function(item){
			var option = document.createElement('option');
			option.innerHTML = item.name;
			option.value = item.value;
			if (this._value == item.value) { option.selected = true; }
			select.appendChild(option);
		}.bind(this));
		return select;
	},
	_convert_disp_value: function(form_value) {
		if (!this._select_items) this._select_items = [];
		for (var i = 0; i < this._select_items.length; i++) {
			if (this._select_items[i].value == form_value)
				return this._select_items[i].name;
		}
		return "";
	}
});

infonic.Editable.CheckBox = infonic.Editable.extend({
	initialize: function() {
		this.superclass.initialize.apply(this, arguments);
	},
	setProperty: function(onDisp, offDisp) {
		if (typeof onDisp == 'string')
			this._is_checked_str = onDisp;
		if (typeof offDisp == 'string')
			this._is_not_checked_str = offDisp;
		this._edit_value = this._target.innerHTML == this._is_checked_str;
	}, 
	_is_checked_str: 'true',
	_is_not_checked_str: 'false',
	
	_create_edit_form: function(span) {
		var chkbox = document.createElement('input');
		chkbox.type = 'checkbox';
		Element.setStyle(chkbox, this._set_default_form_style());
		return chkbox;
	},
	_convert_disp_value: function(checked) {
		if (checked) {return this._is_checked_str;}
		else {return this._is_not_checked_str;}
	},
	_set_default_form_style: function() {
		return Object.extend({
			border: 'solid 1px gray'
		}, (this.style || {}));
	},
	_on_edit_start: function(formElement, span){
		if (this._value){
			formElement.checked = 'checked';
		}
	}
})