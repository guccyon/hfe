PublicDirectory = Class.create({
	initialize: function() {
		$("public_directory_form").insert(
			new Element("li").insert(this._text_form()).insert(this._delete_btn())
		);
	},
	_text_form: function() {
		return new Element('input',{type: 'text', name: 'directory', className: 'directory'})
					.observe('blur', function(e) {	complete_check(); });
	},
	_delete_btn: function() {
		return new Element('input',{type: 'button', value: '削除'})
			.observe('click', function(){ $(this.parentNode).remove() });
	}
});

var public_ary = [];
function complete_check() {
	var complete = public_ary.all(function(pub){
		return pub.check_ok();
	});
	$('public_submit').disabled = complete ? false : true;
}

function add_new_directory() {
	public_ary.push(new PublicDirectory());					
}

function init_public_directory() {
	$$("ul li").each(function(li){
		li.down("remove_btn").observe('click', function(){
			$(this.parentNode).remove();
		});
	});
	
	
	$(document.forms[0]).observe('submit', function(e){
		var dirs = $$("li .directory");
		if(dirs.any(function(e){return e.getValue() == ""})) {
			alert("全て入力してください");
			e.stop();
		}
	});
}

