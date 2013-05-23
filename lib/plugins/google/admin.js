ig.module(
  'plugins.google.admin'
)
.requires(
)
.defines(function(){
  ig.GGS.admin = {
    scoresReset: 0,
    leaderboards: []
  };

  ig.GGS.admin.loadUp = function() {
     //Show admin page
  };

  ig.GGS.admin.resetAchievements = function() {
    gapi.client.request({
      path: ig.GGS.login.adminPath + '/achievements/reset',
      method: 'post',
      callback : function(data) {
        console.log('Achievement reset response: ', data);
        if (data.kind == 'gamesManagement#achievementResetAllResponse') {
          // We should probably actually analyze the data here.
          var namesOfAchievements = [];
          if (data.hasOwnProperty('results')) {
            for (var i=0; i<data.results.length; i++) {
              namesOfAchievements.push(achManager.getNameForId(data.results[i].definitionId));
            }
          }
          // Reload our data
          ig.GGS.achManager.loadData();
          alert('Achievements ' + namesOfAchievements.join(', ') + ' have all been reset.');
        } else {
          alert("Something odd is going on...");
        }
      }
    });
  };

  ig.GGS.admin.resetScores = function() {
    ig.GGS.admin.scoresReset = 0;
    ig.GGS.admin.leaderboards = []; //FIXME get all known leaderboards.
    for (var i = 0; i < admin.leaderboards.length; i++) {
      gapi.client.request({
        path: ig.GGS.login.adminPath + '/leaderboards/' + ig.GGS.admin.leaderboards[i] + '/scores/reset',
        method: 'post',
        callback : function(data) {
          console.log('Score reset response: ', data);
          if (data.kind == "gamesManagement#playerScoreResetResponse") {
            ig.GGS.admin.scoresReset++;
            if (ig.GGS.admin.scoresReset >= ig.GGS.admin.leaderboards.length) {
              alert('All ' + admin.scoresReset + ' leaderboard scores have been reset');
            }
          }
        }
      });
    }
  };


  ig.GGS.admin.goBack = function() {
    ig.GGS.welcome.loadUp();
  };
});