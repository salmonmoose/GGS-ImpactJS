ig.module(
  'plugins.google.achievementTable'
)
.requires(
  'impact.game',
  'impact.entity'
)
.defines(function(){

  ig.GGS.achievementTable.loadUp = function() {
    ig.GGS.achievementTable.clearOut();
    if(ig.GGS.achManager.preloaded) {
      console.log(ig.GGS.achManager.achievements);
    }
  };

  ig.GGS.achievementTable.goBack = function() {
    ig.GGS.welcome.loadUp();
  };
});