'use strict';

angular.module('iguanaApp.controllers').controller('logInController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){

  $scope.passphrase = null;

  // $scope.check_activeHandle = function() {
  //   console.info("check activeHandle...");
  //   var nacl_request_activehandle = angular.toJson({
  //     "agent": "SuperNET", 
  //     "method": "login"
  //   });
  //   naclAPI.makeRequest(nacl_request_activehandle, function(request, response) {
  //     console.info("SuperNET activeHandle Response:");
  //     console.info(response.data);
  //     if (response.data.handle) {
  //       go.walletHome();
  //     }
  //   });
  // }

  // if ($rootScope.activeHandle) {
  //   go.walletHome();
  // }

  storageService.getProfile(function(err, profile){
    if (err) {
      $log.debug('getProfile error:', err);
      return;
    } else if (!profile) {
      $log.debug('Profile not exists :', profile);

      profile = Profile.create();

      $scope.passphrase = pphgen.GeneratePassPhrase();

      storageService.storeNewProfile(profile, function(err) {
        if (err) {
          $log.debug('error store new profile : ', err);
          return;
        } else {
          $log.debug('store new Profile : ', profile);
        }
      });
    } else {
      $log.debug('Profile exists : ', profile);
      // go.walletHome();
    }
  });
  
  $scope.login = function() {
      
  //var request='{"agent":"SuperNET", "method":"login", "handle":"' + $scope.username + '", "password":"' + $scope.password + '", "permanentfile":"path", "passphrase":"sometext"}';
  /*
    SPNAPI.submitRequest = function(e) {
        if ($scope.username || $scope.password) {
            var request = request;
        } else {
            console.log('request is empty');
            return;
        }
        SPNAPI.makeRequest(request, function(json_req, json_resp) {
           $scope.response = json_resp;
        });
    };
  */

    var nacl_request_login = angular.toJson({
      "agent": "SuperNET", 
      "method": "login", 
      "handle": $scope.username, 
      "password": $scope.password, 
      "permanentfile": "path", 
      "passphrase": $scope.passphrase
    });

    if ($scope.username == undefined || $scope.password == undefined) {
      $scope.response = 'Please input all required data';
    } else {
      naclAPI.makeRequest(nacl_request_login, function(request, response) {
        if (response.data.result == "success") {
          $scope.response = response.data;
          console.info("SuperNet login Response: ");
          console.info(response.data);
          $rootScope.activeHandle = response.data.handle;
          console.info('login page - activeHandle: ' + $rootScope.activeHandle);

          storageService.getProfile(function(err, profile) {
            if (err) {
              $log.debug('getProfile error:', err);
              return;
            } else {
              profile.credentials.handle = $scope.username;
              profile.credentials.permanentfile = "path";
              
              storageService.storeProfile(profile, function(err) {
                if (err) {
                  $log.debug('storeProfile error: ', err);
                } else {
                  $log.debug('profile updated: ', profile);
                }
              });

              $timeout(function(){
                go.walletHome();
              }, 50);
            }
          });
        }
      });
    }

  }
});