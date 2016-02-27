
'use strict';

angular.module('iguanaApp.services').factory('go', 
  function($window, $rootScope, $location, $state, $log, $timeout, storageService, nodeWebkit) {
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

  $rootScope.app_config = {};

  storageService.getConfig(function(err, config) {
    if (err) {
      $log.debug('getConfig error: ', err);
    } else if (config) {
      $rootScope.app_config = config;
    }
  });

  $rootScope.checkProfile = function() {
    storageService.getProfile(function(err, profile) {
      if (err) {
        $log.debug('getProfile error: ', err);
        return;
      } else if (!profile) {
        $timeout(function() {
          root.logInPage();
        }, 50);
      } else {
        storageService.storeProfile(profile, function(err) {
          if (err) {
            $log.debug('storeProfile error: ', err);
            return;
          } else {
            $log.debug('profile encrypted');
          }
        });
      }
    });
  };

  // $rootScope.check_activeHandle = function() {
  //   naclAPI.makeRequest($rootScope.nacl_request.activehandle, function(request, response) {
  //     console.info("SuperNET activeHandle Response:");
  //     console.info(response.data);
  //     if (response.data.handle) {
  //       console.info("handle is: " + response.data.handle);
  //       $rootScope.activeHandle = response.data.handle;
  //     } else {
  //       console.info("no handle exists: " + response.data.handle);
  //     }
  //   });
  // };



  return root;
});
