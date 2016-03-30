'use strict';

angular.module('iguanaApp.controllers').controller('logInController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService,testVersionRPC,rpcService, profileService){

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
  $scope.errorOn = false;    
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
      $scope.errorText = "Please input all required data.";
      $scope.errorOn = true;    
    } else {
      naclAPI.makeRequest(nacl_request_login, function(request, response) {
        if (response.data.result === "success") {
          $scope.response = response.data;
          $log.debug("SuperNet login Response: ");
          $log.debug(response.data);
          $rootScope.activeHandle = response.data.handle;
          $log.debug('login page - activeHandle: ' + $rootScope.activeHandle);
           /*
           * Implementing RPC cred init
           */
          testVersionRPC.initRPC($scope.username,$scope.password,$scope.passphrase,"http");
          
          var profile = profileService.create();
              profile.credentials = {
               "handle": response.data.handle,
               //"btcd": response.data.BTCD,
               //"btc": response.data.BTC,
               "addresses": [response.data.BTCD],
               "contacts": [],
               "balances":[],
               "pubkey":""
              };

              
            if ($scope.remember) {
              /*profile.credentials.username = $scope.username;
              profile.credentials.password = $scope.password;
              profile.credentials.passphrase = $scope.passphrase;*/
              $log.debug("remember: ", $scope.remember);
            }
            
            
            storageService.storeProfile(profile, function(err) {
                if (err) {
                  $log.debug('error store new profile : ', err);
                  $scope.errorText = "Can't store new profile. Please try later.";   
                  $scope.errorOn = true; 
                  return;
                } else {
                  $log.debug('store new Profile: ', profile);
                }
              });
              console.log(profileService.toObj());
              var checkLoggedIN=function(){
               
                   var base=this;
              if (testVersionRPC.action==="waiting") {
                  // do not show anything
                  $timeout(checkLoggedIN, 50);
              }else if( testVersionRPC.action!=="waiting" && testVersionRPC.rpcOK && testVersionRPC.isLoggedin){
                  
              rpcService.checkPassphrase($rootScope.account.root.passPhrase).then(
                        function(response){
                                       $rootScope.account.root.isEncrypted=true;
                if(response.data.error && response.data.error.code === -15){
                   $rootScope.account.root.isEncrypted=false;
                   $scope.errorText= "Wallet is not encrypted, Encrypting wallet!! Please reload wallet client.";
                  $scope.errorOn = true; 
                   rpcService.walletEncrypt($rootScope.account.root.passPhrase).then(
                        function(response){
                            /// to be tested 
                            //console.log(response);
                            //$rootScope.account.walletSend(to,amt,comment);  
                        });
              }else if(response.data.error && response.data.error.code === -14){
                 $rootScope.account.root.passphraseOK=false; 
                 $scope.errorText= "Wrong Passphrase.";
                  $scope.errorOn = true;   
                  
              }else if(response.data.result === null && response.data.error === null){
                  $rootScope.account.root.passphraseOK=true;
                  $rootScope.account.root.isEncrypted=true;
                  if($scope.remember){
                  $rootScope.account.root.isCredSaved=true;
                  }else{
                    $rootScope.account.root.isCredSaved=false;
                    $rootScope.account.root.passPhrase="";
                    }
                    go.walletHome();
              } 
                        });
              
              
              }else {
                //$scope.response = 'Please input all required data';
                //$scope.errorText = testVersionRPC.BTCDErrorMessage+testVersionRPC.BTCErrorMessage;;
                if(testVersionRPC.BTCDErrorMessage==="Authorization Required"){
                   $scope.errorText= "Wrong username and password for BitCoinDark";
                }else if(testVersionRPC.BTCErrorMessage==="Authorization Required"){
                   $scope.errorText= "Wrong username and password for BitCoin";
                }else if(testVersionRPC.BTCErrorMessage==="Bitcoin wallet not active." && testVersionRPC.BTCDErrorMessage==="BitcoinDark wallet not active."){
                  $scope.errorText="Bitcoin or BitcoinDark wallet not active please run any one client";
                  
                }
                $scope.errorOn = true;     
                  //$timeout.cancel(base);
              }   
              };
              checkLoggedIN();
               
          /*storageService.getProfile(function(err, profile) {
            if (err) {
              $log.debug('getProfile error:', err);
              $scope.errorText = "The data you entered did not match our records. Please try again."; 
              $scope.errorOn = true;        
              return;
            } else if (!profile) {
              
            }
             
            
            storageService.storeProfile(profile, function(err) {
              if (err) {
                $log.debug('error store new profile : ', err);
                $scope.errorText = "Can't store new profile. Please try later.";  
                return;
              } else {
                $log.debug('store new Profile: ', profile);
              }
            });
          });*/

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

           /* $timeout(function(){    
              $rootScope.$emit('entered passphrase', $scope.passphrase);    
              go.walletHome();
            }, 50);*/
          // });
        }
      });
    }
  };

  $scope.registrate = function() {
    $log.debug('go to signup');
    $state.go('signup');
  };
});