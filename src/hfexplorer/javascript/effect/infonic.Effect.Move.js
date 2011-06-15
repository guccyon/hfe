Object.extend(infonic.Effect, {
	// 移動方法：ストレート
	MOVE_TYPE_STRAIGHT:0,
	
	// 単位移動距離(1/100秒毎)
	DEFAULT_MOVE_RATE: 25
});

// エフェクト用メソッド定義
Object.extend(infonic.Effect.Method, {
	moveTo: function(posX, posY, effect_type) {
		var abspos = Element.getAbsolutePoint(this);
		var rate = infonic.Effect.DEFAULT_MOVE_RATE;
		if (abspos.left < posX) {
			var _x_rate = rate;
		} else {
			var _x_rate = -rate;
		}
		if (abspos.top < posY) {
			var _y_rate = rate;
		} else {
			var _y_rate = -rate;
		}
		
		this.style.top = abspos.top + 'px';
		this.style.left = abspos.left + 'px';
		this.move_property = {
			target:[posX, posY], 
			type: (effect_type || 0),
			x_rate: _x_rate,
			y_rate: _y_rate};
		this.move_property.handler = 
			this.effect._update_position.setIntervalBind(10, this);
	},
	_update_position: function(type) {
		var x = parseInt(this.style.left);
		var y = parseInt(this.style.top);
		switch (this.move_property.type) {
			case infonic.Effect.MOVE_TYPE_STRAIGHT:
				x += this.move_property.x_rate;
				if (this.move_property.x_rate > 0 && x > this.move_property.target[0])
					x = this.move_property.target[0];
				else if (this.move_property.x_rate < 0 && x < this.move_property.target[0])
					x = this.move_property.target[0];
				
				y += this.move_property.y_rate;
				if (this.move_property.y_rate > 0 && y > this.move_property.target[1])
					y = this.move_property.target[1];
				else if (this.move_property.y_rate < 0 && y < this.move_property.target[1])
					y = this.move_property.target[1];
				break;

			default:
				break;
		}
		
		if (x == this.move_property.target[0] && 
			y == this.move_property.target[1]) {
			window.clearInterval(this.move_property.handler);
		}
		
		this.style.left = x + 'px';
		this.style.top = y + 'px';
	}
});