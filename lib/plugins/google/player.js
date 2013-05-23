ig.module(
  'plugins.google.player'
)
.defines(function(){
  ig.GGS.player = {
    displayName: '',
    profileUrl: '',
    userId: ''
  };

  ig.GGS.player.loadLocalPlayer = function() {
    gapi.client.request({
      path: ig.GGS.login.basePath + '/players/me',
      callback: function(data) {
        console.log('This is who you are ', data);
        console.log("Name:", data.displayName);

        //Show logout link
        ig.GGS.player.displayName = data.displayName;
        ig.GGS.player.profileUrl = data.avatarImageUrl;
        ig.GGS.player.userId = data.playerId;
        console.log('This is the player object', ig.GGS.player);
        //ig.GGS.welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
      }
    });
  };
});