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
      ig.GGS.login.loggedIn = true;
      ig.GGS.login.loadClient();
    } else {
      console.log('Login Failed');
    }
  }

  ig.GGS.login.loadClient = function() {
    gapi.client.load('games', 'v1', function(response){
      console.log('Loaded Games Module');
      ig.GGS.player.loadLocalPlayer();
      ig.GGS.achManager.loadData();
      ig.GGS.leadManager.preloadData();
      //ig.GGS.welcome.loadUp();
      //ig.GGS.challenge.tryToLoad();
    });
  }

	ig.GGS.login.trySilentAuth = function() {
    if(!ig.GGS.login.loggedIn && gapi.auth) {

  		gapi.auth.authorize(
  			{
  				client_id: ig.GGS.constants.CLIENT_ID,
  				scope: ig.GGS.login.scopes,
  				immediate: true
  			},
  			this.handleAuthResult
  		);
    }
	}

  ig.GGS.login.showLoginDialog = function() {
    if(!ig.GGS.login.loggedIn) {
      gapi.auth.authorize(
        {
          client_id: ig.GGS.constants.CLIENT_ID,
          scope: ig.GGS.login.scopes,
          immediate: false
        },
        this.handleAuthResult
      );
    }
  }
});