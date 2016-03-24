'use strict';

angular.module('iguanaApp.controllers').controller('ModalInstanceCtrl', function($rootScope,$scope, $modalInstance, passphrase){
    $scope.formData = {};
    $scope.errorOn = false;
    $scope.closeModal = function(){
       $modalInstance.close();
    };
    $scope.save = function(){
                
                if($rootScope.account.root.passPhrase!==$scope.formData.passphrase){
                  $rootScope.account.root.passPhrase=passphrase;
                 $modalInstance.close(); 
                }else{
            $scope.errorOn = true;
            console.log($scope.errorOn);
        }
       
    };
});