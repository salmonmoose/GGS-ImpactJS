ig.GGS = {};

ig.module(
	'plugins.google.gameservice'
)
.requires(
	'impact.font',
	'plugins.google.button',
	'plugins.google.login',
	'plugins.persist'
)
.defines(function(){
	GoogleGameService = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/gplus_signin_normal.png', 114, 32),
		loginButton: false,
		font: false,

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			ig.GGS.font = new ig.Font('media/roboto.bold.png');

			this.loginButton = ig.game.spawnEntity(GoogleGameButton, 16, 536,
				{
					face:0,
					pressedUp: ig.GGS.login.showLoginDialog
				}
			);

			ig.GGS.login.trySilentAuth(); //Has the user already authenticated us?
		},

		update: function() {
			if(ig.GGS.login.loggedIn && this.loginButton) {
				//TODO move the button off the screen.
				console.log('Killing login button');
				this.loginButton.kill();
				this.loginButton = false;
				
				this.resetLeaderboardButton = ig.game.spawnEntity(
					GoogleGameButton, 16, 472,
					{
						animSheet: new ig.AnimationSheet('media/games_leaderboards_white.png', 256, 256),
						size: {x: 48, y: 48},
						face: 0,
						text: "Reset My Scores",
						pressedUp: function() {
							ig.GGS.leadManager.resetAll();
						}
					}
				);

				this.leaderboardButton = ig.game.spawnEntity(
					GoogleGameButton, 16, 536,
					{
						animSheet: new ig.AnimationSheet('media/games_leaderboards_white.png', 256, 256),
						size: {x: 48, y: 48},
						face: 0,
						text: "Leaderboards",
						pressedUp: function(){
							ig.system.setGame(LeaderboardScreen, { backLink: this });
						}
					}
				);

				this.resetAchievementButton = ig.game.spawnEntity(
					GoogleGameButton, 400, 472,
					{
						animSheet: new ig.AnimationSheet('media/games_achievements_white.png', 256, 256),
						size: {x: 48, y: 48},
						face: 0,
						text: "Reset My Acheivements",
						pressedUp: function() {
							ig.GGS.achManager.resetAll();
						}
					}
				);

				this.achievmentButton = ig.game.spawnEntity(
					GoogleGameButton, 400, 536,
					{
						animSheet: new ig.AnimationSheet('media/games_achievements_white.png', 256, 256),
						size: {x: 48, y: 48},
						face: 0,
						text: "Acheivements",
						pressedUp: function() {
							ig.system.setGame(AchievementScreen, { backLink: this });
						}
					}
				);
			}
		},

		draw: function() {
			ig.system.context.fillStyle = "rgba(0,0,0,0.20)";
			ig.system.context.fillRect(0, ig.system.realHeight - 64,ig.system.realWidth, ig.system.realHeight);
		},
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
