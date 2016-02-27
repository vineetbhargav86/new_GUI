'use strict';

angular.module('iguanaApp.controllers').controller('versionController', function() {
  this.version = window.version;
  this.commitHash = window.commitHash;
});