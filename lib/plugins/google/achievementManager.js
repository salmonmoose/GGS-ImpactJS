ig.module(
  'plugins.google.achievementManager'
)
.requires(
	//'plugins.google.achievementWidget'
)
.defines(function(){
  ig.GGS.achManager = {};

  ig.GGS.achManager.achievements = {};
  ig.GGS.achManager.preloaded = false;

  ig.GGS.achManager.loadData = function() {
    gapi.client.request({
      path: ig.GGS.login.basePath + '/achievements',
      callback : function(data) {
        console.log('Achievement definitions', data);
        if (data.kind == 'games#achievementDefinitionsListResponse' &&
            data.hasOwnProperty('items')) {
          for (var i = 0; i < data.items.length; i++) {
            ig.GGS.achManager.achievements[data.items[i].id] = data.items[i];
            // Will be overwritten later if we have achievement data
            ig.GGS.achManager.achievements[data.items[i].id].achievementState = data.items[i].initialState;
          }
          //ig.GGS.welcome.dataLoaded(ig.GGS.welcome.ENUM_ACHIEVEMENT_DEFS);
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
      console.log('Your achievement data: ', data);
      if (data.kind == 'games#playerAchievementListResponse' &&
          data.hasOwnProperty('items')) {
        for (var i = 0; i < data.items.length; i++) {
          var nextAch = data.items[i];
          ig.GGS.achManager.achievements[nextAch.id].achievementState = nextAch.achievementState;
          if (nextAch.hasOwnProperty('formattedCurrentStepsString')) {
            ig.GGS.achManager.achievements[nextAch.id].formattedCurrentStepsString = nextAch.formattedCurrentStepsString;
          }
        }
        //ig.GGS.welcome.dataLoaded(ig.GGS.welcome.ENUM_ACHIEVEMENT_PROGRESS);
      } else {
        console.log("**Unexpected response **", data);
      }
    }
  });

  ig.GGS.achManager.preloaded = true;

  };

	ig.GGS.achManager.getNameForId = function(achId)
	{
	  return ig.GGS.achManager.achievements[achId].name;
	};

	ig.GGS.achManager.submitProgress = function(achId, amount)
	{
	  gapi.client.request({
	    path: ig.GGS.login.basePath + '/achievements/' + achId + '/increment',
	    params: {
	    	achievementId: achId,
	      stepsToIncrement: amount
	    },
	    method: 'post',
	    callback: function(data) {
	      console.log('Data from incrementing achievement is ', data);
	      // Let's updated our locally cached version
	      ig.GGS.achManager.achievements[achId].currentSteps = data.currentSteps;
	      ig.GGS.achManager.achievements[achId].formattedCurrentStepsString = String(data.currentSteps);
	      if (data.newlyUnlocked) {
	        ig.GGS.achievementWidget.showAchievementWidget(achId);
	      } else {
	        console.log('You either haven\'t unlocked ' + ig.GGS.achManager.achievements[achId].name
	            + ' yet, or you unlocked it already.');
	      }
	    }
	  })

	};

	ig.GGS.achManager.unlockAchievement = function(achId)
	{
	  gapi.client.request({
	    path: login.basePath + '/achievements/' + achId + '/unlock',
	    method: 'post',
	    callback: function(data) {
	      console.log('Data from earning achievement is ', data);
	      if (data.newlyUnlocked) {
	        ig.GGS.achievementWidget.showAchievementWidget(achId);
	        // Let's refresh our data here, while we're at it
	        ig.GGS.achManager.loadAchievementsEarnedByPlayer();
	      } else {
	        console.log('You unlocked ' + ig.GGS.achManager.achievements[achId].name + ' but you already unlocked it earlier.');
	      }
	    }
	  });
	};
});