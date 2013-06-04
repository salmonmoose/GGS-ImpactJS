ig.module(
	'plugins.google.leaderboardManager'
)
.requires(
	'plugins.google.leaderboardsTable'
)
.defines(function(){
	ig.GGS.leadManager = {
		preloaded: false,
		leaderboards: {},
		count: 0
	};

	ig.GGS.leadManager.preloadData = function() {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/leaderboards',
			callback : function(data) {
				if (data.kind == 'games#leaderboardListResponse' && data.hasOwnProperty('items')) {
					ig.GGS.leadManager.count = data.items.length;
					for (var i = 0; i < data.items.length; i++) {
						ig.GGS.leadManager.leaderboards[data.items[i].id] = data.items[i];
					}
				}
				ig.GGS.leadManager.preloaded = true;
			}
		});
	};

	ig.GGS.leadManager.getLeaderboardObject = function(leadId) {
		return ig.GGS.leadManager.leaderboards[leadId];
	};

	ig.GGS.leadManager.resetAll = function() {
		
	}

	ig.GGS.leadManager.gotScore = function(receivedScore, leaderboardId, callback) {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/leaderboards/' + leaderboardId + '/scores',
			method: 'post',
			params: {
				leaderboardId: leaderboardId, 
				score: receivedScore
			},
			callback: function(data) {
			console.log('Data from submitting high score is ', data);
			
			var bestScore = false;

			if (data.hasOwnProperty('beatenScoreTimeSpans')) {
				for (var i = 0; i < data.beatenScoreTimeSpans.length; i++) {
					if(!bestScore) {
						//If there is no best score, this must be the best.
						bestScore = data.beatenScoreTimeSpans[i];

					} else if(bestScore == 'DAILY') {
						//If it is only the daily best score, then anything is better.
						bestScore = data.beatenScoreTimeSpans[i];

					} else if(bestScore == 'WEEKLY' && data.beatenScoreTimeSpans[i] == 'ALL_TIME') {
						//If it is a weekly highscore, then only alltime is better.
						bestScore = data.beatenScoreTimeSpans[i];
					}
				}

				var url = (ig.GGS.leadManager.leaderboards[leaderboardId].iconUrl) 
					? ig.GGS.leadManager.leaderboards[leaderboardId].iconUrl
					: 'media/games_leaderboards_white.png';

				url = url + '?sz=64';

				var text;

				switch (bestScore) {
					case 'DAILY':
						text = 'Daily High Score for ' + ig.GGS.leadManager.leaderboards[leaderboardId];
						break;

					case 'WEEKLY':
						text = 'Weekly High Score for ' + ig.GGS.leadManager.leaderboards[leaderboardId];
						break;

					case 'ALL_TIME':
						text = 'All Time High Score for ' + ig.GGS.leadManager.leaderboards[leaderboardId];
						break;
				}

				ig.game.spawnEntity(GoogleGameAlert(0,0,
					{
						animSheet: new ig.AnimationSheet(url, 512, 512),
						text: text
					}
				));
			}
				//callback(newWeeklyHighScore);
			}
		});
	};
});