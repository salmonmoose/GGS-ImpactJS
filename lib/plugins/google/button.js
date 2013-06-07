ig.module(
	'plugins.google.button'
)
.requires(
	'impact.entity'
)
.defines(function(){
	GoogleGameButton = ig.Entity.extend({
		size: {x:114, y:32},
		backdropSize: {x: 320, y: 64},
		animSheet: new ig.AnimationSheet('media/gplus_signin_normal.png', 114, 32),
		_isPressed: false,
		_actionName: 'click',
		scale: {x:1, y:1},
		text: false,
		fillStyle: 'rgba(0, 0, 0, 0.20)',

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.scale.x = this.size.x / this.animSheet.width;
			this.scale.y = this.size.y / this.animSheet.height;

			this.addAnim('face', 1, [(settings.face)?settings.face:0]);
		},

		update: function() {
			var _clicked = (ig.input.state(this._actionName)) ? true : false;
			var _startedIn = false;

			if(this._inButton()) {
				if(!this._isPressed && _clicked && this._inButton()) {
					_startedIn = true;
				}

				if(_clicked && !this._isPressed) {
					this._isPressed = true;
					this.pressedDown();
				} else if(_clicked && this._isPressed) {
					this.pressed();
				} else if(this._isPressed) {
					this._isPressed = false;
					this.pressedUp();
				}

			} else {
				if(!_clicked) {
					this._isPressed = false;
				}
			}
		},

		draw: function() {
			var ctx = ig.system.context;

			ctx.fillStyle = this.fillStyle;

			ctx.fillRect(
				this.pos.x, 
				this.pos.y, 
				this.backdropSize.x, 
				this.backdropSize.y
			);

			ctx.save();
			ctx.translate(
				ig.system.getDrawPos(this.pos.x - ig.game.screen.x),
				ig.system.getDrawPos(this.pos.y - ig.game.screen.y)
			);
			ctx.scale(this.scale.x, this.scale.y);

			offset = (this.backdropSize.y - this.size.y) / 2;

			this.currentAnim.draw(offset,offset);

			ctx.restore();

			if(this.text) {
				ig.GGS.font.draw(
					this.text, 
					this.pos.x + this.size.x + (this.size.x / 2), 
					this.pos.y + ((this.backdropSize.y - ig.GGS.font.height) / 2)
				);
			}
		},

		pressed: function() {},
		pressedUp: function() {},
		pressedDown: function() {},

		_inButton: function() {
			return 	ig.input.mouse.x + ig.game.screen.x > this.pos.x &&
					ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.backdropSize.x &&
					ig.input.mouse.y + ig.game.screen.y > this.pos.y &&
					ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.backdropSize.y;
		}
	});

	ig.GGS.spawnWidget = function(icon, text) {

		console.log(icon, text);
		
		entity = new GoogleGameAlert(0,0,
			{
				animSheet: icon,
				text: text
			}
		);

		ig.game.entities.push(entity);
	}

	GoogleGameAlert = ig.Entity.extend({
		size: {x: 64, y: 64},
		backdropSize: {x: 640, y: 64},
		animSheet: false,
		scale: {x: 1, y: 1},
		moveTarget: {x: 0, y: 0},
		moveDelta: null,
		moveTimer: null,
		eventTimer: null,
		stage: 0,
		startPos: {x: 0, y: 0},
		text: false,
		fillStyle: 'rgba(0, 0, 0, 0.20)',

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.pos.x = (ig.system.realWidth - this.backdropSize.x) / 2;
			this.pos.y = 0 -this.backdropSize.y;
			this.moveTimer = new ig.Timer();
			this.eventTimer = new ig.Timer();

			this.scale.x = this.size.x / this.animSheet.width;
			this.scale.y = this.size.y / this.animSheet.height;

			this.eventTimer.set(2);

			this.moveTo(this.pos.x, 0, 0.5);
			this.addAnim('face', 1, [(settings.face)?settings.face:0]);
		},

		moveTo: function(x, y, delta) {
			this.startPos.x = this.pos.x;
			this.startPos.y = this.pos.y;

			this.moveTarget.x = x;
			this.moveTarget.y = y;
			this.moveDelta = delta;

			this.moveTimer.set();
		},

		update: function() {
			if(this.moveTimer) {
				delta = Math.min(this.moveTimer.delta(), this.moveDelta);

				if(this.pos.x != this.moveTarget.x || this.pos.y != this.moveTarget.y) {
					this.pos.x = parseInt(ig.GGS.easeInOutQuad(this.startPos.x, this.moveTarget.x, delta, this.moveDelta));
					this.pos.y = parseInt(ig.GGS.easeInOutQuad(this.startPos.y, this.moveTarget.y, delta, this.moveDelta));
				}
			}

			if(this.eventTimer.delta() >= 0) {
				switch (this.stage) {
					case 0:
						this.moveTo(this.pos.x, 0 - this.backdropSize.y, 0.5);
						this.eventTimer.set(1);
						this.stage++;
						break;

					case 1:
						this.stage++;
						this.kill;
						break;
				}
			}
		},

		draw: function() {
			var ctx = ig.system.context;

			ctx.fillStyle = this.fillStyle;

			ctx.fillRect(
				this.pos.x, 
				this.pos.y, 
				this.backdropSize.x, 
				this.backdropSize.y
			);

			ctx.save();
			ctx.translate(
				ig.system.getDrawPos(this.pos.x - ig.game.screen.x),
				ig.system.getDrawPos(this.pos.y - ig.game.screen.y)
			);
			ctx.scale(this.scale.x, this.scale.y);

			offset = (this.backdropSize.y - this.size.y) / 2;

			this.currentAnim.draw(offset,offset);

			ctx.restore();

			if(this.text) {
				ig.GGS.font.draw(
					this.text, 
					this.pos.x + this.size.x + (this.size.x / 2), 
					this.pos.y + ((this.backdropSize.y - ig.GGS.font.height) / 2)
				);
			}
		}
	});

	ig.GGS.easeInOutQuad = function (start, end, delta, duration) {
		change = end - start;
		delta /= duration / 2;
		if (delta < 1) return change / 2 * delta * delta + start;
		delta--;
		return -change / 2 * (delta * (delta - 2) - 1) + start;
	}
});