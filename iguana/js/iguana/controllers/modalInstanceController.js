'use strict';

angular.module('iguanaApp.controllers').controller('ModalInstanceCtrl', function($rootScope,$scope, $modalInstance, passphrase){
    $scope.formData = {};
    $scope.errorOn = !$rootScope.account.root.passphraseOK || !$rootScope.account.root.isCredSaved;
    $scope.closeModal = function(){
       $modalInstance.close();
    };
    $scope.save = function(){
                
                if($rootScope.account.root.passPhrase!==$scope.formData.passphrase || !$rootScope.account.root.isCredSaved){
                  $rootScope.account.root.passPhrase=$scope.formData.passphrase;
                  console.log("new passphrase: "+$scope.formData.passphrase);
                   $modalInstance.close(); 
                   $rootScope.$emit('PassPhraseEntered');  
                }else{
            $scope.errorOn = true;
            console.log($scope.errorOn);
        }
       
    };
});