Communication = {};
// 通信中のデータの管理
Communication.Cue = {
	cue_ary: new Array(),
	push: function(arg, _class) {
		this.cue_ary.push([arg, _class]);
		if (!this.interval_handle) {
			this.interval_handle = window.setInterval(this.run.bind(this), 500);
		}
	},
	run: function() {
		target = this.cue_ary.shift();
		if (!target) {
			window.clearInterval(this.interval_handle);
			this.interval_handle = null;
		} else {
			new target[1](target[0]);
		}
	}
}

// 通信クラスの親クラス
Abstract.Communication = Class.create();
Object.extend(Abstract.Communication.prototype, {
	invoke: function() {
		if (local_debug) return;
		if (!this.params) this.params = [];
		new Ajax.Request(window.ServletPath + encodeURI(this.URL) + '?' + new Date().getTime(), {
			method: 'post',
			parameters: $H(this.params).toQueryString(),
			onComplete: this.receive.bind(this),
			onFailure: (this.onError || function(){}).bind(this)
		});
	},
	receive: function(res) {
		try {
			var json = window.eval('(' + res.responseText + ')');
			if (json.failure) {
				this.on_failure(json);
				
			} else {
				this.on_success(json);
			}
		} catch (e) {alert(e);this.onError(res,e)}
	},
	on_success: function(json) {},
	on_failure: function(json) {}
});

// 対象ディレクトリの子ファイルリストを取得
Communication.get_child_data = Abstract.Communication.extend({
	initialize: function(target_dir, callback) {
		this.URL = '/GetFileList' + $GF(target_dir).full_path();
		this.target_dir = target_dir;
		if (callback) this.callback = callback;
		this.invoke();
	},
	on_success: function(json) {
		var dirs = FileManager.add_from_json(this.target_dir, json);
		if (this.callback) this.callback(this);
		this.childCache.setTimeout(1000, dirs);
		return dirs;
	},
	on_failure: function(json) {
		
	},
	onError: function(res, error) {
		/*this.invoke.setTimeoutBind(100, this);*/ 
	},
	childCache: function(dirs) {
		dirs.each(function(dir){
			// 展開後の要素なら で　子要素を見取得であれば
			if ((dir instanceof Directory) && $(dir.id) && dir._children.length == 0) {
				Communication.Cue.push(dir.id, Communication.get_child_data);
			}
		});
	}
});


// ファイルの削除
Communication.remove_files = Abstract.Communication.extend({
	initialize: function(target_dir_id, selects) {
		this.URL = '/Delete' + $GF(target_dir_id).full_path();
		this.target_dir = target_dir_id;
		this.params = {FILES:selects.pluck('name').join(',')};
		this.invoke();
	},
	on_success: function(json) {
	},
	on_failure: function(json) {
		var msg = json.error_msg;
		if (json.files) {
			msg += "\r\n\r\n以下のファイルの削除に失敗しました。"
			msg += "\r\n" + json.files.join('\r\n・');
		}
		alert(msg);
		
		if (json.error_param && json.error_param.lost_target) {
			
			var parent_id = $GF(this.target_dir).parent_id
			$GF(this.target_dir).remove();
			
			TreeViewController.remove($GF(this.target_dir));
			
			if (MainViewController.current_dir == this.target_dir) {
				MainViewController.change_directory(parent_id);
			}
		}
	}
});

// 新規ディレクトリ作成
Communication.make_directory = Abstract.Communication.extend({
	initialize: function(target_dir_id, name) {
		this.URL = '/MakeDirectory' + $GF(target_dir_id).full_path();
		this.target_dir = target_dir_id;
		this.params = {NEW_DIRECTORY: name};
		this.invoke();
	},
	on_success: function(json) {
		if (json.success) {
			var new_dir = FileManager.add_from_json(this.target_dir, json.success);
			if (MainViewController.current_dir = this.target_dir) {
				TreeViewController.set_child(this.target_dir);
				MainViewController.draw();
			}
		}
	},
	on_failure: function(json) {
		var msg = $GF(this.target_dir).full_path() + '/' + this.params.NEW_DIRECTORY;
		msg += '\r\nは以下の理由で作成できませんでした。\r\n';
		msg += json.error_msg;
		alert(msg);
	}
});

// ファイル名の変更
Communication.rename = Abstract.Communication.extend({
	initialize: function(target_file_id, to_Name) {
		this.URL = '/Rename' + $GF(target_file_id).full_path();
		this.params = {TO_NAME: to_Name};
		this.target_file_id = target_file_id;
		this.before = $GF(target_file_id).name;
		this.invoke();
	},
	on_success: function(json) {
		if (!json.success) {
			$GF(this.target_file_id).name = this.before;
			alert(this.before + 'のりネームに失敗しました。');
			MainViewController.draw();
		}
	},
	on_failure: function(json) {
		
	}
});

// パスからファイルのディレクトリの取得
Communication.check_exist_from_path = Abstract.Communication.extend({
	initialize: function(path) {
		this.URL = '/GetFileDataFromPath' + path;
		if (path != "")	this.invoke();
	},
	on_success: function(json) {
		if (json.success) {
			var parentId = 'ROOT';
			json.success.each(function(file, i){
				//file.parent = parentId;
				var file = FileManager.add_from_json(parentId, file);
				parentId = file.id;
				TreeViewController.set_and_show(file.id);
			}.bind(this));
			
			MainViewController.change_directory(parentId);
		}
	}
});

// IFrame経由で受信したデータを処理
iFrameReceiver = {
	file_upload: function(json) {
		if (json.success) {
			for (var i = 0; i < json.success.length; i++) {
				var result_file = json.success[i];
				result_file.parent = MainViewController.current_dir;
				var file = FileManager.add_from_json(MainViewController.current_dir, result_file);
				// FireFoxで表示が崩れる為　子ファイルが１つの場合は再描画
				if ($GF(MainViewController.current_dir).children().length == 1){
					MainViewController.draw();
				} else if (file){
					MainViewController.list.add_file(file);
				}
			}
		} else if(json.error) {
			alert(json.error);
		}
		
		Overlay.hide();
		UploadForm.clear();
	},
	file_download_error: function(path) {
		alert(path);
	}
}