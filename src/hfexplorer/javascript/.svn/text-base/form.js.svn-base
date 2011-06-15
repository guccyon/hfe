function _fadeTo(element, to, rate, callback) {
	if (element.getOpacity() < to) {
		var finish = function() { return element.getOpacity() >= to };
	} else {
		var finish = function() { return element.getOpacity() <= to };
		rate = -rate;
	}
	
	(function(){
		var op = element.getOpacity() + rate;
		element.setOpacity(op < 0 ? 0 : op);
	}).setIntervalTo(50, function(){
		if (finish()) {
			element.setOpacity(to);
			callback && callback();
			return true;
		}
	});
}

// Overlay
var Overlay = {};
Event.observe(window, 'load', function(){
	var fade_rate = 0.2, active = false;
	var overlay = new Element("div", {id: "overlay"});
	overlay.fadeIn = _fadeTo.curry(overlay, 0.85, fade_rate);
	overlay.fadeOut = _fadeTo.curry(overlay, 0, fade_rate);
	
	Object.extend(Overlay,{
		update_content: function(element) {
			this.contents = new Element("div",{id:"form_contents_block"}).update(element);
			$(document.body).insert(this.contents);
		},
		isActive: function() { return active; },
		
		show: function() {
			active = true;
			overlay.setOpacity(0);
			overlay.style.display = "block";
			this.contents.style.display = "block";
			overlay.fadeIn(function(){ this.contents.setOpacity(1); }.bind(this));
			this.contents.setOpacity(1);
		},
		
		hide: function() {
			overlay.fadeOut(function(){ overlay.style.display = "none"; });
			this.contents.remove();
			active = false;
		}
	});
	
	$(document.body).insert(overlay);
});


ModalInputForm = Class.create({
	initialize: function() {
		this.container = new Element('div',{className: 'modal_form'});
		this.form = new Element('form',{
			target: 'upload_target',
			method: 'post',
			encoding: 'multipart/form-data'
		});
		this.container.insert(this.form);
	},
	show: function() {
		Overlay.update_content(this.container);
		Overlay.show();
	},
	hide: function() {
		Overlay.hide();
	},
	indicator: function() {
		Overlay.update_content(new Element('div',{id:'indicator'})
			.insert(new Element('img',{src:'image/indicator.big.gif'}))
			.insert(new Element('p').update(this.WAIT_MESSAGE))
		);
	}
});


var UploadForm = new (Class.create(ModalInputForm, {
	WAIT_MESSAGE: 'ファイルのアップロード中です。<br>暫くお待ちください。',
	initialize: function($super) {
		$super();
		this.form.insert(this._setBtns());
		this.form.insert(new Element('ul',{id: 'upforms'}));
		this._append_input();
		this.form.insert(this.SubmitBtn());
	},
	_setBtns: function() {
		return new Element('div')
			.insert(this.AppendBtn())
			.insert(this.CancelBtn())
			.setStyle({textAlign : 'right'});
	},
	AppendBtn: function() {
		return new Element('input',　{type:'button', value:'追加'})
				.observe('click', function(){
					if(this._validate()) {
						this._append_input();
					} else alert('全てのファイルを選択してください。');
				}.bindAsEventListener(this));
	},
	CancelBtn: function() {
		return new Element('input',{type: 'button', value: 'キャンセル'})
					.observe('click', function(){Overlay.hide()});
	},
	SubmitBtn: function() {
		return new Element('p')
			.setStyle({textAlign: 'center'})
			.insert(new Element('input',{type: 'button', value: 'アップロード開始'}))
			.observe('click', function(){
				if(this._validate_on_submit()) {
					var index = 0;
					this.form.select("input.file").each(
						function(input){ input.name = 'upload_' + index++; });
					var current_path = $GF(MainViewController.current_dir).full_path();
					this.form.action = 'upload' + current_path;
					this.form.encoding = 'multipart/form-data';
					this.form.submit();
					this.indicator();
				}
				(function(){
					alert("#aaa");
					Overlay.hide()
				}).setTimeout(1000);
			}.bind(this));
	},
	_validate: function() {
		return this.form.select("input.file").all(function(e, i){
			return !e.value.empty();
		});
	},
	_validate_on_submit: function() {
		if (MainViewController.current_dir == '') {
			alert('フォルダが選択されていません。');
			return false;
		}
		
		var names = this.form.select("input.file")
				 .findAll(function(input){ return input.value != '';})
				 .map(function(input){return input.value.split(/[\\\/]/).last();});
		
		if (names.length == 0) {
			alert("ファイルを選択してください。");
			return false;
		}
		
		var par = $GF(MainViewController.current_dir);
		var exists = names.findAll(function(name){ return par.has_child(name); });
		if(exists.length > 0) {
			if(!confirm('同名のファイルが存在しますが上書きしますか？' + names.join('\r\n')))
				return false;
		} else {
			if(!confirm('以下のファイルをアップロードしますか？\r\n・' + names.join('\r\n・')))
				return false;
		}
		return true;
	},
	_append_input: function(e) {
		var li = new Element("li");
		var input = new Element('input',{type: 'file', className: 'file'});
		(function(){ input.focus() }).setTimeout(0);
		if (Browser.FireFox) { input.size = 70;	}
		li.insert(input);
		if(this.form.select("input.file").length > 0) {
			li.insert(new Element('input',{type: 'button',value: '削除'})
						.observe('click', function() { li.remove(); }));
		}
		(function(form) { form.select("ul")[0].insert({top: li}); }).setTimeout(0,this.form);
	},
	clear: function() {
		this.form.select("li").each(function(e){ e.remove() });
		this._append_input();
	}
}))();


// ファイルのプロパティダイアログ
var FilePropertyForm = new (Class.create(ModalInputForm, {
	initialize: function($super) {
		$super();
	},
	show: function($super, id) {
		var div = new Element("div")
				.insert(new Element("h1").update("ファイルのプロパティ").setStyle({fontSize: "12pt"}))
				.insert(this.CloseBtn())
				.insert(this.Properties($GF(id)));
		this.form.update(div);
		$super();
	},
	CloseBtn: function() {
		return　new Element("p")
				.setStyle({textAlign: "right"})
				.insert( 
					new Element('input',{type: 'button', value: '閉じる'})
					.observe('click', function(){Overlay.hide()}));
	},
	Properties: function(file) {
		var url = new Element("input",{type:"button", value:"URL"})
					.observe("click", function(){
						var base = document.location.href.replace(/\/+[^\/]+$/,"");
						prompt("このファイルのURL", base+"/download" + encodeURI(file.full_path())); 
					});
					
		return new Element("tbody")
		.insert(new Element("tr")
			.insert("<th>ファイル名</th>")
			.insert(new Element("td").update(this._wrap(file.name)))
		)
		.insert(new Element("tr")
			.insert(new Element("th").insert("ファイルのパス").insert(url))
			.insert(new Element("td").update(this._wrap(file.full_path())))
		)
		.insert(new Element("tr")
			.insert("<th>ファイルのサイズ</th>")
			.insert("<td>" + (file.size ? file.size.toByteString() : "") + "</td>"))
		.insert(new Element("tr")
			.insert("<th>作成日</th>")
			.insert("<td>" + (file.create_date || "") + "</td>"))
		.insert(new Element("tr")
			.insert("<th>備考</th>")
			.insert("<td></td>")
		).wrap(new Element("table",{className: "file_properties"}));
	},
	_wrap: function(val) {
		return new Element("input",{value:val, readonly:true})
					.observe("click", function(){ this.select() })
	}
}))();
