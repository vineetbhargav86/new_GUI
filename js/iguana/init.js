
'use strict';

var modules = [
  'ui.router',
  'angularMoment',
  'mm.foundation',
  'monospaced.qrcode',
  'gettext',
  'ngLodash',
  'uiSwitch',
  'iguanaApp.filters',
  'iguanaApp.services',
  'iguanaApp.controllers',
  'iguanaApp.directives',
  'iguanaApp.addons'
];

var iguanaApp = window.iguanaApp = angular.module('iguanaApp', modules);

function gettext(str){
    return str;
    
}

angular.module('iguanaApp.filters', []);
angular.module('iguanaApp.services', []);
angular.module('iguanaApp.controllers', []);
angular.module('iguanaApp.directives', []);
angular.module('iguanaApp.addons', []);


var unsupported, isaosp;

if (window && window.navigator) {
  var rxaosp = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
  isaosp = (rxaosp && rxaosp[1] < 537);
  if (!window.cordova && isaosp)
    unsupported = true;
  if (unsupported) {
    window.location = '#/unsupported';
  }
}

/*

'use strict';
angular.module('iguanaApp.services')
  .factory('uxLanguage', function languageService($log, lodash, gettextCatalog, amMoment, configService) {
    var root = {};

    root.availableLanguages = [{
      name: 'English',
      isoCode: 'en',
    }, {
      name: 'Français',
      isoCode: 'fr',
    }, {
      name: 'Deutsch',
      isoCode: 'de',
    }, {
      name: 'Español',
      isoCode: 'es',
    }, {
      name: '日本語',
      isoCode: 'ja',
      useIdeograms: true,
    }, {
      name: 'Pусский',
      isoCode: 'ru',
    }];

    root.currentLanguage = null;

    root._detect = function(cb) {

      var userLang, androidLang;
      if (navigator && navigator.globalization) {

        navigator.globalization.getPreferredLanguage(function(preferedLanguage) {
          // works for iOS and Android 4.x
          userLang = preferedLanguage.value;
          userLang = userLang ? (userLang.split('-', 1)[0] || 'en') : 'en';
          // Set only available languages
          userLang = root.isAvailableLanguage(userLang);
          return cb(userLang);
        });
      } else {
        // Auto-detect browser language
        userLang = navigator.userLanguage || navigator.language;
        userLang = userLang ? (userLang.split('-', 1)[0] || 'en') : 'en';
        // Set only available languages
        userLang = root.isAvailableLanguage(userLang);
        return cb(userLang);
      }
    };

    root.isAvailableLanguage = function(userLang) {
      return lodash.find(root.availableLanguages, {
        'isoCode': userLang
      }) ? userLang : 'en';
    };

    root._set = function(lang) {
      $log.debug('Setting default language: ' + lang);
      gettextCatalog.setCurrentLanguage(lang);
      amMoment.changeLocale(lang);
      root.currentLanguage = lang;
    };

    root.getCurrentLanguage = function() {
      return root.currentLanguage;
    };

    root.getCurrentLanguageName = function() {
      return root.getName(root.currentLanguage);
    };

    root.getCurrentLanguageInfo = function() {
      return lodash.find(root.availableLanguages, {
        'isoCode': root.currentLanguage
      });
    };

    root.getLanguages = function() {
      return root.availableLanguages;
    };

    root.init = function() {
      root._detect(function(lang) {
        root._set(lang);
      });
    };

    root.update = function(cb) {
      var userLang = configService.getSync().wallet.settings.defaultLanguage;

      if (!userLang) {

        root._detect(function(lang) {
          userLang = lang;

          if (userLang != root.currentLanguage) {
            root._set(lang);
          }
          return cb(userLang);
        });
      } else {
        if (userLang != root.currentLanguage) {
          root._set(userLang);
        }
        return cb(userLang);
      }
    };

    root.getName = function(lang) {
      return lodash.result(lodash.find(root.availableLanguages, {
        'isoCode': lang
      }), 'name');
    };

    return root;
  });
  */
//Setting up route
angular
  .module('iguanaApp')
  .config(function( $stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/');

    //$logProvider.debugEnabled(true);
    /*$provide.decorator('$log', ['$delegate', 'isDevel',
      function($delegate, isDevel) {
        var historicLog = historicLogProvider.$get();

        ['debug', 'info', 'warn', 'error', 'log'].forEach(function(level) {
          if (isDevel && level == 'error') return;

          var orig = $delegate[level];
          $delegate[level] = function() {
            if (level == 'error')
              console.log(arguments);

            var args = [].slice.call(arguments);
            if (!Array.isArray(args)) args = [args];
            args = args.map(function(v) {
              try {
                if (typeof v == 'undefined') v = 'undefined';
                if (!v) v = 'null';
                if (typeof v == 'object') {
                  if (v.message)
                    v = v.message;
                  else
                    v = JSON.stringify(v);
                }
                // Trim output in mobile
                if (window.cordova) {
                  v = v.toString();
                  if (v.length > 300) {
                    v = v.substr(0, 297) + '...';
                  }
                }
              } catch (e) {
                console.log('Error at log decorator:', e);
                v = 'undefined';
              }
              return v;
            });
            try {
              if (window.cordova)
                console.log(args.join(' '));
              historicLog.add(level, args.join(' '));
              orig.apply(null, args);
            } catch (e) {
              console.log('ERROR (at log decorator):', e, args[0]);
            }
          };
        });
        return $delegate;
      }
    ]);*/

    // whitelist 'chrome-extension:' for chromeApp to work with image URLs processed by Angular
    // link: http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page?lq=1
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);

    $stateProvider
      .state('translators', {
        url: '/translators',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/translators.html'
          }
        }
      })
      .state('disclaimer', {
        url: '/disclaimer',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/disclaimer.html',
          }
        }
      })
      .state('walletHome', {
        url: '/',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/walletHome.html',
          },
        }
      })
      .state('unsupported', {
        url: '/unsupported',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/unsupported.html'
          }
        }
      })
      .state('payment', {
        url: '/uri-payment/:data',
        templateUrl: 'views/paymentUri.html',
        views: {
          'main': {
            templateUrl: 'views/paymentUri.html',
          },
        },
        needProfile: true
      })
      .state('selectWalletForPayment', {
        url: '/selectWalletForPayment',
        controller: 'walletForPaymentController',
        needProfile: true
      })
      .state('join', {
        url: '/join',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/join.html'
          },
        }
      })
      .state('import', {
        url: '/import',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/import.html'
          },
        }
      })
      .state('importProfile', {
        url: '/importProfile',
        templateUrl: 'views/importProfile.html',
        needProfile: false
      })
      .state('importLegacy', {
        url: '/importLegacy',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/importLegacy.html',
          },
        }

      })
      .state('create', {
        url: '/create',
        templateUrl: 'views/create.html',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/create.html'
          },
        }
      })
      .state('copayers', {
        url: '/copayers',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/copayers.html'
          },
        }
      })
      .state('preferences', {
        url: '/preferences',
        templateUrl: 'views/preferences.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferences.html',
          },
        }
      })
      .state('preferencesLanguage', {
        url: '/preferencesLanguage',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesLanguage.html'
          },
        }
      })
      .state('preferencesUnit', {
        url: '/preferencesUnit',
        templateUrl: 'views/preferencesUnit.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesUnit.html'
          },
        }
      })
      .state('preferencesFee', {
        url: '/preferencesFee',
        templateUrl: 'views/preferencesFee.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesFee.html'
          },
        }
      })
      // .state('uriglidera', {
      //   url: '/uri-glidera?code',
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/glideraUri.html'
      //     },
      //   }
      // })
      // .state('glidera', {
      //   url: '/glidera',
      //   walletShouldBeComplete: true,
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/glidera.html'
      //     },
      //   }
      // })
      // .state('buyGlidera', {
      //   url: '/buy',
      //   walletShouldBeComplete: true,
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/buyGlidera.html'
      //     },
      //   }
      // })
      // .state('sellGlidera', {
      //   url: '/sell',
      //   walletShouldBeComplete: true,
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/sellGlidera.html'
      //     },
      //   }
      // })
      // .state('preferencesGlidera', {
      //   url: '/preferencesGlidera',
      //   walletShouldBeComplete: true,
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/preferencesGlidera.html'
      //     },
      //   }
      // })
      .state('preferencesAdvanced', {
        url: '/preferencesAdvanced',
        templateUrl: 'views/preferencesAdvanced.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesAdvanced.html'
          },
        }
      })
      .state('preferencesColor', {
        url: '/preferencesColor',
        templateUrl: 'views/preferencesColor.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesColor.html'
          },
        }
      })
      .state('preferencesAltCurrency', {
        url: '/preferencesAltCurrency',
        templateUrl: 'views/preferencesAltCurrency.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesAltCurrency.html'
          },
        }
      })
      .state('preferencesAlias', {
        url: '/preferencesAlias',
        templateUrl: 'views/preferencesAlias.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesAlias.html'
          },

        }
      })
      .state('preferencesEmail', {
        url: '/preferencesEmail',
        templateUrl: 'views/preferencesEmail.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesEmail.html'
          },

        }
      })
      .state('preferencesBwsUrl', {
        url: '/preferencesBwsUrl',
        templateUrl: 'views/preferencesBwsUrl.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesBwsUrl.html'
          },

        }
      })
      .state('preferencesHistory', {
        url: '/preferencesHistory',
        templateUrl: 'views/preferencesHistory.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesHistory.html'
          },

        }
      })
      .state('deleteWords', {
        url: '/deleteWords',
        templateUrl: 'views/preferencesDeleteWords.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesDeleteWords.html'
          },
        }
      })
      // .state('delete', {
      //   url: '/delete',
      //   templateUrl: 'views/preferencesDeleteWallet.html',
      //   walletShouldBeComplete: true,
      //   needProfile: true,
      //   views: {
      //     'main': {
      //       templateUrl: 'views/preferencesDeleteWallet.html'
      //     },
      //   }
      // })
      .state('preferencesPeerMngmt', {
        url: '/preferencesPeerMngmt',
        templateUrl: 'views/preferencesPeerMngmt.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesPeerMngmt.html'
          },
        }
      })
      .state('information', {
        url: '/information',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesInformation.html'
          },
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/preferencesAbout.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesAbout.html'
          },
        }
      })
      .state('logs', {
        url: '/logs',
        templateUrl: 'views/preferencesLogs.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesLogs.html'
          },
        }
      })
      .state('export', {
        url: '/export',
        templateUrl: 'views/export.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/export.html'
          },
        }
      })
      .state('paperWallet', {
        url: '/paperWallet',
        templateUrl: 'views/paperWallet.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/paperWallet.html'
          },
        }
      })
      .state('backup', {
        url: '/backup',
        templateUrl: 'views/backup.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/backup.html'
          },
        }
      })
      .state('preferencesGlobal', {
        url: '/preferencesGlobal',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesGlobal.html',
          },
        }
      })
      .state('termOfUse', {
        url: '/termOfUse',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/termOfUse.html',
          },
        }
      })
      .state('warning', {
        url: '/warning',
        controller: 'warningController',
        templateUrl: 'views/warning.html',
        needProfile: false
      })
      .state('add', {
        url: '/add',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/add.html'
          },
        }
      })
      .state('cordova', {
        url: '/cordova/:status/:fromHome/:fromDisclaimer/:secondBackButtonPress',
        views: {
          'main': {
            controller: function($rootScope, $state, $stateParams, $timeout, go, isCordova, gettextCatalog) {

              switch ($stateParams.status) {
                case 'resume':
                  $rootScope.$emit('Local/Resume');
                  break;
                case 'backbutton':

                  if ($stateParams.fromDisclaimer == 'true')
                    navigator.app.exitApp();

                  if (isCordova && $stateParams.fromHome == 'true' && !$rootScope.modalOpened) {
                    if ($stateParams.secondBackButtonPress == 'true') {
                      navigator.app.exitApp();
                    } else {
                      window.plugins.toast.showShortBottom(gettextCatalog.getString('Press again to exit'));
                    }
                  } else {
                    $rootScope.$emit('closeModal');
                  }
                  break;
              };
              $timeout(function() {
                $rootScope.$emit('Local/SetTab', 'walletHome', true);
              }, 100);
              go.walletHome();
            }
          }
        },
        needProfile: false
      });
  })
  .run(function($rootScope, $state, $log, isCordova, $timeout) {
    FastClick.attach(document.body);

    //uxLanguage.init();
    $state.transitionTo('walletHome');
    
    // Register URI handler, not for mobileApp
    

/// Step 3
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      
      /*if (!profileService.profile && toState.needProfile) {
        // Give us time to open / create the profile
        event.preventDefault();
        // Try to open local profile
        $state.transitionTo('disclaimer');
        $timeout(function(){
          console.log("copay auto create wallet call");
          $log.debug('No profile... redirecting');
              //$state.transitionTo('disclaimer');
              //$state.transitionTo('walletHome');
              //go.walletHome();
        });
      }


      if (!animationService.transitionAnimated(fromState, toState)) {
        event.preventDefault();
        // Time for the backpane to render
        setTimeout(function() {
          $state.transitionTo(toState);
        }, 50);
      }*/
    });
  });

'use strict';

angular.module('iguanaApp.services').factory('nodeWebkit', function nodeWebkitFactory() {
  var root = {};

  var isNodeWebkit = function() {
    var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
    if(isNode) {
      try {
        return (typeof require('nw.gui') !== "undefined");
      } catch(e) {
        return false;
      }
    }
  };

  root.isDefined = function() {
    return isNodeWebkit();
  };

  root.readFromClipboard = function() {
    if (!isNodeWebkit()) return;
    var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();
    return clipboard.get();
  };

  root.writeToClipboard = function(text) {
    if (!isNodeWebkit()) return;
    var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();
    return clipboard.set(text);
  };

  root.openExternalLink = function(url) {
    if (!isNodeWebkit()) return;
    var gui = require('nw.gui');
    return gui.Shell.openExternal(url);
  };

  return root;
});

'use strict';

angular.module('iguanaApp.services').factory('isChromeApp', function(nodeWebkit) {
  return !!(window.chrome && chrome.runtime && chrome.runtime.id && !nodeWebkit.isDefined());
});

'use strict';

angular.module('iguanaApp.services').value('isCordova',  window.cordova ? true : false);

'use strict';

angular.module('iguanaApp.services').factory('isDevel', function(nodeWebkit, isChromeApp, isMobile) {
  return !isMobile.any() && !isChromeApp && !nodeWebkit.isDefined();
});

'use strict';

// Detect mobile devices
var isMobile = {
  Android: function() {
    return !!navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return !!navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return !!navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return !!navigator.userAgent.match(/IEMobile/i);
  },
  Safari: function() {
    return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


angular.module('iguanaApp.services').value('isMobile', isMobile);

 window.version="0.0.1";
 window.commitHash="1";

'use strict';
angular.module('iguanaApp.services')
  .factory('logHeader', function($log, isChromeApp, isCordova, nodeWebkit) {
    $log.info('Starting Iguana v' + window.version + ' #' + window.commitHash);
    //$log.info('Client: isCordova:', isCordova, 'isChromeApp:', isChromeApp, 'isNodeWebkit:', nodeWebkit.isDefined());
    $log.info('Navigator:', navigator.userAgent);
    return {};
  });


'use strict';

angular.module('iguanaApp.controllers').controller('disclaimerController',
  function($scope, $timeout, $log, profileService, isCordova, storageService, applicationService, gettextCatalog, uxLanguage, go) {
    var self = this;
    self.tries = 0;
    console.log("Disclaimer controller called");
/*
    var create = function(noWallet) {
      $scope.creatingProfile = true;
      profileService.create({
        noWallet: noWallet
      }, function(err) {

        if (err) {
          $log.warn(err);
          $scope.error = err;
          $scope.$apply();
          $timeout(function() {
            $log.warn('Retrying to create profile......');
            if (self.tries == 3) {
              self.tries == 0;
              create(true);
            } else {
              self.tries += 1;
              create(false);
            }
          }, 3000);
        } else {
          $scope.error = "";
          $scope.creatingProfile = false;
        }
      });
    };*/

    this.init = function() {
      //self.lang = uxLanguage.currentLanguage;
      /*
      storageService.getProfile(function(err, profile) {
        if (!profile) create(false);
        else $scope.creatingProfile = false;

        //compatible
        profileService.isDisclaimerAccepted(function(val) {
          if (val) go.walletHome();
        });
      });*/
    };
  });
  
  
  
