'use strict';

angular.module('iguanaApp.controllers').controller('preferencesColorController',
  function($scope, $rootScope, $timeout, $log, storageService, go) {
  
  this.colorOpts = [
    '#DD4B39',
    '#F38F12',
    '#FAA77F',
    '#D0B136',
    '#9EDD72',
    '#77DADA',
    '#4A90E2',
    '#484ED3',
    '#9B59B6',
    '#E856EF',
    '#FF599E',
    '#7A8C9E',
  ];

  this.save = function(color) {
    
    $rootScope.app_config.colorFor = color;

    $log.debug('app_config: ', $rootScope.app_config);

    storageService.storeConfig($rootScope.app_config, function(err) {
      if (err) {
        $log.debug('storeConfig Color error: ', err);
      }
      
      $log.debug('ColorUpdated');
      
      go.preferences();
      
      $timeout(function() {
        $scope.$apply();
      }, 100);
    });

  };
});