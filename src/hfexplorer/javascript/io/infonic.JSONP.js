infonic.JSONP = new Object();
infonic.JSONP.ResponseFacade = {
	requests: [],
	handler: [],
	callbackFunc: function(response) {
		delete infonic.JSONP.ResponseFacade.handler[this.requestId];
		infonic.JSONP.ResponseFacade.remove(this.scriptTag);
		this.func(response);
	},
	remove: function(tag) {
		document.getElementsByTagName("head").item(0).removeChild(tag);
	},
	sequence: 0,
	getSequence: function() {
		return this.sequence++;
	}
};

// JSONPリクエストを扱うクラス
infonic.JSONP.Request = Class.create();
Object.extend(infonic.JSONP.Request.prototype, {
	initialize: function(url, callback, parameters) {
		if (typeof(callback) == 'string') callback = eval('(' + callback + ')');
		this.setOption(callback, parameters);
		this.request(url);
	},
	setOption: function(callback, parameters) {
		this.callback = callback;
		this.requestId = new Date().getTime() + "" + (infonic.JSONP.ResponseFacade.getSequence());
		this.param = 'callback=infonic.JSONP.ResponseFacade.handler['+ this.requestId + "]";
		this.param += '&' + encodeURI((parameters || ""));
	},
	request: function(url) {
		url += (url.match(/\?/) ? '&' : '?') + this.param + '&_=';
		var scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'text/javascript');
		scriptTag.setAttribute('charset', 'utf-8');
		scriptTag.setAttribute('src', url);
		document.getElementsByTagName('head')[0].appendChild(scriptTag);
		infonic.JSONP.ResponseFacade.handler[this.requestId] = infonic.JSONP.ResponseFacade.callbackFunc.bind({'id': this.requestId, 'func': this.callback, 'scriptTag':scriptTag});
  	}
});

// JSONPにより対象コンテナを更新する。
infonic.JSONP.Updater = Class.create();
Object.extend(infonic.JSONP.Updater.prototype, infonic.JSONP.Request.prototype)
Object.extend(infonic.JSONP.Updater.prototype, {
	initialize: function(container, url, parameters) {
		this.container = $(container);
		this.setOption(this.updateContent.bindAsEventListener(this), parameters);
		this.request(url);
	},
	updateContent: function(response) {
		this.container.innerHTML = '<span>' + response + '<\/span>';
		//var block = document.createElement('span');
		//block.innerHTML = response;
		//this.container.appendChild(block);
		//Element.update(this.container, response);
	}
});

