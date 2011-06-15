var view_frame = parent.frames[1];
// ツールバー上の各ボタンの設定
ToolBar = {
	// トグルスイッチタイプのボタン
	type_switch: ['search', 'favorite'],
	// 未実装ボタン
	disabled: ['cut', 'copy', 'favorite']
};

// ツールバー上のボタンの各エフェクト定義
ToolBar.effect = {
	'over': {borderTop:'solid 1px #FFFFFF',borderLeft:'solid 1px #FFFFFF',borderBottom:'solid 1px #BFBFBF', borderRight:'solid 1px #BFBFBF'},
	'down': {borderTop:'solid 1px #BFBFBF',borderLeft:'solid 1px #BFBFBF',borderBottom:'solid 1px #FFFFFF', borderRight:'solid 1px #FFFFFF'},
	'default': {border: 'solid 1px #F2F2EE'}
}

// 実装済みツールバーボタン
ToolBar.Method = {
	disp_mode: function(element) {
		ViewEventAgent.NOT_SUPPORT();
	},
	search: function(element, active) {
		ViewEventAgent.NOT_SUPPORT();
	}
}

// メニュー
Menu = {};
Menu.Item = Class.create();
Object.extend(Menu.Item.prototype, {
	initialize: function(name, func) {
		var item = document.createElement('div');
		$(item).update(name);
		Event.observe(item, 'mouseover', function(e){Element.addClassName($E(e), 'hover')});
		Event.observe(item, 'mouseout', function(e){Element.removeClassName($E(e), 'hover')});
		if (func) {
			Event.observe(item, 'click', function(e){
				func();
				Element.hide($('submenu'));
			}.bind(this));
		} else {
			Element.addClassName(item, 'disabled');
		}
		$('submenu').appendChild(item);
	}
});

// メニューバーを開いた時にそれぞれ実行される処理
Menu.Creator = {
	file: function() {
		new Menu.Item('ファイルアップロード', function(){ViewEventAgent.call('file_upload')});
		
		if (ViewEventAgent.invokeView('current_root')) {
			new Menu.Item('新規フォルダ作成', function(){ViewEventAgent.call('make_directory')});
		} else {
			new Menu.Item('新規フォルダ作成');
		}
		
		if (ViewEventAgent.invokeView('current_select')) {
			new Menu.Item('名前の変更', function(){ViewEventAgent.call('rename')});
		} else {
			new Menu.Item('名前の変更');
		}
	},
	edit: function() {
		new Menu.Item('全て選択', function(){ViewEventAgent.call('select_all')});
	},
	help: function() {
		var help = new Menu.Item('ヘルプ');
	}
}
Object.aspect(Menu.Creator, function(){
	$('submenu').innerHTML = '';
});

// 一度開いたメニューバーのプルダウンメニューを非表示にするイベントセット
//Event.observe(view_frame.document, 'click',function(){ Element.hide($('submenu')) });

// アドレスバー
AddressBar = {
	init: function(element) {
		this.element = element;
		element.value = '/';
		var event_func = this.keypress.bindAsEventListener(this);
		element.observe('focus', function(){
			if (!ViewEventAgent.get_func('get_file')("/")) {
				this.blur();
				return;
			}
			Event.observe(document, 'keyup', event_func);
		});
		element.observe('blur', function(){
			Event.stopObserving(document, 'keyup', event_func);
		});
		element.observe('change', this.change.bindAsEventListener(this));
	},
	
	change: function(e) {
		var file = ViewEventAgent.get_func('get_file')(this.element.value);
		if (file) {
			ViewEventAgent.get_func('change_directory')(file);
		} else {
			ViewEventAgent.get_func('check_exist_from_path')(this.element.value);
		}
	},
	keypress: function(e) {
		var file = ViewEventAgent.get_func('get_file')(this.element.value);
		this.element.style.backgroundColor = (file ? '#FFFFCC' : '#FF99FF');
	},
	// viewフレーム側から表示用パスをセットするのに呼び出される
	setPath: function(value) {
		this.element.value = value;
	}
}

// ビューのイベントリスナーを呼び出すエージェント
// ツリーからビューに対する全ての処理呼び出しを代行する。
ViewEventAgent = {
	NOT_SUPPORT: function() {alert('Not Support yet!');},
	// ビューの関数を呼び出す。存在しない関数の場合、ダイアログ表示
	call: function(name) {
		(this.get_func(name) || this.NOT_SUPPORT)();
	},
	// ビューの関数を取得する。
	get_func: function(name) {
		if (view_frame.ViewEventListener) {
			return view_frame.ViewEventListener.getEvent(name);
		}
	},
	// ビューの処理を呼び出し、戻り値を返す。
	invokeView: function(name) {
		if (view_frame.ViewEventListener) {
			return view_frame.ViewEventListener.invokeViewAPI(name);
		}
	}
}

// 初期化処理
Event.observe(window, 'load', function() {
	$('submenu').hide();
	
	var offset = 0;
	
	$$("#menu td").each(function(td, i){
		console.log(td);
		td.observe('mouseover', function(){ this.addClassName("over") });
		td.observe('mouseout', function(){ this.removeClassName("over") });
		
		var left = offset;
		td.observe('mouseover', function(){
			Menu.Creator[this.id]();
			$('submenu').style.left = left + 'px';
		});
		offset += td.offsetWidth;
				
		td.observe('click', function(){ $('submenu').toggle() });
		td.observe('click', Menu.Creator[td.id]);
	});
	



	/*
	document.getElementsByClassName('btn_component').each(function(box){
		if (ToolBar.disabled.indexOf(box.id) == -1) {
			var func = function(element) {
				if(ToolBar.Method[element.id]) {
					var element = arguments[0];
					var active = arguments[1];
					ToolBar.Method[element.id](element, active);
				} else {
					ViewEventAgent.call(element.id);
				}
			}
			
			if (ToolBar.type_switch.indexOf(box.id) != -1) {
				new infonic.BlockSwitch(box, func, ToolBar.effect);
			} else {
				new infonic.BlockButton(box, func, ToolBar.effect);
			}
		}
	});
	*/
	
	AddressBar.init($('address'));

});

