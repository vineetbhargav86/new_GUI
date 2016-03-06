'use strict';

angular.module('iguanaApp.controllers').controller('preferencesUnitController',
  function($scope, $rootScope, $timeout, $log, go, storageService) {
    // var config = configService.getSync();
    // this.unitName = config.wallet.settings.unitName;
    this.unitOpts = [
      // TODO : add Satoshis to bitcore-wallet-client formatAmount()
      // {
      //     name: 'Satoshis (100,000,000 satoshis = 1BTC)',
      //     shortName: 'SAT',
      //     value: 1,
      //     decimals: 0,
      //     code: 'sat',
      //   }, 
      // {
      //   name: 'bits (1,000,000 bits = 1BTC)',
      //   shortName: 'bits',
      //   value: 100,
      //   decimals: 2,
      //   code: 'bit',
      // }
      // TODO : add mBTC to bitcore-wallet-client formatAmount()
      // ,{
      //   name: 'mBTC (1,000 mBTC = 1BTC)',
      //   shortName: 'mBTC',
      //   value: 100000,
      //   decimals: 5,
      //   code: 'mbtc',
      // }
       {
        name: 'Bitcoin',
        shortName: 'BTC',
        value: 100000000,
        decimals: 8,
        code: 'btc',
      }
      , {
        name: 'BitcoinDark',
        shortName: 'BTCD',
        value: 100000000,
        decimals: 8,
        code: 'btcd',
      }
    ];

    this.save = function(newUnit) {
      $rootScope.app_config.wallet.settings.unitName = newUnit.shortName; 
      $rootScope.app_config.wallet.settings.unitToSatoshi = newUnit.value;
      $rootScope.app_config.wallet.settings.unitDecimals = newUnit.decimals;
      $rootScope.app_config.wallet.settings.unitCode = newUnit.code;

      this.unitName = newUnit.shortName;

      $log.debug('app_config: ', $rootScope.app_config);

    storageService.storeConfig($rootScope.app_config, function(err) {
      if (err) {
        $log.debug('storeConfig Unit error: ', err);
      }
      
      $log.debug('UnitUpdated');
      
      go.preferences();
      
      $timeout(function() {
        $scope.$apply();
      }, 100);
    });
      

    };
  });