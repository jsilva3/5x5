'use strict';

angular.module('myApp.newgame', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/newgame', {
    templateUrl: 'launch/newgame.html',
    controller: 'newGameCtrl'
  });
}])

.controller('newGameCtrl', newGameCtrl); 

function newGameCtrl($scope, $location, $firebaseArray) {

    $scope.imagePath = "img/cardHeader3.jpg";
    $scope.test = 1;
    var showid = "20160622";
    var self = this;
    $scope.gameCount = 0;
    $scope.userGames = '';
//init
$scope.init = function () {

  
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    
    var isAnonymous = user.isAnonymous;
    $scope.uid = user.uid;
    console.log("user is signed in " + JSON.stringify($scope.uid) );
    loadGames($scope.uid);
    //registerUser($scope.uid);
    // ...
  } else {
     console.log("user is not signed in")
    // User is signed out.
    // ...
  }  // ...
});
}; 



//current games
function loadGames(uid) {
   var tempObj = {};
   
var currentGamesRef = firebase.database().ref("users/" + $scope.uid + "/" + showid);
    currentGamesRef
      .on("value", function(snapshot) {
         var arr = [];
         angular.forEach(snapshot.val(),function(games,key){  
           $scope.gameCount +=1;
           
           tempObj = ({game: games.gameid,num: $scope.gameCount});
           //console.log(tempObj);
           arr.push(tempObj);
           console.log($scope.gameCount);

         });
           $scope.currentGames = arr;
           console.log ($scope.currentGames);         
         // console.log ($scope.userGames);
      });  
      console.log ($scope.userGames);                      
  // this.userGames = ('Game1 Game2 Game3 ').split(' ').map(function (game) { return { text: game }; });

};

 self.newGame = newGame; 
  function newGame(uid) {
    if ($scope.gameCount < 4) {
        var newGameKey = firebase.database().ref().child("games").push().key;
        var newPostKey = firebase.database().ref().child("/users/" + $scope.uid + "/" + showid).push().key;
        var obj = {};
        obj["player"] = $scope.uid;
        var updates = {};
        var addData = {
            player: $scope.uid,
            timestamp: Date.now()  
            };
            console.log("new game created");
        var addData2 = {
            gameid: newGameKey,
            timestamp: Date.now()  
            };   

        $scope.game = newGameKey;     
        //firebase.database().ref("/games/" + newGameKey + "/" + $scope.uid).update(addData);
  
        updates["/games/" + newGameKey + "/" + $scope.uid] = addData;
        updates["/users/" + $scope.uid + "/" + showid + "/" + newPostKey] = addData2;
        firebase.database().ref().update(updates);
        //changeView
        
            $location.path("/home/" + newGameKey); // path not hash
  }else {
    console.log("games are full");
  };
};

self.gotoGame = gotoGame;
function gotoGame(gameid) {
  if (gameid) {

  $location.path("/home/" + gameid); // path not 
  }else {
    console.log($scope.currentGames[1]);
    console.log("no gameid");
  }
};





//auth
//
   
};