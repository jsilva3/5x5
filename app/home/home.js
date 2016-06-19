(function () {
  'use strict';

var homeMVC = angular.module('myApp.home', ['ngRoute','ngMaterial','firebase', 'angular-clipboard'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home/:gameNumber', {
        templateUrl: 'home/home.html'

    });
}])

.factory('songService', function($http) {
    return {
      getSong: function() {
         return $http.get('https://sleepy-caverns-50749.herokuapp.com/json');
      }
    }
  })

// Home controller
.controller('HomeCtrl', HomeCtrl); 

function HomeCtrl ($timeout, $q, $log, $location, $scope, $rootScope, $firebaseArray, $firebaseObject, songService, $http, $mdToast, $routeParams, clipboard) {
  $log.info($routeParams.gameNumber);
  if ($routeParams.gameNumber) {
    var game = $routeParams.gameNumber;
  }else {
    console.log("error, no game id")
  };

    $scope.imagePath = "img/cardHeader3.jpg";
    $scope.imageBetaPath = "img/betabadge2.svg";
    //var showid = "20160622";
    var self = this;
   // $scope.songData = [];
  $scope.options = {
    hideOld: false,
    cb4: true,
    cb5: false
  };
//toast code
  var last = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };
  $scope.toastPosition = angular.extend({},last);
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };
  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }
  $scope.showSimpleToast = function(toastText) {
    var pinTo = $scope.getToastPosition();
    $mdToast.show(
      $mdToast.simple()
        .textContent(toastText)
        .position('bottom center')
        .hideDelay(3500)
    );
  };

////clipboard
  $scope.copySupported = false;
  $scope.locationAbsUrl = $location.absUrl();
  console.log($location.absUrl());
  //var copyUrl = $location.path();
  $scope.copyTextToCopy =  $scope.locationAbsUrl;
  $scope.copySuccess = function () {
      console.log('Copied!');
      $scope.showSimpleToast("Game link copied. Send it to your friends!"); 
  };
  $scope.copyFail = function (err) {
      console.error('Error!', err);
  };

//check value of self.songs, delay for async load
//$timeout(function() {
//console.log(self.songs);
//}, 2000);

function myLoad(){
       var promise = 
          songService.getSong()
          promise.then(
          function(payload) { 
            var songData1=[];
              songData1 = payload.data[0];
            self.songs = songData1.map( function (song) {
        return song;
      });
          },
          function(errorPayload) {
              $log.error('failure loading song', errorPayload);
          });
          console.log("here");
};
///////////


    self.readonly = false;
    self.removable = true;
    self.songPicks = this;
    
    self.songPicks.addPick = addPick;
    function addPick(pick) {
      if (pick) {
        addSongFire(pick, $scope.uid);
      };
      self.clear();
    };
    self.songPicks.score = score;
    function score(picks){
      var count =0;
      angular.forEach(picks, function(pick){
        count += pick.played ? 1 : 0;
      });
      return count;
    };
    self.clear = function() {
      self.searchText = "";
    };

function picksActive() {
  if ($scope.showidnew.time < Date.now()) {
    //show has not started
    self.readonly = true;  
  }else{
    //show has started
    self.readonly = false; 
}};

//self.bindSongs = bindSongs;
 function bindSongs(uid, showid){
    var mysongs = [];
    var gameanduserid = game + "_" + uid;
    //console.log(gameanduserid)
    //tie mypicks to listener to catch delete chip
    var myPicksRef = firebase.database().ref("picks/" + showid);
    var query = myPicksRef
      .orderByChild("gameanduserid")
      .equalTo(gameanduserid);

    $scope.myPicks = $firebaseArray(query);
       // console.log($scope.myPicks);
        $scope.deleteThis = function(index){
        //console.log(index);
        $scope.myPicks.$remove(index);
      };
    
   //players
    var allPlayersRef = firebase.database().ref("games/" + game);
    var query7 = allPlayersRef
      .orderByChild("player");
    $scope.allPlayers = $firebaseArray(query7);
    //console.log($scope.allPlayers);

    //get unique players in a game
    var otherPicksRef = firebase.database().ref("games/" + game);
    otherPicksRef
      .on("value", function(snapshot) {
         var arr = [];
         angular.forEach(snapshot.val(),function(player,key){           

         if (player.player == $scope.uid) {  
              //todo - move my pick here
                var playerNameref = firebase.database().ref("games/" + game + "/" + player.player)
                var syncObject = $firebaseObject(playerNameref);
                syncObject.$bindTo($scope, "playerFire").then(function(x) {
                  console.log("Success player");
                  getShowDetails($scope.playerFire.showid);
                }).catch(function(error) {
                  console.error("Error:", error);
                });
                //var getshowid = getShowDetails(temp.showid);
             
         }else {
                var allPicksRef = firebase.database().ref("picks/" + showid);
                var gameanduserid = game + "_" + player.player;      
                var query3 = allPicksRef
                .orderByChild("gameanduserid")
                .equalTo(gameanduserid);
                $scope.playerName = player;
                
                //console.log($scope.playerName.name);
                var tempObj = {};
                if ($scope.playerName.timestamp) {
                tempObj = ({name: $scope.playerName.name, picks:$firebaseArray(query3)});
                arr.push(tempObj);
                };
                $scope.otherPicks = arr;         
         };
         var temp = picksActive();
       });  
    });

   ////load show details
   function getShowDetails(showid) {
      if (!showDetailsRef) {
          var showDetailsRef = firebase.database().ref("shows/" + showid);
            $scope.showDetails = $firebaseObject(showDetailsRef);  
            $scope.showDetails.$loaded().then(function(x) {
              console.log("Success");
              //console.log($scope.showDetails);
            }).catch(function(error) {
            console.error("Error:", error);
           });
          };
        };
 };
// register user
//  
  function registerUser(uid, showid) {
            //var newUserKey = firebase.database().ref().child("games").push().key;
            var updates = {};
            var newPostKey = firebase.database().ref().child("/users/" + $scope.uid + "/" + showid).push().key;
            var ref = firebase.database().ref("games/" +game);
              ref.once("value")
                .then(function(snapshot) {
                    var gameCreated = snapshot.exists();  
                    if (gameCreated) {
                      var obj = {};
                      obj["player"] = $scope.uid;
                      var updates = {};
                      var addData = {
                      player: $scope.uid,
                      timestamp: Date.now(),
                      showid: showid
                    };
                      var addData2 = {
                      gameid: game,
                      timestamp: Date.now(),
                      showid: showid,
                      date_abrev: showid.toString().substring(4,6) + "/" + showid.toString().substring(6,8)  
                    };  
                    //figure out why this overwrites name
                    updates["/users/" + $scope.uid + "/" + showid + "/" + game] = addData2;
                   // updates["/games/" + game + "/" + $scope.uid] = addData;
                   firebase.database().ref().update(updates);
                 firebase.database().ref("/games/" + game + "/" + $scope.uid).update(addData);
                  }else {
                    $location.path("/newGame");
                  };
                    console.log (gameCreated);

                  },function(error) {
                    // The Promise was rejected.
                    console.error(error);
                  });
      };

self.updatePlayed = updatePlayed;
  function updatePlayed(song) {
            //var newUserKey = firebase.database().ref().child("games").push().key;
            var obj = {};
            obj["player"] = $scope.uid;
            var updates = {};
            var songandshowid = song + "_" + $scope.showidnew.showid;
            var addDataTrue = {
                played: true,
                timestamp: Date.now()  
              };
            var addDataFalse = {
                played: false,
                timestamp: Date.now()  
              };
              console.log(song);
            var songsRefQuery = firebase.database().ref("picks/" + $scope.showidnew.showid);
              songsRefQuery
                .orderByChild("song")
                .equalTo(song)
                .once("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                      var songsRefQuery = firebase.database().ref("picks/" + $scope.showidnew.showid + "/" + childSnapshot.key);
                      //console.log(snapshot.val().played);
                      if (childSnapshot.val().played) {
                        songsRefQuery.update(addDataFalse);
                      }else{
                        songsRefQuery.update(addDataTrue);
                      };
                    });
                });
      };

self.removeChipFire = removeChipFire;
    function removeChipFire(chip,index) {
      console.log(chip, index);
      var ref2 = firebase.database().ref("picks/" + $scope.showidnew.showid);
      ref2
        .orderByChild("gameid")
        .startAt(game).endAt(game)
        .once("value", function(snapshot) {
          angular.forEach(snapshot.val(),function(pick,key){
           if ((pick.song == chip.song) && (pick.uid == $scope.uid)) {  
              var ref2 = firebase.database().ref("picks/" + $scope.showidnew.showid + "/" + key);
              ref2.remove()
               .then(function() {
               console.log("Remove succeeded.")
              })
               .catch(function(error) {
               console.log("Remove failed: " + error.message)
           });
            }else {
           //console.log("couldn't find key")
          };
         });
     });
     bindSongs($scope.uid, $scope.showidnew.showid);
    };
 ///
 ////function to add songs to current game picks
 ///
self.addSongFire = addSongFire;
    function addSongFire(pick, uid) {
      //console.log(pick, uid);
      if ($scope.myPicks.length < 5) {
      var newPostKey = firebase.database().ref().child("picks" + "/" + $scope.showidnew.showid).push().key;
      var addData = {
                uid: uid,
                gameid: game,
                gameanduserid: game + "_" + uid,
                song: pick,
                songandgameid: pick + "_" + game,
                songandshowid: pick + "_" + $scope.showidnew.showid,
                played: false,
                timestamp: Date.now()  
              };
      var updates = {};
      updates["/picks/" + "/" + $scope.showidnew.showid + "/" + newPostKey] = addData;
      return firebase.database().ref().update(updates);
      }
      else{
        console.log("picks are full dude"); 
        $scope.showSimpleToast("You have 5 songs! Remove a song if you want to change up your picks.");    
      };
   };
//
//autocomplete from sample
//
    self.hideOld       = $scope.options.hideOld;
    self.simulateQuery = false;
    self.isDisabled    = false;
    self.noCache       = true;
    //self.songs         = myLoadFunction();
    //self.songs         = $scope.songData;
    //console.log($scope.songData);
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.songs.filter( createFilterFor(query) ) : self.songs,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      //$log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      //$log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
  
     */
    
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        if (!$scope.options.hideOld) {
          return ((item.song_name.indexOf(lowercaseQuery) === 0 && parseInt(item.gap_shows) <= 150));
        }
        else{
          return item.song_name.indexOf(lowercaseQuery) === 0
        };
      };
    }
//init and auth  
  Array.prototype.select = function(closure){
    for(var n = 0; n < this.length; n++) {
        if(closure(this[n])){
            return this[n];
        }
    }

    return null;
};  
$scope.init = function () {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
    
      var isAnonymous = user.isAnonymous;
      $rootScope.uid = user.uid;
      console.log("user is signed in " + JSON.stringify($scope.uid) );
    // get showid 
    //new game key
        var getShowIdRef = firebase.database().ref("/gameshow/" + game + "/");
        $scope.showidnew = $firebaseObject(getShowIdRef);  
        $scope.showidnew.$loaded().then(function(x) {
          bindSongs($scope.uid, $scope.showidnew.showid);
          registerUser($scope.uid, $scope.showidnew.showid);
          myLoad();
        }).catch(function(error) {
          console.error("Error:", error);
        });
    // ...
  } else {
     console.log("user is not signed in")
    // User is signed out.
    // ...
  }  // ...
});
};  
}
})();