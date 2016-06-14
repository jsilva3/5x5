'use strict';
 
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngAnimate',
    'firebase',
    'myApp.home',
    'myApp.newgame'           // Newly added home module
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // Set defualt view of our app to home
    //$locationProvider.hashPrefix('!');
    $routeProvider.otherwise({
        redirectTo: '/newgame'
    });

}])

.config(function($mdThemingProvider) {
   $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('teal');

});

 