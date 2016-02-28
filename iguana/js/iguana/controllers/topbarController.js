'use strict';

angular.module('iguanaApp.controllers').controller('topbarController', 
  function(go, $state, $log, $rootScope, $timeout, naclAPI, storageService) { 

  $rootScope.checkProfile();

  this.logout = function() {
    console.info("logout...");
    naclAPI.makeRequest($rootScope.nacl_request.logout, function(request, response) {
      console.info("SuperNET logout Response:");
      console.info(response);
      storageService.deleteProfile(function(err) {
        if (err) {
          $log.debug('deleteProfile error: ', err);
          return;
        }
      });
      
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
  
  this.changeFavorite = function(){
    $rootScope.peerFavorites = this.peerFavorites;
  };
  
});