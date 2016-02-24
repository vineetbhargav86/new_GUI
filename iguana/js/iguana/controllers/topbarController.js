'use strict';

angular.module('iguanaApp.controllers').controller('topbarController', 
  function(go, $state, $rootScope, naclAPI) { 

  console.info('topbarController - activeHandle: ' + $rootScope.activeHandle);

  if (! $rootScope.activeHandle) {
    go.logInPage();
  }

  this.logout = function() {
    console.info("logout...");
    naclAPI.makeRequest($rootScope.nacl_request.logout, function(request, response) {
      console.info("SuperNET logout Response:");
      console.info(response);
      $rootScope.activeHandle = false;
      go.logInPage();
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