ig.module(
	'plugins.google.achievementManager'
)
.requires(
	//'plugins.google.achievementWidget'
	'plugins.google.achievementTable'
)
.defines(function(){
	ig.GGS.achManager = {
		achievements: {},
		preloaded: false,
		count: 0
	};

	ig.GGS.achManager.loadData = function() {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/achievements',
			callback : function(data) {
				if (data.kind == 'games#achievementDefinitionsListResponse' && data.hasOwnProperty('items')) {
					for (var i = 0; i < data.items.length; i++) {
						ig.GGS.achManager.achievements[data.items[i].id] = data.items[i];
						ig.GGS.achManager.achievements[data.items[i].id].achievementState = data.items[i].initialState;
					}
					ig.GGS.achManager.loadAchievementsEarnedByPlayer();
				}
			}
		});
	}

	ig.GGS.achManager.loadAchievementsEarnedByPlayer = function() {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/players/me/achievements',
			params: {
				playerId: 'me',
				state: 'ALL'
			},
			callback : function(data) {
				if (data.kind == 'games#playerAchievementListResponse' && data.hasOwnProperty('items')) {
					for (var i = 0; i < data.items.length; i++) {
						var nextAch = data.items[i];
						ig.GGS.achManager.achievements[nextAch.id].achievementState = nextAch.achievementState;
						if (nextAch.hasOwnProperty('formattedCurrentStepsString')) {
							ig.GGS.achManager.achievements[nextAch.id].formattedCurrentStepsString = nextAch.formattedCurrentStepsString;
						}
					}
				} else {
					
				}
			}
		});
		ig.GGS.achManager.preloaded = true;
	};

	ig.GGS.achManager.submitProgress = function(achId, amount) {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/achievements/' + achId + '/increment',
			params: {
				achievementId: achId,
				stepsToIncrement: amount
			},
			method: 'post',
			callback: function(data) {
				ig.GGS.achManager.achievements[achId].currentSteps = data.currentSteps;
				ig.GGS.achManager.achievements[achId].formattedCurrentStepsString = String(data.currentSteps);
				if (data.newlyUnlocked) {
					var achievement = ig.GGS.achManager.achievements[achId];
					ig.game.spawnEntity(GoogleGameAlert(0,0,
						{
							animSheet: new ig.AnimationSheet(achievement.unlockedIconUrl, 512, 512),
							text: 'Achievement Unlocked: ' + achievement.name,
						}
					));
				} else {
					
				}
			}
		});
	};

	ig.GGS.achManager.resetAll = function() {
		gapi.client.request({
			path: ig.GGS.login.adminPath + '/achievements/reset',
			method: 'post',
			callback: function(data) {
				console.log(data);
			}
		});
	},

	ig.GGS.achManager.unlockAchievement = function(achId) {
		gapi.client.request({
			path: ig.GGS.login.basePath + '/achievements/' + achId + '/unlock',
			method: 'post',
			callback: function(data) {
				console.log('Data from earning achievement is ', data);
				if (data.newlyUnlocked) {
					var achievement = ig.GGS.achManager.achievements[achId];
					ig.GGS.spawnWidget(
						new ig.AnimationSheet(
							ig.GGS.achManager.achievements[achId].unlockedIconUrl, 512, 512
							), 
						'Achievement Unlocked: ' + achievement.name
					);
				} else {
					console.log('You unlocked ' + ig.GGS.achManager.achievements[achId].name + ' but you already unlocked it earlier.');
				}
			}
		});
	};
});