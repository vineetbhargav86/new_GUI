'use strict';

angular.module('iguanaApp.controllers').controller('preferencesInformationController',
  function($rootScope, $scope, $state, $log, $timeout, isMobile, gettextCatalog, lodash, storageService, go) {
    var base = 'xpub';

    this.init = function() {

      $scope.walletConfig = $rootScope.app_config.wallet.settings.wconfig;

      storageService.getProfile(function(err, profile) {
        if (err) {
          $log.debug('getProfile error:', err);
          return;
        } else {
          $scope.walletName = profile.credentials.handle;
          switch ($rootScope.app_config.wallet.settings.unitCode) {
            case "btc":
              $scope.walletId = profile.credentials.btc;
              break;
            default:
              $scope.walletId = profile.credentials.btcd;
              break;
          }
          // $scope.network = c.network;
          // $scope.addressType = c.addressType || 'P2SH';
          // $scope.derivationStrategy = c.derivationStrategy || 'BIP45';
          // $scope.basePath = basePath;
          // $scope.M = c.m;
          // $scope.N = c.n;
          // $scope.pubKeys = lodash.pluck(c.publicKeyRing, 'xPubKey');
          $scope.addrs = null;
        }
      });

      storageService.getProfile(function(err, profile){
        if (err) {
          $log.debug('getProfile error:', err);
          return;
        } else {
          var last10 = [],
            i = 0,
            e = profile.credentials.btc_addr.pop();
          while (i++ < 10 && e) {
            // e.path = base + e.path.substring(1);
            last10.push(e);
            e = profile.credentials.btc_addr.pop();
          }
          $scope.addrs = last10;
          $log.debug("addrs: ", $scope.addrs);
          $timeout(function() {
            $scope.$apply();
          });
        }
      });
    };

    this.send = function(addr) {
      $log.debug("go to send tab, addr: ", addr);
      $state.go('walletHome', {
        'address': addr,
        'action': 'openSendTab'
      });
    };

    this.sendAddrs = function() {
      var self = this;

      if (isMobile.Android() || isMobile.Windows()) {
        window.ignoreMobilePause = true;
      }

      self.loading = true;

      function formatDate(ts) {
        var dateObj = new Date(ts * 1000);
        if (!dateObj) {
          $log.debug('Error formating a date');
          return 'DateError';
        }
        if (!dateObj.toJSON()) {
          return '';
        }
        return dateObj.toJSON();
      };

      $timeout(function() {
        fc.getMainAddresses({
          doNotVerify: true
        }, function(err, addrs) {
          self.loading = false;
          if (err) {
            $log.warn(err);
            return;
          };

          var body = 'Copay Wallet "' + $scope.walletName + '" Addresses\n  Only Main Addresses are  shown.\n\n';
          body += "\n";
          body += addrs.map(function(v) {
            return ('* ' + v.address + ' ' + base + v.path.substring(1) + ' ' + formatDate(v.createdOn));
          }).join("\n");

          var properties = {
            subject: 'Copay Addresses',
            body: body,
            isHtml: false
          };
          window.plugin.email.open(properties);

          $timeout(function() {
            $scope.$apply();
          }, 1000);
        });
      }, 100);
    };

  });