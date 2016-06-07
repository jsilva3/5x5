/*global todomvc */
'use strict';

myApp.directive('myChip', function(){
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      var myChip = elem.parent().parent();
      myChip.addClass('_played');
      
      scope.$watch(function(){
        return scope.$chip.played
      }, function(newVal){
        if (newVal) {
          myChip.addClass('_played');
         // console.log('add class active');
        } else {
          myChip.removeClass('_played');
         // console.log('remove class active');
        }
      })
      
    }
  };
})