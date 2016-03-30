'use strict';

angular.module('iguanaApp.controllers').controller('preferencesAliasController',
  function($scope, $rootScope, $timeout, $log, $state, go, storageService) {

   this.save = function() {
      var self = this;
      
      $log.debug("saving...");
      
      $rootScope.app_config.aliasFor = self.alias;

      $log.debug('app_config: ', $rootScope.app_config);

      storageService.storeConfig($rootScope.app_config, function(err) {
        if (err) {
          $log.debug('storeConfig error: ', err);
          return;
        }
        
        $log.debug('Alias Updated');
        
        $timeout(function(){
          $state.go('preferences');
        }, 50);
      });
   };
    
});