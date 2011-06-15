//-----package-----
// /component/infonic.FloatingMenu.js
//-----package-----
infonic.include("prototype.js",{exist:'Prototype'});

infonic.FloatingMenu = {
	rootMenuList: [],
	panelList: [],
	_panel_sequence: 0,
	register: function(menu) {
		if (!this.menu) {
			document.body.appendChild(menu.element);
			menu.element.style.position = 'absolute';
			menu.element.style.zIndex = '10';
			this.menu = menu;
			Event.observe(document, 'dblclick', infonic.FloatingMenu.dispMenu.bindAsEventListener(infonic.FloatingMenu));
			Event.observe(document, 'contextmenu', function(e) {
				infonic.FloatingMenu.dispMenu(e);
				return false;
			});
		}
	},
	dispMenu: function(e) {
		this.menu.element.style.left = (Event.pointerX(e) - 10) + 'px';
		this.menu.element.style.top = (Event.pointerY(e) - 10) + 'px';
		this.menu.element.style.display = 'block';
		this.eventClick = this.globalOnClick.bindAsEventListener(this);
		Event.observe(document, 'click', this.eventClick);
	},
	globalOnClick: function(e) {
		this.menu.element.style.display = 'none';
		Event.stopObserving(document, 'click', this.eventClick);
	},
	setBody: function(element) {
		if (document.body) {
			document.body.appendChild(element);
		} else {
			var _element = element;
			Event.observe(window, 'load', function() {
					document.body.appendChild(_element);
				}, false);
		}
	},
	setRightClickMenu: function(menuPanel) {
		menuPanel.element.style.position = 'absolute';
		this.setBody(menuPanel.element);
		var _menuPanel = menuPanel;
		Event.observe(document, 'dblclick', function(e){
			_menuPanel.element.style.left = Event.pointerX(e);
			_menuPanel.element.style.top = Event.pointerY(e);
			_menuPanel.show();
		});
		this.rootMenuList.push(menuPanel);
	},
	set: function(menuPanel) {
		if (document.body) {
			document.body.appendChild(menuPanel.element);
		} else {
			Event.observe(window, 'load', function() {
					document.body.appendChild(this.element);
				}.bindAsEventListener(this), false);
		}
		this.rootMenuList.push(menuPanel);
	},
	/* メニューの表示位置をセットする */
	updatePosition: function(top, left) {
		this.element.style.top = top;
		this.element.style.left = left;
	},
	/* 対象のパネルを含むルートメニューを返す */
	getRootMenu: function(target_id) {
		var result;
		this.rootMenuList.each(function(root) {
			if (root._has_own_child(target_id)){
				result = root;
			}
		});
		return result;
	},
	_create_panel_id: function() {
		return this._panel_sequence++;
	}
};

infonic.MenuPanel = Class.create();
Object.extend(infonic.MenuPanel.prototype, {
	_relative_path : 'component',
	initialize: function() {
		this._setArguments(arguments);
		var shadow = document.createElement('div');
		Element.setStyle(shadow, this._shadow_style());
		
		var panel = document.createElement('div');
		Element.setStyle(panel, this._panel_style());
		shadow.appendChild(panel);
		Event.observe(panel, 'mouseout', function(e) {
				this.setHide();
			}.bindAsEventListener(this), false);
		
		this.id = infonic.FloatingMenu._create_panel_id();
		infonic.FloatingMenu.panelList[this.id] = this;
		
		this.container = panel;
		this.element = shadow;
		this.menuItems = [];
	},
	_setArguments: function(arg) {
		if (arg[0])
			this._relative_path = arg[0]['path'];
	},
	/** パネルにメニュー用のアイテムを追加 */
	addItem: function(menuItem) {
		this.menuItems.push(menuItem);
		this.container.appendChild(menuItem.element);
		menuItem._panel_id = this.id;
		menuItem.on_click = this.hideOnClick.bind(this);
	},
	/** パネルを表示する */
	show: function() {
		this.element.style.display = 'block';
	},
	/** 表示中のパネルを非表示にする */
	hide: function() {
		var flg = true;
		this.menuItems.each(function(item) {
			if (item.active) {
				flg = false;
			}
		});
		if (flg) 
			this.element.style.display = 'none';
	},
	setHide: function() {
		setTimeout(this.hide.bindAsEventListener(this), 500);
	},
	hideOnClick: function() {
		this.element.style.display = 'none';
		if(this._parent_close_on_click)
			this._parent_close_on_click();
	},
	/** 子要素に対象のパネルが存在するか返す */
	_has_own_child: function(target_id) {
		if (this.id == target_id) return true;
		var exist = false;
		this.menuItems.each(function(item){
			if(item._child && item._child._has_own_child(target_id)){
				exist = true;
			}
		});
		return exist;
	},
	_shadow_style: function() {
		return {
			position: 'absolute',
			width:    '160px',
			top:      '5px',
			left:     '5px',
			display:  'none',
			backgroundColor: 'silver'
		};
	},
	_panel_style: function() {
		var image_path = infonic.BASE_URL + this._relative_path + '/menu_bgc.jpg';
		return {
			position:        'relative',
			width:           '100%',
			top:             '-5px',
			left:            '-5px',
			padding:         '1px',
			border:          'solid 1px #182CB2',
			backgroundImage: 'url(' + image_path + ')',
			backgroundColor: '#FFFFFF',
			backgroundRepeat: 'repeat-y'
		};
	}
});

infonic.MenuParts = Class.create();
Object.extend(infonic.MenuParts.prototype, {
	_set_default_event: function(element) {
		var element = element;
		Event.observe(element, 'mouseover', function(e){
			Element.setStyle(element, this._default_on_style());
			this.active = true;
		}.bindAsEventListener(this), true);
		
		Event.observe(element, 'mouseout', function(e){
			Element.setStyle(element, this._default_off_style());
			this.active = false;
		}.bindAsEventListener(this), true);
	},
	_set_option: function(options) {
		this.options = {
				on_style: {},
				off_style: {}
			};
    	Object.extend(this.options, options || {});
	},
	_default_style: function() {
		return {
			position:   'relative',
			margin:     '1px',
			padding:    '2px 3px',
			//width:      '100%',
			textAlign:  'left',
			fontSize:   '11pt',
			textIndent: '25px',
			color:      'MenuText',
			cursor:     'default'
		};
	},
	_default_on_style: function(){},
	_default_off_style: function(){},
	on_click: function(){}
});
/**
 * メニュー項目
 */
infonic.MenuItem = Class.create();
Object.extend(infonic.MenuItem.prototype, infonic.MenuParts.prototype);
Object.extend(infonic.MenuItem.prototype, {
	/** コンストラクタ */
	initialize: function(value, proc, options) {
		this._set_option(options);
		this.active = false;
		var element = document.createElement('div');
		this._set_default_event(element);
		Element.setStyle(element, this._default_style());
		Element.setStyle(element, this._default_off_style());
		
		// menuアイテムの作成
		var menu = document.createElement('div');
		menu.innerHTML = value;
		var process = this._get_action_func(proc);
		Event.observe(element, 'click', function(e){
			if (process) process(e);
			this.active = false;
			if (this._child) {
				this._child.element.style.display = 'none';
			}
			this.on_click();
			
		}.bindAsEventListener(this), true);
		
		element.appendChild(menu);
		this.element = element;
	},
	/** サブメニューをセットする */
	setChildMenu: function(menuPanel) {
		if (!this._child) {
			/*var divBtn = document.createElement('div');
			Element.setStyle(divBtn, {
					position: 'absolute',
					width: '100%',
					textAlign: 'right'
				});
			var span = document.createElement('span');
			span.innerHTML = '>';
			divBtn.appendChild(span);
			this.element.parentNode.insertBefore(divBtn, this.element);
			*/
			Event.observe(this.element, 'mouseover', function(e){
					this._child.show();
					this._child.element.style.top = "0px";
					this._child.element.style.left = this.element.offsetWidth + 'px';
					this.active = true;
					Event.stop(e);
				}.bindAsEventListener(this), true);
			Event.observe(this.element, 'mouseout', function(e){
					this.active = false;
					this._child.hide();
					Event.stop(e);
				}.bindAsEventListener(this), true);
				
			this.element.appendChild(menuPanel.element);
			this._child = menuPanel;
			
			menuPanel._parent_close_on_click = function() {
					Element.setStyle(this.element, this._default_off_style());
					infonic.FloatingMenu.panelList[this._panel_id].hideOnClick();
				}.bind(this);
		}
	},
	_get_action_func: function(action) {
		if (typeof action == 'function') {
			return action;
		} else if (typeof action == 'string') {
			if (action.indexOf('http://') == 0 || action.indexOf('https://') == 0 ) {
				var action = action;
				return function() {document.location.href = action;};
			} else {
				return eval('(' + action + ')');
			}
		}
	},
	_default_on_style: function() {
		return Object.extend({
			border: 'solid 1px #182CB2',
			backgroundColor: '#FFDFAA'
		}, this.options.on_style);
	},
	_default_off_style: function() {
		return Object.extend({
			border: '1px solid transparent',
			backgroundColor: 'transparent'
		}, this.options.off_style);
	}
});

infonic.MenuSeparator = Class.create();
Object.extend(infonic.MenuSeparator.prototype, infonic.MenuParts.prototype);
Object.extend(infonic.MenuSeparator.prototype, {
	initialize: function(options) {
		this._set_option(options);
		var element = document.createElement('div');
		element.appendChild(document.createElement('hr'));
		Element.setStyle(element, this._default_style());
		this._set_default_event(element);
		this.element = element;
	},
	_default_style: function() {
		return {
			margin: '2px 3px',
			width:  '100%',
			border: 'none',
			textIndent: '25px',
			cursor: 'auto'
		};
	}
});