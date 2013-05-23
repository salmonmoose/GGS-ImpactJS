ig.module(
  'plugins.google.login'
)
.requires(
  'plugins.google.player',
  'plugins.google.achievementManager',
  'plugins.google.leaderboardManager',
  //'plugins.google.welcome'
  'plugins.google.constants'
)
.defines(function(){
  ig.GGS.login = {
    userId: '',
    loggedIn: false,
    scopes: 'https://www.googleapis.com/auth/games',
    basePath: '/games/v1',
    plusPath: '/plus/v1',
    adminPath: '/games/v1management'
  }

  ig.GGS.login.handleAuthResult = function(auth) {
    console.log('We are in handle auth result');

    console.log(auth);

    if(auth) {
      console.log('Logged in');
      //Get Local Player Object
      ig.GGS.player.loadLocalPlayer();

      //Load The Achievement Manager
      ig.GGS.achManager.loadData();

      //Load The Leaderboard Manager
      ig.GGS.leadManager.preloadData();

      //I don't think I still need this.
      //ig.GGS.welcome.loadUp();

      //Load the challenge manager(?)
     // ig.GGS.challenge.tryToLoad();
      
    } else {
      console.log('Login Failed');
    }
  }

	ig.GGS.login.trySilentAuth = function() {
		gapi.auth.authorize(
			{
				client_id: ig.GGS.constants.CLIENT_ID,
				scope: ig.GGS.login.scopes,
				immediate: true
			},
			this.handleAuthResult
		);
	}

  ig.GGS.login.showLoginDialog = function() {
    gapi.auth.authorize(
      {
        client_id: ig.GGS.constants.CLIENT_ID,
        scope: ig.GGS.login.scopes,
        immediate: false
      },
      this.handleAuthResult
    );
  }
});