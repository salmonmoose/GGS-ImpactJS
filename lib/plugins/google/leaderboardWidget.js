ig.module(
  'plugins.google.leaderboardWidget'
)
.requires(
  'impact.game',
  'impact.entity'
)
.defines(function(){
  ig.GGS.leaderboardWidget.show = function(leadId)
  {
    var leaderboardObject = ig.GGS.leadManager.getLeaderboardObject(leadId);

    console.log('Icon:', leaderboardObject.iconUrl);
    console.log('Name:', leaderboardObject.name);
  };
});