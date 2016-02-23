
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
  'iguanaApp.addons',
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
      .state('logIn', {
        url: '/',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/logIn.html',
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
        url: '/walletHome',
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
angular.module('iguanaApp.services')
  .factory('naclAPI', function($log, isCordova,$http, nodeWebkit) {

var root={usePexe:false, domain:"http://127.0.0.1",port:"7778"};

root.funcToCallback = {};

root.postCall=function(func) {
  var callback = arguments[arguments.length - 1];
  root.funcToCallback[func] = callback;

  nacl_module.postMessage({
    cmd: func,
    args: Array.prototype.slice.call(arguments, 1, -1)
  });
};

function tagGen(len)
{
    var text = "";
    var charset = "0123456789";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

root.makeRequest = function( request, callback ) {
        // check if tag is already included in request
        request = JSON.parse( request );
        if ( request.tag === undefined ) {
            request = JSON.stringify( request );
            var tag = tagGen(18);
            request = request.substr(0, request.length - 1);
            request = request + ',"tag":"' + tag.toString() + '"}';
        } else {
            request = JSON.stringify( request );
        }
        console.log('Requesting: ' + request);
        /*
         * typeof nacl_module !== 'undefined' will test if pexe is loaded or not
         */
        if(typeof nacl_module !== 'undefined' && root.usePexe){
          root.postCall('iguana', request, function(response){
            console.log('pexe Response is ' + response);
            if(typeof callback === 'function'){
                callback(request, response);
    
            }
        });   
        }else{
            request = JSON.parse( request );
        var usepost=root.useGETRequest(request);
        var url="";
    /*
     * Ajax request will be sent if pexe is not loaded or 
     * if usepexe is set to false
     * (this adds the user the ability to handle how requests are sent)
     */ 
    if(!usepost){
                url=root.returnAJAXPostURL(request);
    $http({
  method: "POST",
  url: url,
  data: JSON.stringify(request)
}).then(function successCallback(response) {
    console.log('$http post Response is ' + JSON.stringify(response));
         if(typeof callback === 'function'){callback(request, response);}
  }, function errorCallback(response) {
     console.log('POST request failed.');
  });
              
                      
}else{
    var url=root.returnAJAXgetURL(request);
    if(url){
      $http({
  method: "GET",
  url: url
  
}).then(function successCallback(response) {
    console.log('$http GET Response is ' + JSON.stringify(response));
        if(typeof callback === 'function'){callback(request, response);}
  }, function errorCallback(response) {
     console.log('POST request failed.');
  });
   
    }
    
}

   }
    };
    root.useGETRequest=function(request){
        if(request.method && (request.method==='apikeypair' || request.method==='setuserid')){
            return false;
        }else{
            return true;
        }
    };
    
    root.returnAJAXPostURL=function(request){
        
        var url=root.domain+":"+root.port;
        if(request.method === undefined){
            console.log("Invalid request.");
            return false;
        }
        console.log("Post Url for request:"+url);
        return url;
    };
    
    root.returnAJAXgetURL=function(request){
        
        var url=root.domain+":"+root.port+"/api/";
        if(request.method === undefined){
            console.log("Invalid request.");
            return false;
        }
        if(request.agent=== undefined){
            url=url+"iguana/";
        }else{
             url=url+request.agent+"/";
        }
        
        url=url+request.method+"/";
        
        for(var i in request){
            if(i==="agent" ||i==="method"){
                continue;
            }
            if(request[i] instanceof Array ){
                for(var x in request[i]){
                    url=url+i+"/"+request[i][x]+"/";
                }
                continue;
            }
            url=url+i+"/"+request[i]+"/";
        }
        console.log("Url generated from request:"+url);
        return url;
    };


 //   $log.info('Navigator:', navigator.userAgent);
    return root;
  });



'use strict';
angular.module('iguanaApp.services')
  .factory('naclCommon', function($log,naclAPI,fileStorageService) {

              var root={
    /** A reference to the NaCl module, once it is loaded. */
    naclModule: null,

    attachDefaultListeners: attachDefaultListeners,
    domContentLoaded: domContentLoaded,
    createNaClModule: createNaClModule,
    hideModule: hideModule,
    removeModule: removeModule,
    logMessage: logMessage,
    updateStatus: updateStatus
  };


// Set to true when the Document is loaded IFF "test=true" is in the query
// string.
var isTest = false;

// Set to true when loading a "Release" NaCl module, false when loading a
// "Debug" NaCl module.
var isRelease = true;
  function isHostToolchain(tool) {
    return tool == 'win' || tool == 'linux' || tool == 'mac';
  }

  /**
   * Return the mime type for NaCl plugin.
   *
   * @param {string} tool The name of the toolchain, e.g. "glibc", "newlib" etc.
   * @return {string} The mime-type for the kind of NaCl plugin matching
   * the given toolchain.
   */
  function mimeTypeForTool(tool) {
    // For NaCl modules use application/x-nacl.
    var mimetype = 'application/x-nacl';
    if (isHostToolchain(tool)) {
      // For non-NaCl PPAPI plugins use the x-ppapi-debug/release
      // mime type.
      if (isRelease)
        mimetype = 'application/x-ppapi-release';
      else
        mimetype = 'application/x-ppapi-debug';
    } else if (tool === 'pnacl') {
      mimetype = 'application/x-pnacl';
    }
    return mimetype;
  }

  /**
   * Check if the browser supports NaCl plugins.
   *
   * @param {string} tool The name of the toolchain, e.g. "glibc", "newlib" etc.
   * @return {bool} True if the browser supports the type of NaCl plugin
   * produced by the given toolchain.
   */
  function browserSupportsNaCl(tool) {
    // Assume host toolchains always work with the given browser.
    // The below mime-type checking might not work with
    // --register-pepper-plugins.
    if (isHostToolchain(tool)) {
      return true;
    }
    var mimetype = mimeTypeForTool(tool);
    return navigator.mimeTypes[mimetype] !== undefined;
  }

  /**
   * Inject a script into the DOM, and call a callback when it is loaded.
   *
   * @param {string} url The url of the script to load.
   * @param {Function} onload The callback to call when the script is loaded.
   * @param {Function} onerror The callback to call if the script fails to load.
   */
  function injectScript(url, onload, onerror) {
    var scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.src = url;
    scriptEl.onload = onload;
    if (onerror) {
      scriptEl.addEventListener('error', onerror, false);
    }
    document.head.appendChild(scriptEl);
  }

  /**
   * Run all tests for this example.
   *
   * @param {Object} moduleEl The module DOM element.
   
  function runTests(moduleEl) {
    console.log('runTests()');
    root.tester = new Tester();

    // All NaCl SDK examples are OK if the example exits cleanly; (i.e. the
    // NaCl module returns 0 or calls exit(0)).
    //
    // Without this exception, the browser_tester thinks that the module has crashed.
    common.tester.exitCleanlyIsOK();

    common.tester.addAsyncTest('loaded', function(test) {
      test.pass();
    });

    if (typeof window.addTests !== 'undefined') {
      window.addTests();
    }

    common.tester.waitFor(moduleEl);
    common.tester.run();
  }
*/
  /**
   * Create the Native Client <embed> element as a child of the DOM element
   * named "listener".
   *
   * @param {string} name The name of the example.
   * @param {string} tool The name of the toolchain, e.g. "glibc", "newlib" etc.
   * @param {string} path Directory name where .nmf file can be found.
   * @param {number} width The width to create the plugin.
   * @param {number} height The height to create the plugin.
   * @param {Object} attrs Dictionary of attributes to set on the module.
   */
  function createNaClModule(name, tool, path, width, height, attrs) {
    var moduleEl = document.createElement('embed');
    moduleEl.setAttribute('name', 'nacl_module');
    moduleEl.setAttribute('id', 'nacl_module');
    moduleEl.setAttribute('width', width);
    moduleEl.setAttribute('height', height);
    moduleEl.setAttribute('path', path);
    moduleEl.setAttribute('src', path + '/' + name + '.nmf');

    // Add any optional arguments
    if (attrs) {
      for (var key in attrs) {
        moduleEl.setAttribute(key, attrs[key]);
      }
    }

    var mimetype = mimeTypeForTool(tool);
    moduleEl.setAttribute('type', mimetype);

    // The <EMBED> element is wrapped inside a <DIV>, which has both a 'load'
    // and a 'message' event listener attached.  This wrapping method is used
    // instead of attaching the event listeners directly to the <EMBED> element
    // to ensure that the listeners are active before the NaCl module 'load'
    // event fires.
    var listenerDiv = document.getElementById('listener');
    listenerDiv.appendChild(moduleEl);
    $log.info('nacl module appended');
    
    // Request the offsetTop property to force a relayout. As of Apr 10, 2014
    // this is needed if the module is being loaded on a Chrome App's
    // background page (see crbug.com/350445).
    moduleEl.offsetTop;

    // Host plugins don't send a moduleDidLoad message. We'll fake it here.
    var isHost = isHostToolchain(tool);
    if (isHost) {
      window.setTimeout(function() {
        moduleEl.readyState = 1;
        moduleEl.dispatchEvent(new CustomEvent('loadstart'));
        moduleEl.readyState = 4;
        moduleEl.dispatchEvent(new CustomEvent('load'));
        moduleEl.dispatchEvent(new CustomEvent('loadend'));
      }, 100);  // 100 ms
    }

    // This is code that is only used to test the SDK.
    if (isTest) {
      var loadNaClTest = function() {
        injectScript('nacltest.js', function() {
          runTests(moduleEl);
        });
      };

      // Try to load test.js for the example. Whether or not it exists, load
      // nacltest.js.
      injectScript('test.js', loadNaClTest, loadNaClTest);
    }
  }

  /**
   * Add the default "load" and "message" event listeners to the element with
   * id "listener".
   *
   * The "load" event is sent when the module is successfully loaded. The
   * "message" event is sent when the naclModule posts a message using
   * PPB_Messaging.PostMessage() (in C) or pp::Instance().PostMessage() (in
   * C++).
   */
  function attachDefaultListeners() {
    var listenerDiv = document.getElementById('listener');
    listenerDiv.addEventListener('load', root.moduleDidLoad, true);
    listenerDiv.addEventListener('message', root.handleMessage, true);
    listenerDiv.addEventListener('error', root.handleError, true);
    listenerDiv.addEventListener('crash', root.handleCrash, true);
      //attachListeners();
    console.log("nacl Listeners attached");
  }

      
      function ArrayBufferToString(buf) { return String.fromCharCode.apply(null, new Uint16Array(buf)); }

// Called by the common.js module.
root.handleMessage=function(message_event) {
  var data = message_event.data;
  if ((typeof(data) === 'string' || data instanceof String)) {
    root.logMessage(data);
    if(data.indexOf("iguana_rpcloop")>-1  || data.indexOf("bind(127.0.0.1)")>-1){
      
      var x='{"agent":"SuperNET","method":"help"}';
      //var x='{"agent":"InstantDEX","method":"apikeypair","exchange":"qq","apikey":"oo","apisecret":"kk"}';
    
 naclAPI.makeRequest(x);
 }
  }
  else if (data instanceof Object)
  {
    var pipeName = data['pipe'];
    if ( pipeName !== undefined )
    {
      // Message for JavaScript I/O pipe
      var operation = data['operation'];
      if (operation == 'write') {
        $('pipe_output').value += ArrayBufferToString(data['payload']);
      } else if (operation == 'ack') {
        root.logMessage(pipeName + ": ack:" + data['payload']);
      } else {
        root.logMessage('Got unexpected pipe operation: ' + operation);
      }
    }
    else
    {
      // Result from a function call.
      var params = data.args;
      var funcName = data.cmd;
      var callback = naclAPI.funcToCallback[funcName];
      if (!callback)
      {
        root.logMessage('Error: Bad message ' + funcName + ' received from NaCl module.');
        return;
      }
      delete naclAPI.funcToCallback[funcName];
      callback.apply(null, params);
    }
  } else {
    root.logMessage('Error: Unknow message `' + data + '` received from NaCl module.');
  }
  
  
};


  /**
   * Called when the NaCl module fails to load.
   *
   * This event listener is registered in createNaClModule above.
   */
  function handleError(event) {
    // We can't use common.naclModule yet because the module has not been
    // loaded.
    var moduleEl = document.getElementById('nacl_module');
    root.updateStatus('ERROR [' + moduleEl.lastError + ']');
    //APPLICATION.pexe="Error encountered";
//    change_app_status();
  }

  /**
   * Called when the Browser can not communicate with the Module
   *
   * This event listener is registered in attachDefaultListeners above.
   */
  function handleCrash(event) {
    if (root.naclModule.exitStatus !== 0) {
              updateStatus('ABORTED [' + root.naclModule.exitStatus + ']');
    } else {
      root.updateStatus('EXITED [' + root.naclModule.exitStatus + ']');
    }
    if (typeof window.handleCrash !== 'undefined') {
      window.handleCrash(root.naclModule.lastError);
    }
    //APPLICATION.pexe="crashed";
//    change_app_status();
  }

  /**
   * Called when the NaCl module is loaded.
   *
   * This event listener is registered in attachDefaultListeners above.
   */
  function moduleDidLoad() {
    root.naclModule = document.getElementById('nacl_module');
    root.updateStatus('RUNNING');
    root.hideModule();
    console.log("nacl module running !!");
    //APPLICATION.pexe="loaded";
//    change_app_status();
  }

  /**
   * Hide the NaCl module's embed element.
   *
   * We don't want to hide by default; if we do, it is harder to determine that
   * a plugin failed to load. Instead, call this function inside the example's
   * "moduleDidLoad" function.
   *
   */
  function hideModule() {
    // Setting common.naclModule.style.display = "None" doesn't work; the
    // module will no longer be able to receive postMessages.
    root.naclModule.style.height = '0';
  }

  /**
   * Remove the NaCl module from the page.
   */
  function removeModule() {
    root.naclModule.parentNode.removeChild(root.naclModule);
    root.naclModule = null;
  }

  /**
   * Return true when |s| starts with the string |prefix|.
   *
   * @param {string} s The string to search.
   * @param {string} prefix The prefix to search for in |s|.
   */
  function startsWith(s, prefix) {
    // indexOf would search the entire string, lastIndexOf(p, 0) only checks at
    // the first index. See: http://stackoverflow.com/a/4579228
    return s.lastIndexOf(prefix, 0) === 0;
  }

  /** Maximum length of logMessageArray. */
  var kMaxLogMessageLength = 7;

  /** An array of messages to display in the element with id "log". */
  var logMessageArray = [];

  /**
   * Add a message to an element with id "log".
   *
   * This function is used by the default "log:" message handler.
   *
   * @param {string} message The message to log.
   */
  function logMessage(message) {
   logMessageArray.push(message);
    if ( logMessageArray.length > kMaxLogMessageLength )
      logMessageArray.shift();

      var node = document.createElement("div");                 // Create a node
      //var dt = new DateTime();
      //var date = dt.formats.pretty.c;

      var textnode = document.createTextNode(message);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      var elm=document.getElementById("log");
      if(elm)
      {elm.appendChild(node);
          }
      //document.getElementById('log').appendChild(message);
              console.log(message);
  }

  /**
   */
  var defaultMessageTypes = {
    'alert': alert,
    'log': logMessage
  };

  /**
   * Called when the NaCl module sends a message to JavaScript (via
   * PPB_Messaging.PostMessage())
   *
   * This event listener is registered in createNaClModule above.
   *
   * @param {Event} message_event A message event. message_event.data contains
   *     the data sent from the NaCl module.
   */
              function isJson(str) {
              try {
              JSON.parse(str);
              } catch (e) {
              return false;
              }
              return true;
              }
              
              function retmsg(msg)
              {
              root.naclModule.postMessage(msg);
              console.log("sent: "+msg);
              }

  function handleMessage(message_event)
              {
              if(isJson(message_event.data))
              {
              console.log("AAAA");
              var request = JSON.parse(message_event.data);
              console.log(request);
              if(request.method == "NxtAPI")
              {
              console.log(request.requestType);
              Jay.request(request.requestType, JSON.parse(request.params), function(ans) {
                          retmsg(ans);
                          })
              }
              else if(request.method == "status")
              {
              retmsg("{'status':'doing alright'}");
              }
              else if(request.method == "signBytes")
              {
              var out = converters.byteArrayToHexString(signBytes(converters.hexStringToByteArray(request.bytes), request.secretPhrase));
              var ret = {};
              ret.signature = out;
              retmsg(JSON.stringify(ret));
              }
              else if(request.method == "createToken")
              {
              var out = createToken(request.data, request.secretPhrase);
              var ret = {};
              ret.token = out;
              retmsg(JSON.stringify(ret));
              }
              else if(request.method == "parseToken")
              {
              var out = parseToken(request.token, request.data);
              retmsg(JSON.stringify(out));
              }
              console.log(request);
              }
              
    if (typeof message_event.data === 'string') {
      for (var type in defaultMessageTypes) {
        if (defaultMessageTypes.hasOwnProperty(type)) {
          if (startsWith(message_event.data, type + ':')) {
            func = defaultMessageTypes[type];
            func(message_event.data.slice(type.length + 1));
            return;
          }
        }
      }
    }

    if (typeof naclExample.handleMessage !== 'undefined') {
      naclExample.handleMessage(message_event);
      return;
    }

    logMessage('Unhandled message: ' + message_event.data);
  }

  /**
   * Called when the DOM content has loaded; i.e. the page's document is fully
   * parsed. At this point, we can safely query any elements in the document via
   * document.querySelector, document.getElementById, etc.
   *
   * @param {string} name The name of the example.
   * @param {string} tool The name of the toolchain, e.g. "glibc", "newlib" etc.
   * @param {string} path Directory name where .nmf file can be found.
   * @param {number} width The width to create the plugin.
   * @param {number} height The height to create the plugin.
   * @param {Object} attrs Optional dictionary of additional attributes.
   */
  function domContentLoaded(name, tool, path, width, height, attrs) {
    // If the page loads before the Native Client module loads, then set the
    // status message indicating that the module is still loading.  Otherwise,
    // do not change the status message.
    fileStorageService.init();
    root.updateStatus('Page loaded.');
    if (!browserSupportsNaCl(tool)) {
      updateStatus(
          'Browser does not support NaCl (' + tool + '), or NaCl is disabled');
    } else if (root.naclModule === null) {
      root.updateStatus('Creating embed: ' + tool);

      // We use a non-zero sized embed to give Chrome space to place the bad
      // plug-in graphic, if there is a problem.
      width = typeof width !== 'undefined' ? width : 200;
      height = typeof height !== 'undefined' ? height : 200;
      root.attachDefaultListeners();
      root.createNaClModule(name, tool, path, width, height, attrs);
    } else {
      // It's possible that the Native Client module onload event fired
      // before the page's onload event.  In this case, the status message
      // will reflect 'SUCCESS', but won't be displayed.  This call will
      // display the current message.
      root.updateStatus('Waiting.');
    }
  }
  
  root.onload=function(){
        var body = document.body;
console.log("init called");
    // The data-* attributes on the body can be referenced via body.dataset.
    if (body.dataset) {
        //var  loadFunction = root.domContentLoaded;
        
        // From https://developer.mozilla.org/en-US/docs/DOM/window.location
        var searchVars = {};
        if (window.location.search.length > 1) {
            var pairs = window.location.search.substr(1).split('&');
            for (var key_ix = 0; key_ix < pairs.length; key_ix++) {
                var keyValue = pairs[key_ix].split('=');
                searchVars[unescape(keyValue[0])] =
                    keyValue.length > 1 ? unescape(keyValue[1]) : '';
            }
        }

        
            var toolchains = body.dataset.tools.split(' ');
            var configs = body.dataset.configs.split(' ');

            var attrs = {};
            if (body.dataset.attrs) {
                var attr_list = body.dataset.attrs.split(' ');
                for (var key in attr_list) {
                    var attr = attr_list[key].split('=');
                    var key = attr[0];
                    var value = attr[1];
                    attrs[key] = value;
                }
            }

            var tc = toolchains.indexOf(searchVars.tc) !== -1 ?
                searchVars.tc : toolchains[0];

            // If the config value is included in the search vars, use that.
            // Otherwise default to Release if it is valid, or the first value if
            // Release is not valid.
            if (configs.indexOf(searchVars.config) !== -1)
                var config = searchVars.config;
            else if (configs.indexOf('Release') !== -1)
                var config = 'Release';
            else
                var config = configs[0];

            var pathFormat = body.dataset.path;
            var path = pathFormat.replace('{tc}', tc).replace('{config}', config);

            root.isTest = searchVars.test === 'true';
            root.isRelease = path.toLowerCase().indexOf('release') !== -1;

            root.domContentLoaded(body.dataset.name, tc, path, body.dataset.width,
                body.dataset.height, attrs);
        
    }
      
  };

  /** Saved text to display in the element with id 'statusField'. */
  root.statusText = 'NO-S)TATUSES';

  /**
   * Set the global status message. If the element with id 'statusField'
   * exists, then set its HTML to the status message as well.
   *
   * @param {string} opt_message The message to set. If null or undefined, then
   *     set element 'statusField' to the message from the last call to
   *     updateStatus.
   */
  
  function updateStatus(opt_message) {
    if (opt_message) {
      root.statusText = opt_message;
    }
    var statusField = document.getElementById('statusField');
    if (statusField) {
      statusField.innerHTML = root.statusText;
              }
  }

  // The symbols to export.
  return root;


  //  return {};
  });

'use strict';

angular.module('iguanaApp.controllers').controller('logInController',
  function($scope, $state, $http, naclAPI, pphgen, go){

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

    var nacl_request = angular.toJson({
      "agent": "SuperNET", 
      "method": "login", 
      "handle": $scope.username, 
      "password": $scope.password, 
      "permanentfile": "path", 
      "passphrase": "sometext"
    });

    if ($scope.username == undefined || $scope.password == undefined) {
      $scope.response = 'Please input all required data';
    } else {
      naclAPI.makeRequest(nacl_request, function(request, response) {
        if (response.data.result == "success") {
          $scope.response = response.data;
          console.info(response.data);
          go.walletHome();
        }
      });
    }

  }
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
  
  
  
