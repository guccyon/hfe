//-----package-----
// /infonic.LibLoader
//-----package-----
if(!infonic) var infonic = function(){};
infonic.VERSION = "0.0.1a";
infonic.BASE_URL = "";

var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; i++) {
	if (scripts[i].src && scripts[i].src.match(/infonic.js[?0-9]*$/)) {
		infonic.BASE_URL = scripts[i].src.replace(/infonic.js[?0-9]*$/i, '');
	}
}


/**
 * クラスの継承
 * このメソッドを利用して継承したクラスは、
 * prototypeチェーンが繋がります
 */
Function.prototype.extend = function(properties) {
	var Temp = new Function();
	Temp.prototype = this.prototype;
	var new_class = function(){
		this.initialize.apply(this, arguments);
	};
	new_class.prototype = new Temp();
	new_class.prototype.superclass = this.prototype;
	new_class.prototype.constructor = new_class;
	
	for (var property in properties)
		new_class.prototype[property] = properties[property];
	return new_class;
}


/**
 * 【javascriptライブラリローダー】
 * 
 * [method] include
 * [parameter] 
 *  1.url ライブラリのURL
 *  2.options
 *    (exist) => ライブラリのオブジェクト名。文字列で指定。同期処理を行う。
 *    (cache) => trueを指定するとブラウザでキャッシュする。
 *               falseを指定すると乱数をクエリストリングとして付与する。（毎回最新版を取得）（ディフォルト）
 *    (charset) => ファイルの文字コード（ディフォルト：utf-8）
 *    
 * [method] infonic.LibLoader.setComplete
 * [parameter]
 *  func ライブラリ読込完了時に実行したい関数
 *
 * 【例】infonic.LibLoader.setComplete(function(){ alert("complete");  });
 */
infonic.include = function(url, option) {
	var require = new infonic.LibLoader.Require(url, (option || {}));
	infonic.LibLoader.importCue.push(require);
	if (infonic.LibLoader.executer == null) {
		var _obj = infonic.LibLoader;
		var func = function(){
			return infonic.LibLoader.getLibrary.apply(_obj, arguments);
		};
		infonic.LibLoader.executer = window.setInterval(func, 200);
	}
};



infonic.LibLoader = {
	importCue: [],
	executer: null,
	current: null,
	getLibrary: function() {
		if (this.importCue.length != 0 || this.current) {
			if (!this.current || this.current.times++ > 10) 
				this.next();
				
			if (this.current.options.exist == false) {
				this.load(this.current);
				this.current = null;
			} else if (!this.check_exist()) {
				if (!this.current.appended) this.load(this.current);
			} else {
				this.current = null;
			}
		} else {
			window.clearInterval(this.executer);
			this.executer = null;
			this.onComplete();
		}
	},
	setComplete: function(func) {
		this.complete = func;
	},
	next: function() {
		this.current = this.importCue.shift();
		if (document.body && !this.progress) this.setProgress();
		if (this.progress)this.progress.innerHTML = "<span>" + this.current.url + "<\/span>";
	},
	check_exist: function() {
		try {
			var target = eval(this.current.options.exist);
		} catch (e) {}
		if (typeof target == 'undefined') return false;
		return true;
	},
	load: function(require) {
		if (!require.appended) {
			var script = require.to_script_tag();
			document.getElementsByTagName('head')[0].appendChild(script);
			require.appended = true;
		}
	},
	onComplete: function() {
		if (this.progress) this.removeProgress();
		if (this.complete)	this.complete();
		this.complete = null;
	},
	setProgress: function() {
		this.progress = document.createElement('div');
		this.progress.style.position = 'absolute';
		this.progress.style.top = 0;
		this.progress.style.left = 0;
		this.progress.style.fontSize = '9pt';
		document.body.appendChild(this.progress);
	},
	removeProgress: function() {
		this.progress.style.display = 'none';
		this.progress.parentNode.removeChild(this.progress);
		this.progress = null;
	}
};

infonic.LibLoader.Require = function() {return this.initialize.apply(this, arguments);};
infonic.LibLoader.Require.prototype = {
	initialize: function(url, option) {
		this.url = url;
		this.options = this._option(option);
		this.times = 0;
	},
	_option: function(option) {
		return {
			exist: (option.exist || false),
			cache: (option.cache || false),
			charset: (option.charset || 'UTF-8')
		};
	},
	to_script_tag: function() {
		var script = document.createElement('script');
		var addparam = "_";
		if (!this.options.cache) addparam = new Date().getTime();
		script.charset = this.options.charset;
		script.type = 'text/javascript';
		script.src = this._convert_url(this.url, addparam);
		return script;
	},
	_convert_url: function(url, addparam) {
		var result = url + (url.match(/\?/) ? '&' : '?') + addparam;
		if (!(url.match(/^http:/) || url.match(/^https:/))) {
			result = infonic.BASE_URL + result;
		}
		return result;
	}
};

