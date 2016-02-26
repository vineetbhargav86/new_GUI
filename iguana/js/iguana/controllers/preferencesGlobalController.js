'use strict';

angular.module('iguanaApp.controllers').controller('preferencesGlobalController',
  function($scope, $rootScope, $log) {

  var unwatchSpendUnconfirmed = $scope.$watch('spendUnconfirmed', function(newVal, oldVal) {
    if (newVal == oldVal) return;
    var opts = {
      wallet: {
        spendUnconfirmed: newVal
      }
    };
  });

  var unwatchGlideraEnabled = $scope.$watch('glideraEnabled', function(newVal, oldVal) {
    if (newVal == oldVal) return;
    var opts = {
      glidera: {
        enabled: newVal
      }
    };
  });

  var unwatchGlideraTestnet = $scope.$watch('glideraTestnet', function(newVal, oldVal) {
    if (newVal == oldVal) return;
    var opts = {
      glidera: {
        testnet: newVal
      }
    };
  });

  $scope.$on('$destroy', function() {
    unwatchSpendUnconfirmed();
    unwatchGlideraEnabled();
    unwatchGlideraTestnet();
  });
});