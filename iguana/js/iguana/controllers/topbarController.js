'use strict';

angular.module('iguanaApp.controllers').controller('topbarController', 
  function(go, $state, $log, $rootScope, $timeout, naclAPI, storageService) { 

  $rootScope.check_activeHandle();

  this.logout = function() {
    console.info("logout...");
    naclAPI.makeRequest($rootScope.nacl_request.logout, function(request, response) {
      console.info("SuperNET logout Response:");
      console.info(response);
      $rootScope.activeHandle = null;
      $rootScope.account.root.isLoggedin=false;
      $rootScope.account.root.rpcOK=false;
      // storageService.deleteProfile(function(err) {
      //   if (err) {
      //     $log.debug('deleteProfile error: ', err);
      //     return;
      //   }
      // });
      
      $timeout(function() {
        go.logInPage();
      }, 50);
    });
  };

  this.goHome = function() {
    go.walletHome();
  };

  this.goPreferences = function() {
    go.preferences();
  };
  
  this.showFavorites = function(peer) {
    if(peer)
      $rootScope.showPeerFavorites = false;
  };
  
});