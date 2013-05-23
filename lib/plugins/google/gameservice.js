ig.GGS = {};

ig.module(
	'plugins.google.gameservice'
)
.requires(
	'impact.game',
	'impact.entity',
	'plugins.google.login'
)
.defines(function(){
	GoogleGameService = ig.Entity.extend({
		size: {x:114, y:32},
		animSheet: new ig.AnimationSheet('media/gplus_signin_normal.png', 114, 32),
		_oldPressed: false,
		_startedIn: false,
		_actionName: 'click',

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.addAnim('login', 1, [0]);

			ig.GGS.login.trySilentAuth(); //Has the user already authenticated us?
		},

		update: function() {
			var _clicked = (ig.input.state( this._actionName )) ? true : false;
			this._startedIn = false;

			if(this._inButton()) {
				//this.setState('hover');

				if(!this._oldPressed && _clicked && this._inButton()) {
					this._startedIn = true;
				}

				
				if(_clicked && !this._oldPressed) {
					this._oldPressed = true;
					//this.setState('pressed');
					this.pressedDown();

				} else if(_clicked && this._oldPressed) {
					//this.setState('pressed');
					this.pressed();

				} else if(this._oldPressed) {
					this._oldPressed = false;
					this.pressedUp();
				}
				
			} else {
				if(!_clicked) {
					this._oldPressed = false;
				}
			}
		},

		draw: function() {
			this.parent();
		},

		pressed: function() {},
		pressedUp: function() { ig.GGS.login.showLoginDialog(); },
		pressedDown: function() {},

		_inButton: function() {
			return 	ig.input.mouse.x + ig.game.screen.x > this.pos.x &&
					ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.size.x &&
					ig.input.mouse.y + ig.game.screen.y > this.pos.y &&
					ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.size.y;
		}
	});
	
	ig.GGS.populateBragButton = function() {
		// Let's generate the deep-link ID so we can link on mobile devices

		var challengeObject = ig.GGS.challenge.generateChallenge();

		// Let's JSONify it
		var challengeString = JSON.stringify(challengeObject);
		challengeString = btoa(challengeString);
		var linkUrl = ig.GGS.constants.LINK_PAGE_BASE + "?gamedata=" + challengeString;

		// If we wanted, we could also have a different link for the calltoaction
		// url along with the contenturl. Right now, for simplicity, I just have both
		// links going to, which supplies the Schema.org content (if you're a robot)
		// or directs back to the game page (if you're not)

		gapi.interactivepost.render(
		  	'bragButton',
		    {
		    	'clientid': ig.GGS.constants.CLIENT_ID,
				'calltoactionurl': linkUrl,
				'calltoactiondeeplinkid': challengeString,
				'contenturl': linkUrl,
				'contentdeeplinkid': challengeString,
				'calltoactionlabel': 'PLAY',
				'prefilltext': 'Can you beat my score?',
				'cookiepolicy': 'single_host_origin'
		  	}
		);
	};
});
