infonic.SubmitFilter = function(){this.initialize.apply(this, arguments);};
infonic.SubmitFilter = {
	INDICATOR_URL: '../javascript/effect/indicator.big.gif',
	WAIT_MESSAGE: 'Now Loading...',
	disp: function() {
		if (!this.filter) this._set_filter();
		this.filter.style.display = 'block';
		this.filter.appendChild(this._create_message_area());
	},
	hide: function() {
		this.filter.style.display = "none";
	},
	_set_filter: function() {
		this.filter = document.createElement('div');
		Element.setStyle(this.filter, this._default_filter_style());
		document.body.appendChild(this.filter);
	},
	_default_filter_style: function() {
		return {
			position: 'absolute',
			width:   '100%',
			height:  '100%',
			top:     '0',
			left:    '0',
			zIndex: '6',
			filter:  'alpha(opacity=70)',
			opacity: '0.7',
			display: 'none',
			backgroundColor: 'gray',
			color:   'white'
		};
	},
	_create_message_area: function() {
		var msgArea = document.createElement('div');
		Element.setStyle(msgArea, this._default_msgarea_style());
		
		var indiImg = new Image();
		indiImg.src = this.INDICATOR_URL;
		var indicator = document.createElement('div');
		indicator.appendChild(indiImg);
		msgArea.appendChild(indicator);
		
		var text = 	document.createTextNode(this.WAIT_MESSAGE);
		msgArea.appendChild(text);
		return msgArea;
	},
	_default_msgarea_style: function() {
		return {
			position:  'absolute',
			left:      '40%',
			top:       '45%',
			textAlign: 'center'
		};
	}
};

Event.observe(window, 'load', function() {
	if(Element.getStyle(document.body, 'height') == null) {
		document.body.style.height = '100%';
	}
	if(Element.getStyle(document.body, 'width') == null) {
		document.body.style.width = '100%';
	}
	for(i = 0; i < document.forms.length; i++) {
		Event.observe(document.forms[i], 'submit', function(){
			infonic.SubmitFilter.disp();
		}, false);
	}
});