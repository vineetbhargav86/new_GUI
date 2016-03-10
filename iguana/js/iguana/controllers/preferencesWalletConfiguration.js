'use strict';

angular.module('iguanaApp.controllers').controller('preferencesWalletConfiguration',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){

   this.availableWalletConfig = [{
      name: 'Option 1-1',
      code: '1-1'
   }];

   this.save = function(code) {
      $rootScope.app_config.wallet.settings.wconfig = code;
      
      go.information();
        
      $timeout(function() {
        $scope.$apply();
      }, 50);
   };
  
  });