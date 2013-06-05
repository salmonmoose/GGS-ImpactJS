# GGS-ImpactJS

## Google Play Game Services Interface for ImpactJS
### Introduction
GGS-ImpactJS is designed as an all-inclusive library for integration with Google Play Game Services. It provides interface to the service, as well as a collection of screens and entities to give feedback to the user.

### Installation
Currently you must load the google API in HTML - I am working on a fix for this;

    <script src="https://apis.google.com/js/client:plusone.js?onload=apisLoaded"></script>

Then simply copy included files into your project and include 'plugins.google.gameservice'. 

Update ./lib/plugins/google/constants.js to match your package.

Spawn a GoogleGameService entity and the rest of the templated behaviour is automated.

    this.spawnEntity(GoogleGameService, 0, 0);
    
Send achievement unlock request:

    ig.GGS.unlock('ACH1');
    
Send achievement progress request:

    ig.GGS.progress('ACH1', 1);
    
Send high-score:

    ig.GGS.submitScore('LDB1', score);
    
    

