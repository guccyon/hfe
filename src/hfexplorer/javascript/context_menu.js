function create_context_menu() {
	
	// コンテキストメニューの作成
	var menu_option = {
		on_style: {	fontSize: '9pt'	},
		off_style: { fontSize: '9pt' }
	};
	var menu_disabled_option = {
		on_style: {
			fontSize: '9pt',
			border: '1px solid transparent',
			backgroundColor: 'transparent'
		},
		off_style: {
			fontSize: '9pt',
			color: 'gray'
		}
	}
	var panel = new infonic.MenuPanel();
	
	var down = new infonic.MenuItem('ダウンロード', function(e){ }, menu_option);
	var mv = new infonic.MenuItem('名前の変更', function(e){	}, menu_option);
	var rm = new infonic.MenuItem('削除', function(e){	}, menu_option);
	panel.addItem(down);
	panel.addItem(mv);
	panel.addItem(rm);
	
	var sep = new infonic.MenuSeparator();
	panel.addItem(sep);
	var cut = new infonic.MenuItem('切り取り', function(e){ }, menu_disabled_option);
	var copy = new infonic.MenuItem('コピー', function(e){ }, menu_disabled_option);
	panel.addItem(cut);
	panel.addItem(copy);
	
	document.body.appendChild(panel.element);
	panel.element.style.position = 'absolute';
	panel.element.style.zIndex = '10';
	infonic.FloatingMenu.menu = panel;
	Event.observe($('view'), 'dblclick', infonic.FloatingMenu.dispMenu.bindAsEventListener(infonic.FloatingMenu));
	Event.observe($('view'), 'contextmenu', function(e) {
		infonic.FloatingMenu.dispMenu(e);
		return false;
	});
}