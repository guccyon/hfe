BaseController = {
	remove: function() {
		if (MainViewController.current_dir == '') return;
		var selects = MainViewController.selected_files();
		var nodelete = selects.findAll(function(file){
			return (file.auth && !file.auth['delete'])
		});
		if (nodelete.length > 0) {
			alert('削除できないファイルが選択されています。\r\n' 
				+ nodelete.pluck('name').join(','));
		} else if (selects.length > 0) {
			if (confirm('以下のファイルを削除しますがよろしいですか？\r\n・' 
				+ selects.pluck('name').join('\r\n・'))) {
				
				selects.each(function(file){
					file.remove();
					if (file instanceof Directory) {
						TreeViewController.remove(file);
					}
				});
				MainViewController.draw();
				new Communication.remove_files(MainViewController.current_dir, selects);
			}
		} else {
			alert('削除したいファイルを選択してください。');
		}
	},
	create_directory: function() {
		var value = this.edit_directory('新しいフォルダ');
		if (value != null) {
			new Communication.make_directory(MainViewController.current_dir, value);
		}
	},
	edit_directory: function(default_value) {
		if (!default_value) default_value = '新しいフォルダ';
		var value = window.prompt('フォルダ名を入力してください。', default_value);
		
		if (value == '') {
			return this.edit_directory(value);
		} else {
			return value;
		}
	}
}

// ツリーの表示制御
TreeViewController = {
	element: function(dir_id) { return dir_id=='ROOT' ? $('sidebar_body') : $(dir_id) },
	dir_id: function(element) { return element.id == 'sidebar_body' ? 'ROOT' : element.id },
	// ツリーの開閉
	toggle: function(dir_id) {
		this.is_open(dir_id) ? this._close(dir_id) : this._open(dir_id);
	},
	set_and_show: function(dir_id) {
		if (!$(dir_id)) {
			this.set_child($GF(dir_id).parent_id);
		}
		this._open(dir_id);
	},
	// メインビューに表示
	show: function(dir_id) {
		TreeViewController._open(dir_id);
		MainViewController.change_directory(dir_id);
	},
	// ツリーから削除
	remove: function(directory) {
		$(directory.id).parentNode.removeChild($(directory.id));
	},
	// 対象の親ディレクトリの子をファイルマネージャより取得し、ツリーにセット
	set_child: function(parent_dir_id) {
		var ul = this._get_childs_holder(this.element(parent_dir_id));
		if ($GF(parent_dir_id).children_dirs().length > 0) {
			this._add_childs(ul, this.dir_id(this.element(parent_dir_id))); 
		}
	},
	is_open: function(dir_id) {
		var child_ul = this._get_childs_holder(this.element(dir_id));
		return child_ul && Element.getStyle(child_ul, "display") != 'none'
	},
	_open: function(dir_id) {
		var target = this.element(dir_id);
		var ul = this._get_childs_holder(target);
		if (!ul) {
			ul = new Element('ul')
			target.insert(ul);
		}
		this.set_child(dir_id);
		ul.style.display = 'block';
		
//		new Communication.get_child_data(dir_id, function(com){
//			TreeViewController.set_child(com.target_dir);
//			if (com.target_dir == MainViewController.current_dir) {
//				MainViewController.draw();
//			}
//		});
	},
	_close: function(dir_id) {
		var child_ul = this._get_childs_holder(this.element(dir_id));
		if (child_ul) { child_ul.style.display = 'none' }
	},
	_add_childs: function(holder, dir_id) {
		var children = $GF(dir_id).children_dirs();
		children.each(function(dir, i){
			if (!$(dir.id)) { 
				this._add(holder, this._dom_element(dir))
			}
		}.bind(this));
		this._set_end(holder);
	},
	_dom_element: function(dir){
		var img = new Image();
		img.src = 'image/tree/dir_closed.gif';
		$(img).observe('click', function(e){ this.toggle(dir.id) }.bind(this));
		
		var anchor = new Element('a', {href: "javascript:void(0)"}).update(dir.name)
					.observe("click", function(){ this.show(dir.id);}.bind(this));
					
		return new Element("li",{id: dir.id}).insert(img).insert(anchor);
	},
	_add: function(ul, li) {
		ul.appendChild(li);
	},
	_set_end: function(ul) {
		var li_ary = $A(ul.childNodes);
		li_ary.each(function(li, index){
			if (index == li_ary.length -1) {
				Element.addClassName(li, 'end');
			} else {
				try { Element.removeClassName(li, 'end'); } catch(e){}
			}
		});
	},
	_get_childs_holder: function(li) {
		return $A(li.childNodes).find(function(node){
			return node.nodeName.toUpperCase() == 'UL';
		});
	}
}

var _order_ = (function(){
	
	var order_type = 'file_name';
	var direction = 'ASC';
	
	return {
		orderedType: function(type) {return order_type == type},
		orderAsc: function() { return direction == 'ASC' },
		orderDesc: function() { return direction == 'DESC' },
		availOrder: function(type) { return FileOrder[type] != null }
	};
})();

MainViewController = {
	current_dir: '',
	history: [],
	change_directory: function(dir_id) {
		if (this.current_dir != '') {
			this.unselect();
			if (this.history.length > 10) this.history.shift();
			this.history.push(this.current_dir);
		}
		this._reset_order_option();
		this.current_dir = dir_id;
		this.draw();
		if (parent.frames[0]) {
			parent.frames[0].AddressBar.setPath($GF(this.current_dir).full_path());
		}
	},
	current: function() { return this.current_dir ? $GF(this.current_dir) : null },
	
	draw: function() {
		var children = $GF(this.current_dir).children(FileOrder[this.order_option.current_type]);
		if (this.orderDesc()) children = children.reverse();
		var list = this.list = new FileList();
		if (children.length) {
			children.each(function(e, i){ list.add_file(e);	});
			$('view').update(list.to_dom());
			list.size_fix();
		} else {
			$('view').update("ファイルが見つかりません")
		}
	},
	
	order: function(e) {
		var th = Event.element(e);
		if (th.nodeName.toUpperCase() == 'SPAN') th = th.parentNode;
		if (this.order_option.current_type == th.id) {
			with(this.order_option) {
				direction = direction == 'ASC' ? 'DESC' : 'ASC';
			}
		} else {
			this.order_option.direction = 'ASC';
		}
		this.order_option.current_type = th.id;
		this.draw();
	},
	orderedType: function(type) {return this.order_option.current_type == type},
	orderAsc: function() { return this.order_option.direction == 'ASC' },
	orderDesc: function() { return this.order_option.direction == 'DESC' },
	availOrder: function(type) { return FileOrder[type] != null },
	unselect:function() {
		$GF(this.current_dir).children().each(function(child){
			child.selected = false;
		});
	},
	selected_files: function() {
		return this.current() ? 
			this.current().children().findAll(function(c){ return c.selected}) :
			[];
	},
	_reset_order_option: function() {
		this.order_option = {
			current_type: 'file_name',
			orderd_list: null,
			direction: 'ASC'
		}
	},
	get_object: function(id) {
		if($GF(id) instanceof Directory) {
			if (!TreeViewController.is_open(id)) {
				TreeViewController._open(id);
			}
			this.change_directory(id);
			
		} else if ($GF(id) instanceof File) {
			var path = $GF(id).full_path();
			upload_target.document.location.href = 'download' + path;
		} else if ($GF(id) instanceof ShortCut) {
			this.change_directory($GF(id).target);
		}
	},
	up_folder: function() {
		if (this.current_dir == '' || this.current_dir == 'ROOT') return;
		if ($GF(this.current_dir).parent_id != '') {
			this.change_directory($GF(this.current_dir).parent_id);
		} else {
			this.change_directory('ROOT');
		}
	},
	rename: function(e) {
		var select = this.selected_files();
		if (!select[0]) {
			alert('ファイルが選択されていません。');
		} else if(!select[0].auth['write']) {
			alert('ファイル名を変更する事ができません。');
		} else {
			var input = new Element('input', {type: 'text', value: select[0].name});
			var target_id = select[0].id;
			input.observe('blur', function(e){
				if (input.value == '') {
					alert('ファイル名を空にはできません。');
				} else {
					new Communication.rename(target_id, input.value);
					$GF(target_id).name = input.value;
				}
				MainViewController.draw();
			});
			var anchor = $('file_'+select[0].id);
			Element.addClassName(anchor.parentNode.parentNode, 'edit');
			anchor.parentNode.replaceChild(input, anchor);
			if (Browser.IE) { input.style.fontSize='x-small' }
			input.select();
			input.focus();
		}
	}
}


// ファイル並び替えルール
FileOrder = {
	kind: function(a, b) {return b.kind - a.kind; },
	file_name: function(a, b) {
		if (a.kind != b.kind) return FileOrder.kind(a, b);
		else if (a.name == b.name) return 0;
		else if (a.name > b.name) return 1;
		else return -1;
	},
	file_size: function(a, b) {
		if (a.kind != b.kind) return FileOrder.kind(a, b);
		else if (a.size == b.size) return 0;
		else if (a.size > b.size) return 1;
		else return -1;
	},
	create_date: function(a, b) {
		if (a.kind != b.kind) return FileOrder.kind(a, b);
		else if (a.create_date == b.create_date) return 0;
		else if (a.create_date > b.create_date) return 1;
		else return -1;
	}
}