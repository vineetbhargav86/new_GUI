'use strict';

angular.module('iguanaApp.controllers').controller('preferencesEmailController',
  function($scope, $rootScope, $log, $timeout, go, storageService) {

  this.save = function(form) {
    var self = this;

    this.error = null;

    this.saving = true;

    $rootScope.app_config.email = self.email;

    storageService.storeConfig($rootScope.app_config, function(err) {
      if (err) {
        $log.debug('storeConfig error: ', err);
        return;
      }

      $log.debug('email: ', self.email);
      
      $log.debug('EmailSettingUpdated');
      
      $timeout(function(){
        self.saving = false;
        go.preferences();
      }, 50);
    });
    
    // $scope.$emit('Local/EmailSettingUpdated', self.email, function() {
    //   self.saving = false;
    //   go.path('preferences');
    // });
  };
});