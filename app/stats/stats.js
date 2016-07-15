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
  return $firebaseArray(playedRef)
};
$scope.played = loadPlayed();

function loadSongs(showid) {
  var songsRef = firebase.database().ref("picks/" + showid);
  //$scope.songs = $firebaseArray(songsRef);
  songsRef
    .on("value", function(snapshot) {
      snapshot.forEach(function(picks, key) {   
        console.log (picks.song);
  
    });
  });

     
    
   
  return;
};


      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          console.log ("You have selected: Item " + $scope.selectedItem);
          var songsRef = firebase.database().ref("picks/" + $scope.selectedItem);
          var songObj = {};
          // = $firebaseArray(songsRef);
            songsRef
              .on("value", function(snapshot) {
              angular.forEach(snapshot.val(),function(picks,key){    
              if (!(picks.song in songObj)) {
                songObj[picks.song] = 0;
              }
                songObj[picks.song]++;
              });
            });
          var sortedSongs = sortObject(songObj);
          $scope.songs = sortedSongs;
          console.log(sortedSongs);
          return "Show " + $scope.selectedItem;
        } else {
          return "Please select a show";
        }
      };




//$timeout(function() {
// console.log ($scope.played);
//},2000);

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