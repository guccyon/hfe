Layout = {
	init: function() {
		Layout.size_reflesh();
		SideBar.init();
		ResizeBar.init();
		Event.observe(window, 'resize', Layout.size_reflesh);
	},
	size_reflesh: function() {
		$('resize').style.left = $('sidebar').offsetWidth + 'px';
		$('view').style.left = ($('sidebar').offsetWidth + $('resize').offsetWidth) + 'px';
		var w = $('wrapper').offsetWidth - $('sidebar').offsetWidth;
		$('view').style.width = (w > 0 ? w : 0) + 'px';
	}
}

SideBar = {
	init: function() {
		//var close = $('tree_close');
		//new infonic.Hover(close, {border:'solid 1px #BFBFBF'});
		//Event.observe(close, 'click', this.hide.bind(this));
		SideBar.size_reflesh();
		Event.observe(window, 'resize', SideBar.size_reflesh);
	},
	hide: function() {
		this.width = $('sidebar').offsetWidth;
		$('tree').style.width = '0px';
		Layout.size_reflesh();
	},
	show: function() {	$('tree').style.width = this.width + 'px'; },
	size_reflesh: function() {
		var h = document.body.offsetHeight - 26;
		$('sidebar_body').style.height = (h > 0 ? h : 0) + 'px';
	}
}

ResizeBar = {
	init: function() {
		this.element = $('resize');
		new infonic.Hover(this.element, {backgroundColor:'#1A63C1',def:{backgroundColor:'#E5E5D4'}});
		
		this.element.observe('mousedown', this.resize_start.bindAsEventListener(this));
	},
	// ドラッグ開始
	resize_start: function(e) {
		if (!this.handler) {
			this.moving = new Element('div')
			.setStyle( {
				position: 'absolute',
				top: 0,
				height: this.element.offsetHeight + 'px',
				width: '2px',
				left: Event.pointerX(e) + 'px',
				border: 'dotted 2px gray',
				zIndex: 10,
				cursor: 'e-resize'
			});
			$(document.body).insert({top: this.moving});
			
			this.startX = Event.pointerX(e);
			this.start_width = $('sidebar').offsetWidth;
			this.after_width = this.start_width;
			
			this.handler = this.mouse_move.bindAsEventListener(this);
			Event.observe(document, 'mousemove', this.handler);
			this.end_handler = this.resize_end.bindAsEventListener(this);
			Event.observe(document, 'mouseup', this.end_handler);
			try{e.preventDefault();}catch(e){}
			return false;
		}
	},
	// ドラッグ終了
	resize_end: function(e) {
		this.update_view(this.after_width);
		this.moving.parentNode.removeChild(this.moving);
		Event.stopObserving(document, 'mousemove', this.handler);
		Event.stopObserving(document, 'mouseup', this.end_handler);
		this.end_handler = null;
		this.handler = null;
	},
	// ドラッグ中
	mouse_move: function(e) {
		var x = Event.pointerX(e);
		var width = this.start_width + x - this.startX;
		if (80 < width && width < 500) {
			this.moving.style.left = (x - 1) + 'px';
			this.after_width = width;
		}
		try{e.preventDefault();}catch(e){}
		return false;
	},
	// 幅更新
	update_view: function(width) {
		if (width < 80) {width = 80;}
		$('sidebar').style.width =width + 'px';
		Layout.size_reflesh();
	}
}