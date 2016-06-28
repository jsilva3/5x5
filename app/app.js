'use strict';
 
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngAnimate',
    'firebase',
    'myApp.home',
    'myApp.newgame',
    'myApp.setlist'           // Newly added home module
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // Set defualt view of our app to home
    //$locationProvider.hashPrefix('!');
    $routeProvider.otherwise({
        redirectTo: '/newgame'
    });

}])
.animation('.fade', function() {
  return {
    enter: function(element, done) {
      element.css('display', 'none');
      $(element).fadeIn(1000, function() {
        done();
      });
    },
    leave: function(element, done) {
      $(element).fadeOut(1000, function() {
        done();
      });
    },
    move: function(element, done) {
      element.css('display', 'none');
      $(element).slideDown(500, function() {
        done();
      });
    }
  }
})
.config(function($mdThemingProvider) {
   $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('teal');
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();

});


 