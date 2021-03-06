(function () {
  'use strict';

  angular.module('myApp.setlist', ['ngRoute', 'firebase', 'ngAnimate'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/setlist', {
        templateUrl: 'setlist/setlist.html',
        controller: 'setlistCtrl'
      });
    }])

    .controller('setlistCtrl', setlistCtrl);

  function setlistCtrl($timeout, $q, $log, $scope, $location, $firebaseArray, $firebaseObject) {
    var self = this;


    function loadPlayed() {
      var tempObj = {};
      var playedRef = firebase.database().ref("played/");
      return $firebaseArray(playedRef)
    };
    $scope.played = loadPlayed();

    //load alive times
    function loadAlive() {
      var tempObj = {};
      var aliveRef = firebase.database().ref("admin/alive/");
      var query = aliveRef
      return $firebaseArray(aliveRef)
    };
    $scope.alive = loadAlive();
    
    function loadSongs(showid) {
      var songsRef = firebase.database().ref("played/" + showid);
      $scope.songs = $firebaseArray(songsRef);
      return;
    };
    $scope.songAdd = "";

    $scope.selectedItem;
    $scope.getSelectedText = function () {
      if ($scope.selectedItem !== undefined) {
        console.log("You have selected: Item " + $scope.selectedItem);
        var songsRef = firebase.database().ref("played/" + $scope.selectedItem);
        $scope.songs = $firebaseArray(songsRef);
        return "Show " + $scope.selectedItem;
      } else {
        return "Please select a show";
      }
    };


    $scope.addSong = function (song) {

      if (song) {
        // Get the Firebase reference of the item
        var songAddRef = firebase.database().ref("played/" + $scope.selectedItem + "/" + song);
        var songLower = song.toLowerCase();
        var addData = {
          song: song,
          songMatch: songLower,
          played: true,
          timestamp: Date.now()
        };
        songAddRef.update(addData);
        $scope.songAdd = "";

      }
    };
    $scope.doAction = function (song, chkValue) {
      var songAddRef = firebase.database().ref("played/" + $scope.selectedItem + "/" + song);
      var addDataTrue = {
        addIt: true
      };
      var addDataFalse = {
        addIt: false
      };
      if (!chkValue) {
        songAddRef.update(addDataFalse);
      } else {
        songAddRef.update(addDataTrue);
      };

    };

    //$timeout(function() {
    // console.log ($scope.played);
    //},2000);

  };
})();