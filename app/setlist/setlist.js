(function () {
  'use strict';

angular.module('myApp.setlist', ['ngRoute','firebase','ngAnimate'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/setlist', {
    templateUrl: 'setlist/setlist.html',
    controller: 'setlistCtrl'
  });
}])
.factory('setlistService', function($http) {
    return {
      getSetlist: function() {
         return $http.get('https://api.phish.net/api.js?showdate=06%2F22%2F2016&api=2.0&format=json&method=pnet.shows.setlists.get&artist=1');
      }
    }
  })
.controller('setlistCtrl', setlistCtrl); 

function setlistCtrl($timeout, $q, $log, $scope, $location, $firebaseArray,$firebaseObject, setlistService) {
    var self = this;

function myLoad(){
       var promise = 
          setlistService.getSetlist()
          promise.then(
          function(payload) { 
            var setlistData1=[];
              setlistData1 = payload.data[0];
              $scope.setlist = setlistData1.map( function (song) {
              return song;
          });
          },
          function(errorPayload) {
              $log.error('failure loading song', errorPayload);
          });
          console.log("here");
};

//$timeout(function() {
// console.log ($scope.setlist)
//},3000);

};
})();