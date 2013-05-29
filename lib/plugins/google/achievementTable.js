ig.module(
	'plugins.google.achievementTable'
)
.requires(
	'impact.game'
)
.defines(function(){

	AchievementScreen = ig.Game.extend({
		backdrop: new ig.Image('media/background.jpg'),
		table: false,
		backLink: false,

		init: function() {
			this.backLink = this.persistantData.backLink;

			this.table = this.spawnEntity(AchievementTable, 0, 0, {});
		},

		update: function() {
			this.parent();
		},

		draw: function() {
			this.backdrop.draw(0,0);

			for(var i = 0; i < this.entities.length; i++) {
				this.entities[i].draw();
			}
		},
	});

	AchievementTable = ig.Entity.extend({
		achievementTableRows: [],
		size: {x:320, y: 64},

		init: function(x, y, settings) {

		},

		draw: function() {

		},

		update: function() {
			if(this.achievementTableRows.length == 0 && ig.GGS.achManager.preloaded) {
				this.buildAchievementTable();
			}
		},

		buildAchievementTable: function() {
			count = 0;

			var height = this.size.y;
			this.size.y = 9 * this.size.y;

			this.pos.x = (ig.system.realWidth - this.size.x) / 2;
			this.pos.y = (ig.system.realHeight - this.size.y) / 2;

			for(var achievementId in ig.GGS.achManager.achievements) {
				var achievement = ig.GGS.achManager.achievements[achievementId];

				switch (achievement.achievementState) {
					case 'REVEALED':
						this.achievementTableRows.push(ig.game.spawnEntity(
							GoogleGameButton, this.pos.x, this.pos.y + count,
							{
								animSheet: new ig.AnimationSheet(achievement.revealedIconUrl, 512, 512),
								text: achievement.name,
								size: {x: height, y: height},
								backdropSize: {x: 320, y: 64},
								face: 0,
							}
						));
					break;

					case 'UNLOCKED':
						this.achievementTableRows.push(ig.game.spawnEntity(
							GoogleGameButton, this.pos.x, this.pos.y + count,
							{
								animSheet: new ig.AnimationSheet(achievement.unlockedIconUrl, 512, 512),
								text: achievement.name,
								size: {x: height, y: height},
								backdropSize: {x: 320, y: 64},
								face: 0,
							}
						));
					break;

					case 'HIDDEN':
						this.achievementTableRows.push(ig.game.spawnEntity(
							GoogleGameButton, this.pos.x, this.pos.y + count,
							{
								animSheet: new ig.AnimationSheet(achievement.revealedIconUrl, 512, 512),
								text: 'Hidden',
								size: {x: height, y: height},
								backdropSize: {x: 320, y: 64},
								face: 0,
							}
						));
					break;
				}

				count = count + height;
			}

			this.achievementTableRows.push(ig.game.spawnEntity(
				GoogleGameButton, this.pos.x, this.pos.y + count,
				{
					animSheet: new ig.AnimationSheet('media/games_controller_white.png', 256, 256),
					size: {x: 48, y: 48},
					face: 0,
					text: "Back to Game",
					pressedUp: function() {
						ig.system.setGame(TitleScreen);
					}
				}
			));
		},
	});
});