'use strict';

angular.module('myApp.newGame', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/newGame', {
    templateUrl: 'launch/newGame.html',
    controller: 'newGameCtrl'
  });
}])

.controller('newGameCtrl', newGameCtrl); 

function newGameCtrl($scope, $location) {
    $scope.imagePath = "img/cardHeader3.jpg";
    $scope.test = 1;
    var self = this;
 self.newGame = newGame; 
  function newGame(uid) {
        var newGameKey = firebase.database().ref().child("games").push().key;
        var obj = {};
        obj["player"] = $scope.uid;
        var updates = {};
        var addData = {
            player: $scope.uid,
            timestamp: Date.now()  
            };
            console.log("new game created");
        firebase.database().ref("/games/" + newGameKey + "/" + $scope.uid).update(addData);
        //changeView
        
            $location.path("/home/" + newGameKey); // path not hash
     
        
          };





//auth
//
$scope.init = function () {

  
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    
    var isAnonymous = user.isAnonymous;
    $scope.uid = user.uid;
    console.log("user is signed in " + JSON.stringify($scope.uid) );
    //bindSongs($scope.uid);
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