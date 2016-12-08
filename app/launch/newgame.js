(function () {
  'use strict';

angular.module('myApp.newgame', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/newgame', {
    templateUrl: 'launch/newgame.html',
    controller: 'newGameCtrl'
  });
}])

.controller('newGameCtrl', newGameCtrl); 

function newGameCtrl($timeout, $q, $scope, $location, $firebaseArray,$firebaseObject,$mdToast) {
    var self = this;
    $scope.imagePath = "img/cardHeader5for5.png";
    $scope.imageBetaPath = "img/betabadge2.svg";
    $scope.imageCopyPath = "img/contentcopy.svg";
    $scope.test = 1;
    var showid = '';
    $scope.gameCount = 0;
    $scope.userGames = '';

     
function getNextShow(uid) {
  //load next show from "shows/" 
           var tempObj = {};  
           var uid = uid;
           //console.log (Date.now());
  var nextShowRef = firebase.database().ref("/shows/").orderByChild("time").startAt(Date.now()).limitToFirst(2);
  $scope.nextShow = $firebaseArray(nextShowRef);  
  $scope.nextShow.$loaded().then(function(x) {
  console.log("Success");
  showid = $scope.nextShow[0].showid;
      //console.log (showid + "hererere");
    loadGames($scope.uid, showid);
    }).catch(function(error) {
      console.error("Error:", error);
    });
};

//current games
function loadGames(uid, showid) {
   var tempObj = {};
   var currentGamesRef = firebase.database().ref("users/" + $scope.uid);
    currentGamesRef
      .orderByChild("showid")
      .limitToLast(2)
      .on("value", function(snapshot) {
         var arr = [];
        angular.forEach(snapshot.val(),function(showdays,key){  
         angular.forEach(showdays,function(games,key){  
           $scope.gameCount +=1;         
           tempObj = ({game: games.gameid,num: $scope.gameCount, date_abrev: games.date_abrev});
           arr.push(tempObj);
         });
           $scope.currentGames = arr;
        });       
      });                   
  // this.userGames = ('Game1 Game2 Game3 ').split(' ').map(function (game) { return { text: game }; });

};

 self.newGame = newGame; 
  function newGame(showid) {
    if ($scope.gameCount < 8) {
        var newGameKey = firebase.database().ref().child("games").push().key;
        var newPostKey = firebase.database().ref().child("/users/" + $scope.uid + "/" + showid).push().key;
        var obj = {};
        obj["player"] = $scope.uid;
        var updates = {};
        var addData = {
            player: $scope.uid,
            timestamp: Date.now(),  
            showid: showid
            };
        var addData2 = {
            gameid: newGameKey,
            timestamp: Date.now(),
            showid: showid,
            date_abrev: showid.toString().substring(4,6) + "/" + showid.toString().substring(6,8)  
            };  
        var addData3 = {  
            showid: showid,
            time: $scope.nextShow[0].time}; 

        $scope.game = newGameKey;     
        updates["/games/" + newGameKey + "/" + $scope.uid] = addData;
        updates["/gameshow/" + newGameKey] = addData3;
        firebase.database().ref().update(updates);
        //changeView
        $location.path("/home/" + newGameKey); // path not hash
  }else {
    $scope.showSimpleToast("Maxium 8 games for every two shows.");
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




//init
//
$scope.init = function () {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    
    var isAnonymous = user.isAnonymous;
    $scope.uid = user.uid;
    //console.log("user is signed in " + JSON.stringify($scope.uid) );
    //loadGames($scope.uid);
    getNextShow($scope.uid);
    
    //registerUser($scope.uid);
    // ...
  } else {
    console.log("user is not signed in")
    // User is signed out.
    // ...
  }  // ...
});
};  
   
};
})();