/*global todomvc */
'use strict';

myApp.directive('myChipHide', function(){
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      var myChipHide = elem.parent().parent();
      myChipHide.addClass('_hidetext');
      
      scope.$watch(function(){
        return scope.showDetails.started
      }, function(newVal){
        if (newVal) {
          myChipHide.removeClass('_hidetext');
          //swapped for oppostite effect as locking logic
          //console.log('add class active');
        } else {
          myChipHide.addClass('_hidetext');
         // console.log('remove class active');
        }
      })
      
    }
  };
})