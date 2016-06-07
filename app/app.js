'use strict';
 
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngAnimate',
    'firebase',
    'myApp.home'           // Newly added home module
]).
config(['$routeProvider', function($routeProvider) {
    // Set defualt view of our app to home
     
    $routeProvider.otherwise({
        redirectTo: '/home'
    });

}])
.config(function($mdThemingProvider) {
   $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('teal');

});

 