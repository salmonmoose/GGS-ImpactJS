ig.module(
  'plugins.google.challenge'
)
.requires(
)
.defines(function(){
  ig.GGS.challenge = {
    isActive: false,
    scoreToBeat: 0,
    challenger: "",
    difficulty: 0
  };

  ig.GGS.challenge.tryToLoad = function()
  {
    // Let's see if there's anything to parse here.
    var challengeString = ig.GGS.challenge.getURLParameter('gamedata');
    if (challengeString && challengeString != 'null') {
      console.log("Received challenge string ", challengeString);

      var decodedString = atob(challengeString);
      console.log("Decoded as ", decodedString);

      var challengeObject = JSON.parse(decodedString);
      console.log("Parsed into ", challengeObject);

      // We should always be careful to not trust this data completely!
      if (challengeObject != null &&
          challengeObject.hasOwnProperty('scoreToBeat') &&
          challengeObject.hasOwnProperty('challenger') &&
          challengeObject.hasOwnProperty('difficulty')
      ) {
        ig.GGS.challenge.isActive = true;
        ig.GGS.challenge.scoreToBeat = challengeObject.scoreToBeat;
        ig.GGS.challenge.challenger = challengeObject.challenger;
        ig.GGS.challenge.difficulty = challengeObject.difficulty;
      }
    }
    ig.GGS.welcome.dataLoaded(welcome.ENUM_CHALLENGE_DATA);
  };

  ig.GGS.challenge.getURLParameter = function(name) {
    return (decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    ));
  };

  ig.GGS.challenge.generateChallenge = function()
  {
    var challengeObject = {
      'difficulty': game.difficulty,
      'scoreToBeat': game.finalScore,
      'challenger': player.displayName
    };

    return challengeObject;
  };

  ig.GGS.challenge.resetIncomingChallenge = function() {
    ig.GGS.challenge.challenger = "";
    ig.GGS.challenge.difficulty = 0;
    ig.GGS.challenge.isActive = false;
  };
});