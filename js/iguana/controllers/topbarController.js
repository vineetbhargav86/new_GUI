'use strict';

angular.module('iguanaApp.controllers').controller('topbarController', function(go, $rootScope) { 

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