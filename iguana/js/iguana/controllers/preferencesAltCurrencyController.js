'use strict';

angular.module('iguanaApp.controllers').controller('preferencesAltCurrencyController',
  function($scope, $rootScope, $timeout, $log, lodash, go, storageService) {
    this.hideAdv = true;
    this.hidePriv = true;
    this.hideSecret = true;
    this.error = null;
    this.success = null;

    //var config = configService.getSync();

    this.selectedAlternative = {
      name: $rootScope.app_config.wallet.settings.alternativeName,
      isoCode: $rootScope.app_config.wallet.settings.alternativeIsoCode
    };

    this.alternativeOpts = [this.selectedAlternative]; //default value

    var self = this;
    // rateService.whenAvailable(function() {
    //   self.alternativeOpts = rateService.listAlternatives();
    //   lodash.remove(self.alternativeOpts, function(n) {
    //     return n.isoCode == 'BTC';
    //   });

    //   for (var ii in self.alternativeOpts) {
    //     if (config.wallet.settings.alternativeIsoCode === self.alternativeOpts[ii].isoCode) {
    //       self.selectedAlternative = self.alternativeOpts[ii];
    //     }
    //   }
    //   $scope.$digest();
    // });


    this.save = function(newAltCurrency) {
      $rootScope.app_config = {
        wallet: {
          settings: {
            alternativeName: newAltCurrency.name,
            alternativeIsoCode: newAltCurrency.isoCode,
          }
        }
      };

      this.selectedAlternative = {
        name: newAltCurrency.name,
        isoCode: newAltCurrency.isoCode,
      };

      $log.debug('app_config: ', $rootScope.app_config);

    storageService.storeConfig($rootScope.app_config, function(err) {
      if (err) {
        $log.debug('storeConfig AltCurrency error: ', err);
      }
      
      $log.debug('AltCurrencyUpdated');
      
      go.preferences();
      
      $timeout(function() {
        $scope.$apply();
      }, 100);
    });
      
    };


  });