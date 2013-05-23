ig.module(
  'plugins.google.welcome'
)
.requires(

)
.defines(function(){
  ig.GGS.welcome = {
    leaderboards_loaded: false,
    achievement_defs_loaded: false,
    achievement_progress_loaded: false,
    player_data_loaded: false,
    challenge_loaded: false,

    ENUM_LEADERBOARDS: 1,
    ENUM_ACHIEVEMENT_DEFS: 2,
    ENUM_ACHIEVEMENT_PROGRESS: 3,
    ENUM_PLAYER_DATA: 4,
    ENUM_CHALLENGE_DATA: 5
  }

  ig.GGS.welcome.dataLoaded = function(whatData) {
    if (whatData == ig.GGS.welcome.ENUM_LEADERBOARDS) {
      ig.GGS.welcome.leaderboards_loaded = true;

    } else if (whatData == ig.GGS.welcome.ENUM_ACHIEVEMENT_DEFS) {
      ig.GGS.welcome.achievement_defs_loaded = true;

    } else if (whatData == ig.GGS.welcome.ENUM_ACHIEVEMENT_PROGRESS) {
      ig.GGS.welcome.achievement_progress_loaded = true;

    } else if (whatData == ig.GGS.welcome.ENUM_PLAYER_DATA) {
      ig.GGS.welcome.player_data_loaded = true;

    } else if (whatData == ig.GGS.welcome.ENUM_CHALLENGE_DATA) {
      ig.GGS.welcome.challenge_loaded = true;
    }

    ig.GGS.welcome.activateButtonsIfReady();
  };

  ig.GGS.welcome.activateButtonsIfReady = function()
  {
    if (ig.GGS.welcome.leaderboards_loaded &&
        ig.GGS.welcome.achievement_defs_loaded &&
        ig.GGS.welcome.achievement_progress_loaded &&
        ig.GGS.welcome.player_data_loaded &&
        ig.GGS.welcome.challenge_loaded
    ) {
      
    }
  };

  ig.GGS.welcome.loadUp = function() {
    
  };

  ig.GGS.welcome.showAchievements = function() {
    ig.GGS.achievementTable.loadUp();
  };

  ig.GGS.welcome.showLeaderboards = function() {
    ig.GGS.leaderboardsTable.showAllLeaderboards();
  };

  ig.GGS.welcome.startGame = function(difficulty) {
    
  };

  ig.GGS.welcome.seeFriends = function() {
    ig.GGS.friendsTable.showBuddies();
  };

  ig.GGS.welcome.showAdmin = function() {
    ig.GGS.admin.loadUp();
  };
});