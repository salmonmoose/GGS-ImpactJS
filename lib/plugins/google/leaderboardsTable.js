ig.module(
  'plugins.google.leaderboardsTable'
)
.requires(
	'impact.game'
)
.defines(function(){

	LeaderboardScreen = ig.Game.extend({
		font: new ig.Font('media/american_captain_24.font.png'),
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

		goBack: function() {
			console.log('go back');
		},
  	});

	LeaderboardTable = ig.Entity.extend({
		leaderboardTableRows: [],

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
			console.log('calling custom kill function');
			for(var i = 0; i < this.leaderboardTableRows.length; i ++) {
				this.leaderboardTableRows[i].kill();
			}
			this.parent();
		},

		buildLeaderboardTable: function() {
			count = 0;
			for(var leaderboard in ig.GGS.leadManager.leaderboards) {
				console.log(ig.GGS.leadManager.leaderboards[leaderboard]);

				var url = (ig.GGS.leadManager.leaderboards[leaderboard].iconUrl) 
					? ig.GGS.leadManager.leaderboards[leaderboard].iconUrl
					: 'media/gplus_signin_normal.png';

				url = url + '?sz=32';

				leaderboardId = ig.GGS.leadManager.leaderboards[leaderboard].id;

				this.leaderboardTableRows.push(ig.game.spawnEntity(
					GoogleGameButton, 48, count,
					{
						animSheet: new ig.AnimationSheet(url,512,512),
						text: ig.GGS.leadManager.leaderboards[leaderboard].name,
						size: {x: 32, y: 32},
						face: 0,
						pressedUp: function() {
							ig.game.table.kill();
							ig.game.table = ig.game.spawnEntity(
								Leaderboard, 0,0, 
								{
									leaderboardId: leaderboardId
								}
							);
						}
					}
				));

				count = count + 32;
			}
		}
	});

	Leaderboard = ig.Entity.extend({
		leaderboardId: false,
		leaderboardRows: [],
		leaderboardTableRows: [],

		init: function(x, y, settings) {
			this.leaderboardId = settings.leaderboardId;

			var request = gapi.client.games.scores.list(
				{
					collection: 'SOCIAL',
					leaderboardId: this.leaderboardId,
					timeSpan: 'weekly'
				}
			);

			request.execute(function(response) {
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

		getLeaderboardData: function(data) {
			if(data.hasOwnProperty('items')) {
				for(var i = 0; i < data.items.length; i++) {
					this.leaderboardRows.push(this.buildLeaderboardRow(data.items[i]));
				}
			}
		},

		buildLeaderboard: function() {
			count = 0;
			for(var i = 0; i < this.leaderboardRows.length; i++) {

				console.log(this.leaderboardRows[i]);

				var url = this.leaderboardRows[i].image
					? this.leaderboardRows[i].image
					: 'media/gplus_signin_normal.png';

				url = url + '?sz=64';

				console.log(url);

				this.leaderboardTableRows.push(ig.game.spawnEntity(
					GoogleGameButton, 48, count,
					{
						animSheet: new ig.AnimationSheet(url,64,64),
						text: this.leaderboardRows[i].name + " - " + this.leaderboardRows[i].score,
						size: {x: 64, y: 64},
						face: 0
					}
				));

				count = count + 64;
			}
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


