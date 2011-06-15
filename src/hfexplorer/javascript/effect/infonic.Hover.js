infonic.Hover = Class.create();
Object.extend(infonic.Hover.prototype, {
	initialize: function(handle, effects, element) {
		var element = (element || handle);
		Event.observe(handle, 'mouseover', function(){
			element.setStyle(effects);
		});
		var def_style = this._set_effect(element, effects);
		Event.observe(handle, 'mouseout', function(){
			element.setStyle(def_style);
		});
	},
	_set_effect: function(element, effects) {
		var def = {};
		$H(effects).each(function(effect) {
			var value;
			if (effects.def) value = effects.def[effect.key];
			if (!value) element.getStyle(effect.key);
			if (!value) { value = this._default_value(effect.key) }
			if (value) { def[effect.key] = value; }
		}.bind(this));
		return def;
	}, 
	_default_value: function(css_property) {
		switch (css_property) {
		case "backgroundColor":
			return "transparent";
		case "border":
			return "0px solid transparent";
		}
	}
})