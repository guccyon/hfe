infonic.GlobalListner = {
	keypress: [],
	keyup:[],
	mousedown:[],
	mouseup:[],
	mouseover:[],
	mouseout:[],
	mousemove:[]
}

infonic.GlobalHandler = function(listener_ary) {
	return function(e) {
		listener_ary.each(function(listen){
			try{ listen(e); }catch(ex){}
		});
	}
}


for (var i in infonic.GlobalListner) {
	Event.observe(
		window.document, 
		i, 
		infonic.GlobalHandler(infonic.GlobalListner[i]));
}
