ig.module(
  'plugins.google.achievementWidget'
)
.requires(
  'impact.game',
  'impact.entity'
)
.defines(function() {
  ig.GGS.achievementWidget.showAchievementWidget = function(achId)
  {
    console.log('Unlocked:', ig.GGS.achManager.achievements[achId].name);
    console.log('Description:', ig.GGS.achManager.achievements[achId].description);
    console.log('Image:', ig.GGS.achManager.achievements[achId].unlockedIconUrl);
  };
});