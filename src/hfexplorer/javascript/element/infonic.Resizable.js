document.writeln(
	  '<style type="text/css">'
	+ '    span.resizeHandle {'
	+ '        width: 5px;'
	+ '        height: 100%;'
	+ '        cursor: e-resize;'
	+ '        background-color: inherit;'
	+ '        position: absolute;'
	+ '        '
	+ '    }'
	+ '</style>'
);


//if(typeof Resizable == 'undefined') Resizable = new Object();
Resizable = Class.create();
Resizable.prototype = {

	setEventFlg: false,
	
	onDragObj: null,

	setDraggingArea: function(parent) {
		if (!this.setEventFlg) {
			this.setEventFlg = true;
			Event.observe(parent, 'mousemove', this.dragging.bindAsEventListener(this), false);
			Event.observe(parent, 'mouseup', this.end.bindAsEventListener(this), false);
			Event.observe(document, 'mouseup', this.end.bindAsEventListener(this), false);
			//Event.observe(parent, 'mouseout', this.end.bindAsEventListener(this), false);
		}
	},
	
	dragging: function(e) {
		if (this.onDragObj != null) {
			this.onDragObj.resizeTo(Event.pointerX(e));
		}
	},
	
	end: function(e) {
		if (this.onDragObj != null) {
			this.onDragObj.dragFinish();
			this.onDragObj = null;
		}
	}
}

Resizable.Table = Class.create();
Object.extend(Resizable.Table.prototype, Resizable.prototype);
Object.extend(Resizable.Table.prototype, {

	// リサイズ対象行
	targetRow: null,
	
	// ドラッグ開始Ｘ座標
	startX: 0,
	
	// 対象テーブル
	targetTable: null,
	
	// リサイズ対象セル
	targetCell: null,
	
	// リサイズ対象セル、リサイズ前幅
	targetCurWidth: 0,
	
	// リサイズハンドル
	handles: null,
	
	// 行の右側の位置
	rowRightX: 0,
	
	lastCellIndex: 0,
	
	tableFixFlg: false,
	
	initialize: function(targetRow, tableFixFlg) {
	
		this.targetRow = targetRow;
		this.handles = new Array();
		p = Element.getAbsolutePoint(targetRow);
		if (typeof tableFixFlg == 'boolean') {
			this.tableFixFlg = tableFixFlg;
		}
		
		if (tableFixFlg) {
			setcellLen = targetRow.cells.length - 1;
		} else {
			setcellLen = targetRow.cells.length;
		}
		
		// 対象行のセルの数分処理
		for (var i = 0; i < setcellLen; i++) {
			var handle = document.createElement('span');
			Element.addClassName(handle, 'resizeHandle');
			
			this.updateHandleDispPos(targetRow.cells[i], handle);
			
			Event.observe(handle, 'mousedown', this.dragStart.bindAsEventListener(this), false);
			
			targetRow.cells[i].appendChild(handle);
			// ハンドルを登録
			this.handles[i] = {
					'handle': handle,
					'posX': parseInt(handle.style.left),
					'updatePos': function() {
						handlePos = Element.getAbsolutePoint(this.handle);
						this.posX = handlePos.left;
					}
				};
				
			targetRow.cells[i].style.width = targetRow.cells[i].offsetWidth;
		}
	
		this.lastCellIndex = targetRow.cells.length - 2;
		// 最後のセルの幅は自動にする
		targetRow.cells[targetRow.cells.length - 1].style.width = 'auto';
		
		// ドラッグ可能エリアのセット
		this.setDraggingArea(targetRow);
		
		this.targetTable = targetRow.parentNode;
		while(this.targetTable.nodeName != 'TABLE') {
			
			this.targetTable = this.targetTable.parentNode;
		}
		this.targetTable.style.tableLayout = 'fixed';
	},
	
	/**
	 * ドラッグ開始処理
	 */
	dragStart: function(e) {
	
		if (Event.isLeftClick(e)) {
			this.startX = Event.pointerX(e);
			this.targetCell = Event.element(e).parentNode;
			this.targetCurWidth = parseInt(this.targetCell.offsetWidth);
			this.onDragObj = this;
			this.tableSize = this.targetTable.offsetWidth;
			this.rowRightX = Element.getAbsolutePoint(this.targetRow).left + this.targetRow.offsetWidth;
			this.outsideCellWidth = this.targetRow.cells[this.lastCellIndex + 1].offsetWidth;
		}
	},
	
	/**
	 * ドラッグ終了処理
	 */
	dragFinish: function(e) {
		this.targetCell = null;
		for (var k = 0; k < this.handles.length; k++) {
			this.handles[k].updatePos();
			this.handles[k].handle.style.height = this.targetRow.cells[k].offsetHeight;
		}
	},
	
	/**
	 * リサイズ処理
	 */
	resizeTo: function(x) {
		moveX = x - this.startX;
		resizeWidth = this.targetCurWidth + moveX;
		outsideCell = this.targetCell.cellIndex == this.handles.length - 2;
		
		// 左へドラッグ
		if (moveX < 0) {
			// 移動後のセル幅が15以下の場合何もしない
			if (resizeWidth < 15) {
				return;
			}
			// 最後の一個手前のセルの場合、テーブルサイズを変更しない
			if (this.targetCell.cellIndex != this.lastCellIndex && !this.tableFixFlg) {
				this.targetTable.style.width = this.tableSize + moveX;
			}
			
			this.targetCell.style.width = resizeWidth;
		// 右へドラッグ
		} else {
			// 一番外側のセルの場合何もしない
			if (this.targetCell.cellIndex == this.lastCellIndex + 1) {
				return;
			}
			
			if ((this.outsideCellWidth - moveX) < 10) {
				return;
			}
			
			if (!this.tableFixFlg) {
				this.targetTable.style.width = this.tableSize + moveX;
			}
			
			this.targetCell.style.width = resizeWidth;
		}
		
		for (var j = this.targetCell.cellIndex; j < this.handles.length; j++) {
			this.updateHandleDispPos(this.targetRow.cells[j], this.handles[j].handle);
		}
	},
	
	/**
	 * リサイズ用ハンドルの表示位置を更新
	 */
	updateHandleDispPos: function(cell, handle) {
		
		tdp = Element.getAbsolutePoint(cell);
		tdwidth = cell.offsetWidth;
		
		handle.style.top = tdp.top;
		handle.style.left = tdp.left + tdwidth - 5;
		handle.style.height = cell.offsetHeight;
	}
});

/*
Event.observe(window, 'load', function() {
		tr = document.getElementsByTagName('tr');
		for (var m = 0; m < tr.length; m++) {
			new Resizable.Table(tr[m]);
		}

	}, false);
*/