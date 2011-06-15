/**** ダミーデータのロード *******************/
function load_dummy_data() {
	
	new Communication.get_child_data('ROOT').on_success(
				[{type:'d', name: 'Sandbox',auth:{'delete':true}},
			 	{type:'d', name: 'FileUpload',auth:{'delete':false}},
			 	{type:'d', name: 'Document',auth:{'delete':false}},
			 	{type:'d', name: 'Private',auth:{'delete':false}},
			 	{type:'d', name: 'Company',auth:{'delete':false}}]);
			 	
	(function(){
		var ary = [
			{type:'d', name: 'test1-1'},
			{type:'d', name: 'test1-2'},
			{type:'d', name: 'test1-3'},
			{type:'f', name: 'file1_1.xls', create_date: '2006/10/10', size: 999},
			{type:'f', name: 'file1_2.xls', create_date: '2006/10/13', size: 20489},
			{type:'f', name: 'file1_3.xls', create_date: '2006/09/18', size: 10023882},
			{type:'f', name: 'file1_4.css', create_date: '2005/10/10', size: 300, auth:{'write': false,'delete':false}},
			{type:'f', name: 'file1_5.doc', create_date: '2004/01/11', size: 512},
			{type:'f', name: 'file1_6.pdf', create_date: '2006/12/10', size: 0, auth:{'delete':false}},
			{type:'f', name: 'file1_7.txt', create_date: '2006/10/10', size: 512}];
		var sandbox = FileManager.path2fileId('/Sandbox');
		(new Communication.get_child_data(sandbox)).on_success(ary);
	}).setTimeout(500);
	
	(function(){
		var ary = [
			{type:'d', name: 'test3_1'},
			{type:'f', name: 'file3_2'},
			{type:'f', name: 'file4_1'}];
		var fupload = FileManager.path2fileId('/FileUpload');
		(new Communication.get_child_data(fupload)).on_success(ary);
	}).setTimeout(500);
	
	
	(function() {
		var ary = [
			{type:'d', name: 'test2-1'},
			{type:'d', name: 'test2-2'},
			{type:'d', name: 'test2-3'},
			{type:'f', name: 'file2_1.xls'}];
		var doc = FileManager.path2fileId('/Document');
		(new Communication.get_child_data(doc)).on_success(ary);
	}).setTimeout(4000);
	
	(function() {
		var ary = [
			{type:'d', name: 'test3_1'},
			{type:'f', name: 'file4_3'},
			{type:'f', name: 'file5_2'}];
		var company = FileManager.path2fileId('/Company');
		(new Communication.get_child_data(company)).on_success(ary);
	}).setTimeout(3000);
}
/***** ダミーデータ *****************************/

// ビューフレームのイベントリスナー
// ツリーのイベントハンドラの窓口として要求を受け付ける
ViewEventListener = {
	_event_process: {},
	setEvent: function(func, name, obj) {
		var bind_func = function(proc, self) {
			var f = proc;
			return function() {
				return f.apply(self, arguments);
			}
		};
		this._event_process[name] = bind_func(func, obj);
	},
	getEvent: function(name) {
		if (Overlay.isActive()) {
			return function(){alert('只今処理中です。')}
		} else {
			return this._event_process[name];
		}
	},
	invokeViewAPI: function(name) {
		if(this._event_process[name]) {
			return this._event_process[name]();
		}
		return null;
	}
};

// イベントリスナーへのイベント登録を行う
function set_event_for_toolbar() {
	// change_directory
	ViewEventListener.setEvent(
		MainViewController.change_directory,
		'change_directory',	MainViewController);
	
	// get_file
	ViewEventListener.setEvent(FileManager.path2fileId, 'get_file', FileManager);
	
	// ファイル削除
	ViewEventListener.setEvent(BaseController.remove, 'remove', BaseController);
	
	// 上へ
	ViewEventListener.setEvent(
		MainViewController.up_folder,
		'up_folder', MainViewController);
	
	// ファイルアップロード
	ViewEventListener.setEvent(UploadForm.show,	'file_upload', UploadForm);
	
	// 新規ディレクトリ作成
	ViewEventListener.setEvent(BaseController.create_directory, 'make_directory', BaseController);
	
	// 名前の変更
	ViewEventListener.setEvent(MainViewController.rename, 'rename', MainViewController);
	
	// 全て選択
	ViewEventListener.setEvent(function(){
		if ($GF(MainViewController.current_dir)) {
			$GF(MainViewController.current_dir).children().each(function(child){
				child.selected = true;
			});
			MainViewController.draw();
		}
	}, 'select_all');
	
	// アドレスバーに入力されたフォルダをチェック
	ViewEventListener.setEvent(function(path){
		new Communication.check_exist_from_path(path);
	}, 'check_exist_from_path');
	
	
	/* toolbar向けAPIの登録 */
	ViewEventListener.setEvent(function(){
		if (MainViewController.selected_files().length > 0) {
			return true;
		}
	}, 'current_select');
	ViewEventListener.setEvent(function(){
		return MainViewController.current_dir != 'ROOT' && MainViewController.current_dir != '';
	}, 'current_root');
}



Event.observe(window, 'load', function(){
	// レイアウトの初期化	
	Layout.init();
	
	// 右クリックメニュー作成
	//create_context_menu();
	
	// ツールバー向けイベント準備
	set_event_for_toolbar();
	if(local_debug) {
		// 開発時はダミーデータをロード
		load_dummy_data();
		TreeViewController.toggle('ROOT');
	} else {
		new Communication.get_child_data('ROOT', function(com){
			TreeViewController.toggle('ROOT');
		});
	}
});