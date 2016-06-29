(function () {
  'use strict';

angular.module('myApp.setlist', ['ngRoute','firebase','ngAnimate'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/setlist', {
    templateUrl: 'setlist/setlist.html',
    controller: 'setlistCtrl'
  });
}])

.controller('setlistCtrl', setlistCtrl); 

function setlistCtrl($timeout, $q, $log, $scope, $location, $firebaseArray,$firebaseObject) {
    var self = this;

    //for postgres

function loadPlayed() {
  var tempObj = {};
  var playedRef = firebase.database().ref("played/");
  return $firebaseArray(playedRef)
};
$scope.played = loadPlayed();

function loadSongs(showid) {
  var songsRef = firebase.database().ref("played/" + showid);
  $scope.songs = $firebaseArray(songsRef);
  console.log("here");
  return;
};

      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          console.log ("You have selected: Item " + $scope.selectedItem);
          var songsRef = firebase.database().ref("played/" + $scope.selectedItem);
          $scope.songs = $firebaseArray(songsRef);
          return "Show " + $scope.selectedItem;
        } else {
          return "Please select a show";
        }
      };



$timeout(function() {
 console.log ($scope.played);
},2000);

};
})();