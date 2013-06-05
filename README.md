# GGS-ImpactJS

## Google Play Game Services Interface for ImpactJS

### Installation
To use simply copy included files into your project and include 'plugins.google.gameservice'.

Update ./lib/plugins/google/constants.js to match your package.

Spawn a GoogleGameService entity and the rest of the templated behaviour is automated.

    this.spawnEntity(GoogleGameService, 0, 0);
    
Send achievement unlock request:

    ig.GGS.unlock('ACH1');
    
Send achievement progress request:

    ig.GGS.progress('ACH1', 1);
    
Send high-score:

    ig.GGS.submitScore('LDB1', score);
    
    

