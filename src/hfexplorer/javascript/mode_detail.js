FileListColums = [
	{name:'ファイル名', id:'file_name'},
	{name:'サイズ', id:'file_size'},
//	{name:'作成者', id:'create_user'},
	{name:'作成日', id:'create_date'},
	{name:'R', id:'permission', prop:'read'},
	{name:'W', id:'permission', prop:'write'},
	{name:'D', id:'permission', prop:'delete'},
	{name:'備考', id:'description'}
];


FileListDetail = Class.create({
	initialize: function() {
		this.header = this.create_header();
		this.body = new Element('table',{id: 'detail_body'}).insert(new Element('tbody'));
		Event.observe(window, 'resize', this.size_fix.bind(this));
	},
	size_fix: function() {
		this.data_grid.style.height = ($('view').offsetHeight-44) + 'px';
	},
	create_header: function() {
		var tr = new Element('tr');
		var mainView = MainViewController;
		FileListColums.map(function(col) {
			var cell = new Element('th',{className: col.id, id: col.id}).insert(col.name);
			if (mainView.orderedType(col.id)) {
				cell.insert(
					new Element('span').setStyle({fontWeight:'normal',color:'gray'})
						.insert("&nbsp;&nbsp;").insert(mainView.orderAsc() ? '▲': '▼')
				);
			}
			
			if (mainView.availOrder(col.id)) {
				cell.observe('click', mainView.order.bind(mainView), true);
				new infonic.Hover(cell, {backgroundColor:'#FFFFFE',borderBottom: '2px solid #FFA000', 
									def:{backgroundColor:'#E5E5D4',borderBottom: '2px solid #BFBFBF'}});
			}
			return cell;
		}).each(function(e){ tr.insert(e); }.bind(this));
		
		return new Element('table',{id: 'detail_header'}).insert(new Element('thead').insert(tr));
	},
	to_dom: function() {
		var div = new Element('div',{id: 'detail_container'});
		div.appendChild(this.header);
		var data_grid = new Element('div',{id: 'data_grid'});
		data_grid.appendChild(this.body);
		div.appendChild(data_grid);
		this.data_grid = data_grid;
		this.size_fix();
		div.observe('mousemove', function(e){try{e.preventDefault();}catch(e){} return false});
		return div;
	},
	add_file: function(file) {
		var row = new Element('tr',{id:'detail_' + file.id});
		new infonic.Hover(row, {backgroundColor:'#EEF9FF'});
		
		row.observe('click', function(event){
			if (!event.ctrlKey) {
				MainViewController.unselect();
				this.body.select("tr").each(function(e){ e.removeClassName('selected') });
			}
			file.selected = !(file.selected);
			if(file.selected){ row.addClassName('selected'); }
			else row.removeClassName('selected');
		}.bind(this), true);
		
		if(file.selected) row.addClassName('selected'); 
		FileListColums.each(function(col){
			row.insert(this._set_data(
				new Element("td",{className: col.id}).observe("selectstart", function(){return false}),
				col, file
			));
		}.bind(this));
		this.body.select("tbody")[0].insert(row);
	},
	_set_data: function(cell, col, file){
		switch(col.id) {
		case "file_name":
			var image = $(new Image());
			image.src = FileIconMap.get_icon(file.get_kind());
			cell.insert(
				image.wrap("div",{className: "icon"}).observe("click", function(){ FilePropertyForm.show(file.id); })
			).insert(
				new Element("a",{id: "file_" + file.id, href:"javascript:void(0)"}).update(file.name)
					.observe('click',function(){ MainViewController.get_object(file.id) })
			);
			break;
		case "file_size":
			if (file.size) cell.update(file.size.toByteString());
			break;
		case "create_user":
			cell.update(file.user || "Unknown");
			break;
		case "create_date":
			cell.update("<span>" + file.create_date + "<\/span>");
			break;
		case "permission":
			if (file.auth && file.auth[col.prop]) cell.update('○');
			break;
		case "description":
			cell.update(file.description || "");
			break;
		default:
			
		}
		return cell;
	}
});

FileList = FileListDetail;

FileIconMap = {
	"directory": "icon_dir_closed.gif",
	//"directory": "icon_folder.gif",
	"shortcut": "icon_shortcut.gif",
	"txt": "icon_txt.gif",
	"xls": "icon_xls.gif",
	"doc": "icon_doc.gif",
	"css": "icon_css.gif",
	"exe": "icon_exe.gif",
	"pdf": "icon_pdf.gif"
	
}
FileIconMap.get_icon = function(ext) {
	if (this[ext]) { return 'image/filetype/' + this[ext]; }
	else return 'image/filetype/icon_txt.gif';	
};