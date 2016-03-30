'use strict';

angular.module('iguanaApp.controllers').controller('iguanaTX', function($rootScope,$scope, $modalInstance){
    $scope.TX = $rootScope.TXdetails;
    $scope.coin=$rootScope.account.root.activeCOIN;
    $scope.closeModal = function(){
       $modalInstance.close();
    };
    /*$scope.save = function(){
                
                if($rootScope.account.root.passPhrase!==$scope.formData.passphrase || !$rootScope.account.root.isCredSaved){
                  $rootScope.account.root.passPhrase=$scope.formData.passphrase;
                  console.log("new passphrase: "+$scope.formData.passphrase);
                   $modalInstance.close(); 
                   $rootScope.$emit('PassPhraseEntered');  
                }else{
            $scope.errorOn = true;
            console.log($scope.errorOn);
        }
       
    };*/
});