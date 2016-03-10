'use strict';

angular.module('iguanaApp.controllers').controller('signupController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){
  
   $scope.passphraseConfirm = "";
   $scope.firstStep;
   $scope.passphrase = pphgen.GeneratePassPhrase();
   $scope.username = "";
   $scope.password = "";
   $scope.errors = "";

   $scope.generatePassword = function(){
       $scope.passphrase = pphgen.GeneratePassPhrase();
   };
   
   $scope.backToLogin = function(){
       $rootScope.go('logIn');
   };
   
   $scope.signup = function() {
      $scope.firstStep = false;

    var nacl_request_signup = angular.toJson({
      "agent": "SuperNET", 
      "method": "login", 
      "handle": $scope.username, 
      "password": $scope.password, 
      "passphrase": $scope.passphrase
    });

    if ($scope.username == undefined || $scope.password == undefined || $scope.passphrase == undefined) {
      $scope.response = 'Please input all required data';
    } else {
      naclAPI.makeRequest(nacl_request_signup, function(request, response) {
        if (response.data.result == "success") {
          $scope.response = response.data;
          console.info("SuperNet login Response: ");
          console.info(response.data);

          var profile = Profile.create();

          profile.credentials = {
           "btc_addr": [response.data.BTC],
           "contacts": []
          }; 

          storageService.deleteProfile();

          storageService.storeNewProfile(profile, function(err) {
           if (err) {
             $log.debug('error store new profile : ', err);
             return;
           } else {
             $log.debug('store new Profile');

             $timeout(function(){
                go.logInPage();
              }, 50);
           }
         });
        }
      });
    }
   };

  });