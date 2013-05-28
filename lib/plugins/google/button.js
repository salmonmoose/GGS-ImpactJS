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

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			console.log('creating button at ', x, y);

			this.scale.x = this.size.x / this.animSheet.width;
			this.scale.y = this.size.y / this.animSheet.height;

			console.log(this.scale);

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

			ctx.fillStyle = "rgba(0,0,0,0.20)";

			ctx.fillRect(this.pos.x, this.pos.y, this.pos.x + this.backdropSize.x, this.pos.y + this.backdropSize.y);

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
					ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.size.x &&
					ig.input.mouse.y + ig.game.screen.y > this.pos.y &&
					ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.size.y;
		}
	});
});