ig.module(
	'plugins.google.leaderboardManager'
)
.requires(
	'plugins.google.leaderboardsTable'
)
.defines(function(){
	ig.GGS.leadManager = {
		preloaded: false,
		leaderboards: {}
	};

	ig.GGS.leadManager.preloadData = function() {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/leaderboards',
			callback : function(data) {
				console.log('Leaderboard data', data);
				if (data.kind == 'games#leaderboardListResponse' && data.hasOwnProperty('items')) {
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
			var newWeeklyHighScore = false;
			if (data.hasOwnProperty('beatenScoreTimeSpans')) {
				for (var i = 0; i < data.beatenScoreTimeSpans.length; i++) {
					if (data.beatenScoreTimeSpans[i] == 'WEEKLY') {
						console.log('Hooray! New weekly high score!');
						newWeeklyHighScore = true;
						ig.GGS.leaderboardWidget.show(leaderboardId);
					} else {

					}
				}
			}
				//callback(newWeeklyHighScore);
			}
		});
	};
});