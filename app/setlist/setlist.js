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

function setlistCtrl($timeout, $q, $scope, $location, $firebaseArray,$firebaseObject) {
    var self = this;
    $scope.test = 1;
    
  $scope.items = [
    {name: "Lunchmeat"},
    {name: "Bread"},
    {name: "Milk"},
    {name: "Mustard"},
    {name: "Cheese"}
  ];
  $scope.addItem = function() {
    $scope.items.push($scope.item);
    $scope.item = {};
  };
  $scope.removeItem = function(index) {
    $scope.items.splice(index, 1);
  };



};
})();