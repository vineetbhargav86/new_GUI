'use strict';

angular.module('iguanaApp.controllers').controller('preferencesFeeController',
  function($rootScope, $scope, $log, $timeout, go, storageService) {

    this.save = function(newFee) {
     $rootScope.app_config.wallet.settings.feeLevel = newFee;
     
      $rootScope.$emit('Local/FeeLevelUpdated', newFee);

       $log.debug('app_config: ', $rootScope.app_config);

      storageService.storeConfig($rootScope.app_config, function(err) {
        if (err) {
          $log.debug('storeConfig Fee error: ', err);
        }
        
        $log.debug('FeeUpdated');
        
        go.preferences();
        
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });
      

    };
  });