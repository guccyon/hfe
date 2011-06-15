/**
 * 入力欄(radio以外)にフォーカスが当たると背景色を変更する
 * イベントを追加するメソッド
 * 実際のイベントセットをする処理は
 * 固定テーブルヘッダの処理を行った後にセットする。
 */
function HighlightFocus(element) {
	this.initialize.apply(this, arguments);
}
HighlightFocus.radio = new Array();
if (!HighlightFocus.FOCUS_COLOR) {
	HighlightFocus.FOCUS_COLOR = '#FFFFCC';
}
HighlightFocus.isRadio = function(element) {
		return (element.type && element.type == 'radio' && element.name) 
	};
HighlightFocus.isAvailable = function(element) {
		return (!element.disabled && !element.readOnly);
	};
HighlightFocus.isApplytype = function(element) {
		var type = element.type;
		return (type && type != 'button' && type != 'submit' && type != 'img' && type != 'reset');
	};
	
HighlightFocus.prototype = {
	initialize: function(element) {
		this.element = element;
		this.bgColor = Element.getStyle(this.element, 'backgroundColor');
		this.element.style.backgroundColor = this.bgColor;
		
		if (HighlightFocus.isRadio(element)) {
			if (!HighlightFocus.radio[this.element.name]) {
				HighlightFocus.radio[this.element.name] = new HighlightFocusRadio();
			}
			HighlightFocus.radio[this.element.name].add(this);
		}
		
		if (HighlightFocus.isRadio(this.element)) {
			Event.observe(element, 'focus', this.onFocusAll.bindAsEventListener(this));
			Event.observe(element, 'blur', this.onBlurAll.bindAsEventListener(this));
		} else {
			Event.observe(element, 'focus', this.onFocus.bindAsEventListener(this));
			Event.observe(element, 'blur', this.onBlur.bindAsEventListener(this));
		}
	},
	
	onFocus: function() {
		this.bgColor = Element.getStyle(this.element, 'backgroundColor');
		this.element.style.backgroundColor = HighlightFocus.FOCUS_COLOR;
	},
	
	onBlur: function() {
		this.element.style.backgroundColor = this.bgColor;
	},
	
	onFocusAll: function() {
		HighlightFocus.radio[this.element.name].onFocus();
	},
	
	onBlurAll: function() {
		HighlightFocus.radio[this.element.name].onBlur();
	}
}
function HighlightFocusRadio() {
	this.initialize.apply(this, arguments);
}
HighlightFocusRadio.prototype = {
	initialize: function() {
		this.radioAry = new Array();
	},
	
	add: function(highlightObj) {
		this.radioAry.push(highlightObj);
	},
	
	onFocus: function() {
		this.radioAry.each(function(radio){radio.element.style.backgroundColor = HighlightFocus.FOCUS_COLOR;});
	},
	
	onBlur: function() {
		this.radioAry.each(function(radio){radio.element.style.backgroundColor = radio.bgColor;});
	}
}


/**
 * 画面内全入力フォームにFocusElementイベントをセットします。
 */
Event.observe(window, 'load', function() {
		
		// 全てのInputにイベントをセット
		var inputs = document.getElementsByTagName('INPUT');
		for (var i = 0; i < inputs.length; i++)	{
			if (HighlightFocus.isAvailable(inputs[i])
				&& HighlightFocus.isApplytype(inputs[i]))
				new HighlightFocus(inputs[i]);
		}
			
		// 全てのtextAreasにイベントをセット
		var textAreas = document.getElementsByTagName('TEXTAREA');
		for(i = 0; i < textAreas.length; i++) {
			if(HighlightFocus.isAvailable(textAreas[i]))
				new HighlightFocus(textAreas[i]);
		}
			
		// 全てのSelectにイベントをセット
		var selects = document.getElementsByTagName('SELECT');
		for(i = 0; i < selects.length; i++) {
			if(HighlightFocus.isAvailable(selects[i]))
				new HighlightFocus(selects[i]);
		}
	});