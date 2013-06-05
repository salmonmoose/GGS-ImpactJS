# GGS-ImpactJS

## Google Play Game Services Interface for ImpactJS

### Installation
To use simply copy included files into your project and include 'plugins.google.gameservice'.

Update ./lib/plugins/google/constants.js to match your package.

Spawn a GoogleGameService entity and the rest of the templated behaviour is automated.

    this.spawnEntity(GoogleGameService, 0, 0);
    
Send achievement unlock request:

    ig.GGS.achManager.unlockAchievement(ig.GGS.constants.ACHIEVEMENTS.ACH1.code);
    
Send achievement progress request:

    ig.GGS.achManager.submitProgress(ig.GGS.constant.ACHIEVEMENTS.ACH1.code, 1);
    
Send high-score:

    ig.GGS.leadManager.gotScore(score, ig.GGS.constants.LEADERBOARDS.LDB1.code, callback);
    
    

