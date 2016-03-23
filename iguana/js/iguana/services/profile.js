


'use strict';
angular.module('iguanaApp.services')
  .factory('profileService', function($rootScope,$timeout) {
/**
 * Profile
 *
 * credential: array of OBJECTS
 */
 var root=this;
root.Profile= {
  version : '1.0.0',
  credentials:{}
  
};


root.create = function(opts) {
  opts = opts || {};

  var x =root.Profile;
  x.createdOn = Date.now();
  x.credentials = opts.credentials || {};
  x.disclaimerAccepted = false;
  x.balance={};
  root.Profile=x;
  return x;
};

root.fromObj = function(obj) {
  var x = root.Profile;

  x.createdOn = obj.createdOn;
  x.credentials = obj.credentials;
  x.disclaimerAccepted = obj.disclaimerAccepted;
  if(obj.balance){
        x.balance=obj.balance;
  }

   if (x.credentials[0] && typeof x.credentials[0] !== 'object')
   {
       throw ("credentials should be an object");
       }
root.Profile=x;

  return x;
};

root.fromString = function(str) {
  return root.fromObj(JSON.parse(str));
};

root.toObj = function() {
  return JSON.stringify(root.Profile);
};



  return root;
  });