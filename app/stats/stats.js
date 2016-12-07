(function () {
  'use strict';

angular.module('myApp.stats', ['ngRoute','firebase','ngAnimate'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stats', {
    templateUrl: 'stats/stats.html',
    controller: 'statsCtrl'
  });
}])

.controller('statsCtrl', statsCtrl); 

function statsCtrl($timeout, $q, $log, $scope, $location, $firebaseArray,$firebaseObject) {
    var self = this;


function loadPlayed() {
  var tempObj = {};
  var playedRef = firebase.database().ref("picks/");
  var query = playedRef
  return $firebaseArray(playedRef)
};
$scope.played = loadPlayed();

function loadSongs(showid) {
  var songsRef = firebase.database().ref("picks/" + showid);
  //$scope.songs = $firebaseArray(songsRef);
  songsRef
    .on("value", function(snapshot) {
      snapshot.forEach(function(picks, key) {   
      //  console.log (picks.song);
  
    });
  });  
  return;
};

function loadGameCount(showid) {
  var gamesRef = firebase.database().ref("gameshow/");
  //$scope.songs = $firebaseArray(songsRef);
  var count = 0;
  gamesRef
    .orderByChild("showid")
    .equalTo(showid)
    .on("value", function(snapshot) {
      count = snapshot.numChildren();  
  });  
  return count;
};


      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          //console.log ("You have selected: Item " + $scope.selectedItem);
          $scope.gameCount = loadGameCount($scope.selectedItem);
          var songsRef = firebase.database().ref("picks/" + $scope.selectedItem);
          var songObj = {};
          var arr = [];
          var tempObj = {};
            songsRef
              .on("value", function(snapshot) {
              angular.forEach(snapshot.val(),function(picks,key){    
              if (!(picks.song in songObj)) {
                songObj[picks.song] = 0;
              }
              tempObj = {key:picks.song,value:1,played:false}
                songObj[picks.song]++;
                
                if (picks.played === true) {
                  tempObj = {key:picks.song,value:1,played:true}
                  console.log("played")
                };
              arr.push(tempObj);
              });
            });
          console.log(arr);
          var sortedSongs = sortObject(songObj);
          $scope.songs = sortedSongs;
          //console.log ($scope.songs);
          $scope.songs.sum = sum(sortedSongs);
          $scope.songs.games = Math.round($scope.songs.sum.value / 5);
          //console.log($scope.songs);
          return "Show " + $scope.selectedItem;
        } else {
          return "Please select a show";
        }
      };




//$timeout(function() {
// console.log ($scope.played);
//},2000);
function sum( obj ) {
  return Object.keys(obj).reduce(function (previous, key) {
    previous.value += obj[key].value;
    return previous;
}, { value: 0 });

};
function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

};
})();