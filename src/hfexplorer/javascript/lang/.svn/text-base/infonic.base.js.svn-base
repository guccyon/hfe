var _native_setInterval = window.setInterval;
var _native_clearInterval = window.clearInterval;




/**
 * タスク管理
 * 登録された複数のタスクを指定時間毎に次々に実行します。
 * このクラスは通常のsetIntervalメソッドを拡張した内容のクラスです。
 * ・パフォーマンスが随分違います。
 * ・セット時にオブジェクトを渡す事で、実行時に実行関数より参照できます。
 * ・実行回数指定ができます。
 * 
 * [利用方法]
 * 実行したい関数を以下のようにセット
 * 関数名 = testFunc(){}
 * - 2秒毎にずっと繰り返したい場合 -
 * TaskManager.schedule(testFunc, 2000);
 *
 * - 3秒毎に５回だけ実行したい場合 -
 * TaskManager.schedule(testFunc, 2000, 5);
 *
 * 非同期処理側でthisとして関数のクラスにアクセスしたい場合は
 * prototype.jsの　Function.bindAsEventListener(this)を利用する。
 * TaskManager.schdule(testFunc.bindAsEventListener(this), 2000);
 */
// オーバライド前に本来のタイマー関数を保持しておく
var TaskManager = {
	// タスクの実行間隔最低値
	INTERVAL: 10,
	// プロセス実行キュー
	jobQueue: new Array(),
	// タスクマネージャ自身のintervalハンドル
	intervalHandle: null,
	// 現在アクティブなタスク数
	activProcNum: 0,
	// runが前回実行された時間
	lastTime: new Date().getTime(),
	// フレームカウンター（未使用）
	frameCounter: 0,
	// アクティブなタスクの内、最も低いID番号
	minId: 0,
	
	/**
	 * 新規に定期実行タスクを登録する
	 * process: 定期実行関数（String || 関数）
	 * delay: 実行間隔(ミリ秒)
	 * times: 実行回数 <省略化>
	 */
	schedule: function(process, delay) {
	
		if (this.intervalHandle == null) {
			this.intervalHandle = nativeSetInterval(TaskManager.run, 10);
			//window.setInterval(TaskManager.garbage, 1000 * 60 * 5);
		}
		// 実行回数、指定がなければ無限
		times = -1;
		if (arguments.length == 3 && typeof arguments[2] == 'number') {
			times = arguments[2];
		}
		
		entry = null;
		timing = Math.floor(delay / this.INTERVAL) || 1;
		
		if(typeof process == 'string') {
			entry = new TaskManager.Task(function(){eval(process);}, delay, times);
			//entry = new TaskManager.Task(function(){eval(process);}, timing, obj);
		} else if(typeof process == 'function') {
			entry = new TaskManager.Task(process, delay, times);
			//entry = new TaskManager.Task(process, timing, obj);
		} else {
			throw new Error('Illegal arguments');
		}
		// 実行IDの取得処理
		tmpid = this.minId;
		while(true) {
			if(!TaskManager.jobQueue[tmpid]) {
				this.minId = tmpid + 1;
				break;
			}
		}
		entry.id = tmpid;
		TaskManager.jobQueue[entry.id] = entry;
		TaskManager.activProcNum++;
		return entry.id;
	},
	
	/**
	 * 指定されたタスクの実行をキャンセルします。
	 */
	cancel: function(id) {
		if (id != null && typeof id == 'number' && TaskManager.jobQueue[id] != null) {
			TaskManager.jobQueue[id] = null;
			if (TaskManager.minId > id) {
				TaskManager.minId = id;
			}
			TaskManager.activProcNum--;
			if (TaskManager.activProcNum == 0) {
				TaskManager.jobQueue = new Array();
				TaskManager.minId = 0;
				nativeClearInterval(TaskManager.intervalHandle);
				TaskManager.intervalHandle = null;
			}
		} else {
			throw new Error('IDの指定が不正な為、タスクのキャンセルに失敗しました。');
		}
	},
	
	/**
	 * 登録されたタスクエントリの実行
	 * 10msec毎に実行される
	 */
	run: function() {
		
		current = new Date().getTime();
		passage = current - TaskManager.lastTime;
		TaskManager.lastTime = current;
		nullCnt = 0;
		len = TaskManager.jobQueue.length;
		for(var i = 0; i < len; i++) {
			if (TaskManager.jobQueue[i] != null) {
				//TaskManager.jobQueue[i].checkFrame(TaskManager.frameCounter);
				TaskManager.jobQueue[i].checkTime(passage);
			} else {
				nullCnt++;
			}
		}
		
		if (nullCnt >= 3) {
		}
	},
	
	/**
	 * キューのタスク完了したオブジェクトを破棄します。
	 */
	garbage: function() {
			
		//TaskManager.jobQueue = TaskManager.jobQueue.compact();
		//document.getElementById('threadnumg').innerHTML = TaskManager.jobQueue.length + '個';
	}
}

/**
 * タスク
 */
TaskManager.Task = Class.create();
TaskManager.Task.prototype = {
	// タスクに実行される関数
	process: null,
	// 管理ID
	id: null,
	// 実行間隔
	delay: null,
	// 残り実行回数
	times: null,
	// 前回チェック時からの概算時間
	totalpassage: 0,

	/**
	 * process: 実行する関数
	 * delay: 実行間隔(10/1000sec単位に切り上げられる)
	 * times: 実行回数
	 */
	initialize: function(process, delay, times) {
		this.process = process;
		this.delay   = delay;
		this.times = times;
	},
	
	/**
	 * キュー内のタスクの順番に従い呼び出される。
	 */
	checkTime: function(passage) {
		this.totalpassage = this.totalpassage + passage;
		// delay時間以上経過している場合処理
		if(this.totalpassage >= this.delay && this.process) {
			this.process();
			this.totalpassage = 0;
			
			this.times--;
			if (this.times == 0) {
				TaskManager.cancel(this.id);
			}
		}
	},
	
	/**
	 * キュー内のタスクの順番に従い呼び出される。
	 */
	checkFrame: function(frameCount) {
	
		if(!(frameCount % this.delay) && this.process) {
			this.process();
		}
	}
}

// 通常のsetIntervalをオーバーライド
//window.setInterval = function(process, delay) {
//	TaskManager.schedule(process, delay);
//};

// 通常のclearIntervalをオーバーライド
//window.clearInterval = function(id) {
//	TaskManager.cancel(id);
//};

/**
 * デバッグ用クラス
 * オブジェクトのダンプを別ウインドウに表示します。
 */
infonic.Debug = {
	
	println : function(object) {
		if(!this.debugWin || this.debugWin.closed) {
			this.debugWin = window.open();
		}
		timestamp = '[' + new Date() + '] ';
		if (typeof object == 'string') {
			this.debugWin.document.writeln(timestamp + object + '<br>');
		} else if (typeof object == 'object') {
			this.debugWin.document.writeln(timestamp + object.toString() + '<br>');
		}
	},
	
	/**
	 * オブジェクトのプロパティ一覧をダンプします。
	 */
	dump : function(object) {
		if(!this.debugWin || this.debugWin.closed) {
			this.debugWin = window.open();
		}
		
		timestamp = '[' + new Date() + '] ';
		this.debugWin.document.write(timestamp + ' dump start---------------' + '<br>');
		
		if (typeof object == 'object') {
			for (i in object){
				propStr = "";
				switch(typeof object[i]) {
					case 'undefined':
						propStr = 'null';
						break;
				
					case 'string':
						propStr = object[i];
						break;
						
					case 'number':
						propStr = object[i] + '';
						break;
						
    				case 'boolean':
        				propStr = object[i] ? "true" : "false";
        				break;
						
					case 'object':
						if (object[i] == null) {
							propStr = 'null';
						} else if ( object[i].constructor == Array ) {
							for (j = 0; j < object[i].length; j++ ) {
								propStr = propStr + '[ ' + object[i][j].toString() + ' ]';
							}
        				} else {
							propStr = object[i].toString();
						}
						break;
						
					case 'function':
						propStr = 'function';
						break;
				}
				this.debugWin.document.writeln('<span style="font-weight: bold">' + i + '<\/span>');
				this.debugWin.document.writeln(' = ' + propStr + '<br>');
			}
			
			this.debugWin.document.write(timestamp + ' dump end-----------------' + '<br>');
		} else {
			alert('error');
		}
	}
}

/**
 * クラス：カウントダウンタイマー
 * 指定した時間のカウントダウンを表示する為のクラス
 */
CountDown = Class.create();
CountDown.prototype = {
	// 時間単位(ミリ秒)
	HOUR: 60 * 60 * 1000,
	// 分単位(ミリ秒)
	MINUTE: 60 * 1000,
	// 秒単位(ミリ秒)
	SECOND: 1000,
	// ディフォルトフォーマット
	format:'hh:mm:ss',
	// 総時間
	totaltime: 0,
	// ミリ秒指定フラグ
	msecFlg: false,
	// 残り総時間
	lefttime: 0,
	// タイマー終了後に実行する関数
	methodHandler: null,
	
	/**
	 * divid: タイマーを表示する領域のID
	 * format: タイマーの表示形式 <省略化>
	 *        formatに指定できる書式
	 *              hh : 時間
	 *              mm : 分
	 *              ss : 秒
	 *              SSS: ミリ秒
	 *        全て０埋めで表示します。
	 */
	initialize: function(divid) {
		this.target = $(divid);
		if (arguments.length > 1) {
			//if (arguments[1].indexOf('hh') != -1
			// && arguments[1].indexOf('mm') != -1
			// && arguments[1].indexOf('ss') != -1) {
			     this.format = arguments[1];
			//}
		}
	},
	
	/**
	 * このオブジェクトのカウントダウンタイマーを開始します。
	 * sec: タイマーの時間数
	 * msecFlg: 第１引き数の時間をミリ秒または秒のどちらで指定しているかを示すフラグ
	 *          true -> ミリ秒 false -> 秒
	 * function: タイマー終了時に実行したい関数 <省略化>
	 */
	timerStart: function(sec, msecFlg) {
		this.msecFlg = msecFlg;
		if (!msecFlg) {
			sec = sec * 1000;
		}
		this.totaltime = sec;
		this.lefttime = sec;
		this.start = new Date().getTime();
		
		if (arguments.length > 2) {
			this.methodHandler = arguments[2];
		}
		if (msecFlg) {
			this.threadId = TaskManager.schedule(this.reflesh, 1);
		} else {
			this.threadId = TaskManager.schedule(this.reflesh, 1000);
		}
		
		this.disp();
	},
	
	/**
	 * 時間を再セットします。
	 * 時間の単位は開始時の指定を引き継ぎます。
	 */
	reset: function(sec) {
		
		if (!this.msecFlg) {
			sec = sec * 1000;
		}
		this.totaltime = sec;
		this.lefttime = sec;
		this.start = new Date().getTime();
	},
	
	/**
	 * タイマーによって呼び出され、開始時間からの経過時間を
	 * 残り時間より減らす。
	 */
	reflesh: function(thisObj) {
		// STARTからの経過時間
		interTime = new Date().getTime() - thisObj.start;
		thisObj.lefttime = thisObj.totaltime - interTime;
		
		if (thisObj.lefttime <= 0) {
			thisObj.lefttime = 0;
			thisObj.disp();
			TaskManager.cancel(thisObj.threadId);
			if (thisObj.methodHandler != null) {
				thisObj.methodHandler();
				thisObj.methodHandler = null;
			}
		} else {
			thisObj.disp(this.id);
		}
	},
	
	/**
	 * ターゲットのDIVに現在のタイマー時刻を表示する。
	 */	
	disp: function(id) {
	
		msec = this.lefttime % this.SECOND;
		msecStr = this.formatNumKeta(msec, 3);
		
		sectime = (this.lefttime - msec) % (this.MINUTE);
		secStr = this.formatNum(sectime / this.SECOND);
		
		minutetime = (this.lefttime - sectime - msec) % (this.HOUR);
		minuteStr = this.formatNum(minutetime / this.MINUTE);
		
		hourtime = (this.lefttime - minutetime - sectime - msec);
		hourStr = this.formatNum(hourtime / this.HOUR);
		
		dispStr = this.format.replace('hh', hourStr);
		dispStr = dispStr.replace('mm', minuteStr);
		dispStr = dispStr.replace('ss', secStr);
		dispStr = dispStr.replace('SSS', msecStr);
		if (hourtime == 0 && minutetime == 0) {
			dispStr = '<font color="red">' + dispStr + '<\/font>';
		}
		this.target.innerHTML = dispStr;
	},
	
	/**
	 * 0埋めした数値文字列を取得する。
	 */
	formatNum: function(num) {
		if (num < 10) {
			return '0' + num;
		} else {
			return new String(num);
		}
	},
	
	/**
	 * 0埋めした数値文字列を取得する。
	 */
	formatNumKeta: function(num, keta) {
		result = new String(num);
		
		if (result.length < keta) {
			zero = '';
			for (i = 0; i < (keta - result.length); i++) {
				zero = zero + '0';
			}
			result = zero + result;
		}
		return result;
	}
}

/**
 * ブラウザ毎に違う静的要素を操作するクラス
 * 改行コード取得
 */
Browser = Class.create();
Browser.prototype = {
	IE: false,
	NN: false,
	Opera: false,
	FireFox: false,
	Safari: false,
	
	initialize: function(){
	
		ua = navigator.userAgent;
		if (window.opera) {
			this.Opera = true;
		} else if (document.all) {
			this.IE = true;
		} else if (document.layers) {
			this.NN = true;
		} else {
			if(ua.indexOf('Firefox')) {
				this.FireFox = true;
			}
		}
	
		//alert(this.IE + ' ' + this.NN + ' ' + this.Opera + ' ' + this.FireFox + ' ' + this.Safari);
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
}
var Browser = new Browser();
