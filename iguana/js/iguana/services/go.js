
'use strict';

angular.module('iguanaApp.services').factory('go', 
  function($window, $rootScope, $location, $state, $log, $timeout, storageService, naclAPI, nodeWebkit) {
  var root = {};

  var hideSidebars = function() {
    if (typeof document === 'undefined')
      return;

    var elem = document.getElementById('off-canvas-wrap');
    elem.className = 'off-canvas-wrap';
  };

  var toggleSidebar = function(invert) {
    if (typeof document === 'undefined')
      return;

    var elem = document.getElementById('off-canvas-wrap');
    var leftbarActive = elem.className.indexOf('move-right') >= 0;

    if (invert) {
      if ( !$rootScope.hideNavigation) {
        elem.className = 'off-canvas-wrap move-right';
      }
    } else {
      if (leftbarActive) {
        hideSidebars();
      }
    }
  };

  root.openExternalLink = function(url, target) {
    if (nodeWebkit.isDefined()) {
      nodeWebkit.openExternalLink(url);
    } else {
      target = target || '_blank';
      var ref = window.open(url, target, 'location=no');
    }
  };

  root.path = function(path, cb) {
    $state.transitionTo(path)
      .then(function() {
        if (cb) return cb();
      }, function() {
        if (cb) return cb('animation in progress');
      });
    hideSidebars();
  };

  root.swipe = function(invert) {
    toggleSidebar(invert);
  };

  root.walletHome = function(delayed) {
    //var fc = profileService.focusedClient;
    //if (fc && !fc.isComplete()) {
    //  root.path('copayers');
    //} else {
      root.path('walletHome', function() {
        $rootScope.$emit('Local/SetTab', 'walletHome', true);
      });
    //}
  };


  root.send = function() {
    root.path('walletHome', function() {
      $rootScope.$emit('Local/SetTab', 'send');
    });
  };

  root.addWallet = function() {
    $state.go('add');
  };

  root.preferences = function() {
    $state.go('preferences');
  };

  root.logInPage = function() {
    $state.go('logIn');
  };

  root.preferencesGlobal = function() {
    $state.go('preferencesGlobal');
  };

  root.reload = function() {
    $state.reload();
  };


  // Global go. This should be in a better place TODO
  // We dont do a 'go' directive, to use the benefits of ng-touch with ng-click
  $rootScope.go = function(path) {
    root.path(path);
  };

  $rootScope.openExternalLink = function(url, target) {
    root.openExternalLink(url, target);
  };

  // $rootScope.activeHandle = false;

  $rootScope.nacl_request = {
    activehandle: angular.toJson({
      "agent": "SuperNET", 
      "method": "activehandle"
    }),
    logout: angular.toJson({
      "agent": "SuperNET", 
      "method": "logout"
    })
  };

  $rootScope.activeHandle = null;

  $rootScope.check_activeHandle = function() {
    naclAPI.makeRequest($rootScope.nacl_request.activehandle, function(request, response) {
      $log.debug("SuperNET activeHandle Response:");
      $log.debug(response.data);
      if (response.data.handle) {
        $log.debug("handle is: " + response.data.handle);
        $rootScope.activeHandle = response.data.handle;
      } else {
        $log.debug("no handle exists: " + response.data.handle);
        $timeout(function() {
          root.logInPage();
        }, 50);
      }
    });
  };

  return root;
});
