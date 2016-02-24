'use strict';

angular.module('iguanaApp.controllers').controller('logInController',
  function($rootScope, $scope, $state, $http, naclAPI, pphgen, go){

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

  if ($rootScope.activeHandle) {
    go.walletHome();
  }

  $scope.pass_phrase = pphgen.GeneratePassPhrase();
  
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
      "passphrase": $scope.pass_phrase
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
          go.walletHome();
        }
      });
    }

  }
});