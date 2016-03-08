'use strict';

angular.module('iguanaApp.controllers').controller('preferencesLanguageController',
  function($scope, $rootScope, $log, $timeout, go, storageService, uxLanguage) {
    var self = this;
    this.availableLanguages = uxLanguage.getLanguages();

    $log.debug("currentlanguage: ", uxLanguage.getCurrentLanguageName());

    this.save = function(newLang) {

      for(var i =0;i<self.availableLanguages.length;i++){
        if(newLang==self.availableLanguages[i].isoCode){
          $rootScope.app_config.wallet.settings.defaultLanguageName = self.availableLanguages[i].name;
          break;
        }
      }
      
      $rootScope.app_config.wallet.settings.defaultLanguage = newLang;

      $log.debug('app_config: ', $rootScope.app_config);

      storageService.storeConfig($rootScope.app_config, function(err) {
        if (err) {
          $log.debug('storeConfig Lang error: ', err);
        }

        uxLanguage.update(function(lang) {
          $log.debug('LangUpdated: ', lang);
        });
        
        go.preferences();
        
        $timeout(function() {
          $scope.$apply();
        }, 50);
      });
    
    };
  });
