'use strict';

angular.module('iguanaApp.controllers').controller('signUpController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){

   $scope.username = "";
   $scope.password = "";
   $scope.errors = "";
   $scope.passphrase = pphgen.GeneratePassPhrase();
   
   this.signup = function() {
      var self = this;

    var nacl_request_signup = angular.toJson({
      "agent": "SuperNET", 
      "method": "login", 
      "handle": $scope.username, 
      "password": $scope.password, 
      "passphrase": $scope.passphrase
    });

    if ($scope.username == undefined || $scope.password == undefined) {
      $scope.response = 'Please input all required data';
    } else {
      naclAPI.makeRequest(nacl_request_signup, function(request, response) {
        if (response.data.result == "success") {
          $scope.response = response.data;
          console.info("SuperNet login Response: ");
          console.info(response.data);

          var profile = Profile.create();

          profile.credentials = {
           "passphrase": $scope.passphrase,
           "btc_addr": "addresse",
           "handle": $scope.username, 
           "passphrase": $scope.passphrase
          }; 

          storageService.deleteProfile();

          storageService.storeNewProfile(profile, function(err) {
           if (err) {
             $log.debug('error store new profile : ', err);
             self.errors = err;
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