ig.module(
  'plugins.google.leaderboardsTable'
)
.requires(
)
.define(function(){

  ig.GGS.leaderboardsTable = {
    BACK_TO_GAME: 1,
    BACK_TO_ALL_LEADERBOARDS: 2;
  };

  ig.GGS.leaderboardsTable.showAllLeaderboards = function() {
    ig.GGS.leaderboardsTable.clearOut();
    if (ig.GGS.leadManager.preloaded) {
      console.log(ig.GGS.leaderboardsTable);
    }
  };

  ig.GGS.leaderboardsTable.buildLeaderboardsRowFromData = function(leadObj) {
    console.log(leadObj);
  };

  ig.GGS.leaderboardsTable.selectLeaderboard = function(leaderboardId)
  {
    ig.GGS.leaderboardsTable.showLeaderboard(leaderboardId, ig.GGS.leaderboardsTable.BACK_TO_ALL_LEADERBOARDS);
  };
  
  ig.GGS.leaderboardsTable.goBack = function() {
    welcome.loadUp();
  };

  ig.GGS.leaderboardsTable.showLeaderboard = function(leaderboardId, backDestination)
  {
    leaderboardsTable.goBackTo = backDestination;
    console.log("I am going to show leaderboard ", leaderboardId);
    
    gapi.client.request({
      path: ig.GGS.login.basePath + '/leaderboards/' + leaderboardId + '/scores/social',
      params: {
        leaderboardId: leaderboardId,
        timeSpan: 'weekly'
      },
      callback: function(data){
        console.log('This is your data: ', data);
      }
    });
  };


  ig.GGS.leaderboardsTable.buildTableRowFromData = function(rowObj) {
    console.log(rowObj);
  };

  ig.GGS.leaderboardsTable.goBack = function() {
    console.log('go back');
  };
});


