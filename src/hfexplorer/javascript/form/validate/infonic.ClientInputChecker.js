/**
 * [利用法]
 * ページ読み込み時に
 * ClientInputCheckerにチェックパラメータ指定して
 * new する事でチェックが行えます。
 * チェックパラメータは配列で指定することもできます。
 *
 * チェック対象となるコントロールは
 * テキスト、テキストエリア または value値で入力判定が行えるもの
 * 必須チェックのみチェックボックスも可
 *
 * <<パラメータの定義方法>>
 * パラメータはオブジェクト形式で指定します。
 * パラメータのプロパティ　()は省略可
 * 1: element チェック対象入力フォーム idまたはエレメントを指定
 * 2: checkset チェック順にチェック定義 配列で指定
 *         {type,       チェック種別
 *          (param),    チェック用パラメタ
 *          (errorfunc) エラー時の処理 関数を指定
 *          }
 * 3: (success) チェック成功時の処理 関数を指定
 *
 * [例1]
 * var chk = 
 *  { element: 'bbcde'
 *   ,success: function(){alert('成功')}	
 *	 ,checkset: [ { type: InputChecker.CHK_REQUIRE},
 *				  { type: InputChecker.CHK_MAX_LEN, param: 6}]
 *	};
 * new ClientInputChecker(chk);
 *
 * [例2]
 * var chkAry = [
 *  	{ element: 'password'	
 *		 ,checkset: [ { type: InputChecker.CHK_REQUIRE},
 *					  { type: InputChecker.CHK_ASCII} ]
 *		},
 *
 *  	{ element: document.getElementById('account')
 *  	 ,success: function(){alert('成功')}	
 *		 ,checkset: [ { type: InputChecker.CHK_REQUIRE},
 *					  { type: InputChecker.CHK_MAX_LEN, param: 6} ]
 *		},
 *
 *  	{ element: document.forms[0].age
 *  	 ,success: function(){alert('成功')}	
 *		 ,checkset: [ { type: InputChecker.CHK_REQUIRE},
 *					  { type: InputChecker.CHK_NUMBER, errorfunc: function(){alert('数値で入力！');}} ]
 *		}
 *  ];
 *  new ClientInputChecker(chkAry);
 *
 *  <<ディフォルトで定義されているチェッカー>>
 * (必須チェック)
 * 概要 : 何も入力されていなければエラー
 * type : InputChecker.CHK_REQUIRE
 * param: なし
 *
 * (数値チェック)
 * 概要 : 数値以外が入力されていればエラー
 * type : InputChecker.CHK_NUMBER
 * param: なし
 *
 * (半角英字チェック)
 * 概要 : 半角英字以外が入力されていればエラー
 * type : InputChecker.CHK_ALPHA
 * param: なし
 *
 * (半角英数字チェック)
 * 概要 : 半角英数字以外が入力されていればエラー
 * type : InputChecker.CHK_ALPHA_NUM
 * param: なし
 *
 * (半角チェック)
 * 概要 : 全角文字が入力されていればエラー
 * type : InputChecker.CHK_ASCII
 * param: なし
 *
 * (最大文字数チェック)
 * 概要 : 指定文字数より多く入力されていればエラー
 * type : InputChecker.CHK_MAX_LEN
 * param: 最大文字数
 *
 * (最小文字数チェック)
 * 概要 : 指定文字数より少なければエラー
 * type : InputChecker.CHK_MIN_LEN
 * param: 最小文字数
 *
 * (メールアドレスチェック)
 * 概要 : メールアドレス形式でなければエラー
 * type : InputChecker.CHK_MAIL
 *
 * (メールアドレスチェック)
 * 概要 : メールアドレス形式でなければエラー
 * type : InputChecker.CHK_MAIL
 *
 *
 *
 * <<独自のチェック関数定義について>>
 * ディフォルト定義チェッカー以外に独自に作成した関数を
 * InputChecker.addChecker(名前, 関数)を呼び出す事で
 * チェックに利用できます。
 * 引数２に指定する関数オブジェクトには以下の二種類の関数を
 * 定義する必要があります。
 * ・初期化関数(initialize)
 * ・チェック実行関数(check)
 * また、チェック結果を戻す必要があります。
 * 戻り値は以下の２種類
 * ・エラー（InputChecker.STAT_ERROR）背景が赤になります。
 * ・警告（InputChecker.STAT_WARNING）背景が黄色になります。
 *
 * [定義方法例]
 * function originalCheck() {
 * 		this.initialize = function(param) {
 *			};
 *      this.check = function(value) {
 *				if (value != 'あいうえお')
 *                  return InputChecker.STAT_ERROR
 *          };
 * }
 * 
 * InputChecker.addChecker('original', ofiginalCheck);  // 追加
 *
 * チェックパラメータのtypeに'original'を指定することで
 * その関数でチェック処理を実行できます。
 *
 */
function defaultChecker() {
	this.initialize.apply(this, arguments);
}
defaultChecker.prototype = {
	initialize: function() {},
	check: function(value) {}
}
InputChecker = {
	 BGC_COLOR_ERROR: '#FF99FF'
	,BGC_COLOR_WARNING: '#FFFF75'
	,STAT_ERROR: 1
	,STAT_WARNING: 2
	
	,CHK_REQUIRE: 0
	,CHK_NUMBER: 1
	,CHK_ALPHA: 2
	,CHK_ALPHA_NUM: 3
	,CHK_ASCII: 4
	,CHK_MAX_LEN: 5
	,CHK_MIN_LEN: 6
	,CHK_MAIL: 7
	// add user define check_function
	,addChecker: function(name, func) {
			if (typeof name == 'number') throw 'Illegal argument  set [name] type string'; 
			Object.extend(func.prototype, defaultChecker.prototype);
			this.checker[name] = func;
		}
	,checker: []
};
// 必須チェック
InputChecker.checker[InputChecker.CHK_REQUIRE] = function() {
	 	this.check = function(value, element) {
	 		if(element.type && element.type == 'checkbox') {return !element.checked;}
	 		return value == null || value == '';	};
	 };
// 数値チェック
InputChecker.checker[InputChecker.CHK_NUMBER] = function() {
	 	this.check = function(value) { return value != '' && value.match(/[^0-9]/g) != null; };
	 };
// 半角英字チェック
InputChecker.checker[InputChecker.CHK_ALPHA] = function() {
		this.check = function(value) { return value != '' && value.match(/[^a-zA-Z]/) != null; };
	};
// 半角英数字チェック
InputChecker.checker[InputChecker.CHK_ALPHA_NUM] = function() {
		this.check = function(value) { return value != '' && value.match(/[^0-9a-zA-Z]/) != null; };
	};
// 半角チェック
InputChecker.checker[InputChecker.CHK_ASCII] = function() {
	 	this.check = function(value) { return value != '' && value.match(/[0-9a-zA-Z\+\-\/\*\,\.:; ]+/g) != null; };
	 };
// メールアドレスチェック
InputChecker.checker[InputChecker.CHK_MAIL] = function() {
		this.check = function(value) { return value != '' && value.match(/[!#-9A-~]+@+[a-z0-9]+.+[^.]$/i) == null; };
	};
// 最大文字数チェック
InputChecker.checker[InputChecker.CHK_MAX_LEN] = function() {
	 	this.initialize = function(param){
	 			if (typeof param == 'number') this.param = param;
	 			else if (typeof param == 'string') this.param = parseInt(param);
	 			else throw 'not find parameter > max length';
	 		};
	 	this.check = function(value) { return value.length > this.param; };
	 };
// 最小文字数チェック
InputChecker.checker[InputChecker.CHK_MIN_LEN] = function() {
	 	this.initialize = function(param){
	 			if (typeof param == 'number') this.param = param;
	 			else if (typeof param == 'string') this.param = parseInt(param);
	 			else throw 'not find parameter > min length';
	 		};
	 	this.check = function(value) { return value.length < this.param; };
	 };

for (var i = 0; i < InputChecker.checker.length; i++) {
	Object.extend(InputChecker.checker[i].prototype, defaultChecker.prototype);
}



function ClientInputChecker() {
	this.initialize.apply(this, arguments);
}
ClientInputChecker.prototype = {
	initialize: function(arg) {
		if (!arg.length) {
			if (this.correctParam(arg))
				new ClientFormChecker($(arg.element), arg.checkset, arg.success);
		} else {
			for (var i = 0; i < arg.length; i++) {
				if (this.correctParam(arg[i]))
					new ClientFormChecker($(arg[i].element), arg[i].checkset, arg[i].success);
			}
		}
	},
	correctParam: function(arg) {
		return (arg.element && $(arg.element) && arg.checkset && arg.checkset.length);
	}
};

function ClientFormChecker() {
	this.initialize.apply(this, arguments);
}
ClientFormChecker.prototype = {
	initialize: function(element, checkset, success) { // コンストラクタ
		this.element = element;
		this.defaultBgc = Element.getStyle(element, 'backgroundColor');
		if(success && typeof success == 'function') this.success = success;
		this.chkcue = new Array();
		for (var i = 0; i < checkset.length; i++) {
			if (InputChecker.checker[checkset[i].type]) {
				var checker = new InputChecker.checker[checkset[i].type]();
				this.chkcue.push(checker);
				checker.initialize(checkset[i].param);
				if (checkset[i].errorfunc && typeof checkset[i].errorfunc == 'function') 
					checker.func = checkset[i].errorfunc;
				if (checkset[i].type == InputChecker.CHK_REQUIRE)
					if(checker.check(this.element.value, this.element))
						this.element.style.backgroundColor = InputChecker.BGC_COLOR_ERROR;
			}
		}
		if (element.type && element.type == 'checkbox')
			Event.observe(element, 'click', this.validate.bindAsEventListener(this));
		Event.observe(element, 'keyup', this.validate.bindAsEventListener(this));
	},
	
	validate: function(e) { // チェック処理
		this.chkResult = 0;
		for (var i = 0; i < this.chkcue.length; i++) {
			var result = this.chkcue[i].check(this.element.value, this.element);
			if (typeof result == 'boolean') {
				if (result) {
					this.chkResult = InputChecker.STAT_ERROR;
					if(this.chkcue[i].func) this.chkcue[i].func();
					break;
				}
			} else if (typeof result == 'number') {
				this.chkResult = result;
				if(result == InputChecker.STAT_ERROR) {
					break;
				}
			}
		}
		this.cangeBgc(e);
	},
	cangeBgc: function(e) {
		if (this.chkResult == InputChecker.STAT_ERROR) {
			this.element.style.backgroundColor = InputChecker.BGC_COLOR_ERROR;
		} else if(this.chkResult == InputChecker.STAT_WARNING){
			this.element.style.backgroundColor = InputChecker.BGC_COLOR_WARNING;
		} else {
			this.element.style.backgroundColor = this.defaultBgc;
			if (this.success) this.success(e);
		}
	}
}