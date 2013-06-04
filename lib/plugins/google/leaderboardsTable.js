ig.module(
  'plugins.google.leaderboardsTable'
)
.requires(
	'impact.game'
)
.defines(function(){

	LeaderboardScreen = ig.Game.extend({
		backdrop: new ig.Image('media/background.jpg'),
		table: false,
		backLink: false,

		init: function() {
			this.backLink = this.persistantData.backLink;

			this.table = this.spawnEntity(LeaderboardTable, 0, 0, {});
		},

		showAllLeaderboards: function() {
			if (ig.GGS.leadManager.preloaded) {
				console.log(ig.GGS.leaderboardsTable);
			}
		},

		buildLeaderboardsRowFromData: function(leadObj) {
			console.log(leadObj);
		},

		selectLeaderboard: function(leaderboardId) {
			ig.GGS.leaderboardsTable.showLeaderboard(leaderboardId, ig.GGS.leaderboardsTable.BACK_TO_ALL_LEADERBOARDS);
		},

		update: function() {
			this.parent();
		},

		draw: function() {
			this.backdrop.draw(0,0);

			for(var i = 0; i < this.entities.length; i ++) {
				this.entities[i].draw();
			}
		},
  	});

	LeaderboardTable = ig.Entity.extend({
		leaderboardTableRows: [],
		size: {x: 320, y: 64},

		init: function(x, y, settings) {

		},

		draw: function() {

		},

		update: function() {
			if(this.leaderboardTableRows.length == 0 && ig.GGS.leadManager.preloaded) {
				this.buildLeaderboardTable();
			}
		},

		kill: function() {
			for(var i = 0; i < this.leaderboardTableRows.length; i ++) {
				this.leaderboardTableRows[i].kill();
			}
			this.parent();
		},

		buildLeaderboardTable: function() {
			count = 0;

			var height = this.size.y;
			this.size.y = (ig.GGS.leadManager.count + 1) * this.size.y;
			
			this.pos.x = (ig.system.realWidth - this.size.x) / 2;
			this.pos.y = (ig.system.realHeight - this.size.y) / 2;

			for(var leaderboard in ig.GGS.leadManager.leaderboards) {

				var url = (ig.GGS.leadManager.leaderboards[leaderboard].iconUrl) 
					? ig.GGS.leadManager.leaderboards[leaderboard].iconUrl
					: 'media/gplus_signin_normal.png';

				url = url + '?sz=32';

				leaderboardId = ig.GGS.leadManager.leaderboards[leaderboard].id;

				this.leaderboardTableRows.push(ig.game.spawnEntity(
					GoogleGameButton, this.pos.x, this.pos.y + count,
					{
						animSheet: new ig.AnimationSheet(url,512,512),
						text: ig.GGS.leadManager.leaderboards[leaderboard].name,
						size: {x: height, y: height},
						backdropSize: {x: 320, y: 64},
						face: 0,
						leaderboardId: leaderboardId,

						pressedUp: function() {
							console.log(this.text);

							ig.game.table.kill();

							ig.game.table = ig.game.spawnEntity(
								Leaderboard, 0,0, 
								{
									leaderboardId: this.leaderboardId
								}
							);
						}
					}
				));

				count = count + height;
			}

			this.leaderboardTableRows.push(ig.game.spawnEntity(
				GoogleGameButton, this.pos.x, this.pos.y + count,
				{
					animSheet: new ig.AnimationSheet('media/games_controller_white.png', 256, 256),
					size: {x: 48, y: 48},
					face: 0,
					text: "Back to Game",
					pressedUp: function(){
						ig.system.setGame(TitleScreen);
					}
				}
			));
		}
	});

	Leaderboard = ig.Entity.extend({
		size: {x: 320, y: 64},
		leaderboardId: false,
		leaderboardRows: [],
		leaderboardTableRows: [],

		init: function(x, y, settings) {
			this.leaderboardId = settings.leaderboardId;

			console.log(this.leaderboardId);

			var request = gapi.client.games.scores.list(
				{
					collection: 'SOCIAL',
					leaderboardId: this.leaderboardId,
					timeSpan: 'weekly'
				}
			);

			request.execute(function(response) {
				console.log(response);
				ig.game.table.getLeaderboardData(response);
			});
		},

		update: function() {
			if(this.leaderboardRows.length > this.leaderboardTableRows.length) {
				this.buildLeaderboard();
			}
		},

		draw: function() {

		},

		kill: function() {
			for(var i = 0; i < this.leaderboardTableRows.length; i ++) {
				this.leaderboardTableRows[i].kill();
			}
			this.parent();
		},

		getLeaderboardData: function(data) {
			if(data.hasOwnProperty('items')) {
				for(var i = 0; i < data.items.length; i++) {
					this.leaderboardRows.push(this.buildLeaderboardRow(data.items[i]));
				}
			}
		},

		buildLeaderboard: function() {
			count = 0;

			var height = this.size.y;
			this.size.y = (this.leaderboardRows.length + 1) * this.size.y;

			this.pos.x = (ig.system.realWidth - this.size.x) / 2;
			this.pos.y = (ig.system.realHeight - this.size.y) / 2;

			for(var i = 0; i < this.leaderboardRows.length; i++) {

				console.log(this.leaderboardRows[i]);

				var url = this.leaderboardRows[i].image
					? this.leaderboardRows[i].image
					: 'media/gplus_signin_normal.png';

				url = url + '?sz='+height;

				this.leaderboardTableRows.push(ig.game.spawnEntity(
					GoogleGameButton, this.pos.x, this.pos.y + count,
					{
						animSheet: new ig.AnimationSheet(url, height, height),
						text: this.leaderboardRows[i].name + " - " + this.leaderboardRows[i].score,
						size: {x: height, y: height},
						face: 0
					}
				));

				count = count + height;
			}

			this.leaderboardTableRows.push(ig.game.spawnEntity(
				GoogleGameButton, this.pos.x, this.pos.y + count,
				{
					animSheet: new ig.AnimationSheet('media/games_leaderboards_white.png'),
					size: {x:48, y:48},
					face: 0,
					text: "Leaderboards",
					pressedUp: function(){
						ig.game.table.kill();
						ig.game.table = ig.game.spawnEntity(LeaderboardTable, 0,0, {});
					}
				}
			));
		},

		buildLeaderboardRow: function(data) {
			console.log(data);
			return {
				image: data.player.avatarImageUrl,
				name:  data.player.displayName,
				score: data.formattedScore,
				rank:  data.formattedScoreRank
			};
		}

	});
});


