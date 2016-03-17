'use strict';

angular.module('iguanaApp.controllers').controller('logInController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){

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

  // storageService.getProfile(function(err, profile){
  //   if (err) {
  //     $log.debug('getProfile error:', err);
  //     return;
  //   } else if (!profile) {
  //     $log.debug('Profile not exists');

  //     profile = Profile.create();

  //     storageService.storeNewProfile(profile, function(err) {
  //       if (err) {
  //         $log.debug('error store new profile : ', err);
  //         return;
  //       } else {
  //         $log.debug('store new Profile');
  //       }
  //     });
  //   } else {
  //     $log.debug('Profile exists');
  //   }
  // });

  $scope.remember = false;

  $scope.show = function() {
    $log.debug("remember: ", $scope.remember);
  };
  
  this.signup = function(){
    $rootScope.go('signup');
  };
  
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
      "passphrase": $scope.passphrase
    });

    if ($scope.username == undefined || $scope.password == undefined || $scope.passphrase == undefined) {
      $scope.response = 'Please input all required data';
    } else {
      naclAPI.makeRequest(nacl_request_login, function(request, response) {
        if (response.data.result == "success") {
          $scope.response = response.data;
          $log.debug("SuperNet login Response: ");
          $log.debug(response.data);
          $rootScope.activeHandle = response.data.handle;
          $log.debug('login page - activeHandle: ' + $rootScope.activeHandle);

          storageService.getProfile(function(err, profile) {
            if (err) {
              $log.debug('getProfile error:', err);
              return;
            } else if (!profile) {
              profile = Profile.create();
              profile.credentials = {
               "handle": response.data.handle,
               "btcd": response.data.BTCD,
               "btc": response.data.BTC,
               "btc_addr": [response.data.BTCD],
               "contacts": []
              };

              storageService.storeNewProfile(profile, function(err) {
                if (err) {
                  $log.debug('error store new profile : ', err);
                  return;
                } else {
                  $log.debug('store new Profile: ', profile);
                }
              });
            }
              
            if ($scope.remember) {
              profile.credentials.username = $scope.username;
              profile.credentials.password = $scope.password;
              profile.credentials.passphrase = $scope.passphrase;
              $log.debug("remember: ", $scope.remember);
            }
            
            storageService.storeProfile(profile, function(err) {
              if (err) {
                $log.debug('error store new profile : ', err);
                return;
              } else {
                $log.debug('store new Profile: ', profile);
              }
            });
          });

          // storageService.getProfile(function(err, profile) {
          //   if (err) {
          //     $log.debug('getProfile error:', err);
          //     return;
          //   } else if (profile.credentials.handle == undefined) {
          //     profile.credentials.handle = $scope.username;
          //     profile.credentials.btc_addr = [response.data.BTC];
          //     profile.credentials.contacts = [];
          //     $log.debug("init contacts", profile.credentials.contacts)
              
          //     storageService.storeProfile(profile, function(err) {
          //       if (err) {
          //         $log.debug('storeProfile error: ', err);
          //         return;
          //       } else {
          //         $log.debug('profile updated');
          //       }
          //     });
          //   }

            $timeout(function(){
              go.walletHome();
            }, 50);
          // });
        }
      });
    }
  }

  $scope.registrate = function() {
    $log.debug('go to signup');
    $state.go('signup');
  };
});