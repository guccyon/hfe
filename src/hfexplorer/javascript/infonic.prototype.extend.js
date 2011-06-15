var REG_URL = "https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+";
/**
 * Stringクラスの拡張
 */
Object.extend(String.prototype, {
  /**
   * 文字列中の指定文字の数をカウント
   * 第１引数：カウント対象文字
   * 第２引数：カウント開始位置
   */
  countOf: function() {
  	if (arguments.length != 1) {
  		return 0;
  	}
  	    
	var result = 0;
	var start = 0;
  	if (arguments.length > 1) {
  		start = arguments[1];
  	}
	while((ind = this.indexOf(arguments[0], start)) != -1) {
		result++;
		start = ind + arguments[0].length;
	}
	return result;
  },
  
  /** この文字列中のstr1を全てstr2に置き換えます。 */
  replaceAll: function(str1, str2) {
	var cn = this.countOf(str1);
	result = this;
	for (i = 0; i < cn; i++) {
		result = this.replace(str1, str2);
	}
	return result;
  },
  toLink: function() {
	return this.gsub(REG_URL, function(match){
		return '<a href="' + match + '">' + match + '<\/a>';
	});
  },
  eachChar: function(iterator) {
  	for (var i = 0; i < this.length; i++)
  		iterator(this.charAt(i), i);
  },
  padding: function(length, character) {
  	var tmp = character;
  	while(tmp.length < length) { tmp+= character; }
  	tmp += this;
  	return tmp.slice(-length);
  },
  paddingRight: function(length, character) {
  	
  }
});

Object.extend(Number.prototype,{
	toByteString: function() {
		var rate = ['byte', 'KB', 'MB', 'GB', 'TB'];
		var tmp = this;
		var times = 0;
		while(tmp > 1024) {
			tmp = Math.round(tmp/1024);
			times++;
		}
		return tmp + ' ' + rate[times];
	}
});


/** * オブジェクトの持つ関数それぞれの処理開始時に
 * 横断的に処理をさせたい場合に処理を埋め込む。
 * object: 関数を定義したオブジェクト
 * process: 埋め込みたい処理
 * without: 除外する関数プロパティ配列
 */
Object.aspect = function (object, process, without) {
	for (var i in object) {
		if (typeof object[i] == 'function') {
			if (without && without.include(i)) { continue;	}
			var tmp = function(def) {
				var def = def;
				return function() { 
					process();
					def(); 
				}
			}
			object[i] = tmp(object[i]);
		}
	}
}

Object.extend(Element, {

	/**
	 * エレメントの絶対座標を取得する
	 * 戻り値のオブジェクトのプロパティ
	 * top, leftをそれぞれ参照可
	 */
	getAbsolutePoint: function(element) {
    	var absOffset = { left: 0, top: 0 };
	    while (element) {
	        absOffset.left += element.offsetLeft;
	        absOffset.top  += element.offsetTop;
	        element = element.offsetParent;
	    }
	
	    return absOffset;
	}
});

/**
 * 配列の拡張
 */
Object.extend(Array.prototype, {
	/**
	 * filterの結果がtrueになるものだけ返す
	 */
	filtering: function(filter) {
		result = [];
		for (var i = 0; i < this.length; i++) {
			if(filter(this[i])) result.push(this[i]);
		}
		return result;
	},
	length_filter: function(filter) {
		return this.filtering(filter).length;
	}
});

/**
 * イベントノードを取得する
 * クロスブラウザ
 */
function $E(event) {
	return Event.element((event||window.event));
}
/**
 * ブラウザ毎に違う静的要素を操作するクラス
 * 改行コード取得
 */
Browser = {};
Object.extend(Browser, {
	IE: false,
	NN: false,
	Opera: false,
	FireFox: false,
	Safari: false,
	
	init: function() {
		var ua = navigator.userAgent;
		if (window.opera) this.Opera = true;
		else if (document.all) this.IE = true;
		else if (document.layers) this.NN = true;
		else {
			if(ua.indexOf('Firefox')) this.FireFox = true;
		}
	},
	
	getEnterCd: function() {
		if (this.IE || this.Opera) {
			return '\r\n';
		} else if (this.NN || this.FireFox || this.Safari) {
			return '\n';
		} else {
			return '\r\n';
		}
	},
	
	encodeEnterCd: function(str) {
		if (arguments.length == 0) {
			return;
		}
		if (this.IE || this.Opera) {
			return str.replaceAll('\n', '\r\n');
		} else if (this.NN || this.FireFox || this.Safari) {
			return str.replaceAll('\r\n', '\n');
		} else {
			return str.replaceAll('\n', '\r\n');
		}
	},
	
	dummy: function() {
	}
});
Browser.init();


Object.extend(Function.prototype, {
	/**
	 * マウスホイールイベント用バインド関数
	 * 
	 * イベント後にディフォルト処理を止めたい場合、
	 * 以下の記述をイベント関数に記述する
	 *	if (e.preventDefault)
	 *	   e.preventDefault();
	 *	e.returnValue = false;
	 */
	bindAsEventListenerForWheel: function(object) {
		var __method = this;
		return function(event) {
			var delta = 0;
			if (event.wheelDelta) { /* IE/Opera. */
				delta = event.wheelDelta/120;
				if (window.opera)
					delta = -delta;
			} else if (event.detail) { /** Mozilla case. */
				delta = -event.detail/3;
			}
			return __method.call(object, event || window.event);
		}
	},
	setTimeout : function(ms) {
		var f = this;
		var args = Array.prototype.slice.call(arguments, 1);
		return window.setTimeout(function(){ f.apply(null, args); }, ms);
	},
	setTimeoutBind: function(ms, self) {
		var f = this;
		var args = Array.prototype.slice.call(arguments, 2);
		return window.setTimeout(function(){ f.apply(self, args) }, ms);
	},
	setInterval: function(ms) {
		var f = this;
		var args = Array.prototype.slice.call(arguments, 1);
		return window.setInterval(function (){ f.apply(self, args);}, ms);
	},
	setIntervalBind: function(ms, self) {
		var f = this;
		var args = Array.prototype.slice.call(arguments, 2);
		return window.setInterval(function (){ f.apply(self, args);}, ms);
	},
	setIntervalTo: function(ms, to) {
		to = to || function(){return true};
		var f = this;
		var args = Array.prototype.slice.call(arguments, 2);
		var id = window.setInterval(function (){
			f.apply(self, args);
			if (to()) window.clearInterval(id);
		}, ms);
		return id;
	},
	bench: function(st) {
		var self = this; // 実行時間を計りたい関数
		return function(){
			var start = new Date().getTime();
			var res = self.apply(this,arguments);
			var end = new Date().getTime();
			window.status = st+":"+(end-start); // 結果をステータスバーに表示
			return res;
		}
	}
});


Object.extend(Event, { 
  wheel:function (event){ 
    var delta = 0; 
    if (!event) event = window.event; 
    if (event.wheelDelta) { 
      delta = event.wheelDelta/120; 
      if (window.opera) delta = -delta; 
    } else if (event.detail) { delta = -event.detail/3; } 
    return Math.round(delta); //Safari Round 
  } 
});

infonic.Extend = {};