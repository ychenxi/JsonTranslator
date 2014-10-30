(function(){
	angular.module('translator', [])
    .controller('mainController', ['$scope','$window', function($scope,$window) {
      $scope.text = '';
      $scope.submit = function() {
        if ($scope.text) {
          var res = "/translator?url="+ encodeURIComponent(this.text);
          $window.location.href = res;
          $scope.text = '';
        }
      };
    }]);
	
})();