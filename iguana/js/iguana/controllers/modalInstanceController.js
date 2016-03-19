'use strict';

angular.module('iguanaApp.controllers').controller('ModalInstanceCtrl', function($scope, $modalInstance, passphrase){
    $scope.formData = {};
    $scope.errorOn = false;
    $scope.closeModal = function(){
       $modalInstance.close();
    };
    $scope.save = function(){
        if(passphrase==$scope.formData.passphrase)
            $scope.closeModal();
        else{
            $scope.errorOn = true;
            console.log($scope.errorOn);
        }
    }
});