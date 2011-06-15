// ファイルのIDを生成
var create_new_id = (function() {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=';
	var seq = 0;
	
	return function() {
		var str='';
		(6).times(function(){
			str += chars.charAt(Math.floor(Math.random() * chars.length));
		});
		return str + (seq++).toString().padding(4,'0');
	}
})();

FileManager = (function(){
	var file_map = {};
	
	return {
		put: function(file) { file_map[file.id] = file;	},
		root: function() { return file_map['ROOT'];	},
		get_file: function(id) {
			var ary = id instanceof Array;
			if (!ary) id = [id];
			var res = id.map(function(e){ return file_map[e] }.bind(this));
			return ary ? res : res.pop();
		},
		add_from_json: function(parent_id, json) {
			var jsons = json instanceof Array ? json : [json];
			var parent = $GF(parent_id);
			var files = jsons.map(function(f){
				if (parent.has_child(f.name)) {
					return parent.children().detect(function(c){
						return c.name == f.name;
					}).merge(f);
				} else {
					var new_file = FileManager._make_instance(f);
					parent.add_child(new_file.id);
					new_file.parent_id = parent_id
					FileManager.put(new_file);
					return new_file;
				}
			});
			return json instanceof Array ? files : files[0];
		},
		remove: function(id) { delete file_map[id]; },
		
		_make_instance: function(file) {
			switch(file.type) {
				case 'f':
					return new File(file);
				case 'd':
					return new Directory(file);
				case 's':
					return new ShortCut(file);
			}
		},
		
		path2fileId: function(path) {
			if (!path.match(/^\//) || path.match(/\/{2}/)) {
				return null;
			} else if (path == "/") {
				return 'ROOT';
			}
			
			path = path.replace(/^\//,"");
	
			return path.split(/\//).inject('ROOT', function(dir_id, name){
				if (!dir_id) return null;
				var dir = $GF(dir_id).children_dirs().detect(function(d){
					return name == d.name;
				});
				if (dir) return dir.id;
			});
			
		}
	}
})();
$GF = FileManager.get_file.bind(FileManager);

AbstractFile = Class.create();
Object.extend(AbstractFile.prototype, {
	selected: false,
	description: '',
	initialize: function(){
		var param = arguments[0] || {};
		this.id = param.id || create_new_id();
		this.name = param.name || '';
		this.parent_id = param.parent || '';
		this.create_date = param.create_date || '';
		this.auth = Object.extend({
			'read': true, 'write': true, 'delete': true
		},param.auth);
	},
	
	full_path: function() {
		var list = (function path(f) {
			return f.parent() ? path(f.parent()).concat(f.name) : [f.name];
		})(this);
		
		return (list.length == 1 ? "/" : "") + list.join("/");
	},
	
	parent: function() {
		if(this.id != "ROOT") return $GF(this.parent_id);
	},
	remove: function() {
		this.parent().remove_child(this.id);
		FileManager.remove(this.id);
	},
	merge: function(obj) {
		return Object.extend(this, obj);
	}
});

File = AbstractFile.extend({
	kind: 1,
	isFile: true,
	initialize: function(){
		this.superclass.initialize.apply(this, arguments);
		this.size = arguments[0].size || 0;
		this.user = arguments[0].user || '';
	},
	get_kind: function() {
		var ext = '.NNN';
		var ext_rexp = this.name.match(/\.[a-zA-Z]{3}$/);
		if (ext_rexp) ext = ext_rexp.toString();
		return ext.substring(1,4);
	}
});

Directory = AbstractFile.extend({
	kind: 2,
	isDirectory: true,
	get_kind: function(){ return 'directory'},
	initialize: function() {
		this.superclass.initialize.apply(this, arguments);
		this._children = new Array();
		this.user = arguments[0].user || '';
		this.name = this.name;
	},
	add_child: function(childId) { this._children.push(childId); },
	remove_child:function(childId) {
		this._children = this._children.without(childId);
	},
	has_child: function(name) {
		return this._children.find(function(child){ return $GF(child).name == name; });
	},
	children: function(file_order) {
		if (file_order) return $GF(this._children).sort(file_order);
		return $GF(this._children);
	},
	children_dirs: function() {
		return ["d", {d: this.children()}, "d.isDirectory"].lisc();
	},
	
	to_dom_for_tree: function() {
		var img = new Image();
		img.src = 'image/tree/dir_closed.gif';
		Event.observe(img, 'click', function(e){ TreeViewController.toggle(this.id) }.bind(this));
		
		var href = 'javascript:TreeViewController.show("' + this.id + '")';
		
		return new Element("li",{id: this.id})
				.insert( {top:img} )
				.insert( {bottom: new Element('a', {"href": href}).update(this.name)} );
	},
	remove: function() {
		this.children().each(function(child){
			child.remove();
		});
		this.parent().remove_child(this.id);
		FileManager.remove(this.id);
	}
});

ShortCut = AbstractFile.extend({
	kind: 3,
	target: '',
	get_kind: function(){ return 'shortcut'},
	initialize: function(){
		this.superclass.initialize.apply(this, arguments);
		this.name = this.name || '新しいショートカット';
	}
});

FileManager.put(new Directory({id: 'ROOT', 'name': ""}));