'use strict';

angular.module('iguanaApp.controllers').controller('signupController',
  function($rootScope, $scope, $state, $http, $timeout, $log, naclAPI, pphgen, go, storageService){
  
   $scope.username = "";
   $scope.password = "";
   $scope.passphrase = pphgen.GeneratePassPhrase();
   $scope.passphraseConfirm = "";
   $scope.firstStep;
   $scope.generatePassword = function(){
       $scope.passphrase = pphgen.GeneratePassPhrase();
   };
   $scope.backToLogin = function(){
       $rootScope.go('logIn');
   };
   $scope.signup = function() {};

  });