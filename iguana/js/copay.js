'use strict';

var modules = [
  'ui.router',
  'angularMoment',
  'mm.foundation',
  'monospaced.qrcode',
  'gettext',
  'ngLodash',
  'uiSwitch',
  'bwcModule',
  'copayApp.filters',
  'copayApp.services',
  'copayApp.controllers',
  'copayApp.directives',
  'copayApp.addons'
];

var copayApp = window.copayApp = angular.module('copayApp', modules);

angular.module('copayApp.filters', []);
angular.module('copayApp.services', []);
angular.module('copayApp.controllers', []);
angular.module('copayApp.directives', []);
angular.module('copayApp.addons', []);


'use strict';

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


//Setting up route
angular
  .module('copayApp')
  .config(function(historicLogProvider, $provide, $logProvider, $stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/');

    $logProvider.debugEnabled(true);
    $provide.decorator('$log', ['$delegate', 'isDevel',
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
    ]);

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
  .run(function($rootScope, $state, $log, uriHandler, isCordova, profileService, $timeout, nodeWebkit, uxLanguage, animationService) {
    FastClick.attach(document.body);

    uxLanguage.init();

    // Register URI handler, not for mobileApp
    if (!isCordova) {
      uriHandler.register();
    }

    if (nodeWebkit.isDefined()) {
      var gui = require('nw.gui');
      var win = gui.Window.get();
      var nativeMenuBar = new gui.Menu({
        type: "menubar"
      });
      try {
        nativeMenuBar.createMacBuiltin("Copay");
      } catch (e) {
        $log.debug('This is not OSX');
      }
      win.menu = nativeMenuBar;
    }

/// Step 3
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      
      if (!profileService.profile && toState.needProfile) {
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
      }
    });
  });

'use strict';

function selectText(element) {
  var doc = document;
  if (doc.body.createTextRange) { // ms
    var range = doc.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = doc.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

  }
}
angular.module('copayApp.directives')
.directive('validAddress', ['$rootScope', 'bitcore', 'profileService',
    function($rootScope, bitcore, profileService) {
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var URI = bitcore.URI;
          var Address = bitcore.Address
          var validator = function(value) {
            if (!profileService.focusedClient)
              return;
            var networkName = profileService.focusedClient.credentials.network;
            // Regular url
            if (/^https?:\/\//.test(value)) {
              ctrl.$setValidity('validAddress', true);
              return value;
            }

            // Bip21 uri
            if (/^bitcoin:/.test(value)) {
              var uri, isAddressValid;
              var isUriValid = URI.isValid(value);
              if (isUriValid) {
                uri = new URI(value);
                isAddressValid = Address.isValid(uri.address.toString(), networkName)
              }
              ctrl.$setValidity('validAddress', isUriValid && isAddressValid);
              return value;
            }

            if (typeof value == 'undefined') {
              ctrl.$pristine = true;
              return;
            }

            // Regular Address
            ctrl.$setValidity('validAddress', Address.isValid(value, networkName));
            return value;
          };


          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.unshift(validator);
        }
      };
    }
  ])
  .directive('validUrl', [

    function() {
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var validator = function(value) {
            // Regular url
            if (/^https?:\/\//.test(value)) {
              ctrl.$setValidity('validUrl', true);
              return value;
            } else {
              ctrl.$setValidity('validUrl', false);
              return value;
            }
          };

          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.unshift(validator);
        }
      };
    }
  ])
  .directive('validAmount', ['configService',
    function(configService) {

      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
          var val = function(value) {
            var settings = configService.getSync().wallet.settings;
            var vNum = Number((value * settings.unitToSatoshi).toFixed(0));

            if (typeof value == 'undefined' || value == 0) {
              ctrl.$pristine = true;
            }

            if (typeof vNum == "number" && vNum > 0) {
              var decimals = Number(settings.unitDecimals);
              var sep_index = ('' + value).indexOf('.');
              var str_value = ('' + value).substring(sep_index + 1);
              if (sep_index > 0 && str_value.length > decimals) {
                ctrl.$setValidity('validAmount', false);
              } else {
                ctrl.$setValidity('validAmount', true);
              }
            } else {
              ctrl.$setValidity('validAmount', false);
            }
            return value;
          }
          ctrl.$parsers.unshift(val);
          ctrl.$formatters.unshift(val);
        }
      };
    }
  ])
  .directive('walletSecret', function(bitcore) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var validator = function(value) {
          if (value.length > 0) {
            var m = value.match(/^[0-9A-HJ-NP-Za-km-z]{70,80}$/);
            ctrl.$setValidity('walletSecret', m ? true : false);
          }
          return value;
        };

        ctrl.$parsers.unshift(validator);
      }
    };
  })
  .directive('loading', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attr) {
        var a = element.html();
        var text = attr.loading;
        element.on('click', function() {
          element.html('<i class="size-21 fi-bitcoin-circle icon-rotate spinner"></i> ' + text + '...');
        });
        $scope.$watch('loading', function(val) {
          if (!val) {
            element.html(a);
          }
        });
      }
    }
  })
  .directive('ngFileSelect', function() {
    return {
      link: function($scope, el) {
        el.bind('change', function(e) {
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        });
      }
    }
  })
  .directive('contact', ['addressbookService', function(addressbookService) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var addr = attrs.address;
        addressbookService.getLabel(addr, function(label) {
          if (label) {
            element.append(label);
          } else {
            element.append(addr);
          }
        });
      }
    };
  }])
  .directive('highlightOnChange', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.highlightOnChange, function(newValue, oldValue) {
          element.addClass('highlight');
          setTimeout(function() {
            element.removeClass('highlight');
          }, 500);
        });
      }
    }
  })
  .directive('checkStrength', function() {
    return {
      replace: false,
      restrict: 'EACM',
      require: 'ngModel',
      link: function(scope, element, attrs) {

        var MIN_LENGTH = 8;
        var MESSAGES = ['Very Weak', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        var COLOR = ['#dd514c', '#dd514c', '#faa732', '#faa732', '#16A085', '#16A085'];

        function evaluateMeter(password) {
          var passwordStrength = 0;
          var text;
          if (password.length > 0) passwordStrength = 1;
          if (password.length >= MIN_LENGTH) {
            if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) {
              passwordStrength++;
            } else {
              text = ', add mixed case';
            }
            if (password.match(/\d+/)) {
              passwordStrength++;
            } else {
              if (!text) text = ', add numerals';
            }
            if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
              passwordStrength++;
            } else {
              if (!text) text = ', add punctuation';
            }
            if (password.length > 12) {
              passwordStrength++;
            } else {
              if (!text) text = ', add characters';
            }
          } else {
            text = ', that\'s short';
          }
          if (!text) text = '';

          return {
            strength: passwordStrength,
            message: MESSAGES[passwordStrength] + text,
            color: COLOR[passwordStrength]
          }
        }

        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (newValue && newValue !== '') {
            var info = evaluateMeter(newValue);
            scope[attrs.checkStrength] = info;
          }
        });
      }
    };
  })
  .directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
      scope.$watch(attrs.showFocus,
        function(newValue) {
          $timeout(function() {
            newValue && element[0].focus();
          });
        }, true);
    };
  })
  .directive('match', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        match: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(function() {
          return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
        }, function(currentValue) {
          ctrl.$setValidity('match', currentValue);
        });
      }
    };
  })
  .directive('clipCopy', function() {
    return {
      restrict: 'A',
      scope: {
        clipCopy: '=clipCopy'
      },
      link: function(scope, elm) {
        // TODO this does not work (FIXME)
        elm.attr('tooltip', 'Press Ctrl+C to Copy');
        elm.attr('tooltip-placement', 'top');

        elm.bind('click', function() {
          selectText(elm[0]);
        });
      }
    };
  })
  .directive('menuToggle', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/includes/menu-toggle.html'
    }
  })
  .directive('logo', function() {
    return {
      restrict: 'E',
      scope: {
        width: "@",
        negative: "="
      },
      controller: function($scope) {
        $scope.logo_url = $scope.negative ? 'img/logo-negative.svg' : 'img/logo.svg';
      },
      replace: true,
      template: '<img ng-src="{{ logo_url }}" alt="Copay">'
    }
  })
  .directive('availableBalance', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/includes/available-balance.html'
    }
  });

'use strict';

/*  
 * This is a modification from https://github.com/angular/angular.js/blob/master/src/ngTouch/swipe.js
 */


function makeSwipeDirective(directiveName, direction, eventName) {
  angular.module('copayApp.directives')
    .directive(directiveName, ['$parse', '$swipe',
      function($parse, $swipe) {
        // The maximum vertical delta for a swipe should be less than 75px.
        var MAX_VERTICAL_DISTANCE = 75;
        // Vertical distance should not be more than a fraction of the horizontal distance.
        var MAX_VERTICAL_RATIO = 0.4;
        // At least a 30px lateral motion is necessary for a swipe.
        var MIN_HORIZONTAL_DISTANCE = 30;

        return function(scope, element, attr) {
          var swipeHandler = $parse(attr[directiveName]);

          var startCoords, valid;

          function validSwipe(coords) {
            // Check that it's within the coordinates.
            // Absolute vertical distance must be within tolerances.
            // Horizontal distance, we take the current X - the starting X.
            // This is negative for leftward swipes and positive for rightward swipes.
            // After multiplying by the direction (-1 for left, +1 for right), legal swipes
            // (ie. same direction as the directive wants) will have a positive delta and
            // illegal ones a negative delta.
            // Therefore this delta must be positive, and larger than the minimum.
            if (!startCoords) return false;
            var deltaY = Math.abs(coords.y - startCoords.y);
            var deltaX = (coords.x - startCoords.x) * direction;
            return valid && // Short circuit for already-invalidated swipes.
              deltaY < MAX_VERTICAL_DISTANCE &&
              deltaX > 0 &&
              deltaX > MIN_HORIZONTAL_DISTANCE &&
              deltaY / deltaX < MAX_VERTICAL_RATIO;
          }

          var pointerTypes = ['touch'];
          $swipe.bind(element, {
            'start': function(coords, event) {
              startCoords = coords;
              valid = true;
            },
            'move': function(coords, event) {
              if (validSwipe(coords)) {
                scope.$apply(function() {
                  element.triggerHandler(eventName);
                  swipeHandler(scope, {
                    $event: event
                  });
                });
              }
            }
          }, pointerTypes);
        };
      }
    ]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');

'use strict';

angular.module('copayApp.directives')
    .directive('qrScanner', ['$rootScope', '$timeout', '$modal', 'isCordova', 'gettextCatalog', 'isMobile', 
      function($rootScope, $timeout, $modal, isCordova, gettextCatalog, isMobile) {

        var controller = function($scope) {

          var onSuccess = function(result) {
            $timeout(function() {
              window.plugins.spinnerDialog.hide();
              window.ignoreMobilePause = false;
            }, 100);
            if (isMobile.Windows() && result.cancelled) return;

            $timeout(function() {
              var data = isMobile.Windows() ? result.text : result;
              $scope.onScan({ data: data });
            }, 1000);
          };

          var onError = function(error) {
            $timeout(function() {
              window.ignoreMobilePause = false;
              window.plugins.spinnerDialog.hide();
            }, 100);
          };

          $scope.cordovaOpenScanner = function() {
            window.ignoreMobilePause = true;
            window.plugins.spinnerDialog.show(null, gettextCatalog.getString('Preparing camera...'), true);
            $timeout(function() {
              if (!isMobile.Windows()) {
                cloudSky.zBar.scan({}, onSuccess, onError);
              } else {
                cordova.plugins.barcodeScanner.scan(onSuccess, onError);
              }
              if ($scope.beforeScan) {
                $scope.beforeScan();
              }
            }, 100);
          };

          $scope.modalOpenScanner = function() {
            var parentScope = $scope;
            var ModalInstanceCtrl = function($scope, $rootScope, $modalInstance) {
              // QR code Scanner
              var video;
              var canvas;
              var $video;
              var context;
              var localMediaStream;
              var prevResult;

              var _scan = function(evt) {
                if (localMediaStream) {
                  context.drawImage(video, 0, 0, 300, 225);
                  try {
                    qrcode.decode();
                  } catch (e) {
                    //qrcodeError(e);
                  }
                }
                $timeout(_scan, 800);
              };

              var _scanStop = function() {
                if (localMediaStream && localMediaStream.active) {
                  var localMediaStreamTrack = localMediaStream.getTracks();
                  for (var i = 0; i < localMediaStreamTrack.length; i++) {
                    localMediaStreamTrack[i].stop();
                  }
                } else {
                  try {
                    localMediaStream.stop();
                  } catch(e) {
                    // Older Chromium not support the STOP function
                  };
                }
                localMediaStream = null;
                video.src = '';
              };

              qrcode.callback = function(data) {
                if (prevResult != data) {
                  prevResult = data;
                  return;
                }
                _scanStop();
                $modalInstance.close(data);
              };

              var _successCallback = function(stream) {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                localMediaStream = stream;
                video.play();
                $timeout(_scan, 1000);
              };

              var _videoError = function(err) {
                $scope.cancel();
              };

              var setScanner = function() {
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
                window.URL = window.URL || window.webkitURL ||
                    window.mozURL || window.msURL;
              };

              $scope.init = function() {
                setScanner();
                $timeout(function() {
                  if (parentScope.beforeScan) {
                    parentScope.beforeScan();
                  }
                  canvas = document.getElementById('qr-canvas');
                  context = canvas.getContext('2d');


                  video = document.getElementById('qrcode-scanner-video');
                  $video = angular.element(video);
                  canvas.width = 300;
                  canvas.height = 225;
                  context.clearRect(0, 0, 300, 225);

                  navigator.getUserMedia({
                    video: true
                  }, _successCallback, _videoError);
                }, 500);
              };

              $scope.cancel = function() {
                _scanStop();
                $modalInstance.dismiss('cancel');
              };
            };

            var modalInstance = $modal.open({
              templateUrl: 'views/modals/scanner.html',
              windowClass: 'full',
              controller: ModalInstanceCtrl,
              backdrop : 'static',
              keyboard: false
            });
            modalInstance.result.then(function(data) {
              parentScope.onScan({ data: data });
            });

          };

          $scope.openScanner = function() {
            if (isCordova) {
              $scope.cordovaOpenScanner();
            }
            else {
              $scope.modalOpenScanner();
            }
          };
        };

        return {
          restrict: 'E',
          scope: {
            onScan: "&",
            beforeScan: "&"
          },
          controller: controller,
          replace: true,
          template: '<a id="camera-icon" class="p10" ng-click="openScanner()"><i class="icon-scan size-21"></i></a>'
        }
      }
    ]);

'use strict';

angular.module('copayApp.filters', [])
  .filter('amTimeAgo', ['amMoment',
    function(amMoment) {
      return function(input) {
        return amMoment.preprocessDate(input).fromNow();
      };
    }
  ])
  .filter('paged', function() {
    return function(elements) {
      if (elements) {
        return elements.filter(Boolean);
      }

      return false;
    };
  })
  .filter('removeEmpty', function() {
    return function(elements) {
      elements = elements || [];
      // Hide empty change addresses from other copayers
      return elements.filter(function(e) {
        return !e.isChange || e.balance > 0;
      });
    }
  })

.filter('noFractionNumber', ['$filter', '$locale', 'configService',
  function(filter, locale, configService) {
    var numberFilter = filter('number');
    var formats = locale.NUMBER_FORMATS;
    var config = configService.getSync().wallet.settings;
    return function(amount, n) {
      if (typeof(n) === 'undefined' && !config) return amount;

      var fractionSize = (typeof(n) !== 'undefined') ?
        n : config.unitToSatoshi.toString().length - 1;
      var value = numberFilter(amount, fractionSize);
      var sep = value.indexOf(formats.DECIMAL_SEP);
      var group = value.indexOf(formats.GROUP_SEP);
      if (amount >= 0) {
        if (group > 0) {
          if (sep < 0) {
            return value;
          }
          var intValue = value.substring(0, sep);
          var floatValue = parseFloat(value.substring(sep));
          if (floatValue === 0) {
            floatValue = '';
          } else {
            if (floatValue % 1 === 0) {
              floatValue = floatValue.toFixed(0);
            }
            floatValue = floatValue.toString().substring(1);
          }
          var finalValue = intValue + floatValue;
          return finalValue;
        } else {
          value = parseFloat(value);
          if (value % 1 === 0) {
            value = value.toFixed(0);
          }
          return value;
        }
      }
      return 0;
    };
  }
]);

'use strict';

/**
 * Profile
 *
 * credential: array of OBJECTS
 */
function Profile() {
  this.version = '1.0.0';
};

Profile.create = function(opts) {
  opts = opts || {};

  var x = new Profile();
  x.createdOn = Date.now();
  x.credentials = opts.credentials || [];
  x.disclaimerAccepted = false;
  return x;
};

Profile.fromObj = function(obj) {
  var x = new Profile();

  x.createdOn = obj.createdOn;
  x.credentials = obj.credentials;
  x.disclaimerAccepted = obj.disclaimerAccepted;

  if (x.credentials[0] && typeof x.credentials[0] != 'object')
    throw ("credentials should be an object");

  return x;
};

Profile.fromString = function(str) {
  return Profile.fromObj(JSON.parse(str));
};

Profile.prototype.toObj = function() {
  return JSON.stringify(this);
};

'use strict';

angular.module('copayApp.services').service('addonManager', function (lodash) {
  var addons = [];

  this.registerAddon = function (addonSpec) {
    addons.push(addonSpec);
  };

  this.addonMenuItems = function () {
    return lodash.map(addons, function (addonSpec) {
      return addonSpec.menuItem;
    });
  };

  this.addonViews = function () {
    return lodash.map(addons, function (addonSpec) {
      return addonSpec.view;
    });
  };

  this.formatPendingTxp = function (txp) {
    lodash.each(addons, function (addon) {
      if (addon.formatPendingTxp) {
        addon.formatPendingTxp(txp);
      }
    });
  };

  this.txTemplateUrl = function() {
    var addon = lodash.find(addons, 'txTemplateUrl');
    return addon ? addon.txTemplateUrl() : null;
  }
});

'use strict';
'use strict';
angular.module('copayApp.services')
  .factory('addressService', function(storageService, profileService, $log, $timeout, lodash, bwsError, gettextCatalog) {
    var root = {};


    root.expireAddress = function(walletId,cb) {
      $log.debug('Cleaning Address ' + walletId );
      storageService.clearLastAddress(walletId, function(err) {
        return cb(err);
      });
    };

    root.isUsed = function(walletId, byAddress, cb) {
      storageService.getLastAddress(walletId, function(err, addr) {
        var used = lodash.find(byAddress, {
          address: addr
        });
        return cb(null, used);
      });
    };

    root._createAddress = function(walletId, cb) {
      var client = profileService.getClient(walletId);

      $log.debug('Creating address for wallet:', walletId);

      client.createAddress({}, function(err, addr) {
        if (err) {
          var prefix = gettextCatalog.getString('Could not create address');
          if (err.error && err.error.match(/locked/gi)) {
            $log.debug(err.error);
            return $timeout(function() {
              root._createAddress(walletId, cb);
            }, 5000);
          } else if (err.code && err.code == 'MAIN_ADDRESS_GAP_REACHED') {
            $log.warn(err.message);
            prefix = null;
            client.getMainAddresses({reverse: true, limit : 1}, function(err, addr) {
              if (err) return cb(err);
              return cb(null, addr[0].address);
            });
          }
          return bwsError.cb(err, prefix, cb);
        }
        return cb(null, addr.address);
      });
    };

    root.getAddress = function(walletId, forceNew, cb) {

      var firstStep;
      if (forceNew) {
        firstStep = storageService.clearLastAddress;
      } else {
        firstStep = function(walletId, cb) {
          return cb();
        };
      }

      firstStep(walletId, function(err) {
        if (err) return cb(err);

        storageService.getLastAddress(walletId, function(err, addr) {
          if (err) return cb(err);

          if (addr) return cb(null, addr);

          root._createAddress(walletId, function(err, addr) {
            if (err) return cb(err);
            storageService.storeLastAddress(walletId, addr, function() {
              if (err) return cb(err);
              return cb(null, addr);
            });
          });
        });
      });
    };

    return root;
  });

'use strict';

angular.module('copayApp.services').factory('addressbookService', function(storageService, profileService) {
  var root = {};

  root.getLabel = function(addr, cb) {
    var fc = profileService.focusedClient;
    storageService.getAddressbook(fc.credentials.network, function(err, ab) {
      if (!ab) return cb();
      ab = JSON.parse(ab);
      if (ab[addr]) return cb(ab[addr]);
      else return cb();
    });
  };

  root.list = function(cb) {
    var fc = profileService.focusedClient;
    storageService.getAddressbook(fc.credentials.network, function(err, ab) {
      if (err) return cb('Could not get the Addressbook');
      if (ab) ab = JSON.parse(ab);
      return cb(err, ab);
    });
  };

  root.add = function(entry, cb) {
    var fc = profileService.focusedClient;
    root.list(function(err, ab) {
      if (err) return cb(err);
      if (!ab) ab = {};
      if (ab[entry.address]) return cb('Entry already exist');
      ab[entry.address] = entry.label;
      storageService.setAddressbook(fc.credentials.network, JSON.stringify(ab), function(err, ab) {
        if (err) return cb('Error adding new entry');
        root.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    });
  };
  
  root.remove = function(addr, cb) {
    var fc = profileService.focusedClient;
    root.list(function(err, ab) {
      if (err) return cb(err);
      if (!ab) return;
      if (!ab[addr]) return cb('Entry does not exist');
      delete ab[addr];
      storageService.setAddressbook(fc.credentials.network, JSON.stringify(ab), function(err) {
        if (err) return cb('Error deleting entry');
        root.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    }); 
  };

  root.removeAll = function() {
    var fc = profileService.focusedClient;
    storageService.removeAddressbook(fc.credentials.network, function(err) {
      if (err) return cb('Error deleting addressbook');
      return cb();
    });
  };

  return root;
});

'use strict';

angular.module('copayApp.services').factory('animationService', function(isCordova) {
  var root = {};

  var cachedTransitionState, cachedBackPanel;

  // DISABLE ANIMATION ON DESKTOP
  root.modalAnimated = {
    slideUp: isCordova ? 'full animated slideInUp' : 'full',
    slideRight: isCordova ? 'full animated slideInRight' : 'full',
    slideOutDown: isCordova ? 'slideOutDown' : 'hideModal',
    slideOutRight: isCordova ? 'slideOutRight' : 'hideModal',
  };

  var pageWeight = {
    walletHome: 0,
    copayers: -1,
    cordova: -1,
    payment: -1,
    uriglidera: -1,

    preferences: 11,
    preferencesGlobal: 11,
    glidera: 11,
    preferencesColor: 12,
    backup: 12,
    preferencesAdvanced: 12,
    buyGlidera: 12,
    sellGlidera: 12,
    preferencesGlidera: 12,
    about: 12,
    delete: 13,
    preferencesLanguage: 12,
    preferencesUnit: 12,
    preferencesFee: 12,
    preferencesAltCurrency: 12,
    preferencesBwsUrl: 13,
    preferencesHistory: 13,
    preferencesAlias: 12,
    preferencesEmail: 12,
    export: 13,
    paperWallet: 13,
    logs: 13,
    information: 13,
    termOfUse: 13,
    translators: 13,
    add: 11,
    create: 12,
    join: 12,
    import: 12,
    importLegacy: 13
  };

  function cleanUpLater(e, e2) {
    var cleanedUp = false,
      timeoutID;
    var cleanUp = function() {
      if (cleanedUp) return;
      cleanedUp = true;
      e2.parentNode.removeChild(e2);
      e2.innerHTML = "";
      e.className = '';
      cachedBackPanel = null;
      cachedTransitionState = '';
      if (timeoutID) {
        timeoutID = null;
        window.clearTimeout(timeoutID);
      }
    };
    e.addEventListener("animationend", cleanUp, true);
    e2.addEventListener("animationend", cleanUp, true);
    e.addEventListener("webkitAnimationEnd", cleanUp, true);
    e2.addEventListener("webkitAnimationEnd", cleanUp, true);
    timeoutID = setTimeout(cleanUp, 500);
  };

  root.transitionAnimated = function(fromState, toState, event) {

    if (isaosp)
      return true;

    // Animation in progress?
    var x = document.getElementById('mainSectionDup');
    if (x && !cachedTransitionState) {
      console.log('Anim in progress');
      return true;
    }

    var fromName = fromState.name;
    var toName = toState.name;
    if (!fromName || !toName)
      return true;

    var fromWeight = pageWeight[fromName];
    var toWeight = pageWeight[toName];


    var entering = null,
      leaving = null;

    // Horizontal Slide Animation?
    if (isCordova && fromWeight && toWeight) {
      if (fromWeight > toWeight) {
        leaving = 'CslideOutRight';
      } else {
        entering = 'CslideInRight';
      }

      // Vertical Slide Animation?
    } else if (isCordova && fromName && fromWeight >= 0 && toWeight >= 0) {
      if (toWeight) {
        entering = 'CslideInUp';

      } else {
        leaving = 'CslideOutDown';
      }

      // no Animation  ?
    } else {
      return true;
    }

    var e = document.getElementById('mainSection');


    var desiredTransitionState = (fromName || '-') + ':' + (toName || '-');

    if (desiredTransitionState == cachedTransitionState) {
      e.className = entering || '';
      cachedBackPanel.className = leaving || '';
      cleanUpLater(e, cachedBackPanel);
      //console.log('USing animation', cachedTransitionState);
      return true;
    } else {
      var sc;
      // Keep prefDiv scroll
      var contentDiv = e.getElementsByClassName('content');
      if (contentDiv && contentDiv[0])
        sc = contentDiv[0].scrollTop;

      cachedBackPanel = e.cloneNode(true);
      cachedBackPanel.id = 'mainSectionDup';
      var c = document.getElementById('sectionContainer');
      c.appendChild(cachedBackPanel);

      if (sc)
        cachedBackPanel.getElementsByClassName('content')[0].scrollTop = sc;

      cachedTransitionState = desiredTransitionState;
      return false;
    }
  }

  return root;
});

'use strict';
angular.module('copayApp.services')
  .factory('applicationService', function($rootScope, $timeout, isCordova, isChromeApp, nodeWebkit, go) {
    var root = {};

    root.restart = function() {
      var hashIndex = window.location.href.indexOf('#/');
      if (isCordova) {
        window.location = window.location.href.substr(0, hashIndex);
        $timeout(function() {
          $rootScope.$digest();
        }, 1);

      } else {
        // Go home reloading the application
        if (isChromeApp) {
          chrome.runtime.reload();
        } else if (nodeWebkit.isDefined()) {
          go.walletHome();
          $timeout(function() {
            var win = require('nw.gui').Window.get();
            win.reload(3);
            //or
            win.reloadDev();
          }, 100);
        } else {
          window.location = window.location.href.substr(0, hashIndex);
        }
      }
    };

    return root;
  });

'use strict';
angular.module('copayApp.services')
  .factory('backupService', function backupServiceFactory($log, $timeout, profileService, sjcl) {

    var root = {};

    var _download = function(ew, filename, cb) {
      var NewBlob = function(data, datatype) {
        var out;

        try {
          out = new Blob([data], {
            type: datatype
          });
          $log.debug("case 1");
        } catch (e) {
          window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;

          if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data);
            out = bb.getBlob(datatype);
            $log.debug("case 2");
          } else if (e.name == "InvalidStateError") {
            // InvalidStateError (tested on FF13 WinXP)
            out = new Blob([data], {
              type: datatype
            });
            $log.debug("case 3");
          } else {
            // We're screwed, blob constructor unsupported entirely   
            $log.debug("Errore");
          }
        }
        return out;
      };

      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";

      var blob = new NewBlob(ew, 'text/plain;charset=utf-8');
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      $timeout(function() {
        window.URL.revokeObjectURL(url);
      }, 250);
      return cb();
    };

    root.addMetadata = function(b, opts) {

      b = JSON.parse(b);
      if (opts.historyCache) b.historyCache = opts.historyCache;
      if (opts.addressBook) b.addressBook = opts.addressBook;
      return JSON.stringify(b);
    }

    root.walletExport = function(password, opts) {
      if (!password) {
        return null;
      }
      var fc = profileService.focusedClient;
      try {
        opts = opts || {};
        var b = fc.export(opts);
        if (opts.historyCache || opts.addressBook) b = root.addMetadata(b, opts);

        var e = sjcl.encrypt(password, b, {
          iter: 10000
        });
        return e;
      } catch (err) {
        $log.debug('Error exporting wallet: ', err);
        return null;
      };
    };

    root.walletDownload = function(password, opts, cb) {
      var fc = profileService.focusedClient;
      var ew = root.walletExport(password, opts);
      if (!ew) return cb('Could not create backup');

      var walletName = (fc.alias || '') + (fc.alias ? '-' : '') + fc.credentials.walletName;
      if (opts.noSign) walletName = walletName + '-noSign'
      var filename = walletName + '-Copaybackup.aes.json';
      _download(ew, filename, cb)
    };
    return root;
  });
'use strict';
angular.module('copayApp.services')
  .factory('bitcore', function bitcoreFactory(bwcService) {
    var bitcore = bwcService.getBitcore();
    return bitcore;
  });

'use strict';
angular.module('copayApp.services')
  .factory('bwsError', function bwcErrorService($log, gettextCatalog) {
    var root = {};

    root.msg = function(err, prefix) {
      var body = '';
      prefix = prefix || '';

      if (err && err.code) {
        switch (err.code) {
          case 'CONNECTION_ERROR':
            body = gettextCatalog.getString('Network connection error');
            break;
          case 'NOT_FOUND':
            body = gettextCatalog.getString('Wallet service not found');
            break;
          case 'BAD_SIGNATURES':
            body = gettextCatalog.getString('Signatures rejected by server');
            break;
          case 'COPAYER_DATA_MISMATCH':
            body = gettextCatalog.getString('Copayer data mismatch');
            break;
          case 'COPAYER_IN_WALLET':
            body = gettextCatalog.getString('Copayer already in this wallet');
            break;
          case 'COPAYER_REGISTERED':
            body = gettextCatalog.getString('Key already associated with an existing wallet');
            break;
          case 'COPAYER_VOTED':
            body = gettextCatalog.getString('Copayer already voted on this spend proposal');
            break;
          case 'DUST_AMOUNT':
            body = gettextCatalog.getString('Amount below dust threshold');
            break;
          case 'INCORRECT_ADDRESS_NETWORK':
            body = gettextCatalog.getString('Incorrect address network');
            break;
          case 'INSUFFICIENT_FUNDS':
            body = gettextCatalog.getString('Insufficient funds');
            break;
          case 'INSUFFICIENT_FUNDS_FOR_FEE':
            body = gettextCatalog.getString('Insufficient funds for fee');
            break;
          case 'INVALID_ADDRESS':
            body = gettextCatalog.getString('Invalid address');
            break;
          case 'LOCKED_FUNDS':
            body = gettextCatalog.getString('Funds are locked by pending spend proposals');
            break;
          case 'NOT_AUTHORIZED':
            body = gettextCatalog.getString('Not authorized');
            break;
          case 'TX_ALREADY_BROADCASTED':
            body = gettextCatalog.getString('Transaction already broadcasted');
            break;
          case 'TX_CANNOT_CREATE':
            body = gettextCatalog.getString('Locktime in effect. Please wait to create a new spend proposal');
            break;
          case 'TX_CANNOT_REMOVE':
            body = gettextCatalog.getString('Locktime in effect. Please wait to remove this spend proposal');
            break;
          case 'TX_NOT_ACCEPTED':
            body = gettextCatalog.getString('Spend proposal is not accepted');
            break;
          case 'TX_NOT_FOUND':
            body = gettextCatalog.getString('Spend proposal not found');
            break;
          case 'TX_NOT_PENDING':
            body = gettextCatalog.getString('The spend proposal is not pending');
            break;
          case 'UPGRADE_NEEDED':
            body = gettextCatalog.getString('Please upgrade Copay to perform this action');
            break;
          case 'WALLET_ALREADY_EXISTS':
            body = gettextCatalog.getString('Wallet already exists');
            break;
          case 'WALLET_FULL':
            body = gettextCatalog.getString('Wallet is full');
            break;
          case 'WALLET_NOT_COMPLETE':
            body = gettextCatalog.getString('Wallet is not complete');
            break;
          case 'WALLET_NOT_FOUND':
            body = gettextCatalog.getString('Wallet not found');
            break;
          case 'SERVER_COMPROMISED':
            body = gettextCatalog.getString('Server response could not be verified');
            break;
          case 'WALLET_DOES_NOT_EXIST':
            body = gettextCatalog.getString('Wallet not registed at the Wallet Service. Recreate it from "Create Wallet" using "Advanced Options" to set your seed');
            break;
          case 'INVALID_BACKUP':
            body = gettextCatalog.getString('Wallet seed is invalid');
            break;
          case 'MAIN_ADDRESS_GAP_REACHED':
            body = gettextCatalog.getString('Empty addresses limit reached. New addresses cannot be generated.');
            break;
          case 'WALLET_LOCKED':
            body = gettextCatalog.getString('Wallet is locked');
            break;

          case 'ERROR':
            body = (err.message || err.error);
            break;

          default:
            $log.warn('Unknown error type:', err.code);
            body = err.message || err.code;
            break;
        }
      } else if (err.message) {
        body = gettextCatalog.getString(err.message);
      } else {
        body = gettextCatalog.getString(err);
      }

      var msg = prefix + (body ? (prefix ? ': ' : '') + body : '');
      return msg;
    };

    root.cb = function(err, prefix, cb) {
      return cb(root.msg(err, prefix))
    };

    return root;
  });

'use strict';

angular.module('copayApp.services').factory('configService', function(storageService, lodash, $log) {
  var root = {};

  var defaultConfig = {
    // wallet limits
    limits: {
      totalCopayers: 6,
      mPlusN: 100,
    },

    // Bitcore wallet service URL
    bws: {
      url: 'https://bws.bitpay.com/bws/api',
    },

    // wallet default config
    wallet: {
      requiredCopayers: 2,
      totalCopayers: 3,
      spendUnconfirmed: true,
      reconnectDelay: 5000,
      idleDurationMin: 4,
      settings: {
        unitName: 'bits',
        unitToSatoshi: 100,
        unitDecimals: 2,
        unitCode: 'bit',
        alternativeName: 'US Dollar',
        alternativeIsoCode: 'USD',
      }
    },

    // External services
    glidera: {
      enabled: true,
      testnet: false
    },

    rates: {
      url: 'https://insight.bitpay.com:443/api/rates',
    },
  };

  var configCache = null;


  root.getSync = function() {
    if (!configCache)
      throw new Error('configService#getSync called when cache is not initialized');

    return configCache;
  };

  root.get = function(cb) {

    storageService.getConfig(function(err, localConfig) {
      if (localConfig) {
        configCache = JSON.parse(localConfig);

        //these ifs are to avoid migration problems
        if (!configCache.bws) {
          configCache.bws = defaultConfig.bws;
        }
        if (!configCache.wallet) {
          configCache.wallet = defaultConfig.wallet;
        }
        if (!configCache.wallet.settings.unitCode) {
          configCache.wallet.settings.unitCode = defaultConfig.wallet.settings.unitCode;
        }
        if (!configCache.glidera) {
          configCache.glidera = defaultConfig.glidera; 
        }

      } else {
        configCache = lodash.clone(defaultConfig);
      };

      // Glidera
      // Disabled for testnet
      configCache.glidera.testnet = false;

      $log.debug('Preferences read:', configCache)
      return cb(err, configCache);
    });
  };

  root.set = function(newOpts, cb) {
    var config = lodash.clone(defaultConfig);
    storageService.getConfig(function(err, oldOpts) {
      if (lodash.isString(oldOpts)) {
        oldOpts = JSON.parse(oldOpts);
      }
      if (lodash.isString(config)) {
        config = JSON.parse(config);
      }
      if (lodash.isString(newOpts)) {
        newOpts = JSON.parse(newOpts);
      }
      lodash.merge(config, oldOpts, newOpts);
      configCache = config;

      storageService.storeConfig(JSON.stringify(config), cb);
    });
  };

  root.reset = function(cb) {
    configCache = lodash.clone(defaultConfig);
    storageService.removeConfig(cb);
  };

  root.getDefaults = function() {
    return lodash.clone(defaultConfig);
  };


  return root;
});


'use strict';

angular.module('copayApp.services').factory('confirmDialog', function($log, $timeout, profileService, configService, gettextCatalog, isCordova, isChromeApp) {
  var root = {};


  var acceptMsg = gettextCatalog.getString('Accept');
  var cancelMsg = gettextCatalog.getString('Cancel');
  var confirmMsg = gettextCatalog.getString('Confirm');

  root.show = function(msg, cb) {
    if (isCordova) { 
      navigator.notification.confirm(
        msg,
        function(buttonIndex) {
          if (buttonIndex == 1) {
            $timeout(function() {
              return cb(true);
            }, 1);
          } else {
            return cb(false);
          }
        },
        confirmMsg, [acceptMsg, cancelMsg]
      );
    } else if (isChromeApp) {
      // No feedback, alert/confirm not supported.
      return cb(true);
    } else {
      return cb(confirm(msg));
    }
  };

  return root;
});


'use strict';

angular.module('copayApp.services').factory('derivationPathHelper', function(lodash) {
  var root = {};

  root.default = "m/44'/0'/0'"
  root.parse = function(str) {
    var arr = str.split('/');

    var ret = {};

    if (arr[0] != 'm')
      return false;

    switch (arr[1]) {
      case "44'":
        ret.derivationStrategy = 'BIP44';
        break;
      case "48'":
        ret.derivationStrategy = 'BIP48';
        break;
      default:
        return false;
    };

    switch (arr[2]) {
      case "0'":
        ret.networkName = 'livenet';
        break;
      case "1'":
        ret.networkName = 'testnet';
        break;
      default:
        return false;
    };

    var match = arr[3].match(/(\d+)'/);
    if (!match)
      return false;
    ret.account = + match[1]

    return ret;
  };

  return root;
});

'use strict';

angular.module('copayApp.services').factory('feeService', function($log, profileService, configService, gettextCatalog, lodash) {
  var root = {};

  // Constant fee options to translate
  root.feeOpts = {
    priority: gettextCatalog.getString('Priority'),
    normal: gettextCatalog.getString('Normal'),
    economy: gettextCatalog.getString('Economy')
  };

  root.getCurrentFeeValue = function(currentSendFeeLevel, cb) { 
    var fc = profileService.focusedClient;
    var config = configService.getSync().wallet.settings;
    var feeLevel = currentSendFeeLevel || config.feeLevel || 'normal';
    // static fee
    var fee = 10000;
    fc.getFeeLevels(fc.credentials.network, function(err, levels) {
      if (err) {
        return cb({message: 'Could not get dynamic fee. Using static 10000sat'}, fee);
      }
      else {
        fee = lodash.find(levels, { level: feeLevel }).feePerKB;
        $log.debug('Dynamic fee: ' + feeLevel + ' ' + fee +  ' SAT');
        return cb(null, fee); 
      }
    });
  }; 

  root.getFeeLevels = function(cb) { 
    var fc = profileService.focusedClient;
    var config = configService.getSync().wallet.settings;
    var unitName = config.unitName;

    fc.getFeeLevels('livenet', function(errLivenet, levelsLivenet) {
      fc.getFeeLevels('testnet', function(errTestnet, levelsTestnet) {
        if (errLivenet || errTestnet) $log.debug('Could not get dynamic fee');
        else {
          for (var i = 0; i < 3; i++) {
            levelsLivenet[i]['feePerKBUnit'] = profileService.formatAmount(levelsLivenet[i].feePerKB) + ' ' + unitName;
            levelsTestnet[i]['feePerKBUnit'] = profileService.formatAmount(levelsTestnet[i].feePerKB) + ' ' + unitName;
          }
        }

        return cb({
          'livenet': levelsLivenet,
          'testnet': levelsTestnet
        });
      });
    });
  };

  return root;
});

'use strict';

angular.module('copayApp.services')
  .factory('fileStorageService', function(lodash, $log) {
    var root = {},
      _fs, _dir;

    root.init = function(cb) {
      if (_dir) return cb(null, _fs, _dir);

      function onFileSystemSuccess(fileSystem) {
        console.log('File system started: ', fileSystem.name, fileSystem.root.name);
        _fs = fileSystem;
        root.getDir(function(err, newDir) {
          if (err || !newDir.nativeURL) return cb(err);
          _dir = newDir
          $log.debug("Got main dir:", _dir.nativeURL);
          return cb(null, _fs, _dir);
        });
      }

      function fail(evt) {
        var msg = 'Could not init file system: ' + evt.target.error.code;
        console.log(msg);
        return cb(msg);
      };

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
    };

    root.get = function(k, cb) {
      root.init(function(err, fs, dir) {
        if (err) return cb(err);
        dir.getFile(k, {
          create: false,
        }, function(fileEntry) {
          if (!fileEntry) return cb();
          fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
              return cb(null, this.result)
            }

            reader.readAsText(file);
          });
        }, function(err) {
          // Not found
          if (err.code == 1) return cb();
          else return cb(err);
        });
      })
    };

    root.set = function(k, v, cb) {
      root.init(function(err, fs, dir) {
        if (err) return cb(err);
        dir.getFile(k, {
          create: true,
        }, function(fileEntry) {
          // Create a FileWriter object for our FileEntry (log.txt).
          fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
              console.log('Write completed.');
              return cb();
            };

            fileWriter.onerror = function(e) {
              var err = e.error ? e.error : JSON.stringify(e);
              console.log('Write failed: ' + err);
              return cb('Fail to write:' + err);
            };

            if (lodash.isObject(v))
              v = JSON.stringify(v);

            if (!lodash.isString(v)) {
              v = v.toString();
            }

            $log.debug('Writing:', k, v);
            fileWriter.write(v);

          }, cb);
        });
      });
    };


    // See https://github.com/apache/cordova-plugin-file/#where-to-store-files
    root.getDir = function(cb) {
      if (!cordova.file) {
        return cb('Could not write on device storage');
      }

      var url = cordova.file.dataDirectory;
      // This could be needed for windows
      // if (cordova.file === undefined) {
      //   url = 'ms-appdata:///local/';
      window.resolveLocalFileSystemURL(url, function(dir) {
        return cb(null, dir);
      }, function(err) {
        $log.warn(err);
        return cb(err || 'Could not resolve filesystem:' + url);
      });
    };

    root.remove = function(k, cb) {
      root.init(function(err, fs, dir) {
        if (err) return cb(err);
        dir.getFile(k, {
          create: false,
        }, function(fileEntry) {
          // Create a FileWriter object for our FileEntry (log.txt).
          fileEntry.remove(function() {
            console.log('File removed.');
            return cb();
          }, cb, cb);
        });
      });
    };

    /**
     * Same as setItem, but fails if an item already exists
     */
    root.create = function(name, value, callback) {
      root.get(name,
        function(err, data) {
          if (data) {
            return callback('EEXISTS');
          } else {
            return root.set(name, value, callback);
          }
        });
    };

    return root;
  });

'use strict';

angular.module('copayApp.services').factory('glideraService', function($http, $log, isCordova) {
  var root = {};
  var credentials = {};

  root.setCredentials = function(network) {
    if (network == 'testnet') {
      credentials.HOST = 'https://sandbox.glidera.io';
      if (isCordova) {
        credentials.REDIRECT_URI = 'bitcoin://glidera';
        credentials.CLIENT_ID = 'dfc56e4336e32bb8ba46dde34f3d7d6d';
        credentials.CLIENT_SECRET = '5eb679058f6c7eb81123162323d4fba5';
      }
      else {
        credentials.REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
        credentials.CLIENT_ID = '9915b6ffa6dc3baffb87135ed3873d49';
        credentials.CLIENT_SECRET = 'd74eda05b9c6a228fd5c85cfbd0eb7eb';
      }
    }
    else {
      credentials.HOST = 'https://glidera.io';
      if (isCordova) {
        credentials.REDIRECT_URI = 'bitcoin://glidera';
        credentials.CLIENT_ID = '9c8023f0ac0128235b7b27a6f2610c83';
        credentials.CLIENT_SECRET = '30431511407b47f25a83bffd72881d55';
      }
      else {
        credentials.REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
        credentials.CLIENT_ID = '8a9e8a9cf155db430c1ea6c7889afed1';
        credentials.CLIENT_SECRET = '24ddec578f38d5488bfe13601933c05f';
      }
    };
  };

  root.getOauthCodeUrl = function() {
    return credentials.HOST 
      + '/oauth2/auth?response_type=code&client_id=' 
      + credentials.CLIENT_ID 
      + '&redirect_uri='
      + credentials.REDIRECT_URI;
  };

  root.getToken = function(code, cb) {
    var req = {
      method: 'POST',
      url: credentials.HOST + '/api/v1/oauth/token',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { 
        grant_type : 'authorization_code',
        code: code,
        client_id : credentials.CLIENT_ID,
        client_secret: credentials.CLIENT_SECRET,
        redirect_uri: credentials.REDIRECT_URI
      }
    };

    $http(req).then(function(data) {
      $log.info('Glidera Authorization Access Token: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Authorization Access Token: ERROR ' + data.statusText);
      return cb('Glidera Authorization Access Token: ERROR ' + data.statusText);
    });
  };

  var _get = function(endpoint, token) {
    return {
      method: 'GET',
      url: credentials.HOST + '/api/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
  };

  root.getAccessTokenPermissions = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/oauth/token', token)).then(function(data) {
      $log.info('Glidera Access Token Permissions: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Access Token Permissions: ERROR ' + data.statusText);
      return cb('Glidera Access Token Permissions: ERROR ' + data.statusText);
    });
  };

  root.getEmail = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/email', token)).then(function(data) {
      $log.info('Glidera Get Email: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Get Email: ERROR ' + data.statusText);
      return cb('Glidera Get Email: ERROR ' + data.statusText);
    });
  };

  root.getPersonalInfo = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/personalinfo', token)).then(function(data) {
      $log.info('Glidera Get Personal Info: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Get Personal Info: ERROR ' + data.statusText);
      return cb('Glidera Get Personal Info: ERROR ' + data.statusText);
    });
  };

  root.getStatus = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/status', token)).then(function(data) {
      $log.info('Glidera User Status: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera User Status: ERROR ' + data.statusText);
      return cb('Glidera User Status: ERROR ' + data.statusText);
    });
  };

  root.getLimits = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/limits', token)).then(function(data) {
      $log.info('Glidera Transaction Limits: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Transaction Limits: ERROR ' + data.statusText);
      return cb('Glidera Transaction Limits: ERROR ' + data.statusText);
    });
  };

  root.getTransactions = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/transaction', token)).then(function(data) {
      $log.info('Glidera Transactions: SUCCESS');
      return cb(null, data.data.transactions);
    }, function(data) {
      $log.error('Glidera Transactions: ERROR ' + data.statusText);
      return cb('Glidera Transactions: ERROR ' + data.statusText);
    });
  };

  root.getTransaction = function(token, txid, cb) {
    if (!token) return cb('Invalid Token');
    if (!txid) return cb('TxId required');
    $http(_get('/transaction/' + txid, token)).then(function(data) {
      $log.info('Glidera Transaction: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Transaction: ERROR ' + data.statusText);
      return cb('Glidera Transaction: ERROR ' + data.statusText);
    });
  };

  root.getSellAddress = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/create_sell_address', token)).then(function(data) {
      $log.info('Glidera Create Sell Address: SUCCESS');
      return cb(null, data.data.sellAddress);
    }, function(data) {
      $log.error('Glidera Create Sell Address: ERROR ' + data.statusText);
      return cb('Glidera Create Sell Address: ERROR ' + data.statusText);
    });
  };

  root.get2faCode = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/authentication/get2faCode', token)).then(function(data) {
      $log.info('Glidera Sent 2FA code by SMS: SUCCESS');
      return cb(null, data.status == 200 ? true : false);
    }, function(data) {
      $log.error('Glidera Sent 2FA code by SMS: ERROR ' + data.statusText);
      return cb('Glidera Sent 2FA code by SMS: ERROR ' + data.statusText);
    });
  };

  var _post = function(endpoint, token, twoFaCode, data) {
    return {
      method: 'POST',
      url: credentials.HOST + '/api/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        '2FA_CODE': twoFaCode
      },
      data: data
    };
  };

  root.sellPrice = function(token, price, cb) {
    var data = {
      qty: price.qty,
      fiat: price.fiat
    };
    $http(_post('/prices/sell', token, null, data)).then(function(data) {
      $log.info('Glidera Sell Price: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Sell Price: ERROR ' + data.statusText);
      return cb('Glidera Sell Price: ERROR ' + data.statusText);
    });
  }; 

  root.sell = function(token, twoFaCode, data, cb) {
    var data = {
      refundAddress: data.refundAddress,
      signedTransaction: data.signedTransaction,
      priceUuid: data.priceUuid,
      useCurrentPrice: data.useCurrentPrice,
      ip: data.ip
    };
    $http(_post('/sell', token, twoFaCode, data)).then(function(data) {
      $log.info('Glidera Sell: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Sell Request: ERROR ' + data.statusText);
      return cb('Glidera Sell Request: ERROR ' + data.statusText);
    });
  };

  root.buyPrice = function(token, price, cb) {
    var data = {
      qty: price.qty,
      fiat: price.fiat
    };
    $http(_post('/prices/buy', token, null, data)).then(function(data) {
      $log.info('Glidera Buy Price: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Buy Price: ERROR ' + data.statusText);
      return cb('Glidera Buy Price: ERROR ' + data.statusText);
    });
  };

  root.buy = function(token, twoFaCode, data, cb) {
    var data = {
      destinationAddress: data.destinationAddress,
      qty: data.qty,
      priceUuid: data.priceUuid,
      useCurrentPrice: data.useCurrentPrice,
      ip: data.ip
    };
    $http(_post('/buy', token, twoFaCode, data)).then(function(data) {
      $log.info('Glidera Buy: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Buy Request: ERROR ' + data.statusText);
      return cb('Glidera Buy Request: ERROR ' + data.statusText);
    });
  };

  return root;

});

'use strict';

angular.module('copayApp.services').factory('go', function($window, $rootScope, $location, $state, $timeout, profileService, nodeWebkit) {
  var root = {};

  var hideSidebars = function() {
    if (typeof document === 'undefined')
      return;

    var elem = document.getElementById('off-canvas-wrap');
    elem.className = 'off-canvas-wrap';
  };

  var toggleSidebar = function(invert) {
    if (typeof document === 'undefined')
      return;

    var elem = document.getElementById('off-canvas-wrap');
    var leftbarActive = elem.className.indexOf('move-right') >= 0;

    if (invert) {
      if (profileService.profile && !$rootScope.hideNavigation) {
        elem.className = 'off-canvas-wrap move-right';
      }
    } else {
      if (leftbarActive) {
        hideSidebars();
      }
    }
  };

  root.openExternalLink = function(url, target) {
    if (nodeWebkit.isDefined()) {
      nodeWebkit.openExternalLink(url);
    } else {
      target = target || '_blank';
      var ref = window.open(url, target, 'location=no');
    }
  };

  root.path = function(path, cb) {
    $state.transitionTo(path)
      .then(function() {
        if (cb) return cb();
      }, function() {
        if (cb) return cb('animation in progress');
      });
    hideSidebars();
  };

  root.swipe = function(invert) {
    toggleSidebar(invert);
  };

  root.walletHome = function(delayed) {
    var fc = profileService.focusedClient;
    if (fc && !fc.isComplete()) {
      root.path('copayers');
    } else {
      root.path('walletHome', function() {
        $rootScope.$emit('Local/SetTab', 'walletHome', true);
      });
    }
  };


  root.send = function() {
    root.path('walletHome', function() {
      $rootScope.$emit('Local/SetTab', 'send');
    });
  };

  root.addWallet = function() {
    $state.go('add');
  };

  root.preferences = function() {
    $state.go('preferences');
  };

  root.preferencesGlobal = function() {
    $state.go('preferencesGlobal');
  };

  root.reload = function() {
    $state.reload();
  };


  // Global go. This should be in a better place TODO
  // We dont do a 'go' directive, to use the benefits of ng-touch with ng-click
  $rootScope.go = function(path) {
    root.path(path);
  };

  $rootScope.openExternalLink = function(url, target) {
    root.openExternalLink(url, target);
  };



  return root;
});

'use strict';
var logs = [];
angular.module('copayApp.services')
  .factory('historicLog', function historicLog() {
    var root = {};

    root.add = function(level, msg) {
      logs.push({
        level: level,
        msg: msg,
      });
    };

    root.get = function() {
      return logs;
    };

    return root;
  });

'use strict';

angular.module('copayApp.services')
  .factory('hwWallet', function($log,  bwcService) {
    var root = {};

    // Ledger magic number to get xPub without user confirmation
    root.ENTROPY_INDEX_PATH = "0xb11e/";
    root.UNISIG_ROOTPATH = 44;
    root.MULTISIG_ROOTPATH = 48;
    root.LIVENET_PATH = 0;

    root._err = function(data) {
      var msg = 'Hardware Wallet Error: ' + (data.error || data.message || 'unknown');
      $log.warn(msg);
      return msg;
    };


    root.getRootPath = function(device, isMultisig, account) {
      if (!isMultisig) return root.UNISIG_ROOTPATH;

      // Compat
      if (device == 'ledger' && account ==0) return root.UNISIG_ROOTPATH;

      return root.MULTISIG_ROOTPATH;
    };

    root.getAddressPath = function(device, isMultisig, account) {
      return root.getRootPath(device,isMultisig,account) + "'/" + root.LIVENET_PATH + "'/" + account + "'";
    }

    root.getEntropyPath = function(device, isMultisig, account) {
      var path;

      // Old ledger wallet compat
      if (device == 'ledger' && account == 0)
        return root.ENTROPY_INDEX_PATH  + "0'";

      return root.ENTROPY_INDEX_PATH + root.getRootPath(device,isMultisig,account) + "'/" + account + "'";
    };

    root.pubKeyToEntropySource = function(xPubKey) {
      var b = bwcService.getBitcore();
      var x = b.HDPublicKey(xPubKey);
      return x.publicKey.toString();
    };

    return root;
  });

'use strict';

angular.module('copayApp.services').factory('isChromeApp', function(nodeWebkit) {
  return !!(window.chrome && chrome.runtime && chrome.runtime.id && !nodeWebkit.isDefined());
});

'use strict';

angular.module('copayApp.services').value('isCordova',  window.cordova ? true : false);

'use strict';

angular.module('copayApp.services').factory('isDevel', function(nodeWebkit, isChromeApp, isMobile) {
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


angular.module('copayApp.services').value('isMobile', isMobile);

'use strict';

angular.module('copayApp.services')
  .factory('ledger', function($log, bwcService, gettext, hwWallet) {
    var root = {};
    var LEDGER_CHROME_ID = "kkdpmhnladdopljabkgpacgpliggeeaf";

    root.callbacks = {};
    root.hasSession = function() {
      root._message({
        command: "has_session"
      });
    }

    root.getEntropySource = function(isMultisig, account, callback) {
      root.getXPubKey(hwWallet.getEntropyPath('ledger', isMultisig, account), function(data) {
        if (!data.success) 
          return callback(hwWallet._err(data));
        
        return callback(null,  hwWallet.pubKeyToEntropySource(data.xpubkey));
      });
    };

    root.getXPubKey = function(path, callback) {
      $log.debug('Ledger deriving xPub path:', path);
      root.callbacks["get_xpubkey"] = callback;
      root._messageAfterSession({
        command: "get_xpubkey",
        path: path
      })
    };


    root.getInfoForNewWallet = function(isMultisig, account, callback) {
      var opts = {};
      root.getEntropySource(isMultisig, account, function(err, entropySource) {
        if (err) return callback(err);

        opts.entropySource = entropySource;
        root.getXPubKey(hwWallet.getAddressPath('ledger', isMultisig, account), function(data) {
          if (!data.success) {
            $log.warn(data.message);
            return callback(data);
          }
          opts.extendedPublicKey = data.xpubkey;
          opts.externalSource = 'ledger';
          opts.account = account;

          // Old ledger compat
          opts.derivationStrategy = account ? 'BIP48' : 'BIP44';
          return callback(null, opts);
        });
      });
    };

    root._signP2SH = function(txp, account, isMultisig, callback) {
      root.callbacks["sign_p2sh"] = callback;
      var redeemScripts = [];
      var paths = [];
      var tx = bwcService.buildTx(txp);
      for (var i = 0; i < tx.inputs.length; i++) {
        redeemScripts.push(new ByteString(tx.inputs[i].redeemScript.toBuffer().toString('hex'), GP.HEX).toString());
        paths.push(hwWallet.getAddressPath('ledger', isMultisig, account) + txp.inputs[i].path.substring(1));
      }
      var splitTransaction = root._splitTransaction(new ByteString(tx.toString(), GP.HEX));
      var inputs = [];
      for (var i = 0; i < splitTransaction.inputs.length; i++) {
        var input = splitTransaction.inputs[i];
        inputs.push([
          root._reverseBytestring(input.prevout.bytes(0, 32)).toString(),
          root._reverseBytestring(input.prevout.bytes(32)).toString()
        ]);
      }
      $log.debug('Ledger signing  paths:', paths);
      root._messageAfterSession({
        command: "sign_p2sh",
        inputs: inputs,
        scripts: redeemScripts,
        outputs_number: splitTransaction.outputs.length,
        outputs_script: splitTransaction.outputScript.toString(),
        paths: paths
      });
    };

    root.signTx = function(txp, account, callback) {

      // TODO Compat
      var isMultisig = true;
      if (txp.addressType == 'P2PKH') {
        var msg = 'P2PKH wallets are not supported with ledger';
        $log.error(msg);
        return callback(msg);
      } else {
        root._signP2SH(txp, account, isMultisig, callback);
      }
    }

    root._message = function(data) {
      chrome.runtime.sendMessage(
        LEDGER_CHROME_ID, {
          request: data
        },
        function(response) {
          root._callback(response);
        }
      );
    }

    root._messageAfterSession = function(data) {
      root._after_session = data;
      root._message({
        command: "launch"
      });
      root._should_poll_session = true;
      root._do_poll_session();
    }

    root._do_poll_session = function() {
      root.hasSession();
      if (root._should_poll_session) {
        setTimeout(root._do_poll_session, 500);
      }
    }

    root._callback = function(data) {
      if (typeof data == "object") {
        if (data.command == "has_session" && data.success) {
          root._message(root._after_session);
          root._after_session = null;
          root._should_poll_session = false;
        } else if (typeof root.callbacks[data.command] == "function") {
          root.callbacks[data.command](data);
        }
      } else {
        root._should_poll_session = false;
        Object.keys(root.callbacks).forEach(function(key) {
          root.callbacks[key]({
            success: false,
            message: gettext("The Ledger Chrome application is not installed"),
          });
        });
      }
    }

    root._splitTransaction = function(transaction) {
      var result = {};
      var inputs = [];
      var outputs = [];
      var offset = 0;
      var version = transaction.bytes(offset, 4);
      offset += 4;
      var varint = root._getVarint(transaction, offset);
      var numberInputs = varint[0];
      offset += varint[1];
      for (var i = 0; i < numberInputs; i++) {
        var input = {};
        input['prevout'] = transaction.bytes(offset, 36);
        offset += 36;
        varint = root._getVarint(transaction, offset);
        offset += varint[1];
        input['script'] = transaction.bytes(offset, varint[0]);
        offset += varint[0];
        input['sequence'] = transaction.bytes(offset, 4);
        offset += 4;
        inputs.push(input);
      }
      varint = root._getVarint(transaction, offset);
      var numberOutputs = varint[0];
      offset += varint[1];
      var outputStartOffset = offset;
      for (var i = 0; i < numberOutputs; i++) {
        var output = {};
        output['amount'] = transaction.bytes(offset, 8);
        offset += 8;
        varint = root._getVarint(transaction, offset);
        offset += varint[1];
        output['script'] = transaction.bytes(offset, varint[0]);
        offset += varint[0];
        outputs.push(output);
      }
      var locktime = transaction.bytes(offset, 4);
      result['version'] = version;
      result['inputs'] = inputs;
      result['outputs'] = outputs;
      result['locktime'] = locktime;
      result['outputScript'] = transaction.bytes(outputStartOffset, offset - outputStartOffset);
      return result;
    }

    root._getVarint = function(data, offset) {
      if (data.byteAt(offset) < 0xfd) {
        return [data.byteAt(offset), 1];
      }
      if (data.byteAt(offset) == 0xfd) {
        return [((data.byteAt(offset + 2) << 8) + data.byteAt(offset + 1)), 3];
      }
      if (data.byteAt(offset) == 0xfe) {
        return [((data.byteAt(offset + 4) << 24) + (data.byteAt(offset + 3) << 16) +
          (data.byteAt(offset + 2) << 8) + data.byteAt(offset + 1)), 5];
      }
    }

    root._reverseBytestring = function(x) {
      var res = "";
      for (var i = x.length - 1; i >= 0; i--) {
        res += Convert.toHexByte(x.byteAt(i));
      }
      return new ByteString(res, GP.HEX);
    }

    return root;
  });

var Convert = {};

/**
 * Convert a binary string to his hexadecimal representation
 * @param {String} src binary string
 * @static
 * @returns {String} hexadecimal representation
 */
Convert.stringToHex = function(src) {
  var r = "";
  var hexes = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
  for (var i = 0; i < src.length; i++) {
    r += hexes[src.charCodeAt(i) >> 4] + hexes[src.charCodeAt(i) & 0xf];
  }
  return r;
}

/**
 * Convert an hexadecimal string to its binary representation
 * @param {String} src hexadecimal string
 * @static
 * @return {Array} byte array
 * @throws {InvalidString} if the string isn't properly formatted
 */
Convert.hexToBin = function(src) {
  var result = "";
  var digits = "0123456789ABCDEF";
  if ((src.length % 2) != 0) {
    throw "Invalid string";
  }
  src = src.toUpperCase();
  for (var i = 0; i < src.length; i += 2) {
    var x1 = digits.indexOf(src.charAt(i));
    if (x1 < 0) {
      return "";
    }
    var x2 = digits.indexOf(src.charAt(i + 1));
    if (x2 < 0) {
      return "";
    }
    result += String.fromCharCode((x1 << 4) + x2);
  }
  return result;
}

/**
 * Convert a double digit hexadecimal number to an integer
 * @static
 * @param {String} data buffer containing the digit to parse
 * @param {Number} offset offset to the digit (default is 0)
 * @returns {Number} converted digit
 */
Convert.readHexDigit = function(data, offset) {
  var digits = '0123456789ABCDEF';
  if (typeof offset == "undefined") {
    offset = 0;
  }
  return (digits.indexOf(data.substring(offset, offset + 1).toUpperCase()) << 4) + (digits.indexOf(data.substring(offset + 1, offset + 2).toUpperCase()));
}

/**
 * Convert a number to a two digits hexadecimal string (deprecated)
 * @static
 * @param {Number} number number to convert
 * @returns {String} converted number
 */
Convert.toHexDigit = function(number) {
  var digits = '0123456789abcdef';
  return digits.charAt(number >> 4) + digits.charAt(number & 0x0F);
}

/**
 * Convert a number to a two digits hexadecimal string (similar to toHexDigit)
 * @static
 * @param {Number} number number to convert
 * @returns {String} converted number
 */
Convert.toHexByte = function(number) {
  return Convert.toHexDigit(number);
}

/**
 * Convert a BCD number to a two digits hexadecimal string
 * @static
 * @param {Number} number number to convert
 * @returns {String} converted number
 */
Convert.toHexByteBCD = function(numberBCD) {
  var number = ((numberBCD / 10) * 16) + (numberBCD % 10);
  return Convert.toHexDigit(number);
}


/**
 * Convert a number to an hexadecimal short number
 * @static
 * @param {Number} number number to convert
 * @returns {String} converted number
 */
Convert.toHexShort = function(number) {
  return Convert.toHexDigit((number >> 8) & 0xff) + Convert.toHexDigit(number & 0xff);
}

/**
 * Convert a number to an hexadecimal int number
 * @static
 * @param {Number} number number to convert
 * @returns {String} converted number
 */
Convert.toHexInt = function(number) {
  return Convert.toHexDigit((number >> 24) & 0xff) + Convert.toHexDigit((number >> 16) & 0xff) +
    Convert.toHexDigit((number >> 8) & 0xff) + Convert.toHexDigit(number & 0xff);
}


var GP = {};
GP.ASCII = 1;
GP.HEX = 5;

/**
 * @class GPScript ByteString implementation
 * @param {String} value initial value
 * @param {HEX|ASCII} encoding encoding to use
 * @property {Number} length length of the ByteString
 * @constructs
 */
var ByteString = function(value, encoding) {
  this.encoding = encoding;
  this.hasBuffer = (typeof Buffer != 'undefined');
  if (this.hasBuffer && (value instanceof Buffer)) {
    this.value = value;
    this.encoding = GP.HEX;
  } else {
    switch (encoding) {
      case GP.HEX:
        if (!this.hasBuffer) {
          this.value = Convert.hexToBin(value);
        } else {
          this.value = new Buffer(value, 'hex');
        }
        break;

      case GP.ASCII:
        if (!this.hasBuffer) {
          this.value = value;
        } else {
          this.value = new Buffer(value, 'ascii');
        }
        break;

      default:
        throw "Invalid arguments";
    }
  }
  this.length = this.value.length;
}

/**
 * Retrieve the byte value at the given index
 * @param {Number} index index
 * @returns {Number} byte value
 */
ByteString.prototype.byteAt = function(index) {
  if (arguments.length < 1) {
    throw "Argument missing";
  }
  if (typeof index != "number") {
    throw "Invalid index";
  }
  if ((index < 0) || (index >= this.value.length)) {
    throw "Invalid index offset";
  }
  if (!this.hasBuffer) {
    return Convert.readHexDigit(Convert.stringToHex(this.value.substring(index, index + 1)));
  } else {
    return this.value[index];
  }
}

/**
 * Retrieve a subset of the ByteString
 * @param {Number} offset offset to start at
 * @param {Number} [count] size of the target ByteString (default : use the remaining length)
 * @returns {ByteString} subset of the original ByteString
 */
ByteString.prototype.bytes = function(offset, count) {
  var result;
  if (arguments.length < 1) {
    throw "Argument missing";
  }
  if (typeof offset != "number") {
    throw "Invalid offset";
  }
  //if ((offset < 0) || (offset >= this.value.length)) {
  if (offset < 0) {
    throw "Invalid offset";
  }
  if (typeof count == "number") {
    if (count < 0) {
      throw "Invalid count";
    }
    if (!this.hasBuffer) {
      result = new ByteString(this.value.substring(offset, offset + count), GP.ASCII);
    } else {
      result = new Buffer(count);
      this.value.copy(result, 0, offset, offset + count);
    }
  } else
  if (typeof count == "undefined") {
    if (!this.hasBuffer) {
      result = new ByteString(this.value.substring(offset), GP.ASCII);
    } else {
      result = new Buffer(this.value.length - offset);
      this.value.copy(result, 0, offset, this.value.length);
    }
  } else {
    throw "Invalid count";
  }
  if (!this.hasBuffer) {
    result.encoding = this.encoding;
    return result;
  } else {
    return new ByteString(result, GP.HEX);
  }
}

/**
 * Appends two ByteString
 * @param {ByteString} target ByteString to append
 * @returns {ByteString} result of the concatenation
 */
ByteString.prototype.concat = function(target) {
  if (arguments.length < 1) {
    throw "Not enough arguments";
  }
  if (!(target instanceof ByteString)) {
    throw "Invalid argument";
  }
  if (!this.hasBuffer) {
    var result = this.value + target.value;
    var x = new ByteString(result, GP.ASCII);
    x.encoding = this.encoding;
    return x;
  } else {
    var result = Buffer.concat([this.value, target.value]);
    return new ByteString(result, GP.HEX);
  }
}

/**
 * Check if two ByteString are equal
 * @param {ByteString} target ByteString to check against
 * @returns {Boolean} true if the two ByteString are equal
 */
ByteString.prototype.equals = function(target) {
  if (arguments.length < 1) {
    throw "Not enough arguments";
  }
  if (!(target instanceof ByteString)) {
    throw "Invalid argument";
  }
  if (!this.hasBuffer) {
    return (this.value == target.value);
  } else {
    return Buffer.equals(this.value, target.value);
  }
}


/**
 * Convert the ByteString to a String using the given encoding
 * @param {HEX|ASCII|UTF8|BASE64|CN} encoding encoding to use
 * @return {String} converted content
 */
ByteString.prototype.toString = function(encoding) {
  var targetEncoding = this.encoding;
  if (arguments.length >= 1) {
    if (typeof encoding != "number") {
      throw "Invalid encoding";
    }
    switch (encoding) {
      case GP.HEX:
      case GP.ASCII:
        targetEncoding = encoding;
        break;

      default:
        throw "Unsupported arguments";
    }
    targetEncoding = encoding;
  }
  switch (targetEncoding) {
    case GP.HEX:
      if (!this.hasBuffer) {
        return Convert.stringToHex(this.value);
      } else {
        return this.value.toString('hex');
      }
    case GP.ASCII:
      if (!this.hasBuffer) {
        return this.value;
      } else {
        return this.value.toString();
      }
    default:
      throw "Unsupported";
  }
}

ByteString.prototype.toStringIE = function(encoding) {
  return this.toString(encoding);
}

ByteString.prototype.toBuffer = function() {
  return this.value;
}

'use strict';
angular.module('copayApp.services')
  .factory('legacyImportService', function($rootScope, $log, $timeout, $http, lodash, bitcore, bwcService, sjcl, profileService, isChromeApp) {

    var root = {};
    var wc = bwcService.getClient();

    root.getKeyForEmail = function(email) {
      var hash = bitcore.crypto.Hash.sha256ripemd160(new bitcore.deps.Buffer(email)).toString('hex');
      $log.debug('Storage key:' + hash);
      return 'profile::' + hash;
    };

    root.getKeyForWallet = function(id) {
      return 'wallet::' + id;
    };

    root._importOne = function(user, pass, walletId, get, cb) {
      get(root.getKeyForWallet(walletId), function(err, blob) {
        if (err) {
          $log.warn('Could not fetch wallet: ' + walletId + ":" + err);
          return cb('Could not fetch ' + walletId);
        }
        profileService.importLegacyWallet(user, pass, blob, cb);
      });
    };


    root._doImport = function(user, pass, get, cb) {
      var self = this;
      get(root.getKeyForEmail(user), function(err, p) {
        if (err || !p)
          return cb(err || ('Could not find profile for ' + user));


        var ids = wc.getWalletIdsFromOldCopay(user, pass, p);
        if (!ids)
          return cb('Could not find wallets on the profile');

        $rootScope.$emit('Local/ImportStatusUpdate',
          'Found ' + ids.length + ' wallets to import:' + ids.join());

        $log.info('Importing Wallet Ids:', ids);

        var i = 0;
        var okIds = [];
        var toScanIds = [];
        lodash.each(ids, function(walletId) {
          $timeout(function() {
            $rootScope.$emit('Local/ImportStatusUpdate',
              'Importing wallet ' + walletId + ' ... ');

            self._importOne(user, pass, walletId, get, function(err, id, name, existed) {
              if (err) {
                $rootScope.$emit('Local/ImportStatusUpdate',
                  'Failed to import wallet ' + (name || walletId));
              } else {
                okIds.push(walletId);
                $rootScope.$emit('Local/ImportStatusUpdate',
                  'Wallet ' + id + '[' + name + '] imported successfully');

                if (!existed) {
                  $log.info('Wallet ' + walletId + ' was created. need to be scanned');
                  toScanIds.push(id);
                }
              }

              if (++i == ids.length) {
                return cb(null, okIds, toScanIds);
              }
            });
          }, 100);
        });
      });
    };

    root.import = function(user, pass, serverURL, fromCloud, cb) {

      var insightGet = function(key, cb) {


        var kdfbinary = function(password, salt, iterations, length) {
          iterations = iterations || defaultIterations;
          length = length || 512;
          salt = sjcl.codec.base64.toBits(salt || defaultSalt);

          var hash = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(password));
          var prff = function(key) {
            return new sjcl.misc.hmac(hash, sjcl.hash.sha1);
          };

          return sjcl.misc.pbkdf2(hash, salt, iterations, length, prff);
        };

        var salt = 'jBbYTj8zTrOt6V';
        var iter = 1000;
        var SEPARATOR = '|';

        var kdfb = kdfbinary(pass + SEPARATOR + user, salt, iter);
        var kdfb64 = sjcl.codec.base64.fromBits(kdfb);


        var keyBuf = new bitcore.deps.Buffer(kdfb64);
        var passphrase = bitcore.crypto.Hash.sha256sha256(keyBuf).toString('base64');
        var authHeader = new bitcore.deps.Buffer(user + ':' + passphrase).toString('base64');
        var retrieveUrl = serverURL + '/retrieve';
        var getParams = {
          method: 'GET',
          url: retrieveUrl + '?key=' + encodeURIComponent(key) + '&rand=' + Math.random(),
          headers: {
            'Authorization': authHeader,
          },
        };
        $log.debug('Insight GET', getParams);

        $http(getParams)
          .success(function(data) {
            data = JSON.stringify(data);
            $log.info('Fetch from insight OK:' + getParams.url);
            return cb(null, data);
          })
          .error(function() {
            $log.warn('Failed to fetch from insight');
            return cb('PNOTFOUND: Profile not found');
          });
      };

      var localStorageGet = function(key, cb) {
        if (isChromeApp) {
          chrome.storage.local.get(key,
            function(data) {
              return cb(null, data[key]);
            });
        } else {
          var v = localStorage.getItem(key);
          return cb(null, v);
        }
      };

      var get = fromCloud ? insightGet : localStorageGet;

      root._doImport(user, pass, get, cb);
    };

    return root;
  });

'use strict';

angular.module('copayApp.services')
  .factory('localStorageService', function(isChromeApp, nodeWebkit, $timeout) {
    var root = {};
    var ls = ((typeof window.localStorage !== "undefined") ? window.localStorage : null);

    if (isChromeApp && !nodeWebkit.isDefined() && !ls) {
      ls = localStorage = chrome.storage.local;
      window.localStorage = chrome.storage.local;
    }

    if (!ls)
      throw new Error('localstorage not available');

    root.get = function(k, cb) {
      if (isChromeApp && !nodeWebkit.isDefined()) {
        chrome.storage.local.get(k,
          function(data) {
            //TODO check for errors
            return cb(null, data[k]);
          });
      } else {
        return cb(null, ls.getItem(k));
      }
    };

    /**
     * Same as setItem, but fails if an item already exists
     */
    root.create = function(name, value, callback) {
      root.get(name,
        function(err, data) {
          if (data) {
            return callback('EEXISTS');
          } else {
            return root.set(name, value, callback);
          }
        });
    };

    root.set = function(k, v, cb) {
      if (isChromeApp && !nodeWebkit.isDefined()) {
        var obj = {};
        obj[k] = v;

        chrome.storage.local.set(obj, cb);
      } else {
        ls.setItem(k, v);
        return cb();
      }

    };

    root.remove = function(k, cb) {
      if (isChromeApp && !nodeWebkit.isDefined()) {
        chrome.storage.local.remove(k, cb);
      } else {
        ls.removeItem(k);
        return cb();
      }

    };

    return root;
  });
// Step 1
'use strict';
angular.module('copayApp.services')
  .factory('logHeader', function($log, isChromeApp, isCordova, nodeWebkit) {
    $log.info('Starting Copay v' + window.version + ' #' + window.commitHash);
    $log.info('Client: isCordova:', isCordova, 'isChromeApp:', isChromeApp, 'isNodeWebkit:', nodeWebkit.isDefined());
    $log.info('Navigator:', navigator.userAgent);
    return {};
  });

'use strict';

angular.module('copayApp.services').factory('nodeWebkit', function nodeWebkitFactory() {
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

angular.module('copayApp.services').
factory('notification', ['$timeout',
  function($timeout) {

    var notifications = [];

    /*
    ls.getItem('notifications', function(err, data) {
      if (data) {
        notifications = JSON.parse(data);
      }
    });
    */

    var queue = [];
    var settings = {
      info: {
        duration: 6000,
        enabled: true
      },
      funds: {
        duration: 7000,
        enabled: true
      },
      version: {
        duration: 60000,
        enabled: true
      },
      warning: {
        duration: 7000,
        enabled: true
      },
      error: {
        duration: 7000,
        enabled: true
      },
      success: {
        duration: 5000,
        enabled: true
      },
      progress: {
        duration: 0,
        enabled: true
      },
      custom: {
        duration: 35000,
        enabled: true
      },
      details: true,
      localStorage: false,
      html5Mode: false,
      html5DefaultIcon: 'img/favicon.ico'
    };

    function html5Notify(icon, title, content, ondisplay, onclose) {
      if (window.webkitNotifications && window.webkitNotifications.checkPermission() === 0) {
        if (!icon) {
          icon = 'img/favicon.ico';
        }
        var noti = window.webkitNotifications.createNotification(icon, title, content);
        if (typeof ondisplay === 'function') {
          noti.ondisplay = ondisplay;
        }
        if (typeof onclose === 'function') {
          noti.onclose = onclose;
        }
        noti.show();
      } else {
        settings.html5Mode = false;
      }
    }


    return {

      /* ========== SETTINGS RELATED METHODS =============*/

      disableHtml5Mode: function() {
        settings.html5Mode = false;
      },

      disableType: function(notificationType) {
        settings[notificationType].enabled = false;
      },

      enableHtml5Mode: function() {
        // settings.html5Mode = true;
        settings.html5Mode = this.requestHtml5ModePermissions();
      },

      enableType: function(notificationType) {
        settings[notificationType].enabled = true;
      },

      getSettings: function() {
        return settings;
      },

      toggleType: function(notificationType) {
        settings[notificationType].enabled = !settings[notificationType].enabled;
      },

      toggleHtml5Mode: function() {
        settings.html5Mode = !settings.html5Mode;
      },

      requestHtml5ModePermissions: function() {
        if (window.webkitNotifications) {
          if (window.webkitNotifications.checkPermission() === 0) {
            return true;
          } else {
            window.webkitNotifications.requestPermission(function() {
              if (window.webkitNotifications.checkPermission() === 0) {
                settings.html5Mode = true;
              } else {
                settings.html5Mode = false;
              }
            });
            return false;
          }
        } else {
          return false;
        }
      },


      /* ============ QUERYING RELATED METHODS ============*/

      getAll: function() {
        // Returns all notifications that are currently stored
        return notifications;
      },

      getQueue: function() {
        return queue;
      },

      /* ============== NOTIFICATION METHODS ==============*/

      info: function(title, content, userData) {
        return this.awesomeNotify('info', 'fi-info', title, content, userData);
      },

      funds: function(title, content, userData) {
        return this.awesomeNotify('funds', 'icon-receive', title, content, userData);
      },

      version: function(title, content, severe) {
        return this.awesomeNotify('version', severe ? 'fi-alert' : 'fi-flag', title, content);
      },

      error: function(title, content, userData) {
        return this.awesomeNotify('error', 'fi-x', title, content, userData);
      },

      success: function(title, content, userData) {
        return this.awesomeNotify('success', 'fi-check', title, content, userData);
      },

      warning: function(title, content, userData) {
        return this.awesomeNotify('warning', 'fi-alert', title, content, userData);
      },

      new: function(title, content, userData) {
        return this.awesomeNotify('warning', 'fi-plus', title, content, userData);
      },

      sent: function(title, content, userData) {
        return this.awesomeNotify('warning', 'icon-paperplane', title, content, userData);
      },

      awesomeNotify: function(type, icon, title, content, userData) {
        /**
         * Supposed to wrap the makeNotification method for drawing icons using font-awesome
         * rather than an image.
         *
         * Need to find out how I'm going to make the API take either an image
         * resource, or a font-awesome icon and then display either of them.
         * Also should probably provide some bits of color, could do the coloring
         * through classes.
         */
        // image = '<i class="icon-' + image + '"></i>';
        return this.makeNotification(type, false, icon, title, content, userData);
      },

      notify: function(image, title, content, userData) {
        // Wraps the makeNotification method for displaying notifications with images
        // rather than icons
        return this.makeNotification('custom', image, true, title, content, userData);
      },

      makeNotification: function(type, image, icon, title, content, userData) {
        var notification = {
          'type': type,
          'image': image,
          'icon': icon,
          'title': title,
          'content': content,
          'timestamp': +new Date(),
          'userData': userData
        };

        notifications.push(notification);

        if (settings.html5Mode) {
          html5Notify(image, title, content, function() {
            // inner on display function
          }, function() {
            // inner on close function
          });
        }

        //this is done because html5Notify() changes the variable settings.html5Mode
        if (!settings.html5Mode) {
          queue.push(notification);
          $timeout(function removeFromQueueTimeout() {
            queue.splice(queue.indexOf(notification), 1);
          }, settings[type].duration);
        }

        // Mobile notification
        if (window && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        };

        if (document.hidden && (type == 'info' || type == 'funds')) {
          new window.Notification(title, {
            body: content,
            icon: 'img/notification.png'
          });
        }

        this.save();
        return notification;
      },


      /* ============ PERSISTENCE METHODS ============ */

      save: function() {
        // Save all the notifications into localStorage
        if (settings.localStorage) {
          localStorage.setItem('notifications', JSON.stringify(notifications));
        }
      },

      restore: function() {
        // Load all notifications from localStorage
      },

      clear: function() {
        notifications = [];
        this.save();
      }

    };
  }
]).directive('notifications', function(notification, $compile) {
  /**
   *
   * It should also parse the arguments passed to it that specify
   * its position on the screen like "bottom right" and apply those
   * positions as a class to the container element
   *
   * Finally, the directive should have its own controller for
   * handling all of the notifications from the notification service
   */
  function link(scope, element, attrs) {
    var position = attrs.notifications;
    position = position.split(' ');
    element.addClass('dr-notification-container');
    for (var i = 0; i < position.length; i++) {
      element.addClass(position[i]);
    }
  }

  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'views/includes/notifications.html',
    link: link,
    controller: ['$scope',
      function NotificationsCtrl($scope) {
        $scope.queue = notification.getQueue();

        $scope.removeNotification = function(noti) {
          $scope.queue.splice($scope.queue.indexOf(noti), 1);
        };
      }
    ]

  };
});

'use strict';
angular.module('copayApp.services')
  .factory('notificationService', function profileServiceFactory($filter, notification, lodash, configService, gettext) {

    var root = {};

    var groupingTime = 5000;
    var lastNotificationOnWallet = {};

    root.getLast = function(walletId) {
      var last = lastNotificationOnWallet[walletId];
      if (!last) return null;

      return Date.now() - last.ts < groupingTime ? last : null;
    };

    root.storeLast = function(notificationData, walletId) {

      if (notificationData.type == 'NewAddress')
        return;

      lastNotificationOnWallet[walletId] = {
        creatorId: notificationData.creatorId,
        type: notificationData.type,
        ts: Date.now(),
      };
    };

    root.shouldSkip = function(notificationData, last) {
      if (!last) return false;

      // rules...
      if (last.type === 'NewTxProposal'
          && notificationData.type === 'TxProposalAcceptedBy')
        return true;

      if (last.type === 'TxProposalFinallyAccepted'
          && notificationData.type === 'NewOutgoingTx')
        return true;

      if (last.type === 'TxProposalRejectedBy'
          && notificationData.type === 'TxProposalFinallyRejected')
        return true;

      return false;
    };


    root.newBWCNotification = function(notificationData, walletId, walletName) {
      var last = root.getLast(walletId);
      root.storeLast(notificationData, walletId);

      if (root.shouldSkip(notificationData, last))
        return;

      var config = configService.getSync();
      config.colorFor = config.colorFor || {};
      var color = config.colorFor[walletId] || '#7A8C9E';
      var name = config.aliasFor[walletId] || walletName;

      switch (notificationData.type) {
        case 'NewTxProposal':
          notification.new(gettext('New Payment Proposal'),
            name, {color: color} );
          break;
        case 'TxProposalAcceptedBy':
          notification.success(gettext('Payment Proposal Signed by Copayer'),
            name, {color: color} );
          break;
        case 'TxProposalRejectedBy':
          notification.error(gettext('Payment Proposal Rejected by Copayer'),
            name, {color: color} );
          break;
        case 'TxProposalFinallyRejected':
          notification.error(gettext('Payment Proposal Rejected'),
            name, {color: color} );
          break;
        case 'NewOutgoingTx':
          notification.sent(gettext('Payment Sent'),
            name, {color: color} );
          break;
        case 'NewIncomingTx':
          notification.funds(gettext('Funds received'),
            name, {color: color} );
          break;
        case 'ScanFinished':
          notification.success(gettext('Scan Finished'),
            name, {color: color} );
          break;

        case 'NewCopayer':
          // No UX notification
          break;
        case 'BalanceUpdated':
          // No UX notification
          break;
      }
    };

    return root;
  });

'use strict';
angular.module('copayApp.services')
  .factory('profileService', function profileServiceFactory($rootScope, $location, $timeout, $filter, $log, lodash, storageService, bwcService, configService, notificationService, isChromeApp, isCordova, gettext, gettextCatalog, nodeWebkit, bwsError, uxLanguage, ledger, bitcore, trezor) {

    var root = {};

    var FOREGROUND_UPDATE_PERIOD = 5;
    var BACKGROUND_UPDATE_PERIOD = 30;

    root.profile = null;
    root.focusedClient = null;
    root.walletClients = {};

    root.Utils = bwcService.getUtils();
    root.formatAmount = function(amount) {
      var config = configService.getSync().wallet.settings;
      if (config.unitCode == 'sat') return amount;

      //TODO : now only works for english, specify opts to change thousand separator and decimal separator
      return this.Utils.formatAmount(amount, config.unitCode);
    };

    root._setFocus = function(walletId, cb) {
      $log.debug('Set focus:', walletId);

      // Set local object
      if (walletId)
        root.focusedClient = root.walletClients[walletId];
      else
        root.focusedClient = [];

      if (lodash.isEmpty(root.focusedClient)) {
        root.focusedClient = root.walletClients[lodash.keys(root.walletClients)[0]];
      }

      // Still nothing?
      if (lodash.isEmpty(root.focusedClient)) {
        $rootScope.$emit('Local/NoWallets');
      } else {
        $rootScope.$emit('Local/NewFocusedWallet');

        // Set update period
        lodash.each(root.walletClients, function(client, id) {
          client.setNotificationsInterval(BACKGROUND_UPDATE_PERIOD);
        });
        root.focusedClient.setNotificationsInterval(FOREGROUND_UPDATE_PERIOD);
      }

      return cb();
    };

    root.setAndStoreFocus = function(walletId, cb) {
      root._setFocus(walletId, function() {
        storageService.storeFocusedWalletId(walletId, cb);
      });
    };

    root.setBaseURL = function(walletId) {
      var config = configService.getSync();
      var defaults = configService.getDefaults();

      bwcService.setBaseUrl((config.bwsFor && config.bwsFor[walletId]) || defaults.bws.url);
      bwcService.setTransports(['polling']);
    }

    root.setWalletClient = function(credentials) {
      if (root.walletClients[credentials.walletId] &&
        root.walletClients[credentials.walletId].started) {
        return;
      }

      root.setBaseURL(credentials.walletId);

      var client = bwcService.getClient(JSON.stringify(credentials));
      root.walletClients[credentials.walletId] = client;
      client.removeAllListeners();

      client.on('notification', function(n) {
        $log.debug('BWC Notification:', n);
        notificationService.newBWCNotification(n,
          client.credentials.walletId, client.credentials.walletName);

        if (root.focusedClient.credentials.walletId == client.credentials.walletId) {
          $rootScope.$emit(n.type, n);
        } else {
          $rootScope.$apply();
        }
      });

      client.on('walletCompleted', function() {
        $log.debug('Wallet completed');

        root.updateCredentialsFC(function() {
          $rootScope.$emit('Local/WalletCompleted')
        });

      });

      root.walletClients[credentials.walletId].started = true;
      root.walletClients[credentials.walletId].doNotVerifyPayPro = isChromeApp;

      client.initialize({}, function(err) {
        if (err) {
          $log.error('Could not init notifications err:', err);
          return;
        }
        client.setNotificationsInterval(BACKGROUND_UPDATE_PERIOD);
      });
    }

    root.setWalletClients = function() {
      var credentials = root.profile.credentials;
      lodash.each(credentials, function(credentials) {
        root.setWalletClient(credentials);
      });
      $rootScope.$emit('Local/WalletListUpdated');
    };

    root.bindProfile = function(profile, cb) {
      root.profile = profile;
      
      configService.get(function(err) {
        $log.debug('Preferences read');
        if (err) return cb(err);
        root.setWalletClients();
        storageService.getFocusedWalletId(function(err, focusedWalletId) {
          if (err) return cb(err);
          root._setFocus(focusedWalletId, function() {
            $rootScope.$emit('Local/ProfileBound');
            root.isDisclaimerAccepted(function(val) {
              if (!val) { 
                return cb(new Error('NONAGREEDDISCLAIMER: Non agreed disclaimer'));
              }
              else {
                return cb();
              }
            });
          });
        });
      });
        
    };

    root.loadAndBindProfile = function(cb) { 
      storageService.getProfile(function(err, profile) {
        if (err) {
          $rootScope.$emit('Local/DeviceError', err);
          return cb(err);
        }
        if (!profile) {
          // Migration??
          storageService.tryToMigrate(function(err, migratedProfile) {
            if (err) return cb(err);
            if (!migratedProfile)
              return cb(new Error('NOPROFILE: No profile'));

            profile = migratedProfile;
            return root.bindProfile(profile, cb);
          })
        } else {
          $log.debug('Profile read');
          return root.bindProfile(profile, cb);
        }
      });
    };

    root._seedWallet = function(opts, cb) {
      opts = opts || {};
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();
      var network = opts.networkName || 'livenet';


      if (opts.mnemonic) {
        try {
          opts.mnemonic = root._normalizeMnemonic(opts.mnemonic);
          walletClient.seedFromMnemonic(opts.mnemonic, {
            network: network,
            passphrase: opts.passphrase,
            account: opts.account || 0,
            derivationStrategy: opts.derivationStrategy || 'BIP44',
          });

        } catch (ex) {
          $log.info(ex);
          return cb(gettext('Could not create: Invalid wallet seed'));
        }
      } else if (opts.extendedPrivateKey) {
        try {
          walletClient.seedFromExtendedPrivateKey(opts.extendedPrivateKey);
        } catch (ex) {
          $log.warn(ex);
          return cb(gettext('Could not create using the specified extended private key'));
        }
      } else if (opts.extendedPublicKey) {
        try {
          walletClient.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
            account: opts.account || 0,
            derivationStrategy: opts.derivationStrategy || 'BIP44',
          });
        } catch (ex) {
          $log.warn("Creating wallet from Extended Public Key Arg:", ex, opts);
          return cb(gettext('Could not create using the specified extended public key'));
        }
      } else {
        var lang = uxLanguage.getCurrentLanguage();
        try {
          walletClient.seedFromRandomWithMnemonic({
            network: network,
            passphrase: opts.passphrase,
            language: lang,
            account: 0,
          });
        } catch (e) {
          $log.info('Error creating seed: ' + e.message);
          if (e.message.indexOf('language') > 0) {
            $log.info('Using default language for mnemonic');
            walletClient.seedFromRandomWithMnemonic({
              network: network,
              passphrase: opts.passphrase,
              account: 0,
            });
          } else {
            return cb(e);
          }
        }
      }
      return cb(null, walletClient);
    };

    root._createNewProfile = function(opts, cb) {

      if (opts.noWallet) {
        return cb(null, Profile.create());
      }

      root._seedWallet({}, function(err, walletClient) {
        if (err) return cb(err);

        var walletName = gettextCatalog.getString('Personal Wallet');
        var me = gettextCatalog.getString('me');
        walletClient.createWallet(walletName, me, 1, 1, {
          network: 'livenet'
        }, function(err) {
          if (err) return bwsError.cb(err, gettext('Error creating wallet'), cb);
          var p = Profile.create({
            credentials: [JSON.parse(walletClient.export())],
          });
          return cb(null, p);
        });
      })
    };

    root.createWallet = function(opts, cb) {
      $log.debug('Creating Wallet:', opts);
      root._seedWallet(opts, function(err, walletClient) {
        if (err) return cb(err);

        walletClient.createWallet(opts.name, opts.myName || 'me', opts.m, opts.n, {
          network: opts.networkName
        }, function(err, secret) {
          if (err) return bwsError.cb(err, gettext('Error creating wallet'), cb);

          root._addWalletClient(walletClient, opts, cb);
        })
      });
    };

    root.joinWallet = function(opts, cb) {
      var walletClient = bwcService.getClient();
      $log.debug('Joining Wallet:', opts);

      try {
        var walletData = bwcService.parseSecret(opts.secret);

        // check if exist
        if (lodash.find(root.profile.credentials, {
            'walletId': walletData.walletId
          })) {
          return cb(gettext('Cannot join the same wallet more that once'));
        }
      } catch (ex) {
        $log.debug(ex);
        return cb(gettext('Bad wallet invitation'));
      }
      opts.networkName = walletData.network;
      $log.debug('Joining Wallet:', opts);

      root._seedWallet(opts, function(err, walletClient) {
        if (err) return cb(err);

        walletClient.joinWallet(opts.secret, opts.myName || 'me', {}, function(err) {
          if (err) return bwsError.cb(err, gettext('Could not join wallet'), cb);
          root._addWalletClient(walletClient, opts, cb);
        });
      });
    };

    root.getClient = function(walletId) {
      return root.walletClients[walletId];
    };

    root.deleteWalletFC = function(opts, cb) {
      var fc = root.focusedClient;
      var walletId = fc.credentials.walletId;
      $log.debug('Deleting Wallet:', fc.credentials.walletName);

      fc.removeAllListeners();
      root.profile.credentials = lodash.reject(root.profile.credentials, {
        walletId: walletId
      });

      delete root.walletClients[walletId];
      root.focusedClient = null;

      storageService.clearLastAddress(walletId, function(err) {
        if (err) $log.warn(err);
      });

      storageService.removeTxHistory(walletId, function(err) {
        if (err) $log.warn(err);
      });

      storageService.clearBackupFlag(walletId, function(err) {
        if (err) $log.warn(err);
      });

      $timeout(function() {
        root.setWalletClients();
        root.setAndStoreFocus(null, function() {
          storageService.storeProfile(root.profile, function(err) {
            if (err) return cb(err);
            return cb();
          });
        });
      });
    };

    root.setMetaData = function(walletClient, addressBook, historyCache, cb) {
      storageService.getAddressbook(walletClient.credentials.network, function(err, localAddressBook) {
        var localAddressBook1 = {};
        try {
          localAddressBook1 = JSON.parse(localAddressBook);
        } catch (ex) {
          $log.warn(ex);
        }
        var mergeAddressBook = lodash.merge(addressBook, localAddressBook1);
        storageService.setAddressbook(walletClient.credentials.network, JSON.stringify(addressBook), function(err) {
          if (err) return cb(err);
          storageService.setTxHistory(JSON.stringify(historyCache), walletClient.credentials.walletId, function(err) {
            if (err) return cb(err);
            return cb(null);
          });
        });
      });
    }

    root._addWalletClient = function(walletClient, opts, cb) {
      var walletId = walletClient.credentials.walletId;

      // check if exist
      var w = lodash.find(root.profile.credentials, {
        'walletId': walletId
      });
      if (w) {
        return cb(gettext('Wallet already in Copay' + ": ") + w.walletName);
      }

      var defaults = configService.getDefaults();
      var bwsFor = {};
      bwsFor[walletId] = opts.bwsurl || defaults.bws.url;

      configService.set({
        bwsFor: bwsFor,
      }, function(err) {
        if (err) console.log(err);

        root.profile.credentials.push(JSON.parse(walletClient.export()));
        root.setWalletClients();


        var handleImport = function(cb) {
          var isImport = opts.mnemonic || opts.externalSource || opts.extendedPrivateKey;

          if (!isImport)
            return cb();

          $rootScope.$emit('Local/BackupDone', walletId);

          if (!walletClient.isComplete())
            return cb();

          storageService.setCleanAndScanAddresses(walletId, cb);
        };

        handleImport(function() {
          root.setAndStoreFocus(walletId, function() {
            storageService.storeProfile(root.profile, function(err) {
              return cb(err, walletId);
            });
          });
        });
      });
    };

    root.importWallet = function(str, opts, cb) {
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();

      $log.debug('Importing Wallet:', opts);
      try {
        walletClient.import(str, {
          compressed: opts.compressed,
          password: opts.password
        });
      } catch (err) {
        return cb(gettext('Could not import. Check input file and password'));
      }

      str = JSON.parse(str);

      var addressBook = str.addressBook || {};
      var historyCache = str.historyCache ||  [];

      root._addWalletClient(walletClient, opts, function(err, walletId) {
        if (err) return cb(err);
        root.setMetaData(walletClient, addressBook, historyCache, function(error) {
          if (error) console.log(error);
          return cb(err, walletId);
        });
      });
    };

    root.importExtendedPrivateKey = function(xPrivKey, opts, cb) {
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();
      $log.debug('Importing Wallet xPrivKey');

      walletClient.importFromExtendedPrivateKey(xPrivKey, function(err) {
        if (err)
          return bwsError.cb(err, gettext('Could not import'), cb);

        root._addWalletClient(walletClient, opts, cb);
      });
    };

    root._normalizeMnemonic = function(words) {
      var isJA = words.indexOf('\u3000') > -1;
      var wordList = words.split(/[\u3000\s]+/);

      return wordList.join(isJA ? '\u3000' : ' ');
    };

    root.importMnemonic = function(words, opts, cb) {
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();

      $log.debug('Importing Wallet Mnemonic');

      words = root._normalizeMnemonic(words);
      walletClient.importFromMnemonic(words, {
        network: opts.networkName,
        passphrase: opts.passphrase,
        account: opts.account || 0,
      }, function(err) {
        if (err)
          return bwsError.cb(err, gettext('Could not import'), cb);

        root._addWalletClient(walletClient, opts, cb);
      });
    };

    root.importExtendedPublicKey = function(opts, cb) {
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();
      $log.debug('Importing Wallet XPubKey');

      walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
      }, function(err) {
        if (err) {

          // in HW wallets, req key is always the same. They can't addAccess.
          if (err.code == 'NOT_AUTHORIZED')
            err.code = 'WALLET_DOES_NOT_EXIST';

          return bwsError.cb(err, gettext('Could not import'), cb);
        }

        root._addWalletClient(walletClient, opts, cb);
      });
    };

    root.create = function(opts, cb) {
      $log.info('Creating profile');
      var defaults = configService.getDefaults();

      configService.get(function(err) {
        bwcService.setBaseUrl(defaults.bws.url);
        bwcService.setTransports(['polling']);
        root._createNewProfile(opts, function(err, p) {
          if (err) return cb(err);

          root.bindProfile(p, function(err) {
            storageService.storeNewProfile(p, function(err) {
              return cb(err);
            });
          });
        });
      });
    };

    root.setDisclaimerAccepted = function(cb) {
      storageService.getProfile(function(err, profile) {
        profile.disclaimerAccepted = true;
        storageService.storeProfile(profile, function(err) {
          return cb(err);
        });
      });
    };

    root.isDisclaimerAccepted = function(cb) {
      storageService.getProfile(function(err, profile) {
        if (profile && profile.disclaimerAccepted)
          return cb(true);
        else if (profile && !profile.disclaimerAccepted) {
          storageService.getCopayDisclaimerFlag(function(err, val) {
            if (val) {
              profile.disclaimerAccepted = true;
              storageService.storeProfile(profile, function(err) {
                if (err) $log.error(err);
                return cb(true);
              });
            }
            else {
              return cb();
            }
          });
        }
        else {
          return cb();
        }
      });   
    };

    root.importLegacyWallet = function(username, password, blob, cb) {
      var walletClient = bwcService.getClient();

      walletClient.createWalletFromOldCopay(username, password, blob, function(err, existed) {
        if (err) return cb(gettext('Error importing wallet: ') + err);

        if (root.walletClients[walletClient.credentials.walletId]) {
          $log.debug('Wallet:' + walletClient.credentials.walletName + ' already imported');
          return cb(gettext('Wallet Already Imported: ') + walletClient.credentials.walletName);
        };

        $log.debug('Creating Wallet:', walletClient.credentials.walletName);
        root.profile.credentials.push(JSON.parse(walletClient.export()));
        root.setWalletClients();
        root.setAndStoreFocus(walletClient.credentials.walletId, function() {
          storageService.storeProfile(root.profile, function(err) {
            return cb(null, walletClient.credentials.walletId, walletClient.credentials.walletName, existed);
          });
        });
      });
    };

    root.updateCredentialsFC = function(cb) {
      var fc = root.focusedClient;

      var newCredentials = lodash.reject(root.profile.credentials, {
        walletId: fc.credentials.walletId
      });
      newCredentials.push(JSON.parse(fc.export()));
      root.profile.credentials = newCredentials;

      storageService.storeProfile(root.profile, cb);
    };


    root.setPrivateKeyEncryptionFC = function(password, cb) {
      var fc = root.focusedClient;
      $log.debug('Encrypting private key for', fc.credentials.walletName);

      fc.setPrivateKeyEncryption(password);
      root.lockFC();
      root.updateCredentialsFC(function() {
        $log.debug('Wallet encrypted');
        return cb();
      });
    };


    root.disablePrivateKeyEncryptionFC = function(cb) {
      var fc = root.focusedClient;
      $log.debug('Disabling private key encryption for', fc.credentials.walletName);

      try {
        fc.disablePrivateKeyEncryption();
      } catch (e) {
        return cb(e);
      }
      root.updateCredentialsFC(function() {
        $log.debug('Wallet encryption disabled');
        return cb();
      });
    };

    root.lockFC = function() {
      var fc = root.focusedClient;
      try {
        fc.lock();
      } catch (e) {};
    };

    root.unlockFC = function(cb) {
      var fc = root.focusedClient;
      $log.debug('Wallet is encrypted');
      $rootScope.$emit('Local/NeedsPassword', false, function(err2, password) {
        if (err2 || !password) {
          return cb({
            message: (err2 || gettext('Password needed'))
          });
        }
        try {
          fc.unlock(password);
        } catch (e) {
          $log.debug(e);
          return cb({
            message: gettext('Wrong password')
          });
        }
        $timeout(function() {
          if (fc.hasPrivKeyEncrypted()) {
            $log.debug('Locking wallet automatically');
            root.lockFC();
          };
        }, 2000);
        return cb();
      });
    };

    root.getWallets = function(network) {
      if (!root.profile) return [];

      var config = configService.getSync();
      config.colorFor = config.colorFor || {};
      config.aliasFor = config.aliasFor || {};
      var ret = lodash.map(root.profile.credentials, function(c) {
        return {
          m: c.m,
          n: c.n,
          name: config.aliasFor[c.walletId] || c.walletName,
          id: c.walletId,
          network: c.network,
          color: config.colorFor[c.walletId] || '#4A90E2'
        };
      });
      ret = lodash.filter(ret, function(w) {
        return (w.network == network);
      });
      return lodash.sortBy(ret, 'name');
    };

    root._signWithLedger = function(txp, cb) {
      var fc = root.focusedClient;
      $log.info('Requesting Ledger Chrome app to sign the transaction');

      ledger.signTx(txp, fc.credentials.account, function(result) {
        $log.debug('Ledger response', result);
        if (!result.success)
          return cb(result.message || result.error);

        txp.signatures = lodash.map(result.signatures, function(s) {
          return s.substring(0, s.length - 2);
        });
        return fc.signTxProposal(txp, cb);
      });
    };


    root._signWithTrezor = function(txp, cb) {
      var fc = root.focusedClient;
      $log.info('Requesting Trezor  to sign the transaction');

      var xPubKeys = lodash.pluck(fc.credentials.publicKeyRing, 'xPubKey');
      trezor.signTx(xPubKeys, txp, fc.credentials.account, function(err, result) {
        if (err) return cb(err);

        $log.debug('Trezor response', result);
        txp.signatures = result.signatures;
        return fc.signTxProposal(txp, cb);
      });
    };


    root.signTxProposal = function(txp, cb) {
      var fc = root.focusedClient;

      if (fc.isPrivKeyExternal()) {
        switch (fc.getPrivKeyExternalSourceName()) {
          case 'ledger':
            return root._signWithLedger(txp, cb);
          case 'trezor':
            return root._signWithTrezor(txp, cb);
          default:
            var msg = 'Unsupported External Key:' + fc.getPrivKeyExternalSourceName();
            $log.error(msg);
            return cb(msg);
        }
      } else {
        return fc.signTxProposal(txp, function(err, signedTxp) {
          root.lockFC();
          return cb(err, signedTxp);
        });
      }
    };

    return root;
  });

'use strict';

//var util = require('util');
//var _ = require('lodash');
//var log = require('../util/log');
//var preconditions = require('preconditions').singleton();
//var request = require('request');

/*
  This class lets interfaces with BitPay's exchange rate API.
*/

var RateService = function(opts) {
  var self = this;

  opts = opts || {};
  self.httprequest = opts.httprequest; // || request;
  self.lodash = opts.lodash;

  self.SAT_TO_BTC = 1 / 1e8;
  self.BTC_TO_SAT = 1e8;
  self.UNAVAILABLE_ERROR = 'Service is not available - check for service.isAvailable() or use service.whenAvailable()';
  self.UNSUPPORTED_CURRENCY_ERROR = 'Currency not supported';

  self._url = opts.url || 'https://insight.bitpay.com:443/api/rates';

  self._isAvailable = false;
  self._rates = {};
  self._alternatives = [];
  self._queued = [];

  self._fetchCurrencies();
};


var _instance;
RateService.singleton = function(opts) {
  if (!_instance) {
    _instance = new RateService(opts);
  }
  return _instance;
};

RateService.prototype._fetchCurrencies = function() {
  var self = this;

  var backoffSeconds = 5;
  var updateFrequencySeconds = 5 * 60;
  var rateServiceUrl = 'https://bitpay.com/api/rates';

  var retrieve = function() {
    //log.info('Fetching exchange rates');
    self.httprequest.get(rateServiceUrl).success(function(res) {
      self.lodash.each(res, function(currency) {
        self._rates[currency.code] = currency.rate;
        self._alternatives.push({
          name: currency.name,
          isoCode: currency.code,
          rate: currency.rate
        });
      });
      self._isAvailable = true;
      self.lodash.each(self._queued, function(callback) {
        setTimeout(callback, 1);
      });
      setTimeout(retrieve, updateFrequencySeconds * 1000);
    }).error(function(err) {
      //log.debug('Error fetching exchange rates', err);
      setTimeout(function() {
        backoffSeconds *= 1.5;
        retrieve();
      }, backoffSeconds * 1000);
      return;
    });

  };

  retrieve();
};

RateService.prototype.getRate = function(code) {
  return this._rates[code];
};

RateService.prototype.getHistoricRate = function(code, date, cb) {
  var self = this;

  self.httprequest.get(self._url + '/' + code + '?ts=' + date)
    .success(function(body) {
      return cb(null, body.rate)
    })
    .error(function(err) {
      return cb(err)
    });

};

RateService.prototype.getHistoricRates = function(code, dates, cb) {
  var self = this;

  var tsList = dates.join(',');

  self.httprequest.get(self._url + '/' + code + '?ts=' + tsList)
    .success(function(body) {
      if (!self.lodash.isArray(body)) {
        body = [{
          ts: dates[0],
          rate: body.rate
        }];
      }
      return cb(null, body);
    })
    .error(function(err) {
      return cb(err)
    });
};

RateService.prototype.getAlternatives = function() {
  return this._alternatives;
};

RateService.prototype.isAvailable = function() {
  return this._isAvailable;
};

RateService.prototype.whenAvailable = function(callback) {
  if (this.isAvailable()) {
    setTimeout(callback, 1);
  } else {
    this._queued.push(callback);
  }
};

RateService.prototype.toFiat = function(satoshis, code) {
  if (!this.isAvailable()) {
    return null;
  }

  return satoshis * this.SAT_TO_BTC * this.getRate(code);
};

RateService.prototype.toFiatHistoric = function(satoshis, code, date, cb) {
  var self = this;

  self.getHistoricRate(code, date, function(err, rate) {
    if (err) return cb(err);
    return cb(null, satoshis * self.SAT_TO_BTC * rate);
  });
};

RateService.prototype.fromFiat = function(amount, code) {
  if (!this.isAvailable()) {
    return null;
  }
  return amount / this.getRate(code) * this.BTC_TO_SAT;
};

RateService.prototype.listAlternatives = function() {
  var self = this;
  if (!this.isAvailable()) {
    return [];
  }

  return self.lodash.map(this.getAlternatives(), function(item) {
    return {
      name: item.name,
      isoCode: item.isoCode
    }
  });
};

angular.module('copayApp.services').factory('rateService', function($http, lodash) {
  // var cfg = _.extend(config.rates, {
  //   httprequest: $http
  // });

  var cfg = {
    httprequest: $http,
    lodash: lodash
  };
  return RateService.singleton(cfg);
});


'use strict';
angular.module('copayApp.services')
  .factory('sjcl', function bitcoreFactory(bwcService) {
    var sjcl = bwcService.getSJCL();
    return sjcl;
  });


/// Step 2
'use strict';
angular.module('copayApp.services')
  .factory('storageService', function(logHeader, fileStorageService, localStorageService, sjcl, $log, lodash, isCordova) {

    var root = {};

    // File storage is not supported for writting according to 
    // https://github.com/apache/cordova-plugin-file/#supported-platforms
    var shouldUseFileStorage = isCordova && !isMobile.Windows();
    $log.debug('Using file storage:', shouldUseFileStorage);


    var storage = shouldUseFileStorage ? fileStorageService : localStorageService;

    var getUUID = function(cb) {
      // TO SIMULATE MOBILE
      //return cb('hola');
      if (!window || !window.plugins || !window.plugins.uniqueDeviceID)
        return cb(null);

      window.plugins.uniqueDeviceID.get(
        function(uuid) {
          return cb(uuid);
        }, cb);
    };

    var encryptOnMobile = function(text, cb) {

      // UUID encryption is disabled.
      return cb(null, text);
      //
      // getUUID(function(uuid) {
      //   if (uuid) {
      //     $log.debug('Encrypting profile');
      //     text = sjcl.encrypt(uuid, text);
      //   }
      //   return cb(null, text);
      // });
    };


    var decryptOnMobile = function(text, cb) {
      var json;
      try {
        json = JSON.parse(text);
        console.log("Got value:"+text);
      } catch (e) {};

      if (!json) return cb('Could not access storage');

      if (!json.iter || !json.ct) {
        $log.debug('Profile is not encrypted');
        return cb(null, text);
      }

      $log.debug('Profile is encrypted');
      getUUID(function(uuid) {
        $log.debug('Device UUID:' + uuid);
        if (!uuid)
          return cb('Could not decrypt storage: could not get device ID');

        try {
          text = sjcl.decrypt(uuid, text);

          $log.info('Migrating to unencrypted profile');
          return storage.set('profile', text, function(err) {
            return cb(err, text);
          });
        } catch (e) {
          $log.warn('Decrypt error: ', e);
          return cb('Could not decrypt storage: device ID mismatch');
        };
        return cb(null, text);
      });
    };



    root.tryToMigrate = function(cb) {
      if (!shouldUseFileStorage) return cb();

      localStorageService.get('profile', function(err, str) {
        if (err) return cb(err);
        if (!str) return cb();

        $log.info('Starting Migration profile to File storage...');

        fileStorageService.create('profile', str, function(err) {
          if (err) cb(err);
          $log.info('Profile Migrated successfully');

          localStorageService.get('config', function(err, c) {
            if (err) return cb(err);
            if (!c) return root.getProfile(cb);

            fileStorageService.create('config', c, function(err) {

              if (err) {
                $log.info('Error migrating config: ignoring', err);
                return root.getProfile(cb);
              }
              $log.info('Config Migrated successfully');
              return root.getProfile(cb);
            });
          });
        });
      });
    };

    root.storeNewProfile = function(profile, cb) {
      encryptOnMobile(profile.toObj(), function(err, x) {
        storage.create('profile', x, cb);
      });
    };

    root.storeProfile = function(profile, cb) {
      encryptOnMobile(profile.toObj(), function(err, x) {
        storage.set('profile', x, cb);
      });
    };

    root.getProfile = function(cb) {
      storage.get('profile', function(err, str) {
        if (err || !str)
          return cb(err);

        decryptOnMobile(str, function(err, str) {
          if (err) return cb(err);
          var p, err;
          try {
            p = Profile.fromString(str);
          } catch (e) {
            $log.debug('Could not read profile:', e);
            err = new Error('Could not read profile:' + p);
          }
          return cb(err, p);
        });
      });
    };

    root.deleteProfile = function(cb) {
      storage.remove('profile', cb);
    };

    root.storeFocusedWalletId = function(id, cb) {
      storage.set('focusedWalletId', id || '', cb);
    };

    root.getFocusedWalletId = function(cb) {
      storage.get('focusedWalletId', cb);
    };

    root.getLastAddress = function(walletId, cb) {
      storage.get('lastAddress-' + walletId, cb);
    };

    root.storeLastAddress = function(walletId, address, cb) {
      storage.set('lastAddress-' + walletId, address, cb);
    };

    root.clearLastAddress = function(walletId, cb) {
      storage.remove('lastAddress-' + walletId, cb);
    };

    root.setBackupFlag = function(walletId, cb) {
      storage.set('backup-' + walletId, Date.now(), cb);
    };

    root.getBackupFlag = function(walletId, cb) {
      storage.get('backup-' + walletId, cb);
    };

    root.clearBackupFlag = function(walletId, cb) {
      storage.remove('backup-' + walletId, cb);
    };

    root.setCleanAndScanAddresses = function(walletId, cb) {
      storage.set('CleanAndScanAddresses', walletId, cb);
    };

    root.getCleanAndScanAddresses = function(cb) {
      storage.get('CleanAndScanAddresses', cb);
    };

    root.removeCleanAndScanAddresses = function(cb) {
      storage.remove('CleanAndScanAddresses', cb);
    };

    root.getConfig = function(cb) {
      storage.get('config', cb);
    };

    root.storeConfig = function(val, cb) {
      $log.debug('Storing Preferences', val);
      storage.set('config', val, cb);
    };

    root.clearConfig = function(cb) {
      storage.remove('config', cb);
    };

    //for compatibility
    root.getCopayDisclaimerFlag = function(cb) {
      storage.get('agreeDisclaimer', cb);
    };

    root.setRemotePrefsStoredFlag = function(cb) {
      storage.set('remotePrefStored', true, cb);
    };

    root.getRemotePrefsStoredFlag = function(cb) {
      storage.get('remotePrefStored', cb);
    };

    root.setGlideraToken = function(network, token, cb) {
      storage.set('glideraToken-' + network, token, cb);
    };

    root.getGlideraToken = function(network, cb) {
      storage.get('glideraToken-' + network, cb);
    };

    root.removeGlideraToken = function(network, cb) {
      storage.remove('glideraToken-' + network, cb);
    };

    root.setAddressbook = function(network, addressbook, cb) {
      storage.set('addressbook-' + network, addressbook, cb);
    };

    root.getAddressbook = function(network, cb) {
      storage.get('addressbook-' + network, cb);
    };

    root.removeAddressbook = function(network, cb) {
      storage.remove('addressbook-' + network, cb);
    };

    root.setTxHistory = function(txs, walletId, cb) {
      storage.set('txsHistory-' + walletId, txs, cb);
    }

    root.getTxHistory = function(walletId, cb) {
      storage.get('txsHistory-' + walletId, cb);
    }

    root.removeTxHistory = function(walletId, cb) {
      storage.remove('txsHistory-' + walletId, cb);
    }

    return root;
  });

'use strict';

/*  
 * This is a modification from https://github.com/angular/angular.js/blob/master/src/ngTouch/swipe.js
 */


angular.module('copayApp.services')
  .factory('$swipe', [
  function() {
    // The total distance in any direction before we make the call on swipe vs. scroll.
    var MOVE_BUFFER_RADIUS = 10;

    var POINTER_EVENTS = {
      'touch': {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
      }
    };

    function getCoordinates(event) {
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

      return {
        x: e.clientX,
        y: e.clientY
      };
    }

    function getEvents(pointerTypes, eventType) {
      var res = [];
      angular.forEach(pointerTypes, function(pointerType) {
        var eventName = POINTER_EVENTS[pointerType][eventType];
        if (eventName) {
          res.push(eventName);
        }
      });
      return res.join(' ');
    }

    return {
      /**
       * @ngdoc method
       * @name $swipe#bind
       *
       * @description
       * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
       * object containing event handlers.
       * The pointer types that should be used can be specified via the optional
       * third argument, which is an array of strings `'mouse'` and `'touch'`. By default,
       * `$swipe` will listen for `mouse` and `touch` events.
       *
       * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
       * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }`.
       *
       * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
       * watching for `touchmove` or `mousemove` events. These events are ignored until the total
       * distance moved in either dimension exceeds a small threshold.
       *
       * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
       * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
       * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
       *   A `cancel` event is sent.
       *
       * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
       * a swipe is in progress.
       *
       * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
       *
       * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
       * as described above.
       *
       */
      bind: function(element, eventHandlers, pointerTypes) {
        // Absolute total movement, used to control swipe vs. scroll.
        var totalX, totalY;
        // Coordinates of the start position.
        var startCoords;
        // Last event's position.
        var lastPos;
        // Whether a swipe is active.
        var active = false;

        pointerTypes = pointerTypes || ['touch'];
        element.on(getEvents(pointerTypes, 'start'), function(event) {
          startCoords = getCoordinates(event);
          active = true;
          totalX = 0;
          totalY = 0;
          lastPos = startCoords;
          eventHandlers['start'] && eventHandlers['start'](startCoords, event);
        });
        var events = getEvents(pointerTypes, 'cancel');
        if (events) {
          element.on(events, function(event) {
            active = false;
            eventHandlers['cancel'] && eventHandlers['cancel'](event);
          });
        }

        element.on(getEvents(pointerTypes, 'move'), function(event) {
          if (!active) return;

          // Android will send a touchcancel if it thinks we're starting to scroll.
          // So when the total distance (+ or - or both) exceeds 10px in either direction,
          // we either:
          // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
          // - On totalY > totalX, we let the browser handle it as a scroll.

          if (!startCoords) return;
          var coords = getCoordinates(event);

          totalX += Math.abs(coords.x - lastPos.x);
          totalY += Math.abs(coords.y - lastPos.y);

          lastPos = coords;

          if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
            return;
          }

          // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
          if (totalY > totalX) {
            // Allow native scrolling to take over.
            active = false;
            eventHandlers['cancel'] && eventHandlers['cancel'](event);
            return;
          } else {

            // Prevent the browser from scrolling.
            event.preventDefault();
            eventHandlers['move'] && eventHandlers['move'](coords, event);
          }
        });

        element.on(getEvents(pointerTypes, 'end'), function(event) {
          if (!active) return;
          active = false;
          eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
        });
      }
    };
  }
]);



'use strict';

angular.module('copayApp.services')
  .factory('trezor', function($log, $timeout, gettext, lodash, bitcore, hwWallet) {
    var root = {};

    var SETTLE_TIME = 3000;
    root.callbacks = {};

    root.getEntropySource = function(isMultisig, account, callback) {
      root.getXPubKey(hwWallet.getEntropyPath('trezor', isMultisig, account), function(data) {
        if (!data.success) 
          return callback(hwWallet._err(data));
        
        return callback(null,  hwWallet.pubKeyToEntropySource(data.xpubkey));
      });
    };


    root.getXPubKey = function(path, callback) {
      $log.debug('TREZOR deriving xPub path:', path);
      TrezorConnect.getXPubKey(path, callback);
    };


    root.getInfoForNewWallet = function(isMultisig, account, callback) {
      var opts = {};
      root.getEntropySource(isMultisig, account, function(err, data) {
        if (err) return callback(err);
        opts.entropySource = data;
        $log.debug('Waiting TREZOR to settle...');
        $timeout(function() {

          root.getXPubKey(hwWallet.getAddressPath('trezor', isMultisig, account), function(data) {
            if (!data.success)
              return callback(hwWallet._err(data));

            opts.extendedPublicKey = data.xpubkey;
            opts.externalSource = 'trezor';
            opts.account = account;

            if (isMultisig)
              opts.derivationStrategy = 'BIP48';

            return callback(null, opts);
          });
        }, SETTLE_TIME);
      });
    };

    root._orderPubKeys = function(xPub, np) {
      var xPubKeys = lodash.clone(xPub);
      var path = lodash.clone(np);
      path.unshift('m');
      path = path.join('/');

      var keys = lodash.map(xPubKeys, function(x) {
        var pub = (new bitcore.HDPublicKey(x)).derive(path).publicKey;
        return {
          xpub: x,
          pub: pub.toString('hex'),
        };
      });

      var sorted = lodash.sortBy(keys, function(x) {
        return x.pub;
      });

      return lodash.pluck(sorted, 'xpub');
    };

    root.signTx = function(xPubKeys, txp, account, callback) {

      var inputs = [],
        outputs = [];
      var tmpOutputs = [];

      if (txp.type != 'simple')
        return callback('Only TXPs type SIMPLE are supported in TREZOR');

      var toScriptType = 'PAYTOADDRESS';
      if (txp.toAddress.charAt(0) == '2' || txp.toAddress.charAt(0) == '3')
        toScriptType = 'PAYTOSCRIPTHASH';


      // Add to
      tmpOutputs.push({
        address: txp.toAddress,
        amount: txp.amount,
        script_type: toScriptType,
      });



      if (txp.addressType == 'P2PKH') {

        $log.debug("Trezor signing uni-sig p2pkh. Account:", account);

        var inAmount = 0;
        inputs = lodash.map(txp.inputs, function(i) {
          $log.debug("Trezor TX input path:", i.path);
          var pathArr = i.path.split('/');
          var n = [hwWallet.UNISIG_ROOTPATH | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          inAmount += i.satoshis;
          return {
            address_n: n,
            prev_index: i.vout,
            prev_hash: i.txid,
          };
        });

        var change = inAmount - txp.fee - txp.amount;
        if (change > 0) {
          $log.debug("Trezor TX change path:", txp.changeAddress.path);
          var pathArr = txp.changeAddress.path.split('/');
          var n = [hwWallet.UNISIG_ROOTPATH | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];

          tmpOutputs.push({
            address_n: n,
            amount: change,
            script_type: 'PAYTOADDRESS'
          });
        }

      } else {

        // P2SH Wallet, multisig wallet
        var inAmount = 0;
        $log.debug("Trezor signing multi-sig p2sh. Account:", account);

        var sigs = xPubKeys.map(function(v) {
          return '';
        });


        inputs = lodash.map(txp.inputs, function(i) {
          $log.debug("Trezor TX input path:", i.path);
          var pathArr = i.path.split('/');
          var n = [hwWallet.MULTISIG_ROOTPATH | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          var np = n.slice(3);

          inAmount += i.satoshis;

          var orderedPubKeys = root._orderPubKeys(xPubKeys, np);
          var pubkeys = lodash(orderedPubKeys.map(function(v) {
            return {
              node: v,
              address_n: np,
            };
          }));

          return {
            address_n: n,
            prev_index: i.vout,
            prev_hash: i.txid,
            script_type: 'SPENDMULTISIG',
            multisig: {
              pubkeys: pubkeys,
              signatures: sigs,
              m: txp.requiredSignatures,
            }
          };
        });

        var change = inAmount - txp.fee - txp.amount;
        if (change > 0) {
          $log.debug("Trezor TX change path:", txp.changeAddress.path);
          var pathArr = txp.changeAddress.path.split('/');
          var n = [hwWallet.MULTISIG_ROOTPATH | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          var np = n.slice(3);

          var orderedPubKeys = root._orderPubKeys(xPubKeys, np);
          var pubkeys = lodash(orderedPubKeys.map(function(v) {
            return {
              node: v,
              address_n: np,
            };
          }));

          tmpOutputs.push({
            address_n: n,
            amount: change,
            script_type: 'PAYTOMULTISIG',
            multisig: {
              pubkeys: pubkeys,
              signatures: sigs,
              m: txp.requiredSignatures,
            }
          });
        }
      }

      // Shuffle outputs for improved privacy
      if (tmpOutputs.length > 1) {
        outputs = new Array(tmpOutputs.length);
        lodash.each(txp.outputOrder, function(order) {
          outputs[order] = tmpOutputs.shift();
        });

        if (tmpOutputs.length)
          return cb("Error creating transaction: tmpOutput order");
      } else {
        outputs = tmpOutputs;
      }

      // Prevents: Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': An object could not be cloned.
      inputs = JSON.parse(JSON.stringify(inputs));
      outputs = JSON.parse(JSON.stringify(outputs));

      $log.debug('Signing with TREZOR', inputs, outputs);
      TrezorConnect.signTx(inputs, outputs, function(res) {
        if (!res.success)
          return callback(hwWallet._err(res));

        callback(null, res);
      });
    };

    return root;
  });

'use strict';

angular.module('copayApp.services').factory('txFormatService', function(profileService, rateService, configService, lodash) {
  var root = {};

  var formatAmountStr = function(amount) {
    if (!amount) return;
    var config = configService.getSync().wallet.settings;
    return profileService.formatAmount(amount) + ' ' + config.unitName;
  };

  var formatAlternativeStr = function(amount) {
    if (!amount) return;
    var config = configService.getSync().wallet.settings;
    return (rateService.toFiat(amount, config.alternativeIsoCode) ? rateService.toFiat(amount, config.alternativeIsoCode).toFixed(2) : 'N/A') + ' ' + config.alternativeIsoCode;
  };

  var formatFeeStr = function(fee) {
    if (!fee) return;
    var config = configService.getSync().wallet.settings;
    return profileService.formatAmount(fee) + ' ' + config.unitName;
  };

  root.processTx = function(tx) {
    if (!tx) return; 

    var outputs = lodash.isArray(tx.outputs) ? tx.outputs.length : 0;
    if (outputs && tx.action != 'received') {
      if ((tx.type && tx.type == 'multiple_output') || (tx.proposalType && tx.proposalType == 'multiple_output')) {
        tx.hasMultiplesOutputs = true;
        tx.recipientCount = outputs;
      }
      tx.amount = lodash.reduce(tx.outputs, function(total, o) {
        o.amountStr = formatAmountStr(o.amount);
        o.alternativeAmountStr = formatAlternativeStr(o.amount);
        return total + o.amount;
      }, 0);
    }

    tx.amountStr = formatAmountStr(tx.amount);
    tx.alternativeAmountStr = formatAlternativeStr(tx.amount);
    tx.feeStr = formatFeeStr(tx.fee || tx.fees);

    return tx;
  };

  return root;
});

'use strict';

angular.module('copayApp.services').factory('txStatus', function($modal, lodash, profileService, $timeout, txFormatService, isCordova) {
  var root = {};

  root.notify = function(txp, cb) {
    var fc = profileService.focusedClient;
    var status = txp.status;
    var type;
    var INMEDIATE_SECS = 10;

    if (status == 'broadcasted') {
      type = 'broadcasted';
    } else {

      var n = txp.actions.length;
      var action = lodash.find(txp.actions, {
        copayerId: fc.credentials.copayerId
      });

      if (!action)  {
        type = 'created';
      } else if (action.type == 'accept') {
        // created and accepted at the same time?
        if ( n == 1 && action.createdOn - txp.createdOn < INMEDIATE_SECS ) {
          type = 'created';
        } else {
          type = 'accepted';
        }
      } else if (action.type == 'reject') {
        type = 'rejected';
      } else {
        throw new Error('Unknown type:' + type);
      }
    }

    openModal(type, txp, cb);
  };

  root._templateUrl = function(type, txp) {
    return 'views/modals/tx-status.html';
  };

  var openModal = function(type, txp, cb) {
    var fc = profileService.focusedClient;
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.type = type;
      $scope.tx = txFormatService.processTx(txp);
      $scope.color = fc.backgroundColor;
      if (isCordova && StatusBar.isVisible) {
        StatusBar.hide();
      }
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
      if (cb) $timeout(cb, 100);
    };
    var modalInstance = $modal.open({
      templateUrl: root._templateUrl(type, txp),
      windowClass: 'popup-tx-status full',
      controller: ModalInstanceCtrl,
    });

    modalInstance.result.finally(function() {
      if (isCordova && !StatusBar.isVisible) {
        StatusBar.show();
      }
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass('hideModal');
    });
  };

  return root;
});

'use strict';

var UriHandler = function() {};

UriHandler.prototype.register = function() {
  var base = window.location.origin + '/';
  var url = base + '#/uri-payment/%s';

  if(navigator.registerProtocolHandler) {
    //navigator.registerProtocolHandler('bitcoin', url, 'Copay');
  }
};

angular.module('copayApp.services').value('uriHandler', new UriHandler());

'use strict';
angular.module('copayApp.services')
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

'use strict';

angular.module('copayApp.controllers').controller('backupController',
  function($rootScope, $scope, $timeout, $log, $state, $compile, go, lodash, profileService, gettext, bwcService, bwsError) {

    var self = this;
    var fc = profileService.focusedClient;
    var customWords = [];
    var choosenWords = [];

    function init() {
      $scope.passphrase = '';
      customWords = [];
      self.step = 1;
      self.deleted = false;
      self.credentialsEncrypted = false;
      self.selectComplete = false;
      self.backupError = false;
    }

    init();

    if (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic)
      self.deleted = true;

    if (fc.isPrivKeyEncrypted() && !self.deleted) {
      self.credentialsEncrypted = true;
      passwordRequest();
    } else {
      if (!self.deleted)
        initWords();
    }

    self.goToStep = function(n) {
      self.step = n;
      if (self.step == 1)
        init();
      if (self.step == 3 && !self.mnemonicHasPassphrase)
        self.step++;
      if (self.step == 4) {
        confirm();
      }
    }

    function initWords() {
      var words = fc.getMnemonic();
      self.xPrivKey = fc.credentials.xPrivKey;
      profileService.lockFC();
      self.mnemonicWords = words.split(/[\u3000\s]+/);
      self.shuffledMnemonicWords = lodash.sortBy(self.mnemonicWords);
      self.choosenMnemonicWords = lodash.sortBy(self.mnemonicWords, function(){return 0.5 - Math.random();});
      self.mnemonicHasPassphrase = fc.mnemonicHasPassphrase();
      self.useIdeograms = words.indexOf("\u3000") >= 0;
    };

    self.toggle = function() {
      self.error = "";

      if (self.credentialsEncrypted)
        passwordRequest();

      $timeout(function() {
        $scope.$apply();
      }, 1);
    };

    function passwordRequest() {
      try {
        initWords();
      } catch (e) {
        if (e.message && e.message.match(/encrypted/) && fc.isPrivKeyEncrypted()) {

          $timeout(function() {
            $scope.$apply();
          }, 1);

          profileService.unlockFC(function(err) {
            if (err) {
              self.error = bwsError.msg(err, gettext('Could not decrypt'));
              $log.warn('Error decrypting credentials:', self.error); //TODO
              return;
            }

            self.credentialsEncrypted = false;
            initWords();

            $timeout(function() {
              $scope.$apply();
            }, 1);
          });
        }
      }
    }

    self.enableButton = function(word) {
      document.getElementById(word).disabled = false;
      lodash.remove(customWords, function(v) {
        return v == word;
      });
    }

    self.disableButton = function(index, word) {
      var element = {
        index: index,
        word: word
      };
      if(document.getElementById(index + word).className == "button radius tiny words ng-binding ng-scope"){
        document.getElementById(index + word).className = "button radius tiny words ng-binding ng-scope disabled";
        customWords.push(element);
        self.addButton(index, word);
      }
      else{
        document.getElementById(index + word).className = "button radius tiny words ng-binding ng-scope";
        self.removeButton(index, word);
      }
      
    }

    self.addButton = function(index, word) {
      var choosen = 0;
      choosenWords.push(word);
      
     if(choosenWords.length==3){
        choosen = 1;
        for(var i=0;i<3;i++){
          if(choosenWords[i]!=self.choosenMnemonicWords[i]){
            choosen=0;
            break;
          }
        }
        if(choosen)
          self.shouldContinue(true);
      }
      if(!choosen)
        self.shouldContinue(false);
    }

    self.removeButton = function(index, word) {
      var choosen = 0;
      var id = index+word;
      lodash.remove(customWords, function(d) {
        return d.index == id.substring(1, 3);
      });
      console.log(choosenWords);
      var index = choosenWords.indexOf(word);
      choosenWords.splice(index, 1);
      console.log(choosenWords);
      
       if(choosenWords.length==3){
        choosen = 1;
        for(var i=0;i<3;i++){
          if(choosenWords[i]!=self.choosenMnemonicWords[i]){
            choosen=0;
            break;
          }
        }
        if(choosen)
          self.shouldContinue(true);
      }
      if(!choosen)
        self.shouldContinue(false);
      
    }

    self.shouldContinue = function(answer) {
      if (answer)
        self.selectComplete = true;
      else
        self.selectComplete = false;
    }

    function confirm() {
      self.backupError = false;

      var walletClient = bwcService.getClient();
      var separator = self.useIdeograms ? '\u3000' : ' ';
      var customSentence = lodash.pluck(customWords, 'word').join(separator);
      var passphrase = $scope.passphrase || '';

      try {
        walletClient.seedFromMnemonic(customSentence, {
          network: fc.credentials.network,
          passphrase: passphrase,
          account: fc.credentials.account
        })
      } catch (err) {
        return backupError(err);
      }

      if (walletClient.credentials.xPrivKey != self.xPrivKey) {
        return backupError('Private key mismatch');
      }

      $rootScope.$emit('Local/BackupDone');
    }

    function backupError(err) {
      $log.debug('Failed to verify backup: ', err);
      self.backupError = true;

      $timeout(function() {
        $scope.$apply();
      }, 1);
    };
  });


'use strict';

angular.module('copayApp.controllers').controller('copayersController',
  function($scope, $rootScope, $timeout, $log, $modal, profileService, go, notification, isCordova, gettext, gettextCatalog, animationService) {
    var self = this;

    var delete_msg = gettextCatalog.getString('Are you sure you want to delete this wallet?');
    var accept_msg = gettextCatalog.getString('Accept');
    var cancel_msg = gettextCatalog.getString('Cancel');
    var confirm_msg = gettextCatalog.getString('Confirm');

    self.init = function() {
      var fc = profileService.focusedClient;
      if (fc.isComplete()) {
        $log.debug('Wallet Complete...redirecting')
        go.walletHome();
        return;
      }
      self.loading = false;
      self.isCordova = isCordova;
    };

    var _modalDeleteWallet = function() {
      var ModalInstanceCtrl = function($scope, $modalInstance, gettext) {
        $scope.title = delete_msg;
        $scope.loading = false;

        $scope.ok = function() {
          $scope.loading = true;
          $modalInstance.close(accept_msg);

        };
        $scope.cancel = function() {
          $modalInstance.dismiss(cancel_msg);
        };
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/confirmation.html',
        windowClass: animationService.modalAnimated.slideUp,
        controller: ModalInstanceCtrl
      });

      modalInstance.result.finally(function() {
        var m = angular.element(document.getElementsByClassName('reveal-modal'));
        m.addClass(animationService.modalAnimated.slideOutDown);
      });

      modalInstance.result.then(function(ok) {
        if (ok) {
          _deleteWallet();
        }
      });
    };

    var _deleteWallet = function() {
      var fc = profileService.focusedClient;
      $timeout(function() {
        var fc = profileService.focusedClient;
        var walletName = fc.credentials.walletName;

        profileService.deleteWalletFC({}, function(err) {
          if (err) {
            this.error = err.message || err;
            console.log(err);
            $timeout(function() {
              $scope.$digest();
            });
          } else {
            go.walletHome();
            $timeout(function() {
              notification.success(gettextCatalog.getString('Success'), gettextCatalog.getString('The wallet "{{walletName}}" was deleted', {walletName: walletName}));
            });
          }
        });
      }, 100);
    };

    self.deleteWallet = function() {
      var fc = profileService.focusedClient;
      if (isCordova) {
        navigator.notification.confirm(
          delete_msg,
          function(buttonIndex) {
            if (buttonIndex == 1) {
              _deleteWallet();
            }
          },
          confirm_msg, [accept_msg, cancel_msg]
        );
      } else {
        _modalDeleteWallet();
      }
    };

    self.copySecret = function(secret) {
      if (isCordova) {
        window.cordova.plugins.clipboard.copy(secret);
        window.plugins.toast.showShortCenter(gettextCatalog.getString('Copied to clipboard'));
      }
    };

    self.shareSecret = function(secret) {
      if (isCordova) {
        if (isMobile.Android() || isMobile.Windows()) {
          window.ignoreMobilePause = true;
        }
        var message = gettextCatalog.getString('Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io', {secret: secret});
        window.plugins.socialsharing.share(message, gettextCatalog.getString('Invitation to share a Copay Wallet'), null, null);
      }
    };

  });

'use strict';

angular.module('copayApp.controllers').controller('createController',
  function($scope, $rootScope, $location, $timeout, $log, lodash, go, profileService, configService, isCordova, gettext, ledger, trezor, isMobile, isChromeApp, isDevel, derivationPathHelper) {

    var self = this;
    var defaults = configService.getDefaults();
    this.isWindowsPhoneApp = isMobile.Windows() && isCordova;
    $scope.account = 1;

    /* For compressed keys, m*73 + n*34 <= 496 */
    var COPAYER_PAIR_LIMITS = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 4,
      6: 4,
      7: 3,
      8: 3,
      9: 2,
      10: 2,
      11: 1,
      12: 1,
    };

    var defaults = configService.getDefaults();
    $scope.bwsurl = defaults.bws.url;
    $scope.derivationPath = derivationPathHelper.default;

    // ng-repeat defined number of times instead of repeating over array?
    this.getNumber = function(num) {
      return new Array(num);
    }

    var updateRCSelect = function(n) {
      $scope.totalCopayers = n;
      var maxReq = COPAYER_PAIR_LIMITS[n];
      self.RCValues = lodash.range(1, maxReq + 1);
      $scope.requiredCopayers = Math.min(parseInt(n / 2 + 1), maxReq);
    };

    var updateSeedSourceSelect = function(n) {

      self.seedOptions = [{
        id: 'new',
        label: gettext('New Random Seed'),
      }, {
        id: 'set',
        label: gettext('Specify Seed...'),
      }];
      $scope.seedSource = self.seedOptions[0];

      if (n > 1 && isChromeApp)
        self.seedOptions.push({
          id: 'ledger',
          label: 'Ledger Hardware Wallet',
        });

      if (isChromeApp || isDevel) {
        self.seedOptions.push({
          id: 'trezor',
          label: 'Trezor Hardware Wallet',
        });
      }
    };

    this.TCValues = lodash.range(2, defaults.limits.totalCopayers + 1);
    $scope.totalCopayers = defaults.wallet.totalCopayers;

    this.setTotalCopayers = function(tc) {
      updateRCSelect(tc);
      updateSeedSourceSelect(tc);
      self.seedSourceId = $scope.seedSource.id;
    };


    this.setSeedSource = function(src) {
      self.seedSourceId = $scope.seedSource.id;

      $timeout(function() {
        $rootScope.$apply();
      });
    };

    this.create = function(form) {
      if (form && form.$invalid) {
        this.error = gettext('Please enter the required fields');
        return;
      }
      
      var opts = {
        m: $scope.requiredCopayers,
        n: $scope.totalCopayers,
        name: form.walletName.$modelValue,
        myName: $scope.totalCopayers > 1 ? form.myName.$modelValue : null,
        networkName: form.isTestnet.$modelValue ? 'testnet' : 'livenet',
        bwsurl: $scope.bwsurl,
      };
      
      var setSeed = self.seedSourceId == 'set';
      if (setSeed) {

        var words = form.privateKey.$modelValue || '';
        if (words.indexOf(' ') == -1 && words.indexOf('prv') == 1 && words.length > 108) {
          opts.extendedPrivateKey = words;
        } else {
          opts.mnemonic = words;
        }
        opts.passphrase = form.passphrase.$modelValue;

        var pathData = derivationPathHelper.parse($scope.derivationPath);
        if (!pathData) {
          this.error = gettext('Invalid derivation path');
          return;
        }

        opts.account = pathData.account;
        opts.networkName = pathData.networkName;
        opts.derivationStrategy = pathData.derivationStrategy;

      } else {
        opts.passphrase = form.createPassphrase.$modelValue;
      }

      if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
        this.error = gettext('Please enter the wallet seed');
        return;
      }

      if (self.seedSourceId == 'ledger' || self.seedSourceId == 'trezor') {
        var account = $scope.account;
        if (!account || account < 1) {
          this.error = gettext('Invalid account number');
          return;
        }

        if ( self.seedSourceId == 'trezor')
          account = account - 1;

        opts.account = account;
        self.hwWallet = self.seedSourceId == 'ledger' ? 'Ledger' : 'Trezor';
        var src = self.seedSourceId == 'ledger' ? ledger : trezor;

        src.getInfoForNewWallet(opts.n > 1, account, function(err, lopts) {
          self.hwWallet = false;
          if (err) {
            self.error = err;
            $scope.$apply();
            return;
          }
          opts = lodash.assign(lopts, opts);
          self._create(opts);
        });
      } else {
        self._create(opts);
      }
    };

    this._create = function(opts) {
      // self.loading = true;
      $timeout(function() {
        console.log('create copay wallet call');
      }, 100);
    }

    this.formFocus = function(what) {
      if (!this.isWindowsPhoneApp) return

      if (what && what == 'my-name') {
        this.hideWalletName = true;
        this.hideTabs = true;
      } else if (what && what == 'wallet-name') {
        this.hideTabs = true;
      } else {
        this.hideWalletName = false;
        this.hideTabs = false;
      }
      $timeout(function() {
        $rootScope.$digest();
      }, 1);
    };

    $scope.$on("$destroy", function() {
      $rootScope.hideWalletNavigation = false;
    });

    updateSeedSourceSelect(1);
    self.setSeedSource('new');
  });

'use strict';

angular.module('copayApp.controllers').controller('DevLoginController', function($scope, $rootScope, $routeParams, identityService) {

  var mail = $routeParams.mail;
  var password = $routeParams.password;

  var form = {};
  form.email = {};
  form.password = {};
  form.email.$modelValue = mail;
  form.password.$modelValue = password;

  identityService.open($scope, form);

});

'use strict';

angular.module('copayApp.controllers').controller('disclaimerController',
  function($scope, $timeout, $log, profileService, isCordova, storageService, applicationService, gettextCatalog, uxLanguage, go) {
    var self = this;
    self.tries = 0;
    

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
    };

    this.init = function() {
      self.lang = uxLanguage.currentLanguage;
      storageService.getProfile(function(err, profile) {
        if (!profile) create(false);
        else $scope.creatingProfile = false;

        //compatible
        profileService.isDisclaimerAccepted(function(val) {
          if (val) go.walletHome();
        });
      });
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('exportController',
  function($rootScope, $scope, $timeout, $log, backupService, storageService, profileService, isMobile, notification, go, gettext, gettextCatalog) {
    var self = this;

    self.error = null;
    self.success = null;
    $scope.metaData = true;
    var fc = profileService.focusedClient;
    self.isEncrypted = fc.isPrivKeyEncrypted();

    self.downloadWalletBackup = function() {
      self.getMetaData($scope.metaData, function(err, txsFromLocal, localAddressBook) {
        if (err) {
          self.error = true;
          return;
        }
        var opts = {
          noSign: $scope.noSign,
          historyCache: txsFromLocal,
          addressBook: localAddressBook
        };

        backupService.walletDownload(self.password, opts, function(err) {
          if (err) {
            self.error = true;
            return;
          }

          $rootScope.$emit('Local/BackupDone');
          notification.success(gettext('Success'), gettext('Encrypted export file saved'));
          go.walletHome();
        });
      });
    };

    self.getMetaData = function(metaData, cb) {
      if (metaData == false) return cb();
      self.getHistoryCache(function(err, txsFromLocal) {
        if (err) return cb(err);

        self.getAddressbook(function(err, localAddressBook) {
          if (err) return cb(err);

          return cb(null, txsFromLocal, localAddressBook)
        });
      });
    }

    self.getHistoryCache = function(cb) {
      storageService.getTxHistory(fc.credentials.walletId, function(err, txs) {
        if (err) return cb(err);

        var localTxs = [];

        try {
          localTxs = JSON.parse(txs);
        } catch (ex) {
          $log.warn(ex);
        }
        if (!localTxs[0]) return cb(null, null);

        return cb(null, localTxs);
      });
    }

    self.getAddressbook = function(cb) {
      storageService.getAddressbook(fc.credentials.network, function(err, addressBook) {
        if (err) return cb(err);

        var localAddressBook = [];
        try {
          localAddressBook = JSON.parse(addressBook);
        } catch (ex) {
          $log.warn(ex);
        }

        return cb(null, localAddressBook);
      });
    }

    self.getBackup = function(cb) {
      self.getMetaData($scope.metaData, function(err, txsFromLocal, localAddressBook) {
        if (err) {
          self.error = true;
          return cb(null);
        }
        var opts = {
          noSign: $scope.noSign,
          historyCache: txsFromLocal,
          addressBook: localAddressBook
        };

        var ew = backupService.walletExport(self.password, opts);
        if (!ew) {
          self.error = true;
        } else {
          self.error = false;
          $rootScope.$emit('Local/BackupDone');
        }
        return cb(ew);
      });
    }

    self.viewWalletBackup = function() {
      var self = this;
      $timeout(function() {
        self.getBackup(function(backup) {
          var ew = backup;
          if (!ew) return;
          self.backupWalletPlainText = ew;
        });
      }, 100);
    };

    self.copyWalletBackup = function() {
      self.getBackup(function(backup) {
        var ew = backup;
        if (!ew) return;
        window.cordova.plugins.clipboard.copy(ew);
        window.plugins.toast.showShortCenter(gettextCatalog.getString('Copied to clipboard'));
      });
    };

    self.sendWalletBackup = function() {
      var fc = profileService.focusedClient;
      if (isMobile.Android() || isMobile.Windows()) {
        window.ignoreMobilePause = true;
      }
      window.plugins.toast.showShortCenter(gettextCatalog.getString('Preparing backup...'));
      var name = (fc.credentials.walletName || fc.credentials.walletId);
      if (fc.alias) {
        name = fc.alias + ' [' + name + ']';
      }
      self.getBackup(function(backup) {
        var ew = backup;
        if (!ew) return;

        if ($scope.noSign)
          name = name + '(No Private Key)';

        var properties = {
          subject: 'Copay Wallet Backup: ' + name,
          body: 'Here is the encrypted backup of the wallet ' + name + ': \n\n' + ew + '\n\n To import this backup, copy all text between {...}, including the symbols {}',
          isHtml: false
        };
        window.plugin.email.open(properties);
      });
    };

  });

'use strict';

angular.module('copayApp.controllers').controller('glideraController', 
  function($rootScope, $scope, $timeout, $modal, profileService, configService, storageService, glideraService, isChromeApp, animationService, lodash) {

    window.ignoreMobilePause = true;

    this.getAuthenticateUrl = function() {
      return glideraService.getOauthCodeUrl();
    };

    this.submitOauthCode = function(code) {
      var self = this;
      var glideraTestnet = configService.getSync().glidera.testnet;
      var network = glideraTestnet ? 'testnet' : 'livenet';
      this.loading = true;
      this.error = null;
      $timeout(function() {
        glideraService.getToken(code, function(err, data) {
          self.loading = null;
          if (err) {
            self.error = err;
            $timeout(function() {
                $scope.$apply();
              }, 100);
          }
          else if (data && data.access_token) {
            storageService.setGlideraToken(network, data.access_token, function() {
              $scope.$emit('Local/GlideraUpdated', data.access_token);
              $timeout(function() {
                $scope.$apply();
              }, 100);
            });
          }
        });
      }, 100);
    };

    this.openTxModal = function(token, tx) {
      $rootScope.modalOpened = true;
      var self = this;
      var config = configService.getSync().wallet.settings;
      var fc = profileService.focusedClient;
      var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.tx = tx;
        $scope.settings = config;
        $scope.color = fc.backgroundColor;
        $scope.noColor = true;

        glideraService.getTransaction(token, tx.transactionUuid, function(error, tx) {
          $scope.tx = tx;
        });

        $scope.cancel = lodash.debounce(function() {
          $modalInstance.dismiss('cancel');
        }, 0, 1000);

      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/glidera-tx-details.html',
          windowClass: animationService.modalAnimated.slideRight,
          controller: ModalInstanceCtrl,
      });

      var disableCloseModal = $rootScope.$on('closeModal', function() {
        modalInstance.dismiss('cancel');
      });

      modalInstance.result.finally(function() {
        $rootScope.modalOpened = false;
        disableCloseModal();
        var m = angular.element(document.getElementsByClassName('reveal-modal'));
        m.addClass(animationService.modalAnimated.slideOutRight);
      });
    };

  });

'use strict';
angular.module('copayApp.controllers').controller('glideraUriController',
  function($scope, $stateParams, $timeout, profileService, configService, glideraService, storageService, go) { 

    this.submitOauthCode = function(code) {
      var self = this;
      var glideraTestnet = configService.getSync().glidera.testnet;
      var network = glideraTestnet ? 'testnet' : 'livenet';
      this.loading = true;
      this.error = null;
      $timeout(function() {
        glideraService.getToken(code, function(err, data) {
          self.loading = null;
          if (err) {
            self.error = err;
            $timeout(function() {
                $scope.$apply();
              }, 100);
          }
          else if (data && data.access_token) {
            storageService.setGlideraToken(network, data.access_token, function() {
              $scope.$emit('Local/GlideraUpdated', data.access_token);
              $timeout(function() {
                go.path('glidera');
                $scope.$apply();
              }, 100);
            });
          }
        });
      }, 100);
    };

    this.checkCode = function() {
      this.code = $stateParams.code;
      this.submitOauthCode(this.code);
    };

  });

'use strict';

angular.module('copayApp.controllers').controller('importController',
  function($scope, $rootScope, $location, $timeout, $log, profileService, configService, notification, go, sjcl, gettext, lodash, ledger, trezor, isChromeApp, isDevel, derivationPathHelper) {

    var self = this;
    var reader = new FileReader();
    var defaults = configService.getDefaults();
    $scope.bwsurl = defaults.bws.url;
    $scope.derivationPath = derivationPathHelper.default;
    $scope.account = 1;

    window.ignoreMobilePause = true;
    $scope.$on('$destroy', function() {
      $timeout(function() {
        window.ignoreMobilePause = false;
      }, 100);
    });

    var updateSeedSourceSelect = function() {
      self.seedOptions = [];

      if (isChromeApp) {
        self.seedOptions.push({
          id: 'ledger',
          label: 'Ledger Hardware Wallet',
        });
      }

      if (isChromeApp || isDevel) {
        self.seedOptions.push({
          id: 'trezor',
          label: 'Trezor Hardware Wallet',
        });
        $scope.seedSource = self.seedOptions[0];
      }
    };



    this.setType = function(type) {
      $scope.type = type;
      this.error = null;
      $timeout(function() {
        $rootScope.$apply();
      });
    };

    var _importBlob = function(str, opts) {
      var str2, err;
      try {
        str2 = sjcl.decrypt(self.password, str);
      } catch (e) {
        err = gettext('Could not decrypt file, check your password');
        $log.warn(e);
      };

      if (err) {
        self.error = err;
        $timeout(function() {
          $rootScope.$apply();
        });
        return;
      }

      //self.loading = true;
      opts.compressed = null;
      opts.password = null;

      $timeout(function() {
       console.log("copay import blob wallet call");
      }, 100);
    };

    var _importExtendedPrivateKey = function(xPrivKey, opts) {
      //self.loading = true;

      $timeout(function() {
        console.log("copay import extended private key wallet call");
      }, 100);
    };

    var _importMnemonic = function(words, opts) {
      //self.loading = true;

      $timeout(function() {
        console.log("copay import mnemonic wallet call");
      }, 100);
    };

    $scope.getFile = function() {
      // If we use onloadend, we need to check the readyState.
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          var opts = {};
          opts.bwsurl = $scope.bwsurl;
          _importBlob(evt.target.result, opts);
        }
      }
    };

    this.importBlob = function(form) {
      if (form.$invalid) {
        this.error = gettext('There is an error in the form');

        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      var backupFile = $scope.file;
      var backupText = form.backupText.$modelValue;
      var password = form.password.$modelValue;

      if (!backupFile && !backupText) {
        this.error = gettext('Please, select your backup file');
        $timeout(function() {
          $scope.$apply();
        });

        return;
      }

      if (backupFile) {
        reader.readAsBinaryString(backupFile);
      } else {
        var opts = {};
        opts.bwsurl = $scope.bwsurl;
        _importBlob(backupText, opts);
      }
    };

    this.importMnemonic = function(form) {
      if (form.$invalid) {
        this.error = gettext('There is an error in the form');

        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      var opts = {};
      if ($scope.bwsurl)
        opts.bwsurl = $scope.bwsurl;

      var passphrase = form.passphrase.$modelValue;
      var words = form.words.$modelValue;
      this.error = null;

      if (!words) {
        this.error = gettext('Please enter the seed words');
      } else if (words.indexOf('xprv') == 0 || words.indexOf('tprv') == 0) {
        return _importExtendedPrivateKey(words, opts);
      } else {
        var wordList = words.split(/[\u3000\s]+/);

        if ((wordList.length % 3) != 0)
          this.error = gettext('Wrong number of seed words:') + wordList.length;
      }

      if (this.error) {
        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      opts.passphrase = form.passphrase.$modelValue || null;

      var pathData = derivationPathHelper.parse($scope.derivationPath);
      if (!pathData) {
        this.error = gettext('Invalid derivation path');
        return;
      }
      opts.account = pathData.account;
      opts.networkName = pathData.networkName;
      opts.derivationStrategy = pathData.derivationStrategy;


      _importMnemonic(words, opts);
    };

    this.importTrezor = function(account, isMultisig) {
      var self = this;
      trezor.getInfoForNewWallet(isMultisig, account, function(err, lopts) {
        self.hwWallet = false;
        if (err) {
          self.error = err;
          $scope.$apply();
          return;
        }

        lopts.externalSource = 'trezor';
        lopts.bwsurl = $scope.bwsurl;
        self.loading = true;
        $log.debug('Import opts', lopts);

        profileService.importExtendedPublicKey(lopts, function(err, walletId) {
          self.loading = false;
          if (err) {
            self.error = err;
            return $timeout(function() {
              $scope.$apply();
            });
          }
          $rootScope.$emit('Local/WalletImported', walletId);
          notification.success(gettext('Success'), gettext('Your wallet has been imported correctly'));
          go.walletHome();
        });
      }, 100);
    };

    this.importHW = function(form) {
      if (form.$invalid || $scope.account < 0 ) {
        this.error = gettext('There is an error in the form');
        $timeout(function() {
          $scope.$apply();
        });
        return;
      }
      this.error = '';

      var account = + $scope.account;
      
      if (self.seedSourceId == 'trezor') {
        if ( account < 1) {
          this.error = gettext('Invalid account number');
          return;
        }
        account = account - 1;
      }
      var isMultisig = form.isMultisig.$modelValue;

      switch (self.seedSourceId) {
        case ('ledger'):
          self.hwWallet = 'Ledger';
          self.importLedger(account);
          break;
        case ('trezor'):
          self.hwWallet = 'Trezor';
          self.importTrezor(account, isMultisig);
          break;
        default:
          throw ('Error: bad source id');
      };
    };

    this.setSeedSource = function() {
      if (!$scope.seedSource) return;
      self.seedSourceId = $scope.seedSource.id;

      $timeout(function() {
        $rootScope.$apply();
      });
    };

    this.importLedger = function(account) {
      var self = this;
      ledger.getInfoForNewWallet(true, account, function(err, lopts) {
        self.hwWallet = false;
        if (err) {
          self.error = err;
          $scope.$apply();
          return;
        }

        lopts.externalSource = 'ledger';
        lopts.bwsurl = $scope.bwsurl;
        self.loading = true;
        $log.debug('Import opts', lopts);

        profileService.importExtendedPublicKey(lopts, function(err, walletId) {
          self.loading = false;
          if (err) {
            self.error = err;
            return $timeout(function() {
              $scope.$apply();
            });
          }
          $rootScope.$emit('Local/WalletImported', walletId);
          notification.success(gettext('Success'), gettext('Your wallet has been imported correctly'));
        });
      }, 100);
    };

    updateSeedSourceSelect();
    self.setSeedSource('new');
  });

'use strict';

angular.module('copayApp.controllers').controller('importLegacyController',
  function($rootScope, $scope, $log, $timeout, notification, legacyImportService, profileService, go, lodash, bitcore, gettext, gettextCatalog) {

    var self = this;
    self.messages = [];
    self.fromCloud = true;
    self.server = "https://insight.bitpay.com:443/api/email";


    $rootScope.$on('Local/ImportStatusUpdate', function(event, status) {
      $timeout(function() {
        $log.debug(status);

        self.messages.unshift({
          message: status,
        });

        var op = 1;
        lodash.each(self.messages, function(m) {
          if (op < 0.1) op = 0.1;
          m.opacity = op;
          op = op - 0.15;
        });
      }, 100);
    });

    self.scan = function(ids) {
      $log.debug('### Scaning: ' + ids)
      var i = 0;
      lodash.each(ids, function(id) {
        $rootScope.$emit('Local/WalletImported', id);
        if (++i == ids.length) {
          go.walletHome();
        };
      });
    };


    self.import = function(form) {
      var username = form.username.$modelValue;
      var password = form.password.$modelValue;
      var serverURL = form.server.$modelValue;
      var fromCloud = form.fromCloud.$modelValue;

      self.error = null;
      self.importing = true;
      $timeout(function() {
        legacyImportService.import(username, password, serverURL, fromCloud, function(err, ids, toScanIds) {
          if (err || !ids || !ids.length) {
            self.importing = false;
            self.error = err || gettext('Failed to import wallets');
            return;
          }

          notification.success( gettextCatalog.getString('{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance', {len: ids.length}));
          self.scan(toScanIds);
        });
      }, 100);
    };
    // TODO destroy event...
  });

'use strict';

angular.module('copayApp.controllers').controller('indexController', function($rootScope, $scope, $log, $filter, $timeout, lodash, go, profileService, configService, isCordova, rateService, storageService, addressService, gettext, gettextCatalog, amMoment, nodeWebkit, addonManager, feeService, isChromeApp, bwsError, txFormatService, uxLanguage, $state, glideraService, isMobile, addressbookService) {
  var self = this;
  var SOFT_CONFIRMATION_LIMIT = 12;
  self.isCordova = isCordova;
  self.isChromeApp = isChromeApp;
  self.isSafari = isMobile.Safari();
  self.onGoingProcess = {};
  self.historyShowLimit = 10;
  self.updatingTxHistory = {};
  self.prevState = 'walletHome';

  function strip(number) {
    return (parseFloat(number.toPrecision(12)));
  };

  self.goHome = function() {
    go.walletHome();
  };

  self.menu = [{
    'title': gettext('Receive'),
    'icon': {false:'icon-receive', true: 'icon-receive-active'},
    'link': 'receive'
  }, {
    'title': gettext('Activity'),
    'icon': {false:'icon-activity',true: 'icon-activity-active'},
    'link': 'walletHome'
  }, {
    'title': gettext('Send'),
    'icon': {false:'icon-send', true: 'icon-send-active'},
    'link': 'send'
  }];

  self.addonViews = addonManager.addonViews();
  self.menu = self.menu.concat(addonManager.addonMenuItems());
  self.menuItemSize = self.menu.length > 4 ? 2 : 4;
  self.txTemplateUrl = addonManager.txTemplateUrl() || 'views/includes/transaction.html';

  self.tab = 'walletHome';

  self.feeOpts = feeService.feeOpts;

  self.setOngoingProcess = function(processName, isOn) {
    $log.debug('onGoingProcess', processName, isOn);
    self[processName] = isOn;
    self.onGoingProcess[processName] = isOn;

    var name;
    self.anyOnGoingProcess = lodash.any(self.onGoingProcess, function(isOn, processName) {
      if (isOn)
        name = name || processName;
      return isOn;
    });
    // The first one
    self.onGoingProcessName = name;
    $timeout(function() {
      $rootScope.$apply();
    });
  };

  self.setFocusedWallet = function() {
    var fc = profileService.focusedClient;
    if (!fc) return;

    // loading full wallet
    self.loadingWallet = true;

    // Clean status
    self.totalBalanceSat = null;
    self.lockedBalanceSat = null;
    self.availableBalanceSat = null;
    self.pendingAmount = null;
    self.spendUnconfirmed = null;

    self.totalBalanceStr = null;
    self.availableBalanceStr = null;
    self.lockedBalanceStr = null;

    self.alternativeBalanceAvailable = false;
    self.totalBalanceAlternative = null;

    self.currentFeeLevel = null;
    self.notAuthorized = false;
    self.txHistory = [];
    self.completeHistory = [];
    self.txProgress = 0;
    self.historyShowShowAll = false;
    self.balanceByAddress = null;
    self.pendingTxProposalsCountForUs = null;
    self.setSpendUnconfirmed();

    $timeout(function() {
      $rootScope.$apply();
      self.hasProfile = true;
      self.noFocusedWallet = false;
      self.onGoingProcess = {};

      // Credentials Shortcuts
      self.m = fc.credentials.m;
      self.n = fc.credentials.n;
      self.network = fc.credentials.network;
      self.copayerId = fc.credentials.copayerId;
      self.copayerName = fc.credentials.copayerName;
      self.requiresMultipleSignatures = fc.credentials.m > 1;
      self.isShared = fc.credentials.n > 1;
      self.walletName = fc.credentials.walletName;
      self.walletId = fc.credentials.walletId;
      self.isComplete = fc.isComplete();
      self.canSign = fc.canSign();
      self.isPrivKeyExternal = fc.isPrivKeyExternal();
      self.isPrivKeyEncrypted = fc.isPrivKeyEncrypted();
      self.externalSource = fc.getPrivKeyExternalSourceName();
      self.account = fc.credentials.account;

      if (self.externalSource == 'trezor')
        self.account++;

      self.txps = [];
      self.copayers = [];
      self.updateColor();
      self.updateAlias();
      self.setAddressbook();

      self.initGlidera();

      self.setCustomBWSFlag();
      if (fc.isPrivKeyExternal()) {
        self.needsBackup = false;
        self.openWallet();
      } else {
        storageService.getBackupFlag(self.walletId, function(err, val) {
          if (!fc.credentials.mnemonic)
            self.needsBackup = false;
          else
            self.needsBackup = self.network == 'testnet' ? false : !val;
          self.openWallet();
        });
      }
    });
  };

  self.setCustomBWSFlag = function() {
    var defaults = configService.getDefaults();
    var config = configService.getSync();

    self.usingCustomBWS = config.bwsFor && config.bwsFor[self.walletId] && (config.bwsFor[self.walletId] != defaults.bws.url);
  };

  self.acceptDisclaimer = function() {
    var profile = profileService.profile;
    if (profile) profile.disclaimerAccepted = true;
    self.disclaimerAccepted = true;
    profileService.setDisclaimerAccepted(function(err) {
      if (err) $log.error(err);
      go.walletHome();
    });
  };

  self.isDisclaimerAccepted = function() {
    if (self.disclaimerAccepted == true) {
      go.walletHome();
      return;
    }
    profileService.isDisclaimerAccepted(function(v) {
      if (v) {
        self.acceptDisclaimer();
      }
      else 
        go.path('disclaimer');
    });
  };

  self.setTab = function(tab, reset, tries, switchState) {
    tries = tries || 0;

    // check if the whole menu item passed
    if (typeof tab == 'object') {
      if (tab.open) {
        if (tab.link) {
          self.tab = tab.link;
        }
        tab.open();
        return;
      } else {
        return self.setTab(tab.link, reset, tries, switchState);
      }
    }
    if (self.tab === tab && !reset)
      return;

    if (!document.getElementById('menu-' + tab) && ++tries < 5) {
      return $timeout(function() {
        self.setTab(tab, reset, tries, switchState);
      }, 300);
    }

    if (!self.tab || !$state.is('walletHome'))
      self.tab = 'walletHome';

    var changeTab = function() {
      if (document.getElementById(self.tab)) {
        document.getElementById(self.tab).className = 'tab-out tab-view ' + self.tab;
        var old = document.getElementById('menu-' + self.tab);
        if (old) {
          old.className = '';
        }
      }

      if (document.getElementById(tab)) {
        document.getElementById(tab).className = 'tab-in  tab-view ' + tab;
        var newe = document.getElementById('menu-' + tab);
        if (newe) {
          newe.className = 'active';
        }
      }

      self.tab = tab;
      $rootScope.$emit('Local/TabChanged', tab);
    };

    if (switchState && !$state.is('walletHome')) {
      go.path('walletHome', function() {
        changeTab();
      });
      return;
    }

    changeTab();
  };


  self._updateRemotePreferencesFor = function(clients, prefs, cb) {
    var client = clients.shift();

    if (!client)
      return cb();

    $log.debug('Saving remote preferences', client.credentials.walletName, prefs);
    client.savePreferences(prefs, function(err) {
      // we ignore errors here
      if (err) $log.warn(err);

      self._updateRemotePreferencesFor(clients, prefs, cb);
    });
  };


  self.updateRemotePreferences = function(opts, cb) {
    var prefs = opts.preferences || {};
    var fc = profileService.focusedClient;

    // Update this JIC.
    var config = configService.getSync().wallet.settings;

    //prefs.email  (may come from arguments)
    prefs.language = self.defaultLanguageIsoCode;
    prefs.unit = config.unitCode;

    var clients = [];
    if (opts.saveAll) {
      clients = lodash.values(profileService.walletClients);
    } else {
      clients = [fc];
    };

    self._updateRemotePreferencesFor(clients, prefs, function(err) {
      if (err) return cb(err);
      if (!fc) return cb();

      fc.getPreferences(function(err, preferences) {
        if (err) {
          return cb(err);
        }
        self.preferences = preferences;
        return cb();
      });
    });
  };

  var _walletStatusHash = function(walletStatus) {
    var bal;
    if (walletStatus) {
      bal = walletStatus.balance.totalAmount;
    } else {
      bal = self.totalBalanceSat;
    }
    return bal;
  };

  self.updateAll = function(opts, initStatusHash, tries) {
    tries = tries || 0;
    opts = opts || {};

    if (opts.untilItChanges && lodash.isUndefined(initStatusHash)) {
      initStatusHash = _walletStatusHash();
      $log.debug('Updating status until it changes. initStatusHash:' + initStatusHash)
    }
    var get = function(cb) {
      if (opts.walletStatus)
        return cb(null, opts.walletStatus);
      else {
        self.updateError = false;
        return fc.getStatus({ twoStep : true }, function(err, ret) {
          if (err) {
            self.updateError = bwsError.msg(err, gettext('Could not update Wallet'));
          } else {
            if (!opts.quiet)
              self.setOngoingProcess('scanning', ret.wallet.scanStatus == 'running');
          }
          return cb(err, ret);
        });
      }
    };

    var fc = profileService.focusedClient;
    if (!fc) return;

    $timeout(function() {

      if (!opts.quiet)
        self.setOngoingProcess('updatingStatus', true);

      $log.debug('Updating Status:', fc.credentials.walletName, tries);
      get(function(err, walletStatus) {
        var currentStatusHash = _walletStatusHash(walletStatus);
        $log.debug('Status update. hash:' + currentStatusHash + ' Try:' + tries);
        if (!err && opts.untilItChanges && initStatusHash == currentStatusHash && tries < 7) {
          return $timeout(function() {
            $log.debug('Retrying update... Try:' + tries)
            return self.updateAll({
              walletStatus: null,
              untilItChanges: true,
              triggerTxUpdate: opts.triggerTxUpdate,
            }, initStatusHash, ++tries);
          }, 1400 * tries);
        }
        if (!opts.quiet)
          self.setOngoingProcess('updatingStatus', false);

        if (err) {
          self.handleError(err);
          return;
        }
        $log.debug('Wallet Status:', walletStatus);
        self.setPendingTxps(walletStatus.pendingTxps);
        self.setFeesOpts();

        // Status Shortcuts
        self.walletName = walletStatus.wallet.name;
        self.walletSecret = walletStatus.wallet.secret;
        self.walletStatus = walletStatus.wallet.status;
        self.walletScanStatus = walletStatus.wallet.scanStatus;
        self.copayers = walletStatus.wallet.copayers;
        self.preferences = walletStatus.preferences;
        self.setBalance(walletStatus.balance);
        self.otherWallets = lodash.filter(profileService.getWallets(self.network), function(w) {
          return w.id != self.walletId;
        });

        // Notify external addons or plugins
        $rootScope.$emit('Local/BalanceUpdated', walletStatus.balance);

        $rootScope.$apply();

        if (opts.triggerTxUpdate) {
          $timeout(function() {
            self.debounceUpdateHistory();
          }, 1);
        }
      });
    });
  };

  self.setSpendUnconfirmed = function(spendUnconfirmed) {
    self.spendUnconfirmed = spendUnconfirmed || configService.getSync().wallet.spendUnconfirmed;
  };

  self.setFeeAndSendMax = function(cb) {

    self.feeToSendMaxStr = null;
    self.availableMaxBalance = null;
    self.currentFeePerKb = null;

    // Set Send max
    if (self.currentFeeLevel && self.totalBytesToSendMax) {
      feeService.getCurrentFeeValue(self.currentFeeLevel, function(err, feePerKb) {

        // KB to send max
        var feeToSendMaxSat = parseInt(((self.totalBytesToSendMax * feePerKb) / 1000.).toFixed(0));
        self.currentFeePerKb = feePerKb;

        if (self.availableBalanceSat > feeToSendMaxSat) {
          self.availableMaxBalance = strip((self.availableBalanceSat - feeToSendMaxSat) * self.satToUnit);
          self.feeToSendMaxStr = profileService.formatAmount(feeToSendMaxSat) + ' ' + self.unitName;
        }
          
        if (cb) return cb(self.currentFeePerKb, self.availableMaxBalance, self.feeToSendMaxStr);
      });
    }

  };

  self.setCurrentFeeLevel = function(level) {
    self.currentFeeLevel = level || configService.getSync().wallet.settings.feeLevel || 'normal';
    self.setFeeAndSendMax();
  };


  self.setFeesOpts = function() {
    var fc = profileService.focusedClient;
    if (!fc) return;
    $timeout(function() {
      feeService.getFeeLevels(function(levels) {
        self.feeLevels = levels;
        $rootScope.$apply();
      });
    });
  };

  self.updateBalance = function() {
    var fc = profileService.focusedClient;
    $timeout(function() {
      self.setOngoingProcess('updatingBalance', true);
      $log.debug('Updating Balance');
      fc.getBalance(function(err, balance) {
        self.setOngoingProcess('updatingBalance', false);
        if (err) {
          self.handleError(err);
          return;
        }
        $log.debug('Wallet Balance:', balance);
        self.setBalance(balance);
      });
    });
  };

  self.updatePendingTxps = function() {
    var fc = profileService.focusedClient;
    $timeout(function() {
      self.setOngoingProcess('updatingPendingTxps', true);
      $log.debug('Updating PendingTxps');
      fc.getTxProposals({}, function(err, txps) {
        self.setOngoingProcess('updatingPendingTxps', false);
        if (err) {
          self.handleError(err);
        } else {
          $log.debug('Wallet PendingTxps:', txps);
          self.setPendingTxps(txps);
        }
        $rootScope.$apply();
      });
    });
  };

  // This handles errors from BWS/index with are nomally
  // trigger from async events (like updates).
  // Debounce function avoids multiple popups
  var _handleError = function(err) {
    $log.warn('Client ERROR: ', err);
    if (err.code === 'NOT_AUTHORIZED') {
      self.notAuthorized = true;
      go.walletHome();
    } else if (err.code === 'NOT_FOUND') {
      self.showErrorPopup(gettext('Could not access Wallet Service: Not found'));
    } else {
      var msg = ""
      $scope.$emit('Local/ClientError', (err.error ? err.error : err));
      var msg = bwsError.msg(err, gettext('Error at Wallet Service'));
      self.showErrorPopup(msg);
    }
  };

  self.handleError = lodash.debounce(_handleError, 1000);

  self.openWallet = function() {
    var fc = profileService.focusedClient;
    $timeout(function() {
      $rootScope.$apply();
      self.setOngoingProcess('openingWallet', true);
      self.updateError = false;
      fc.openWallet(function(err, walletStatus) {
        self.setOngoingProcess('openingWallet', false);
        if (err) {
          self.updateError = true;
          self.handleError(err);
          return;
        }
        $log.debug('Wallet Opened');
        self.updateAll(lodash.isObject(walletStatus) ? {
          walletStatus: walletStatus
        } : null);
        $rootScope.$apply();
      });
    });
  };

  self.setPendingTxps = function(txps) {
    self.pendingTxProposalsCountForUs = 0;
    var now = Math.floor(Date.now() / 1000);

    /* Uncomment to test multiple outputs */
    /*
    var txp = {
      message: 'test multi-output',
      fee: 1000,
      createdOn: new Date() / 1000,
      type: 'multiple_output',
      outputs: []
    };
    function addOutput(n) {
      txp.outputs.push({
        amount: 600,
        toAddress: '2N8bhEwbKtMvR2jqMRcTCQqzHP6zXGToXcK',
        message: 'output #' + (Number(n) + 1)
      });
    };
    lodash.times(150, addOutput);
    txps.push(txp);
    */

    lodash.each(txps, function(tx) {

      tx = txFormatService.processTx(tx);

      // no future transactions...
      if (tx.createdOn > now)
        tx.createdOn = now;

      var action = lodash.find(tx.actions, {
        copayerId: self.copayerId
      });

      if (!action && tx.status == 'pending') {
        tx.pendingForUs = true;
      }

      if (action && action.type == 'accept') {
        tx.statusForUs = 'accepted';
      } else if (action && action.type == 'reject') {
        tx.statusForUs = 'rejected';
      } else {
        tx.statusForUs = 'pending';
      }

      if (!tx.deleteLockTime)
        tx.canBeRemoved = true;

      if (tx.creatorId != self.copayerId) {
        self.pendingTxProposalsCountForUs = self.pendingTxProposalsCountForUs + 1;
      }
      addonManager.formatPendingTxp(tx);
    });
    self.txps = txps;
  };

  var SAFE_CONFIRMATIONS = 6;

  self.processNewTxs = function(txs) {
    var config = configService.getSync().wallet.settings;
    var now = Math.floor(Date.now() / 1000);
    var txHistoryUnique = {};
    var ret = [];
    self.hasUnsafeConfirmed = false;

    lodash.each(txs, function(tx) {
      tx = txFormatService.processTx(tx);

      // no future transactions...
      if (tx.time > now)
        tx.time = now;

      if (tx.confirmations >= SAFE_CONFIRMATIONS) {
        tx.safeConfirmed = SAFE_CONFIRMATIONS + '+';
      } else {
        tx.safeConfirmed = false;
        self.hasUnsafeConfirmed = true;
      }

      if (!txHistoryUnique[tx.txid]) {
        ret.push(tx);
        txHistoryUnique[tx.txid] = true;
      } else {
        $log.debug('Ignoring duplicate TX in history: ' + tx.txid)
      }
    });

    return ret;
  };

  self.updateAlias = function() {
    var config = configService.getSync();
    config.aliasFor = config.aliasFor || {};
    self.alias = config.aliasFor[self.walletId];
    var fc = profileService.focusedClient;
    fc.alias = self.alias;
  };

  self.updateColor = function() {
    var config = configService.getSync();
    config.colorFor = config.colorFor || {};
    self.backgroundColor = config.colorFor[self.walletId] || '#4A90E2';
    var fc = profileService.focusedClient;
    fc.backgroundColor = self.backgroundColor;
    if (isCordova && StatusBar.isVisible) {
      StatusBar.backgroundColorByHexString(fc.backgroundColor);
    }
  };

  self.setBalance = function(balance) {
    if (!balance) return;
    var config = configService.getSync().wallet.settings;
    var COIN = 1e8;


    // Address with Balance
    self.balanceByAddress = balance.byAddress;

    // Spend unconfirmed funds
    if (self.spendUnconfirmed) {
      self.totalBalanceSat = balance.totalAmount;
      self.lockedBalanceSat = balance.lockedAmount;
      self.availableBalanceSat = balance.availableAmount;
      self.totalBytesToSendMax = balance.totalBytesToSendMax;
      self.pendingAmount = null;
    } else {
      self.totalBalanceSat = balance.totalConfirmedAmount;
      self.lockedBalanceSat = balance.lockedConfirmedAmount;
      self.availableBalanceSat = balance.availableConfirmedAmount;
      self.totalBytesToSendMax = balance.totalBytesToSendConfirmedMax;
      self.pendingAmount = balance.totalAmount - balance.totalConfirmedAmount;
    }

    // Selected unit
    self.unitToSatoshi = config.unitToSatoshi;
    self.satToUnit = 1 / self.unitToSatoshi;
    self.unitName = config.unitName;

    //STR
    self.totalBalanceStr = profileService.formatAmount(self.totalBalanceSat) + ' ' + self.unitName;
    self.lockedBalanceStr = profileService.formatAmount(self.lockedBalanceSat) + ' ' + self.unitName;
    self.availableBalanceStr = profileService.formatAmount(self.availableBalanceSat) + ' ' + self.unitName;

    if (self.pendingAmount) {
      self.pendingAmountStr = profileService.formatAmount(self.pendingAmount) + ' ' + self.unitName;
    } else {
      self.pendingAmountStr = null;
    }

    self.alternativeName = config.alternativeName;
    self.alternativeIsoCode = config.alternativeIsoCode;

    // Set fee level and max value to send all
    self.setCurrentFeeLevel();

    // Check address
    addressService.isUsed(self.walletId, balance.byAddress, function(err, used) {
      if (used) {
        $log.debug('Address used. Creating new');
        $rootScope.$emit('Local/NeedNewAddress');
      }
    });

    rateService.whenAvailable(function() {

      var totalBalanceAlternative = rateService.toFiat(self.totalBalanceSat, self.alternativeIsoCode);
      var lockedBalanceAlternative = rateService.toFiat(self.lockedBalanceSat, self.alternativeIsoCode);
      var alternativeConversionRate = rateService.toFiat(100000000, self.alternativeIsoCode);

      self.totalBalanceAlternative = $filter('noFractionNumber')(totalBalanceAlternative, 2);
      self.lockedBalanceAlternative = $filter('noFractionNumber')(lockedBalanceAlternative, 2);
      self.alternativeConversionRate = $filter('noFractionNumber')(alternativeConversionRate, 2);

      self.alternativeBalanceAvailable = true;

      self.isRateAvailable = true;
      $rootScope.$apply();
    });

    if (!rateService.isAvailable()) {
      $rootScope.$apply();
    }
  };

  this.csvHistory = function() {

    function saveFile(name, data) {
      var chooser = document.querySelector(name);
      chooser.addEventListener("change", function(evt) {
        var fs = require('fs');
        fs.writeFile(this.value, data, function(err) {
          if (err) {
            $log.debug(err);
          }
        });
      }, false);
      chooser.click();
    }

    function formatDate(date) {
      var dateObj = new Date(date);
      if (!dateObj) {
        $log.debug('Error formating a date');
        return 'DateError'
      }
      if (!dateObj.toJSON()) {
        return '';
      }

      return dateObj.toJSON();
    }

    function formatString(str) {
      if (!str) return '';

      if (str.indexOf('"') !== -1) {
        //replace all
        str = str.replace(new RegExp('"', 'g'), '\'');
      }

      //escaping commas
      str = '\"' + str + '\"';

      return str;
    }

    var step = 6;
    var unique = {};

    function getHistory(cb) {
      storageService.getTxHistory(c.walletId, function(err, txs) {
        if (err) return cb(err);

        var txsFromLocal = [];
        try {
          txsFromLocal = JSON.parse(txs);
        } catch (ex) {
          $log.warn(ex);
        }

        allTxs.push(txsFromLocal);
        return cb(null, lodash.flatten(allTxs));
      });
    }

    if (isCordova) {
      $log.info('CSV generation not available in mobile');
      return;
    }
    var isNode = nodeWebkit.isDefined();
    var fc = profileService.focusedClient;
    var c = fc.credentials;
    if (!fc.isComplete()) return;
    var self = this;
    var allTxs = [];

    $log.debug('Generating CSV from History');
    self.setOngoingProcess('generatingCSV', true);

    $timeout(function() {
      getHistory(function(err, txs) {
        self.setOngoingProcess('generatingCSV', false);
        if (err) {
          self.handleError(err);
        } else {
          $log.debug('Wallet Transaction History:', txs);

          self.satToUnit = 1 / self.unitToSatoshi;
          var data = txs;
          var satToBtc = 1 / 100000000;
          var filename = 'Copay-' + (self.alias || self.walletName) + '.csv';
          var csvContent = '';

          if (!isNode) csvContent = 'data:text/csv;charset=utf-8,';
          csvContent += 'Date,Destination,Note,Amount,Currency,Txid,Creator,Copayers\n';

          var _amount, _note, _copayers, _creator;
          var dataString;
          data.forEach(function(it, index) {
            var amount = it.amount;

            if (it.action == 'moved')
              amount = 0;

            _copayers = '';
            _creator = '';

            if (it.actions && it.actions.length > 1) {
              for (var i = 0; i < it.actions.length; i++) {
                _copayers += it.actions[i].copayerName + ':' + it.actions[i].type + ' - ';
              }
              _creator = (it.creatorName && it.creatorName != 'undefined') ? it.creatorName : '';
            }
            _copayers = formatString(_copayers);
            _creator = formatString(_creator);
            _amount = (it.action == 'sent' ? '-' : '') + (amount * satToBtc).toFixed(8);
            _note = formatString((it.message ? it.message : ''));

            if (it.action == 'moved')
              _note += ' Moved:' + (it.amount * satToBtc).toFixed(8)

            dataString = formatDate(it.time * 1000) + ',' + formatString(it.addressTo) + ',' + _note + ',' + _amount + ',BTC,' + it.txid + ',' + _creator + ',' + _copayers;
            csvContent += dataString + "\n";

            if (it.fees && (it.action == 'moved' || it.action == 'sent')) {
              var _fee = (it.fees * satToBtc).toFixed(8)
              csvContent += formatDate(it.time * 1000) + ',Bitcoin Network Fees,, -' + _fee + ',BTC,,,' + "\n";
            }
          });

          if (isNode) {
            saveFile('#export_file', csvContent);
          } else {
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            link.click();
          }
        }
        $rootScope.$apply();
      });
    });
  };

  self.removeSoftConfirmedTx = function(txs) {
    return lodash.map(txs, function(tx) {
      if (tx.confirmations >= SOFT_CONFIRMATION_LIMIT)
        return tx;
    });
  }

  self.getConfirmedTxs = function(walletId, cb) {

    storageService.getTxHistory(walletId, function(err, txs) {
      if (err) return cb(err);

      var localTxs = [];

      if (!txs) {
        return cb(null, localTxs);
      }

      try {
        localTxs = JSON.parse(txs);
      } catch (ex) {
        $log.warn(ex);
      }
      return cb(null, lodash.compact(self.removeSoftConfirmedTx(localTxs)));
    });
  }

  self.updateLocalTxHistory = function(client, cb) {
    var requestLimit = 6;
    var walletId = client.credentials.walletId;
    var config = configService.getSync().wallet.settings;

    var fixTxsUnit = function(txs) {
      if (!txs || !txs[0]) return;

      var cacheUnit = txs[0].amountStr.split(' ')[1];

      if (cacheUnit == config.unitName)
        return;

      var name = ' ' + config.unitName;

      $log.debug('Fixing Tx Cache Unit to:' + name)
      lodash.each(txs, function(tx) {

        tx.amountStr = profileService.formatAmount(tx.amount, config.unitName) + name;
        tx.feeStr = profileService.formatAmount(tx.fees, config.unitName) + name;
      });
    };

    self.getConfirmedTxs(walletId, function(err, txsFromLocal) {
      if (err) return cb(err);
      var endingTxid = txsFromLocal[0] ? txsFromLocal[0].txid : null;

      fixTxsUnit(txsFromLocal);

      function getNewTxs(newTxs, skip, i_cb) {
        self.getTxsFromServer(client, skip, endingTxid, requestLimit, function(err, res, shouldContinue) {
          if (err) return i_cb(err);

          newTxs = newTxs.concat(lodash.compact(res));
          skip = skip + requestLimit;

          $log.debug('Syncing TXs. Got:' + newTxs.length + ' Skip:' + skip, ' EndingTxid:', endingTxid, ' Continue:', shouldContinue);

          if (!shouldContinue) {
            newTxs = self.processNewTxs(newTxs);
            $log.debug('Finish Sync: New Txs: ' + newTxs.length);
            return i_cb(null, newTxs);
          }

          if (walletId == profileService.focusedClient.credentials.walletId)
            self.txProgress = newTxs.length;

          $timeout(function() {
            $rootScope.$apply();
          });
          getNewTxs(newTxs, skip, i_cb);
        });
      };

      getNewTxs([], 0, function(err, txs) {
        if (err) return cb(err);

        var newHistory = lodash.compact(txs.concat(txsFromLocal));
        $log.debug('Tx History synced. Total Txs: ' + newHistory.length);

        if (walletId == profileService.focusedClient.credentials.walletId) {
          self.completeHistory = newHistory;
          self.txHistory = newHistory.slice(0, self.historyShowLimit);
          self.historyShowShowAll = newHistory.length >= self.historyShowLimit;
        }

        return storageService.setTxHistory(JSON.stringify(newHistory), walletId, function() {
          return cb();
        });
      });
    });
  }
  self.showAllHistory = function() {
    self.historyShowShowAll = false;
    self.historyRendering = true;
    $timeout(function() {
      $rootScope.$apply();
      $timeout(function() {
        self.historyRendering = false;
        self.txHistory = self.completeHistory;
      }, 100);
    }, 100);
  };

  self.getTxsFromServer = function(client, skip, endingTxid, limit, cb) {
    var res = [];

    client.getTxHistory({
      skip: skip,
      limit: limit
    }, function(err, txsFromServer) {
      if (err) return cb(err);

      if (!txsFromServer.length)
        return cb();

      var res = lodash.takeWhile(txsFromServer, function(tx) {
        return tx.txid != endingTxid;
      });

      return cb(null, res, res.length == limit);
    });
  };

  self.updateHistory = function() {
    var fc = profileService.focusedClient;
    if (!fc) return;
    var walletId = fc.credentials.walletId;

    if (!fc.isComplete() || self.updatingTxHistory[walletId]) return;

    $log.debug('Updating Transaction History');
    self.txHistoryError = false;
    self.updatingTxHistory[walletId] = true;

    $timeout(function() {
      self.updateLocalTxHistory(fc, function(err) {
        self.updatingTxHistory[walletId] = false;
        self.loadingWallet = false;
        self.txProgress = 0;
        if (err)
          self.txHistoryError = true;

        $timeout(function() {
          self.newTx = false
        }, 1000);

        $rootScope.$apply();
      });
    });
  };

  self.debounceUpdateHistory = lodash.debounce(function() {
    self.updateHistory();
  }, 1000);

  self.throttledUpdateHistory = lodash.throttle(function() {
    self.updateHistory();
  }, 10000);

  self.showErrorPopup = function(msg, cb) {
    $log.warn('Showing err popup:' + msg);
    self.showAlert = {
      msg: msg,
      close: function() {
        self.showAlert = null;
        if (cb) return cb();
      },
    };
    $timeout(function() {
      $rootScope.$apply();
    });
  };

  self.recreate = function(cb) {
    var fc = profileService.focusedClient;
    self.setOngoingProcess('recreating', true);
    fc.recreateWallet(function(err) {
      self.notAuthorized = false;
      self.setOngoingProcess('recreating', false);

      if (err) {
        self.handleError(err);
        $rootScope.$apply();
        return;
      }

      profileService.setWalletClients();
      self.startScan(self.walletId);
    });
  };

  self.openMenu = function() {
    if (!self.disclaimerAccepted) return;
    go.swipe(true);
  };

  self.closeMenu = function() {
    go.swipe();
  };

  self.retryScan = function() {
    var self = this;
    self.startScan(self.walletId);
  }

  self.startScan = function(walletId) {
    $log.debug('Scanning wallet ' + walletId);
    var c = profileService.walletClients[walletId];
    if (!c.isComplete()) return;

    if (self.walletId == walletId)
      self.setOngoingProcess('scanning', true);

    c.startScan({
      includeCopayerBranches: true,
    }, function(err) {
      if (err && self.walletId == walletId) {
        self.setOngoingProcess('scanning', false);
        self.handleError(err);
        $rootScope.$apply();
      }
    });
  };

  self.setUxLanguage = function() {
    uxLanguage.update(function(lang) {
      var userLang = lang;
      self.defaultLanguageIsoCode = userLang;
      self.defaultLanguageName = uxLanguage.getName(userLang);
    });
  };

  self.initGlidera = function(accessToken) {
    self.glideraEnabled = configService.getSync().glidera.enabled;
    self.glideraTestnet = configService.getSync().glidera.testnet;
    var network = self.glideraTestnet ? 'testnet' : 'livenet';

    self.glideraToken = null;
    self.glideraError = null;
    self.glideraPermissions = null;
    self.glideraEmail = null;
    self.glideraPersonalInfo = null;
    self.glideraTxs = null;
    self.glideraStatus = null;

    if (!self.glideraEnabled) return;

    glideraService.setCredentials(network);

    var getToken = function(cb) {
      if (accessToken) {
        cb(null, accessToken);
      } else {
        storageService.getGlideraToken(network, cb);
      }
    };

    getToken(function(err, accessToken) {
      if (err || !accessToken) return;
      else {
        self.glideraLoading = 'Connecting to Glidera...';
        glideraService.getAccessTokenPermissions(accessToken, function(err, p) {
          self.glideraLoading = null;
          if (err) {
            self.glideraError = err;
          } else {
            self.glideraToken = accessToken;
            self.glideraPermissions = p;
            self.updateGlidera({
              fullUpdate: true
            });
          }
        });
      }
    });
  };

  self.updateGlidera = function(opts) {
    if (!self.glideraToken || !self.glideraPermissions) return;
    var accessToken = self.glideraToken;
    var permissions = self.glideraPermissions;

    opts = opts || {};

    glideraService.getStatus(accessToken, function(err, data) {
      self.glideraStatus = data;
    });

    glideraService.getLimits(accessToken, function(err, limits) {
      self.glideraLimits = limits;
    });

    if (permissions.transaction_history) {
      self.glideraLoadingHistory = 'Getting Glidera transactions...';
      glideraService.getTransactions(accessToken, function(err, data) {
        self.glideraLoadingHistory = null;
        self.glideraTxs = data;
      });
    }

    if (permissions.view_email_address && opts.fullUpdate) {
      self.glideraLoadingEmail = 'Getting Glidera Email...';
      glideraService.getEmail(accessToken, function(err, data) {
        self.glideraLoadingEmail = null;
        self.glideraEmail = data.email;
      });
    }
    if (permissions.personal_info && opts.fullUpdate) {
      self.glideraLoadingPersonalInfo = 'Getting Glidera Personal Information...';
      glideraService.getPersonalInfo(accessToken, function(err, data) {
        self.glideraLoadingPersonalInfo = null;
        self.glideraPersonalInfo = data;
      });
    }

  };

  self.setAddressbook = function(ab) {
    if (ab) {
      self.addressbook = ab;
      return;
    }

    addressbookService.list(function(err, ab) {
      if (err) {
        $log.error('Error getting the addressbook');
        return;
      }
      self.addressbook = ab;
    });
  };

  $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    self.prevState = from.name || 'walletHome';
    self.tab = 'walletHome';
  });

  $rootScope.$on('Local/ClearHistory', function(event) {
    $log.debug('The wallet transaction history has been deleted');
    self.txHistory = self.completeHistory = [];
    self.debounceUpdateHistory();
  });

  $rootScope.$on('Local/AddressbookUpdated', function(event, ab) {
    self.setAddressbook(ab);
  });

  // UX event handlers
  $rootScope.$on('Local/ColorUpdated', function(event) {
    self.updateColor();
    $timeout(function() {
      $rootScope.$apply();
    });
  });

  $rootScope.$on('Local/AliasUpdated', function(event) {
    self.updateAlias();
    $timeout(function() {
      $rootScope.$apply();
    });
  });

  $rootScope.$on('Local/SpendUnconfirmedUpdated', function(event, spendUnconfirmed) {
    self.setSpendUnconfirmed(spendUnconfirmed);
    self.updateAll();
  });

  $rootScope.$on('Local/FeeLevelUpdated', function(event, level) {
    self.setCurrentFeeLevel(level);
  });

  $rootScope.$on('Local/SetFeeSendMax', function(event, cb) {
    self.setFeeAndSendMax(cb);
  });

  $rootScope.$on('Local/ProfileBound', function() {
    storageService.getRemotePrefsStoredFlag(function(err, val) {
      if (err || val) return;
      self.updateRemotePreferences({
        saveAll: true
      }, function() {
        $log.debug('Remote preferences saved')
        storageService.setRemotePrefsStoredFlag(function() {});
      });
    });
  });

  $rootScope.$on('Local/LanguageSettingUpdated', function() {
    self.setUxLanguage(function() {
      self.updateRemotePreferences({
        saveAll: true
      }, function() {
        $log.debug('Remote preferences saved')
      });
    });
  });

  $rootScope.$on('Local/GlideraUpdated', function(event, accessToken) {
    self.initGlidera(accessToken);
  });

  $rootScope.$on('Local/GlideraTx', function(event, accessToken, permissions) {
    self.updateGlidera();
  });

  $rootScope.$on('Local/GlideraError', function(event) {
    self.debouncedUpdate();
  });

  $rootScope.$on('Local/UnitSettingUpdated', function(event) {
    self.updateAll({
      triggerTxUpdate: true,
    });
    self.updateRemotePreferences({
      saveAll: true
    }, function() {
      $log.debug('Remote preferences saved')
    });
  });

  $rootScope.$on('Local/EmailSettingUpdated', function(event, email, cb) {
    self.updateRemotePreferences({
      preferences: {
        email: email || null
      },
    }, cb);
  });

  $rootScope.$on('Local/WalletCompleted', function(event) {
    self.setFocusedWallet();
    go.walletHome();
  });

  self.debouncedUpdate = lodash.throttle(function() {
    self.updateAll({
      quiet: true
    });
    self.debounceUpdateHistory();
  }, 4000, {
    leading: false,
    trailing: true
  });

  $rootScope.$on('Local/Resume', function(event) {
    $log.debug('### Resume event');
    self.isDisclaimerAccepted();
    self.debouncedUpdate();
  });

  $rootScope.$on('Local/BackupDone', function(event, walletId) {
    self.needsBackup = false;
    $log.debug('Backup done');
    storageService.setBackupFlag(walletId || self.walletId, function(err) {
      $log.debug('Backup done stored');
    });
  });

  $rootScope.$on('Local/DeviceError', function(event, err) {
    self.showErrorPopup(err, function() {
      if (self.isCordova && navigator && navigator.app) {
        navigator.app.exitApp();
      }
    });
  });

  $rootScope.$on('Local/WalletImported', function(event, walletId) {
    self.needsBackup = false;
    storageService.setBackupFlag(walletId, function() {
      $log.debug('Backup done stored');
      addressService.expireAddress(walletId, function(err) {
        $timeout(function() {
          self.txHistory = self.completeHistory = [];
          storageService.removeTxHistory(walletId, function() {
            self.startScan(walletId);
          });
        }, 500);
      });
    });
  });

  $rootScope.$on('NewIncomingTx', function() {
    self.newTx = true;
    self.updateAll({
      walletStatus: null,
      untilItChanges: true,
      triggerTxUpdate: true,
    });
  });


  $rootScope.$on('NewBlock', function() {
    if (self.glideraEnabled) {
      $timeout(function() {
        self.updateGlidera();
      });
    }
    if (self.pendingAmount) {
      self.updateAll({
        walletStatus: null,
        untilItChanges: null,
        triggerTxUpdate: true,
      });
    } else if (self.hasUnsafeConfirmed) {
      $log.debug('Wallet has transactions with few confirmations. Updating.')
      if (self.network == 'testnet') {
        self.throttledUpdateHistory();
      } else {
        self.debounceUpdateHistory();
      }
    }
  });

  $rootScope.$on('BalanceUpdated', function(e, n) {
    self.setBalance(n.data);
  });

  $rootScope.$on('NewOutgoingTx', function() {
    self.newTx = true;
    self.updateAll({
      walletStatus: null,
      untilItChanges: true,
      triggerTxUpdate: true,
    });
  });

  lodash.each(['NewTxProposal', 'TxProposalFinallyRejected', 'TxProposalRemoved', 'NewOutgoingTxByThirdParty',
    'Local/NewTxProposal', 'Local/TxProposalAction', 'Local/GlideraTx'
  ], function(eventName) {
    $rootScope.$on(eventName, function(event, untilItChanges) {
      self.newTx = eventName == 'Local/TxProposalAction' && untilItChanges;
      self.updateAll({
        walletStatus: null,
        untilItChanges: untilItChanges,
        triggerTxUpdate: true,
      });
    });
  });

  $rootScope.$on('ScanFinished', function() {
    $log.debug('Scan Finished. Updating history');
    storageService.removeTxHistory(self.walletId, function() {
      self.updateAll({
        walletStatus: null,
        triggerTxUpdate: true,
      });
    });
  });

  lodash.each(['TxProposalRejectedBy', 'TxProposalAcceptedBy'], function(eventName) {
    $rootScope.$on(eventName, function() {
      var f = function() {
        if (self.updatingStatus) {
          return $timeout(f, 200);
        };
        self.updatePendingTxps();
      };
      f();
    });
  });

  $rootScope.$on('Local/NoWallets', function(event) {

    $timeout(function() {
      self.hasProfile = true;
      self.noFocusedWallet = true;
      self.isComplete = null;
      self.walletName = null;
      self.setUxLanguage(function() {});
      profileService.isDisclaimerAccepted(function(v) {
        if (v) {
          go.path('import');
        }
      });
    });
  });

  $rootScope.$on('Local/NewFocusedWallet', function() {
    self.setUxLanguage(function() {});
    self.setFocusedWallet();
    self.debounceUpdateHistory();
    self.isDisclaimerAccepted();
    storageService.getCleanAndScanAddresses(function(err, walletId) {
      if (walletId && profileService.walletClients[walletId]) {
        $log.debug('Clear last address cache and Scan ', walletId);
        addressService.expireAddress(walletId, function(err) {
          self.startScan(walletId);
        });
        storageService.removeCleanAndScanAddresses(function() {});
      }
    });
  });

  $rootScope.$on('Local/SetTab', function(event, tab, reset) {
    self.setTab(tab, reset);
  });

  $rootScope.$on('Local/RequestTouchid', function(event, cb) {
    window.plugins.touchid.verifyFingerprint(
      gettextCatalog.getString('Scan your fingerprint please'),
      function(msg) {
        // OK
        return cb();
      },
      function(msg) {
        // ERROR
        return cb(gettext('Invalid Touch ID'));
      }
    );
  });

  $rootScope.$on('Local/NeedsPassword', function(event, isSetup, cb) {
    self.askPassword = {
      isSetup: isSetup,
      callback: function(err, pass) {
        self.askPassword = null;
        return cb(err, pass);
      },
    };
  });

  lodash.each(['NewCopayer', 'CopayerUpdated'], function(eventName) {
    $rootScope.$on(eventName, function() {
      // Re try to open wallet (will triggers)
      self.setFocusedWallet();
    });
  });

  $rootScope.$on('Local/NewEncryptionSetting', function() {
    var fc = profileService.focusedClient;
    self.isPrivKeyEncrypted = fc.isPrivKeyEncrypted();
    $timeout(function() {
      $rootScope.$apply();
    });
  });
 
});

'use strict';

angular.module('copayApp.controllers').controller('joinController',
  function($scope, $rootScope, $timeout, go, notification, profileService, configService, isCordova, storageService, applicationService, $modal, gettext, lodash, ledger, trezor, isChromeApp, isDevel,derivationPathHelper) {

    var self = this;
    var defaults = configService.getDefaults();
    $scope.bwsurl = defaults.bws.url;
    $scope.derivationPath = derivationPathHelper.default;
    $scope.account = 1;

    this.onQrCodeScanned = function(data) {
      $scope.secret = data;
      $scope.joinForm.secret.$setViewValue(data);
      $scope.joinForm.secret.$render();
    };


    var updateSeedSourceSelect = function() {
      self.seedOptions = [{
        id: 'new',
        label: gettext('New Random Seed'),
      }, {
        id: 'set',
        label: gettext('Specify Seed...'),
      }];
      $scope.seedSource = self.seedOptions[0];


      if (isChromeApp) {
        self.seedOptions.push({
          id: 'ledger',
          label: 'Ledger Hardware Wallet',
        });
      }

      if (isChromeApp || isDevel) {
        self.seedOptions.push({
          id: 'trezor',
          label: 'Trezor Hardware Wallet',
        });
      }
    };

    this.setSeedSource = function(src) {
      self.seedSourceId = $scope.seedSource.id;

      $timeout(function() {
        $rootScope.$apply();
      });
    };

    this.join = function(form) {
      if (form && form.$invalid) {
        self.error = gettext('Please enter the required fields');
        return;
      }

      var opts = {
        secret: form.secret.$modelValue,
        myName: form.myName.$modelValue,
        bwsurl: $scope.bwsurl,
      }

      var setSeed = self.seedSourceId =='set';
      if (setSeed) {
        var words = form.privateKey.$modelValue;
        if (words.indexOf(' ') == -1 && words.indexOf('prv') == 1 && words.length > 108) {
          opts.extendedPrivateKey = words;
        } else {
          opts.mnemonic = words;
        }
        opts.passphrase = form.passphrase.$modelValue;

        var pathData = derivationPathHelper.parse($scope.derivationPath);
        if (!pathData) {
          this.error = gettext('Invalid derivation path');
          return;
        }
        opts.account = pathData.account;
        opts.networkName = pathData.networkName;
        opts.derivationStrategy = pathData.derivationStrategy;
      } else {
        opts.passphrase = form.createPassphrase.$modelValue;
      }

      if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
        this.error = gettext('Please enter the wallet seed');
        return;
      }

      if (self.seedSourceId == 'ledger' || self.seedSourceId == 'trezor') {
        var account = $scope.account;
        if (!account || account < 1) {
          this.error = gettext('Invalid account number');
          return;
        }

        if ( self.seedSourceId == 'trezor')
          account = account - 1;

        opts.account =  account;
        self.hwWallet = self.seedSourceId == 'ledger' ? 'Ledger' : 'Trezor';
        var src = self.seedSourceId == 'ledger' ? ledger : trezor;

        src.getInfoForNewWallet(true, account, function(err, lopts) {
          self.hwWallet = false;
          if (err) {
            self.error = err;
            $scope.$apply();
            return;
          }
          opts = lodash.assign(lopts, opts);
          self._join(opts);
        });
      } else {
        self._join(opts);
      }
    };

    this._join = function(opts) {
      self.loading = true;
      $timeout(function() {
       console.log("copay wallet join");
      }, 100);
    };

    updateSeedSourceSelect();
    self.setSeedSource('new');
  });

angular.module('copayApp.controllers').controller('paperWalletController',
  function($scope, $http, $timeout, $log, configService, profileService, go, addressService, txStatus, bitcore) {
    var self = this;
    var fc = profileService.focusedClient;
    var rawTx;

    self.onQrCodeScanned = function(data) {
      $scope.inputData = data;
      self.onData(data);
    }

    self.onData = function(data) {
      self.error = '';
      self.scannedKey = data;
      self.isPkEncrypted = (data.charAt(0) == '6');
    }

    self._scanFunds = function(cb) {
      function getPrivateKey(scannedKey, isPkEncrypted, passphrase, cb) {
        if (!isPkEncrypted) return cb(null, scannedKey);
        fc.decryptBIP38PrivateKey(scannedKey, passphrase, null, cb);
      };

      function getBalance(privateKey, cb) {
        fc.getBalanceFromPrivateKey(privateKey, cb);
      };

      function checkPrivateKey(privateKey) {
        try {
          new bitcore.PrivateKey(privateKey, 'livenet');
        } catch (err) {
          return false;
        }
        return true;
      }

      getPrivateKey(self.scannedKey, self.isPkEncrypted, $scope.passphrase, function(err, privateKey) {
        if (err) return cb(err);
        if (!checkPrivateKey(privateKey)) return cb(new Error('Invalid private key'));

        getBalance(privateKey, function(err, balance) {
          if (err) return cb(err);
          return cb(null, privateKey, balance);
        });
      });
    }

    self.scanFunds = function() {
      self.scanning = true;
      self.privateKey = '';
      self.balanceSat = 0;
      self.error = '';

      $timeout(function() {
        self._scanFunds(function(err, privateKey, balance) {
          self.scanning = false;
          if (err) {
            $log.error(err);
            self.error = err.message || err.toString();
          } else {
            self.privateKey = privateKey;
            self.balanceSat = balance;
            var config = configService.getSync().wallet.settings;
            self.balance = profileService.formatAmount(balance) + ' ' + config.unitName;
          }

          $scope.$apply();
        });
      }, 100);
    }

    self._sweepWallet = function(cb) {
      addressService.getAddress(fc.credentials.walletId, true, function(err, destinationAddress) {
        if (err) return cb(err);

        fc.buildTxFromPrivateKey(self.privateKey, destinationAddress, null, function(err, tx) {
          if (err) return cb(err);

          fc.broadcastRawTx({
            rawTx: tx.serialize(),
            network: 'livenet'
          }, function(err, txid) {
            if (err) return cb(err);
            return cb(null, destinationAddress, txid);
          });
        });
      });
    };

    self.sweepWallet = function() {
      self.sending = true;
      self.error = '';

      $timeout(function() {
        self._sweepWallet(function(err, destinationAddress, txid) {
          self.sending = false;

          if (err) {
            self.error = err.message || err.toString();
            $log.error(err);
          } else {
            txStatus.notify({
              status: 'broadcasted'
            }, function() {
              go.walletHome();
            });
          }

          $scope.$apply();
        });
      }, 100);
    }
  });

'use strict';

angular.module('copayApp.controllers').controller('passwordController',
  function($rootScope, $scope, $timeout, profileService, notification, go, gettext) {

    var self = this;

    var pass1;

    self.isVerification = false;

    document.getElementById("passwordInput").focus();

    self.close = function(cb) {
      return cb('No password given');
    };

    self.set = function(isSetup, cb) {
      self.error = false;

      if (isSetup && !self.isVerification) {
        document.getElementById("passwordInput").focus();
        self.isVerification = true;
        pass1 = self.password;
        self.password = null;
        $timeout(function() {
          $rootScope.$apply();
        })
        return;
      }
      if (isSetup) {
        if (pass1 != self.password) {
          self.error = gettext('Passwords do not match');
          self.isVerification = false;
          self.password = null;
          pass1 = null;

          return;
        }
      }
      return cb(null, self.password);
    };

  });
'use strict';
angular.module('copayApp.controllers').controller('paymentUriController',
  function($rootScope, $stateParams, $location, $timeout, profileService, configService, lodash, bitcore, go) {

    function strip(number) {
      return (parseFloat(number.toPrecision(12)));
    };

    // Build bitcoinURI with querystring
    this.checkBitcoinUri = function() {
      var query = [];
      angular.forEach($location.search(), function(value, key) {
        query.push(key + "=" + value);
      });
      var queryString = query ? query.join("&") : null;
      this.bitcoinURI = $stateParams.data + (queryString ? '?' + queryString : '');

      var URI = bitcore.URI;
      var isUriValid = URI.isValid(this.bitcoinURI);
      if (!URI.isValid(this.bitcoinURI)) {
        this.error = true;
        return;
      }
      var uri = new URI(this.bitcoinURI);

      if (uri && uri.address) {
        var config = configService.getSync().wallet.settings;
        var unitToSatoshi = config.unitToSatoshi;
        var satToUnit = 1 / unitToSatoshi;
        var unitName = config.unitName;

        if (uri.amount) {
          uri.amount = strip(uri.amount * satToUnit) + ' ' + unitName;
        }
        uri.network = uri.address.network.name;
        this.uri = uri;
      }
    };

    this.getWallets = function(network) {
      return profileService.getWallets(network);
    };

    this.selectWallet = function(wid) {
      var self = this;
      if (wid != profileService.focusedClient.credentials.walletId) {
        profileService.setAndStoreFocus(wid, function() {});
      }
      $timeout(function() {
        $rootScope.$emit('paymentUri', self.bitcoinURI);
      }, 1000);
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesController',
  function($scope, $rootScope, $timeout, $log, configService, profileService) {

    var fc = profileService.focusedClient;
    $scope.deleted = false;
    if (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic) {
      $scope.deleted = true;
    }

    this.init = function() {
      var config = configService.getSync();
      var fc = profileService.focusedClient;
      if (fc) {
        $scope.encrypt = fc.hasPrivKeyEncrypted();
        this.externalSource = fc.getPrivKeyExternalSourceName() == 'ledger' ? "Ledger" : null;
        // TODO externalAccount
        //this.externalIndex = fc.getExternalIndex();
      }

      if (window.touchidAvailable) {
        var walletId = fc.credentials.walletId;
        this.touchidAvailable = true;
        config.touchIdFor = config.touchIdFor || {};
        $scope.touchid = config.touchIdFor[walletId];
      }
    };

    var unwatchEncrypt = $scope.$watch('encrypt', function(val) {
      var fc = profileService.focusedClient;
      if (!fc) return;

      if (val && !fc.hasPrivKeyEncrypted()) {
        $rootScope.$emit('Local/NeedsPassword', true, function(err, password) {
          if (err || !password) {
            $scope.encrypt = false;
            return;
          }
          profileService.setPrivateKeyEncryptionFC(password, function() {
            $rootScope.$emit('Local/NewEncryptionSetting');
            $scope.encrypt = true;
          });
        });
      } else {
        if (!val && fc.hasPrivKeyEncrypted()) {
          profileService.unlockFC(function(err) {
            if (err) {
              $scope.encrypt = true;
              return;
            }
            profileService.disablePrivateKeyEncryptionFC(function(err) {
              $rootScope.$emit('Local/NewEncryptionSetting');
              if (err) {
                $scope.encrypt = true;
                $log.error(err);
                return;
              }
              $scope.encrypt = false;
            });
          });
        }
      }
    });

    var unwatchRequestTouchid = $scope.$watch('touchid', function(newVal, oldVal) {
      if (newVal == oldVal || $scope.touchidError) {
        $scope.touchidError = false;
        return;
      }
      var walletId = profileService.focusedClient.credentials.walletId;

      var opts = {
        touchIdFor: {}
      };
      opts.touchIdFor[walletId] = newVal;

      $rootScope.$emit('Local/RequestTouchid', function(err) {
        if (err) {
          $log.debug(err);
          $timeout(function() {
            $scope.touchidError = true;
            $scope.touchid = oldVal;
          }, 100);
        } else {
          configService.set(opts, function(err) {
            if (err) {
              $log.debug(err);
              $scope.touchidError = true;
              $scope.touchid = oldVal;
            }
          });
        }
      });
    });

    $scope.$on('$destroy', function() {
      unwatchEncrypt();
      unwatchRequestTouchid();
    });
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesAbout',
  function() {});

'use strict';

angular.module('copayApp.controllers').controller('preferencesAliasController',
  function($scope, $timeout, configService, profileService, go) {
    var config = configService.getSync();
    var fc = profileService.focusedClient;
    var walletId = fc.credentials.walletId;

    var config = configService.getSync();
    config.aliasFor = config.aliasFor || {};
    this.alias = config.aliasFor[walletId] || fc.credentials.walletName;

    this.save = function() {
      var self = this;
      var opts = {
        aliasFor: {}
      };
      opts.aliasFor[walletId] = self.alias;

      configService.set(opts, function(err) {
        if (err) {
          $scope.$emit('Local/DeviceError', err);
          return;
        }
        $scope.$emit('Local/AliasUpdated');
        $timeout(function(){
          go.path('preferences');
        }, 50);
      });

    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesAltCurrencyController',
  function($scope, $timeout, $log, configService, rateService, lodash, go) {
    this.hideAdv = true;
    this.hidePriv = true;
    this.hideSecret = true;
    this.error = null;
    this.success = null;

    var config = configService.getSync();

    this.selectedAlternative = {
      name: config.wallet.settings.alternativeName,
      isoCode: config.wallet.settings.alternativeIsoCode
    };

    this.alternativeOpts = [this.selectedAlternative]; //default value

    var self = this;
    rateService.whenAvailable(function() {
      self.alternativeOpts = rateService.listAlternatives();
      lodash.remove(self.alternativeOpts, function(n) {
        return n.isoCode == 'BTC';
      });

      for (var ii in self.alternativeOpts) {
        if (config.wallet.settings.alternativeIsoCode === self.alternativeOpts[ii].isoCode) {
          self.selectedAlternative = self.alternativeOpts[ii];
        }
      }
      $scope.$digest();
    });


    this.save = function(newAltCurrency) {
      var opts = {
        wallet: {
          settings: {
            alternativeName: newAltCurrency.name,
            alternativeIsoCode: newAltCurrency.isoCode,
          }
        }
      };
      this.selectedAlternative = {
        name: newAltCurrency.name,
        isoCode: newAltCurrency.isoCode,
      };

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        go.preferencesGlobal();
        $scope.$emit('Local/UnitSettingUpdated');
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });
    };


  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesBwsUrlController',
  function($scope, $log, configService, go, applicationService, profileService, storageService) {
    this.error = null;
    this.success = null;

    var fc = profileService.focusedClient;
    var walletId = fc.credentials.walletId;
    var defaults = configService.getDefaults();
    var config = configService.getSync();

    this.bwsurl = (config.bwsFor && config.bwsFor[walletId]) || defaults.bws.url;

    this.resetDefaultUrl = function() {
      this.bwsurl = defaults.bws.url;
    };

    this.save = function() {

      var bws;
      switch (this.bwsurl) {
        case 'prod':
        case 'production':
          bws = 'https://bws.bitpay.com/bws/api'
          break;
        case 'sta':
        case 'staging':
          bws = 'https://bws-staging.b-pay.net/bws/api'
          break;
        case 'loc':
        case 'local':
          bws = 'http://localhost:3232/bws/api'
          break;
      };
      if (bws) {
        $log.info('Using BWS URL Alias to ' + bws);
        this.bwsurl = bws;
      }

      var opts = {
        bwsFor: {}
      };
      opts.bwsFor[walletId] = this.bwsurl;

      configService.set(opts, function(err) {
        if (err) console.log(err);
        storageService.setCleanAndScanAddresses(walletId, function() {
          applicationService.restart();
        });
      });
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesColorController',
  function($scope, $timeout, $log, configService, profileService, go) {
    var config = configService.getSync();
    this.colorOpts = [
      '#DD4B39',
      '#F38F12',
      '#FAA77F',
      '#D0B136',
      '#9EDD72',
      '#77DADA',
      '#4A90E2',
      '#484ED3',
      '#9B59B6',
      '#E856EF',
      '#FF599E',
      '#7A8C9E',
    ];

    var fc = profileService.focusedClient;
    var walletId = fc.credentials.walletId;

    var config = configService.getSync();
    config.colorFor = config.colorFor || {};
    this.color = config.colorFor[walletId] || '#4A90E2';

    this.save = function(color) {
      var self = this;
      var opts = {
        colorFor: {}
      };
      opts.colorFor[walletId] = color;

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        go.preferences();
        $scope.$emit('Local/ColorUpdated');
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });

    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesDeleteWalletController',
  function($scope, $rootScope, $filter, $timeout, $modal, $log, storageService, notification, profileService, isCordova, go, gettext, gettextCatalog, animationService) {
    this.isCordova = isCordova;
    this.error = null;

    var delete_msg = gettextCatalog.getString('Are you sure you want to delete this wallet?');
    var accept_msg = gettextCatalog.getString('Accept');
    var cancel_msg = gettextCatalog.getString('Cancel');
    var confirm_msg = gettextCatalog.getString('Confirm');

    var _modalDeleteWallet = function() {
      var ModalInstanceCtrl = function($scope, $modalInstance, gettext) {
        $scope.title = delete_msg;
        $scope.loading = false;

        $scope.ok = function() {
          $scope.loading = true;
          $modalInstance.close(accept_msg);

        };
        $scope.cancel = function() {
          $modalInstance.dismiss(cancel_msg);
        };
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/confirmation.html',
        windowClass: animationService.modalAnimated.slideUp,
        controller: ModalInstanceCtrl
      });

      modalInstance.result.finally(function() {
        var m = angular.element(document.getElementsByClassName('reveal-modal'));
        m.addClass(animationService.modalAnimated.slideOutDown);
      });

      modalInstance.result.then(function(ok) {
        if (ok) {
          _deleteWallet();
        }
      });
    };

    var _deleteWallet = function() {
      var fc = profileService.focusedClient;
      var name = fc.credentials.walletName;
      var walletName = (fc.alias || '') + ' [' + name + ']';
      var self = this;

      profileService.deleteWalletFC({}, function(err) {
        if (err) {
          self.error = err.message || err;
        } else {
          notification.success(gettextCatalog.getString('Success'), gettextCatalog.getString('The wallet "{{walletName}}" was deleted', {
            walletName: walletName
          }));
        }
      });
    };

    this.deleteWallet = function() {
      if (isCordova) {
        navigator.notification.confirm(
          delete_msg,
          function(buttonIndex) {
            if (buttonIndex == 1) {
              _deleteWallet();
            }
          },
          confirm_msg, [accept_msg, cancel_msg]
        );
      } else {
        _modalDeleteWallet();
      }
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesEmailController',
  function($scope, go, profileService, gettext, $log) {
    this.save = function(form) {
      var self = this;
      this.error = null;

      var fc = profileService.focusedClient;
      this.saving = true;
      $scope.$emit('Local/EmailSettingUpdated', self.email, function() {
        self.saving = false;
        go.path('preferences');
      });
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesFeeController',
  function($rootScope, configService) {

    this.save = function(newFee) {
      var opts = {
        wallet: {
          settings: {
            feeLevel: newFee
          }
        }
      };
      $rootScope.$emit('Local/FeeLevelUpdated', newFee);

      configService.set(opts, function(err) {
        if (err) $log.debug(err);
      });

    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesGlideraController', 
  function($scope, $modal, $timeout, profileService, applicationService, glideraService, storageService, isChromeApp, animationService) {

    this.getEmail = function(token) {
      var self = this;
      glideraService.getEmail(token, function(error, data) {
        self.email = data;
      });
    };

    this.getPersonalInfo = function(token) {
      var self = this;
      glideraService.getPersonalInfo(token, function(error, info) {
        self.personalInfo = info;
      });
    };

    this.getStatus = function(token) {
      var self = this;
      glideraService.getStatus(token, function(error, data) {
        self.status = data;
      });
    };

    this.getLimits = function(token) {
      var self = this;
      glideraService.getLimits(token, function(error, limits) {
        self.limits = limits;
      });
    };

    this.revokeToken = function(testnet) {
      var network = testnet ? 'testnet' : 'livenet';
      var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close(true);
        };
        $scope.cancel = function() {
          $modalInstance.dismiss();
        };
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/glidera-confirmation.html',
        windowClass: animationService.modalAnimated.slideRight,
        controller: ModalInstanceCtrl
      });

      modalInstance.result.then(function(ok) {
        if (ok) {
          storageService.removeGlideraToken(network, function() {
            $timeout(function() {
              applicationService.restart();
            }, 100);
          });
        }
      });

      modalInstance.result.finally(function() {
        var m = angular.element(document.getElementsByClassName('reveal-modal'));
        m.addClass(animationService.modalAnimated.slideOutRight);
      });
    };

  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesGlobalController',
  function($scope, $rootScope, $log, configService, uxLanguage) {
    
    this.init = function() {
      var config = configService.getSync();
      this.unitName = config.wallet.settings.unitName;
      this.currentLanguageName = uxLanguage.getCurrentLanguageName();
      this.selectedAlternative = {
        name: config.wallet.settings.alternativeName,
        isoCode: config.wallet.settings.alternativeIsoCode
      }; 
      $scope.spendUnconfirmed = config.wallet.spendUnconfirmed;
      $scope.glideraEnabled = config.glidera.enabled;
      $scope.glideraTestnet = config.glidera.testnet;
    };

    var unwatchSpendUnconfirmed = $scope.$watch('spendUnconfirmed', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        wallet: {
          spendUnconfirmed: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/SpendUnconfirmedUpdated', newVal);
        if (err) $log.debug(err);
      });
    });

    var unwatchGlideraEnabled = $scope.$watch('glideraEnabled', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        glidera: {
          enabled: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/GlideraUpdated');
        if (err) $log.debug(err);
      });
    });

    var unwatchGlideraTestnet = $scope.$watch('glideraTestnet', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        glidera: {
          testnet: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/GlideraUpdated');
        if (err) $log.debug(err);
      });
    });

    $scope.$on('$destroy', function() {
      unwatchSpendUnconfirmed();
      unwatchGlideraEnabled();
      unwatchGlideraTestnet();
    });
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesHistory',
  function($scope, $log, $timeout, storageService, go, profileService) {
    var fc = profileService.focusedClient;
    var c = fc.credentials;

    this.clearTransactionHistory = function() {
      storageService.removeTxHistory(c.walletId, function(err) {
        if (err) {
          $log.error(err);
          return;
        }
        $scope.$emit('Local/ClearHistory');

        $timeout(function() {
          go.walletHome();
        }, 100);
      });
    }
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesInformation',
  function($scope, $log, $timeout, isMobile, gettextCatalog, lodash, profileService, storageService, go) {
    var base = 'xpub';
    var fc = profileService.focusedClient;
    var c = fc.credentials;

    this.init = function() {
      var basePath = c.getBaseAddressDerivationPath();

      $scope.walletName = c.walletName;
      $scope.walletId = c.walletId;
      $scope.network = c.network;
      $scope.addressType = c.addressType || 'P2SH';
      $scope.derivationStrategy = c.derivationStrategy || 'BIP45';
      $scope.basePath = basePath;
      $scope.M = c.m;
      $scope.N = c.n;
      $scope.pubKeys = lodash.pluck(c.publicKeyRing, 'xPubKey');
      $scope.addrs = null;

      fc.getMainAddresses({
        doNotVerify: true
      }, function(err, addrs) {
        if (err) {
          $log.warn(err);
          return;
        };
        var last10 = [],
          i = 0,
          e = addrs.pop();
        while (i++ < 10 && e) {
          e.path = base + e.path.substring(1);
          last10.push(e);
          e = addrs.pop();
        }
        $scope.addrs = last10;
        $timeout(function() {
          $scope.$apply();
        });

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

'use strict';

angular.module('copayApp.controllers').controller('preferencesLanguageController',
  function($scope, $log, $timeout, configService, uxLanguage, go) {

    this.availableLanguages = uxLanguage.getLanguages();

    this.save = function(newLang) {

      var opts = {
        wallet: {
          settings: {
            defaultLanguage: newLang
          }
        }
      };

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        go.preferencesGlobal();
        $scope.$emit('Local/LanguageSettingUpdated');
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });
    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesLogs',
function(historicLog) {
  this.logs = historicLog.get();

  this.sendLogs = function() {
    var body = 'Copay Session Logs\n Be careful, this could contain sensitive private data\n\n';
    body += '\n\n';
    body += this.logs.map(function(v) {
      return v.msg;
    }).join('\n');

    var properties = {
      subject: 'Copay Logs',
      body: body,
      isHtml: false
    };
    window.plugin.email.open(properties);
  };
});

'use strict';

angular.module('copayApp.controllers').controller('preferencesUnitController',
  function($scope, $timeout, $log, configService, go) {
    var config = configService.getSync();
    this.unitName = config.wallet.settings.unitName;
    this.unitOpts = [
      // TODO : add Satoshis to bitcore-wallet-client formatAmount()
      // {
      //     name: 'Satoshis (100,000,000 satoshis = 1BTC)',
      //     shortName: 'SAT',
      //     value: 1,
      //     decimals: 0,
      //     code: 'sat',
      //   }, 
      {
        name: 'bits (1,000,000 bits = 1BTC)',
        shortName: 'bits',
        value: 100,
        decimals: 2,
        code: 'bit',
      }
      // TODO : add mBTC to bitcore-wallet-client formatAmount()
      // ,{
      //   name: 'mBTC (1,000 mBTC = 1BTC)',
      //   shortName: 'mBTC',
      //   value: 100000,
      //   decimals: 5,
      //   code: 'mbtc',
      // }
      , {
        name: 'BTC',
        shortName: 'BTC',
        value: 100000000,
        decimals: 8,
        code: 'btc',
      }
    ];

    this.save = function(newUnit) {
      var opts = {
        wallet: {
          settings: {
            unitName: newUnit.shortName,
            unitToSatoshi: newUnit.value,
            unitDecimals: newUnit.decimals,
            unitCode: newUnit.code,
          }
        }
      };
      this.unitName = newUnit.shortName;

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        go.preferencesGlobal();
        $scope.$emit('Local/UnitSettingUpdated');
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });

    };
  });

'use strict';

angular.module('copayApp.controllers').controller('preferencesPeerMngmt', function($scope, $rootScope){
  $rootScope.showPeerFavorites = true;
  this.favor1 = true;
  this.favor3 = true;
   
});

'use strict';

angular.module('copayApp.controllers').controller('sellGlideraController', 
  function($scope, $timeout, $log, $modal, configService, profileService, addressService, feeService, glideraService, bwsError, lodash, isChromeApp, animationService) {

    var self = this;
    var config = configService.getSync();
    this.data = {};
    this.show2faCodeInput = null;
    this.success = null;
    this.error = null;
    this.loading = null;
    this.currentSpendUnconfirmed = config.wallet.spendUnconfirmed;
    this.currentFeeLevel = config.wallet.settings.feeLevel || 'normal';
    var fc;

    window.ignoreMobilePause = true;

    var otherWallets = function(testnet) {
      var network = testnet ? 'testnet' : 'livenet';
      return lodash.filter(profileService.getWallets(network), function(w) {
        return w.network == network && w.m == 1;
      });
    };

    this.init = function(testnet) {
      self.otherWallets = otherWallets(testnet);
      // Choose focused wallet
      try {
        var currentWalletId = profileService.focusedClient.credentials.walletId;
        lodash.find(self.otherWallets, function(w) {
          if (w.id == currentWalletId) {
            $timeout(function() {
              self.selectedWalletId = w.id;
              self.selectedWalletName = w.name;
              fc = profileService.getClient(w.id);
              $scope.$apply();
            }, 100);
          }
        });
      } catch(e) {
        $log.debug(e);
      };
    };

    $scope.openWalletsModal = function(wallets) {
      self.error = null;
      self.selectedWalletId = null;
      self.selectedWalletName = null;
      var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.type = 'SELL';
        $scope.wallets = wallets;
        $scope.noColor = true;
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.selectWallet = function(walletId, walletName) {
          if (!profileService.getClient(walletId).isComplete()) {
            self.error = bwsError.msg({'code': 'WALLET_NOT_COMPLETE'}, 'Could not choose the wallet');
            $modalInstance.dismiss('cancel');
            return;
          }
          $modalInstance.close({
            'walletId': walletId, 
            'walletName': walletName,
          });
        };
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/glidera-wallets.html',
          windowClass: animationService.modalAnimated.slideUp,
          controller: ModalInstanceCtrl,
      });

      modalInstance.result.finally(function() {
        var m = angular.element(document.getElementsByClassName('reveal-modal'));
        m.addClass(animationService.modalAnimated.slideOutDown);
      });

      modalInstance.result.then(function(obj) {
        $timeout(function() {
          self.selectedWalletId = obj.walletId;
          self.selectedWalletName = obj.walletName;
          fc = profileService.getClient(obj.walletId);
          $scope.$apply();
        }, 100);
      });
    };

    this.getSellPrice = function(token, price) {
      var self = this;
      this.error = null;
      if (!price || (price && !price.qty && !price.fiat)) {
        this.sellPrice = null;
        return;
      }
      this.gettingSellPrice = true;
      glideraService.sellPrice(token, price, function(err, sellPrice) {
        self.gettingSellPrice = false;
        if (err) {
          self.error = 'Could not get exchange information. Please, try again.';
        }
        else {
          self.error = null;
          self.sellPrice = sellPrice;
        }
      });     
    };

    this.get2faCode = function(token) {
      var self = this;
      this.loading = 'Sending 2FA code...';
      $timeout(function() {
        glideraService.get2faCode(token, function(err, sent) {
          self.loading = null;
          if (err) {
            self.error = 'Could not send confirmation code to your phone';
          }
          else {
            self.show2faCodeInput = sent;
          }
        });
      }, 100);
    };

    this.createTx = function(token, permissions, twoFaCode) {
      var self = this;
      self.error = null;

      this.loading = 'Selling Bitcoin...';
      $timeout(function() {
        addressService.getAddress(fc.credentials.walletId, null, function(err, refundAddress) {
          if (!refundAddress) {
            self.loading = null;
            self.error = bwsError.msg(err, 'Could not create address');
            return;
          }
          glideraService.getSellAddress(token, function(error, sellAddress) {
            if (!sellAddress) {
              self.loading = null;
              self.error = 'Could not get the destination bitcoin address';
              return;
            }
            var amount = parseInt((self.sellPrice.qty * 100000000).toFixed(0));

            feeService.getCurrentFeeValue(self.currentFeeLevel, function(err, feePerKb) {
              if (err) $log.debug(err);
              fc.sendTxProposal({
                toAddress: sellAddress,
                amount: amount,
                message: 'Glidera transaction',
                customData: {'glideraToken': token},
                payProUrl: null,
                feePerKb: feePerKb,
                excludeUnconfirmedUtxos: self.currentSpendUnconfirmed ? false : true
              }, function(err, txp) {
                if (err) {
                  profileService.lockFC();
                  $log.error(err);
                  $timeout(function() {
                    self.loading = null;
                    self.error = bwsError.msg(err, 'Error');
                  }, 1);
                  return;
                }

                if (!fc.canSign()) {
                  self.loading = null;
                  $log.info('No signing proposal: No private key');
                  return;
                }

                _signTx(txp, function(err, txp, rawTx) {
                  profileService.lockFC();
                  if (err) {
                    self.loading = null;
                    self.error = err;
                    $scope.$apply();
                  }
                  else {
                    var data = {
                      refundAddress: refundAddress,
                      signedTransaction: rawTx,
                      priceUuid: self.sellPrice.priceUuid,
                      useCurrentPrice: self.sellPrice.priceUuid ? false : true,
                      ip: null 
                    };
                    glideraService.sell(token, twoFaCode, data, function(err, data) {
                      self.loading = null;
                      if (err) {
                        self.error = err;
                        fc.removeTxProposal(txp, function(err, txpb) {
                          $timeout(function() {
                            $scope.$emit('Local/GlideraError');
                          }, 100);
                        });
                      }
                      else {
                        self.success = data;
                        $scope.$emit('Local/GlideraTx');
                      }
                    });
                  }
                });
              });
            });
          });
        });

      }, 100);
    
    };

    var _signTx = function(txp, cb) {
      var self = this;
      fc.signTxProposal(txp, function(err, signedTx) {
        profileService.lockFC();
        if (err) {
          err = bwsError.msg(err, 'Could not accept payment');
          return cb(err);
        }
        else {
          if (signedTx.status == 'accepted') {
            return cb(null, txp, signedTx.raw);

          } else {
            return cb('The transaction could not be signed');
          }
        }
      });
    };

  });

'use strict';

angular.module('copayApp.controllers').controller('sidebarController',
  function($rootScope, $timeout, lodash, profileService, configService, go, isMobile, isCordova) {
    var self = this;
    self.isWindowsPhoneApp = isMobile.Windows() && isCordova;
    self.walletSelection = false;

    // wallet list change
    $rootScope.$on('Local/WalletListUpdated', function(event) {
      self.walletSelection = false;
      self.setWallets();
    });

    $rootScope.$on('Local/ColorUpdated', function(event) {
      self.setWallets();
    });

    $rootScope.$on('Local/AliasUpdated', function(event) {
      self.setWallets();
    });


    self.signout = function() {
      profileService.signout();
    };

    self.switchWallet = function(selectedWalletId, currentWalletId) {
      if (selectedWalletId == currentWalletId) return;
      self.walletSelection = false;
      profileService.setAndStoreFocus(selectedWalletId, function() {});
    };

    self.toggleWalletSelection = function() {
      self.walletSelection = !self.walletSelection;
      if (!self.walletSelection) return;
      self.setWallets();
    };

    self.setWallets = function() {
      if (!profileService.profile) return;

      var config = configService.getSync();
      config.colorFor = config.colorFor || {};
      config.aliasFor = config.aliasFor || {};

      // Sanitize empty wallets (fixed in BWC 1.8.1, and auto fixed when wallets completes)
      var credentials = lodash.filter(profileService.profile.credentials, 'walletName');
      var ret = lodash.map(credentials, function(c) {
        return {
          m: c.m,
          n: c.n,
          name: config.aliasFor[c.walletId] || c.walletName,
          id: c.walletId,
          color: config.colorFor[c.walletId] || '#4A90E2',
        };
      });

      self.wallets = lodash.sortBy(ret, 'name');
    };

    self.setWallets();

  });

'use strict';

angular.module('copayApp.controllers').controller('termOfUseController',
  function($scope, uxLanguage) {

    $scope.lang = uxLanguage.currentLanguage;

  });

'use strict';

angular.module('copayApp.controllers').controller('topbarController', function(go, $rootScope) { 

  this.goHome = function() {
    go.walletHome();
  };

  this.goPreferences = function() {
    go.preferences();
  };
  
  this.showFavorites = function(peer) {
    if(peer)
      $rootScope.showPeerFavorites = false;
  };
  this.changeFavorite = function(){
    
    $rootScope.peerFavorites = this.peerFavorites;
  };
  
});

'use strict';

angular.module('copayApp.controllers').controller('versionController', function() {
  this.version = window.version;
  this.commitHash = window.commitHash;
});

'use strict';

angular.module('copayApp.controllers').controller('walletHomeController', function($scope, $rootScope, $timeout, $filter, $modal, $log, notification, txStatus, isCordova, isMobile, profileService, lodash, configService, rateService, storageService, bitcore, isChromeApp, gettext, gettextCatalog, nodeWebkit, addressService, ledger, bwsError, confirmDialog, txFormatService, animationService, addressbookService, go, feeService) {

  var self = this;
  window.ignoreMobilePause = false;
  $rootScope.hideMenuBar = false;
  $rootScope.wpInputFocused = false;
  var config = configService.getSync();
  var configWallet = config.wallet;

  // INIT
  var walletSettings = configWallet.settings;
  this.unitToSatoshi = walletSettings.unitToSatoshi;
  this.satToUnit = 1 / this.unitToSatoshi;
  this.unitName = walletSettings.unitName;
  this.alternativeIsoCode = walletSettings.alternativeIsoCode;
  this.alternativeName = walletSettings.alternativeName;
  this.alternativeAmount = 0;
  this.unitDecimals = walletSettings.unitDecimals;
  this.isCordova = isCordova;
  this.addresses = [];
  this.isMobile = isMobile.any();
  this.isWindowsPhoneApp = isMobile.Windows() && isCordova;
  this.blockUx = false;
  this.isRateAvailable = false;
  this.showScanner = false;
  this.addr = {};
  this.lockedCurrentFeePerKb = null;

  var disableScannerListener = $rootScope.$on('dataScanned', function(event, data) {
    self.setForm(data);
    $rootScope.$emit('Local/SetTab', 'send');

    var form = $scope.sendForm;
    if (form.address.$invalid && !self.blockUx) {
      self.resetForm();
      self.error = gettext('Could not recognize a valid Bitcoin QR Code');
    }
  });

  var disablePaymentUriListener = $rootScope.$on('paymentUri', function(event, uri) {
    $rootScope.$emit('Local/SetTab', 'send');
    $timeout(function() {
      self.setForm(uri);
    }, 100);
  });

  var disableAddrListener = $rootScope.$on('Local/NeedNewAddress', function() {
    self.setAddress(true);
  });

  var disableFocusListener = $rootScope.$on('Local/NewFocusedWallet', function() {
    self.addr = {};
    self.resetForm();
  });

  var disableResumeListener = $rootScope.$on('Local/Resume', function() {
    // This is needed then the apps go to sleep
    self.bindTouchDown();
  });

  var disableTabListener = $rootScope.$on('Local/TabChanged', function(e, tab) {
    // This will slow down switch, do not add things here!
    switch (tab) {
      case 'receive':
        // just to be sure we have an address
        self.setAddress();
        break;
      case 'send':
        self.resetError();
    };
  });

  var disableOngoingProcessListener = $rootScope.$on('Addon/OngoingProcess', function(e, name) {
    self.setOngoingProcess(name);
  });

  $scope.$on('$destroy', function() {
    disableAddrListener();
    disableScannerListener();
    disablePaymentUriListener();
    disableTabListener();
    disableFocusListener();
    disableResumeListener();
    disableOngoingProcessListener();
    $rootScope.hideMenuBar = false;
  });

  var requestTouchid = function(cb) {
    var fc = profileService.focusedClient;
    config.touchIdFor = config.touchIdFor || {};
    if (window.touchidAvailable && config.touchIdFor[fc.credentials.walletId]) {
      $rootScope.$emit('Local/RequestTouchid', cb);
    } else {
      return cb();
    }
  };

  this.onQrCodeScanned = function(data) {
    if (data) go.send();
    $rootScope.$emit('dataScanned', data);
  };

  rateService.whenAvailable(function() {
    self.isRateAvailable = true;
    $rootScope.$digest();
  });

  var accept_msg = gettextCatalog.getString('Accept');
  var cancel_msg = gettextCatalog.getString('Cancel');
  var confirm_msg = gettextCatalog.getString('Confirm');

  this.openDestinationAddressModal = function(wallets, address) {
    $rootScope.modalOpened = true;
    var fc = profileService.focusedClient;
    self.lockAddress = false;
    self._address = null;

    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.wallets = wallets;
      $scope.editAddressbook = false;
      $scope.addAddressbookEntry = false;
      $scope.selectedAddressbook = {};
      $scope.newAddress = address;
      $scope.walletName = fc.credentials.walletName;
      $scope.color = fc.backgroundColor;
      $scope.addressbook = {
        'address': ($scope.newAddress || ''),
        'label': ''
      };

      $scope.beforeQrCodeScann = function() {
        $scope.error = null;
        $scope.addAddressbookEntry = true;
        $scope.editAddressbook = false;
      };

      $scope.onQrCodeScanned = function(data, addressbookForm) {
        $timeout(function() {
          var form = addressbookForm;
          if (data && form) {
            data = data.replace('bitcoin:', '');
            form.address.$setViewValue(data);
            form.address.$isValid = true;
            form.address.$render();
          }
          $scope.$digest();
        }, 100);
      };

      $scope.selectAddressbook = function(addr) {
        $modalInstance.close(addr);
      };

      $scope.toggleEditAddressbook = function() {
        $scope.editAddressbook = !$scope.editAddressbook;
        $scope.selectedAddressbook = {};
        $scope.addAddressbookEntry = false;
      };

      $scope.toggleSelectAddressbook = function(addr) {
        $scope.selectedAddressbook[addr] = $scope.selectedAddressbook[addr] ? false : true;
      };

      $scope.toggleAddAddressbookEntry = function() {
        $scope.error = null;
        $scope.addressbook = {
          'address': ($scope.newAddress || ''),
          'label': ''
        };
        $scope.addAddressbookEntry = !$scope.addAddressbookEntry;
      };

      $scope.list = function() {
        $scope.error = null;
        addressbookService.list(function(err, ab) {
          if (err) {
            $scope.error = err;
            return;
          }
          $scope.list = ab;
        });
      };

      $scope.add = function(addressbook) {
        $scope.error = null;
        $timeout(function() {
          addressbookService.add(addressbook, function(err, ab) {
            if (err) {
              $scope.error = err;
              return;
            }
            $rootScope.$emit('Local/AddressbookUpdated', ab);
            $scope.list = ab;
            $scope.editAddressbook = true;
            $scope.toggleEditAddressbook();
            $scope.$digest();
          });
        }, 100);
      };

      $scope.remove = function(addr) {
        $scope.error = null;
        $timeout(function() {
          addressbookService.remove(addr, function(err, ab) {
            if (err) {
              $scope.error = err;
              return;
            }
            $rootScope.$emit('Local/AddressbookUpdated', ab);
            $scope.list = ab;
            $scope.$digest();
          });
        }, 100);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.selectWallet = function(walletId, walletName) {
        $scope.gettingAddress = true;
        $scope.selectedWalletName = walletName;
        $timeout(function() {
          $scope.$apply();
        });
        addressService.getAddress(walletId, false, function(err, addr) {
          $scope.gettingAddress = false;

          if (err) {
            self.error = err;
            $modalInstance.dismiss('cancel');
            return;
          }

          $modalInstance.close(addr);
        });
      };
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/destination-address.html',
      windowClass: animationService.modalAnimated.slideUp,
      controller: ModalInstanceCtrl,
    });

    var disableCloseModal = $rootScope.$on('closeModal', function() {
      modalInstance.dismiss('cancel');
    });

    modalInstance.result.finally(function() {
      $rootScope.modalOpened = false;
      disableCloseModal();
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass(animationService.modalAnimated.slideOutDown);
    });

    modalInstance.result.then(function(addr) {
      if (addr) {
        self.setForm(addr);
      }
    });
  };

  var GLIDERA_LOCK_TIME = 6 * 60 * 60;
  // isGlidera flag is a security mesure so glidera status is not
  // only determined by the tx.message
  this.openTxpModal = function(tx, copayers, isGlidera) {
    $rootScope.modalOpened = true;
    var fc = profileService.focusedClient;
    var refreshUntilItChanges = false;
    var currentSpendUnconfirmed = configWallet.spendUnconfirmed;
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.error = null;
      $scope.copayers = copayers
      $scope.copayerId = fc.credentials.copayerId;
      $scope.canSign = fc.canSign() || fc.isPrivKeyExternal();
      $scope.loading = null;
      $scope.color = fc.backgroundColor;
      $scope.isShared = fc.credentials.n > 1;

      // ToDo: use tx.customData instead of tx.message
      if (tx.message === 'Glidera transaction' && isGlidera) {
        tx.isGlidera = true;
        if (tx.canBeRemoved) {
          tx.canBeRemoved = (Date.now() / 1000 - (tx.ts || tx.createdOn)) > GLIDERA_LOCK_TIME;
        }
      }
      $scope.tx = tx;

      refreshUntilItChanges = false;
      $scope.currentSpendUnconfirmed = currentSpendUnconfirmed;

      $scope.getShortNetworkName = function() {
        return fc.credentials.networkName.substring(0, 4);
      };
      lodash.each(['TxProposalRejectedBy', 'TxProposalAcceptedBy', 'transactionProposalRemoved', 'TxProposalRemoved', 'NewOutgoingTx', 'UpdateTx'], function(eventName) {
        $rootScope.$on(eventName, function() {
          fc.getTx($scope.tx.id, function(err, tx) {
            if (err) {

              if (err.code && err.code == 'TX_NOT_FOUND' &&
                (eventName == 'transactionProposalRemoved' || eventName == 'TxProposalRemoved')) {
                $scope.tx.removed = true;
                $scope.tx.canBeRemoved = false;
                $scope.tx.pendingForUs = false;
                $scope.$apply();
                return;
              }
              return;
            }

            var action = lodash.find(tx.actions, {
              copayerId: fc.credentials.copayerId
            });
            $scope.tx = txFormatService.processTx(tx);
            if (!action && tx.status == 'pending')
              $scope.tx.pendingForUs = true;
            $scope.updateCopayerList();
            $scope.$apply();
          });
        });
      });

      $scope.updateCopayerList = function() {
        lodash.map($scope.copayers, function(cp) {
          lodash.each($scope.tx.actions, function(ac) {
            if (cp.id == ac.copayerId) {
              cp.action = ac.type;
            }
          });
        });
      };

      $scope.sign = function(txp) {
        var fc = profileService.focusedClient;

        if (!fc.canSign() && !fc.isPrivKeyExternal())
          return;

        if (fc.isPrivKeyEncrypted()) {
          profileService.unlockFC(function(err) {
            if (err) {
              $scope.error = bwsError.msg(err);
              return;
            }
            return $scope.sign(txp);
          });
          return;
        };

        self._setOngoingForSigning();
        $scope.loading = true;
        $scope.error = null;
        $timeout(function() {
          requestTouchid(function(err) {
            if (err) {
              self.setOngoingProcess();
              $scope.loading = false;
              profileService.lockFC();
              $scope.error = err;
              $scope.$digest();
              return;
            }

            profileService.signTxProposal(txp, function(err, txpsi) {
              self.setOngoingProcess();
              if (err) {
                $scope.$emit('UpdateTx');
                $scope.loading = false;
                $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not accept payment'));
                $scope.$digest();
              } else {
                //if txp has required signatures then broadcast it
                var txpHasRequiredSignatures = txpsi.status == 'accepted';
                if (txpHasRequiredSignatures) {
                  self.setOngoingProcess(gettextCatalog.getString('Broadcasting transaction'));
                  $scope.loading = true;
                  fc.broadcastTxProposal(txpsi, function(err, txpsb, memo) {
                    self.setOngoingProcess();
                    $scope.loading = false;
                    if (err) {
                      $scope.$emit('UpdateTx');
                      $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not broadcast payment'));
                      $scope.$digest();
                    } else {
                      $log.debug('Transaction signed and broadcasted')
                      if (memo)
                        $log.info(memo);

                      refreshUntilItChanges = true;
                      $modalInstance.close(txpsb);
                    }
                  });
                } else {
                  $scope.loading = false;
                  $modalInstance.close(txpsi);
                }
              }
            });
          });
        }, 100);
      };

      $scope.reject = function(txp) {
        self.setOngoingProcess(gettextCatalog.getString('Rejecting payment'));
        $scope.loading = true;
        $scope.error = null;
        $timeout(function() {
          fc.rejectTxProposal(txp, null, function(err, txpr) {
            self.setOngoingProcess();
            $scope.loading = false;
            if (err) {
              $scope.$emit('UpdateTx');
              $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not reject payment'));
              $scope.$digest();
            } else {
              $modalInstance.close(txpr);
            }
          });
        }, 100);
      };


      $scope.remove = function(txp) {
        self.setOngoingProcess(gettextCatalog.getString('Deleting payment'));
        $scope.loading = true;
        $scope.error = null;
        $timeout(function() {
          fc.removeTxProposal(txp, function(err, txpb) {
            self.setOngoingProcess();
            $scope.loading = false;

            // Hacky: request tries to parse an empty response
            if (err && !(err.message && err.message.match(/Unexpected/))) {
              $scope.$emit('UpdateTx');
              $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not delete payment proposal'));
              $scope.$digest();
              return;
            }
            $modalInstance.close();
          });
        }, 100);
      };

      $scope.broadcast = function(txp) {
        self.setOngoingProcess(gettextCatalog.getString('Broadcasting Payment'));
        $scope.loading = true;
        $scope.error = null;
        $timeout(function() {
          fc.broadcastTxProposal(txp, function(err, txpb, memo) {
            self.setOngoingProcess();
            $scope.loading = false;
            if (err) {
              $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not broadcast payment'));
              $scope.$digest();
            } else {

              if (memo)
                $log.info(memo);

              refreshUntilItChanges = true;
              $modalInstance.close(txpb);
            }
          });
        }, 100);
      };

      $scope.copyAddress = function(addr) {
        if (!addr) return;
        self.copyAddress(addr);
      };

      $scope.cancel = lodash.debounce(function() {
        $modalInstance.dismiss('cancel');
      }, 0, 1000);
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/txp-details.html',
      windowClass: animationService.modalAnimated.slideRight,
      controller: ModalInstanceCtrl,
    });

    var disableCloseModal = $rootScope.$on('closeModal', function() {
      modalInstance.dismiss('cancel');
    });

    modalInstance.result.finally(function() {
      $rootScope.modalOpened = false;
      disableCloseModal();
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass(animationService.modalAnimated.slideOutRight);
    });

    modalInstance.result.then(function(txp) {
      self.setOngoingProcess();
      if (txp) {
        txStatus.notify(txp, function() {
          $scope.$emit('Local/TxProposalAction', refreshUntilItChanges);
        });
      } else {
        $timeout(function() {
          $scope.$emit('Local/TxProposalAction', refreshUntilItChanges);
        }, 100);
      }
    });

  };

  this.setAddress = function(forceNew) {
    self.addrError = null;
    var fc = profileService.focusedClient;
    if (!fc)
      return;

    // Address already set?
    if (!forceNew && self.addr[fc.credentials.walletId]) {
      return;
    }

    self.generatingAddress = true;
    $timeout(function() {
      addressService.getAddress(fc.credentials.walletId, forceNew, function(err, addr) {
        self.generatingAddress = false;

        if (err) {
          self.addrError = err;
        } else {
          if (addr)
            self.addr[fc.credentials.walletId] = addr;
        }

        $scope.$digest();
      });
    });
  };

  this.copyAddress = function(addr) {
    if (isCordova) {
      window.cordova.plugins.clipboard.copy(addr);
      window.plugins.toast.showShortCenter(gettextCatalog.getString('Copied to clipboard'));
    } else if (nodeWebkit.isDefined()) {
      nodeWebkit.writeToClipboard(addr);
    }
  };

  this.shareAddress = function(addr) {
    if (isCordova) {
      if (isMobile.Android() || isMobile.Windows()) {
        window.ignoreMobilePause = true;
      }
      window.plugins.socialsharing.share('bitcoin:' + addr, null, null, null);
    }
  };

  this.openCustomizedAmountModal = function(addr) {
    $rootScope.modalOpened = true;
    var self = this;
    var fc = profileService.focusedClient;
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.addr = addr;
      $scope.color = fc.backgroundColor;
      $scope.unitName = self.unitName;
      $scope.alternativeAmount = self.alternativeAmount;
      $scope.alternativeName = self.alternativeName;
      $scope.alternativeIsoCode = self.alternativeIsoCode;
      $scope.isRateAvailable = self.isRateAvailable;
      $scope.unitToSatoshi = self.unitToSatoshi;
      $scope.unitDecimals = self.unitDecimals;
      var satToUnit = 1 / self.unitToSatoshi;
      $scope.showAlternative = false;
      $scope.isCordova = isCordova;

      Object.defineProperty($scope,
        "_customAlternative", {
          get: function() {
            return $scope.customAlternative;
          },
          set: function(newValue) {
            $scope.customAlternative = newValue;
            if (typeof(newValue) === 'number' && $scope.isRateAvailable) {
              $scope.customAmount = parseFloat((rateService.fromFiat(newValue, $scope.alternativeIsoCode) * satToUnit).toFixed($scope.unitDecimals), 10);
            } else {
              $scope.customAmount = null;
            }
          },
          enumerable: true,
          configurable: true
        });

      Object.defineProperty($scope,
        "_customAmount", {
          get: function() {
            return $scope.customAmount;
          },
          set: function(newValue) {
            $scope.customAmount = newValue;
            if (typeof(newValue) === 'number' && $scope.isRateAvailable) {
              $scope.customAlternative = parseFloat((rateService.toFiat(newValue * $scope.unitToSatoshi, $scope.alternativeIsoCode)).toFixed(2), 10);
            } else {
              $scope.customAlternative = null;
            }
            $scope.alternativeAmount = $scope.customAlternative;
          },
          enumerable: true,
          configurable: true
        });

      $scope.submitForm = function(form) {
        var satToBtc = 1 / 100000000;
        var amount = form.amount.$modelValue;
        var amountSat = parseInt((amount * $scope.unitToSatoshi).toFixed(0));
        $timeout(function() {
          $scope.customizedAmountUnit = amount + ' ' + $scope.unitName;
          $scope.customizedAlternativeUnit = $filter('noFractionNumber')(form.alternative.$modelValue, 2) + ' ' + $scope.alternativeIsoCode;
          if ($scope.unitName == 'bits') {
            amount = (amountSat * satToBtc).toFixed(8);
          }
          $scope.customizedAmountBtc = amount;
        }, 1);
      };

      $scope.toggleAlternative = function() {
        $scope.showAlternative = !$scope.showAlternative;
      };

      $scope.shareAddress = function(uri) {
        if (isCordova) {
          if (isMobile.Android() || isMobile.Windows()) {
            window.ignoreMobilePause = true;
          }
          window.plugins.socialsharing.share(uri, null, null, null);
        }
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/customized-amount.html',
      windowClass: animationService.modalAnimated.slideUp,
      controller: ModalInstanceCtrl,
    });

    var disableCloseModal = $rootScope.$on('closeModal', function() {
      modalInstance.dismiss('cancel');
    });

    modalInstance.result.finally(function() {
      $rootScope.modalOpened = false;
      disableCloseModal();
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass(animationService.modalAnimated.slideOutDown);
    });
  };

  // Send 

  this.canShowAlternative = function() {
    return $scope.showAlternative;
  };

  this.showAlternative = function() {
    $scope.showAlternative = true;
  };

  this.hideAlternative = function() {
    $scope.showAlternative = false;
  };

  this.resetError = function() {
    this.error = this.success = null;
  };

  this.bindTouchDown = function(tries) {
    var self = this;
    tries = tries || 0;
    if (tries > 5) return;
    var e = document.getElementById('menu-walletHome');
    if (!e) return $timeout(function() {
      self.bindTouchDown(++tries);
    }, 500);

    // on touchdown elements
    $log.debug('Binding touchstart elements...');
    ['hamburger', 'menu-walletHome', 'menu-send', 'menu-receive'].forEach(function(id) {
      var e = document.getElementById(id);
      if (e) e.addEventListener('touchstart', function() {
        try {
          event.preventDefault();
        } catch (e) {};
        angular.element(e).triggerHandler('click');
      }, true);
    });
  }

  this.hideMenuBar = lodash.debounce(function(hide) {
    if (hide) {
      $rootScope.hideMenuBar = true;
      this.bindTouchDown();
    } else {
      $rootScope.hideMenuBar = false;
    }
    $rootScope.$digest();
  }, 100);


  this.formFocus = function(what) {
    if (isCordova && !this.isWindowsPhoneApp) {
      this.hideMenuBar(what);
    }
    if (!this.isWindowsPhoneApp) return

    if (!what) {
      this.hideAddress = false;
      this.hideAmount = false;

    } else {
      if (what == 'amount') {
        this.hideAddress = true;
      } else if (what == 'msg') {
        this.hideAddress = true;
        this.hideAmount = true;
      }
    }
    $timeout(function() {
      $rootScope.$digest();
    }, 1);
  };

  this.setSendFormInputs = function() {
    var unitToSat = this.unitToSatoshi;
    var satToUnit = 1 / unitToSat;
    /**
     * Setting the two related amounts as properties prevents an infinite
     * recursion for watches while preserving the original angular updates
     *
     */
    Object.defineProperty($scope,
      "_alternative", {
        get: function() {
          return $scope.__alternative;
        },
        set: function(newValue) {
          $scope.__alternative = newValue;
          if (typeof(newValue) === 'number' && self.isRateAvailable) {
            $scope._amount = parseFloat((rateService.fromFiat(newValue, self.alternativeIsoCode) * satToUnit).toFixed(self.unitDecimals), 10);
          } else {
            $scope.__amount = null;
          }
        },
        enumerable: true,
        configurable: true
      });
    Object.defineProperty($scope,
      "_amount", {
        get: function() {
          return $scope.__amount;
        },
        set: function(newValue) {
          $scope.__amount = newValue;
          if (typeof(newValue) === 'number' && self.isRateAvailable) {
            $scope.__alternative = parseFloat((rateService.toFiat(newValue * self.unitToSatoshi, self.alternativeIsoCode)).toFixed(2), 10);
          } else {
            $scope.__alternative = null;
          }
          self.alternativeAmount = $scope.__alternative;
          self.resetError();
        },
        enumerable: true,
        configurable: true
      });

    Object.defineProperty($scope,
      "_address", {
        get: function() {
          return $scope.__address;
        },
        set: function(newValue) {
          $scope.__address = self.onAddressChange(newValue);
          if ($scope.sendForm && $scope.sendForm.address.$valid) {
            self.lockAddress = true;
          }
        },
        enumerable: true,
        configurable: true
      });

    var fc = profileService.focusedClient;
    // ToDo: use a credential's (or fc's) function for this
    this.hideNote = !fc.credentials.sharedEncryptingKey;
  };

  this.setSendError = function(err) {
    var fc = profileService.focusedClient;
    var prefix =
      fc.credentials.m > 1 ? gettextCatalog.getString('Could not create payment proposal') : gettextCatalog.getString('Could not send payment');

    this.error = bwsError.msg(err, prefix);

    $timeout(function() {
      $scope.$digest();
    }, 1);
  };


  this.setOngoingProcess = function(name) {
    var self = this;
    self.blockUx = !!name;

    if (isCordova) {
      if (name) {
        window.plugins.spinnerDialog.hide();
        window.plugins.spinnerDialog.show(null, name + '...', true);
      } else {
        window.plugins.spinnerDialog.hide();
      }
    } else {
      self.onGoingProcess = name;
      $timeout(function() {
        $rootScope.$apply();
      });
    };
  };

  this.submitForm = function() {
    var fc = profileService.focusedClient;
    var unitToSat = this.unitToSatoshi;
    var currentSpendUnconfirmed = configWallet.spendUnconfirmed;
    var currentFeeLevel = walletSettings.feeLevel || 'normal';

    if (isCordova && this.isWindowsPhoneApp) {
      this.hideAddress = false;
      this.hideAmount = false;
    }

    var form = $scope.sendForm;
    if (form.$invalid) {
      this.error = gettext('Unable to send transaction proposal');
      return;
    }

    if (fc.isPrivKeyEncrypted()) {
      profileService.unlockFC(function(err) {
        if (err) return self.setSendError(err);
        return self.submitForm();
      });
      return;
    };

    var comment = form.comment.$modelValue;

    // ToDo: use a credential's (or fc's) function for this
    if (comment && !fc.credentials.sharedEncryptingKey) {
      var msg = 'Could not add message to imported wallet without shared encrypting key';
      $log.warn(msg);
      return self.setSendError(gettext(msg));
    }

    var getFee = function(cb) {
      if (self.lockedCurrentFeePerKb) {
        cb(null, self.lockedCurrentFeePerKb);
      } else {
        feeService.getCurrentFeeValue(currentFeeLevel, cb);
      }
    };

    self.setOngoingProcess(gettextCatalog.getString('Creating transaction'));
    $timeout(function() {
      var paypro = self._paypro;
      var address, amount;

      address = form.address.$modelValue;
      amount = parseInt((form.amount.$modelValue * unitToSat).toFixed(0));

      requestTouchid(function(err) {
        if (err) {
          profileService.lockFC();
          self.setOngoingProcess();
          self.error = err;
          $timeout(function() {
            $scope.$digest();
          }, 1);
          return;
        }

        getFee(function(err, feePerKb) {
          if (err) $log.debug(err);
          fc.sendTxProposal({
            toAddress: address,
            amount: amount,
            message: comment,
            payProUrl: paypro ? paypro.url : null,
            feePerKb: feePerKb,
            excludeUnconfirmedUtxos: currentSpendUnconfirmed ? false : true
          }, function(err, txp) {
            if (err) {
              self.setOngoingProcess();
              profileService.lockFC();
              return self.setSendError(err);
            }

            if (!fc.canSign() && !fc.isPrivKeyExternal()) {
              $log.info('No signing proposal: No private key')
              self.setOngoingProcess();
              self.resetForm();
              txStatus.notify(txp, function() {
                return $scope.$emit('Local/TxProposalAction');
              });
              return;
            }

            self.signAndBroadcast(txp, function(err) {
              self.setOngoingProcess();
              self.resetForm();
              if (err) {
                self.error = err.message ? err.message : gettext('The payment was created but could not be completed. Please try again from home screen');
                $scope.$emit('Local/TxProposalAction');
                $timeout(function() {
                  $scope.$digest();
                }, 1);
              } else go.walletHome();
            });
          });
        });
      });
    }, 100);
  };

  this._setOngoingForSigning = function() {
    var fc = profileService.focusedClient;

    if (fc.isPrivKeyExternal() && fc.getPrivKeyExternalSourceName() == 'ledger') {
      self.setOngoingProcess(gettextCatalog.getString('Requesting Ledger Wallet to sign'));
    } else {
      self.setOngoingProcess(gettextCatalog.getString('Signing payment'));
    }
  };

  this.signAndBroadcast = function(txp, cb) {
    var fc = profileService.focusedClient;

    this._setOngoingForSigning();
    profileService.signTxProposal(txp, function(err, signedTx) {
      self.setOngoingProcess();
      if (err) {
        if (!lodash.isObject(err)) {
          err = { message: err};
        }
        err.message = bwsError.msg(err, gettextCatalog.getString('The payment was created but could not be signed. Please try again from home screen'));
        return cb(err);
      }

      if (signedTx.status == 'accepted') {
        self.setOngoingProcess(gettextCatalog.getString('Broadcasting transaction'));
        fc.broadcastTxProposal(signedTx, function(err, btx, memo) {
          self.setOngoingProcess();
          if (err) {
            err.message = bwsError.msg(err, gettextCatalog.getString('The payment was signed but could not be broadcasted. Please try again from home screen'));
            return cb(err);
          }
          if (memo)
            $log.info(memo);

          txStatus.notify(btx, function() {
            $scope.$emit('Local/TxProposalAction', true);
            return cb();
          });
        });
      } else {
        self.setOngoingProcess();
        txStatus.notify(signedTx, function() {
          $scope.$emit('Local/TxProposalAction');
          return cb();
        });
      }
    });
  };

  this.setForm = function(to, amount, comment) {
    var form = $scope.sendForm;
    if (to) {
      form.address.$setViewValue(to);
      form.address.$isValid = true;
      form.address.$render();
      this.lockAddress = true;
    }

    if (amount) {
      form.amount.$setViewValue("" + amount);
      form.amount.$isValid = true;
      form.amount.$render();
      this.lockAmount = true;
    }

    if (comment) {
      form.comment.$setViewValue(comment);
      form.comment.$isValid = true;
      form.comment.$render();
    }
  };



  this.resetForm = function() {
    this.resetError();
    this._paypro = null;
    this.lockedCurrentFeePerKb = null;

    this.lockAddress = false;
    this.lockAmount = false;

    this._amount = this._address = null;

    var form = $scope.sendForm;

    if (form && form.amount) {
      form.amount.$pristine = true;
      form.amount.$setViewValue('');
      form.amount.$render();

      form.comment.$setViewValue('');
      form.comment.$render();
      form.$setPristine();

      if (form.address) {
        form.address.$pristine = true;
        form.address.$setViewValue('');
        form.address.$render();
      }
    }
    $timeout(function() {
      $rootScope.$digest();
    }, 1);
  };

  this.openPPModal = function(paypro) {
    $rootScope.modalOpened = true;
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      var fc = profileService.focusedClient;
      var satToUnit = 1 / self.unitToSatoshi;
      $scope.paypro = paypro;
      $scope.alternative = self.alternativeAmount;
      $scope.alternativeIsoCode = self.alternativeIsoCode;
      $scope.isRateAvailable = self.isRateAvailable;
      $scope.unitTotal = (paypro.amount * satToUnit).toFixed(self.unitDecimals);
      $scope.unitName = self.unitName;
      $scope.color = fc.backgroundColor;

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/paypro.html',
      windowClass: animationService.modalAnimated.slideUp,
      controller: ModalInstanceCtrl,
    });

    var disableCloseModal = $rootScope.$on('closeModal', function() {
      modalInstance.dismiss('cancel');
    });

    modalInstance.result.finally(function() {
      $rootScope.modalOpened = false;
      disableCloseModal();
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass(animationService.modalAnimated.slideOutDown);
    });
  };

  this.setFromPayPro = function(uri, cb) {
    if (!cb) cb = function() {};

    var fc = profileService.focusedClient;
    if (isChromeApp) {
      this.error = gettext('Payment Protocol not supported on Chrome App');
      return cb(true);
    }

    var satToUnit = 1 / this.unitToSatoshi;
    var self = this;
    /// Get information of payment if using Payment Protocol
    self.setOngoingProcess(gettextCatalog.getString('Fetching Payment Information'));

    $log.debug('Fetch PayPro Request...', uri);
    $timeout(function() {
      fc.fetchPayPro({
        payProUrl: uri,
      }, function(err, paypro) {
        self.setOngoingProcess();

        if (err) {
          $log.warn('Could not fetch payment request:', err);
          self.resetForm();
          var msg = err.toString();
          if (msg.match('HTTP')) {
            msg = gettext('Could not fetch payment information');
          }
          self.error = msg;
          $timeout(function() {
            $rootScope.$digest();
          }, 1);
          return cb(true);
        }

        if (!paypro.verified) {
          self.resetForm();
          $log.warn('Failed to verified payment protocol signatured');
          self.error = gettext('Payment Protocol Invalid');
          $timeout(function() {
            $rootScope.$digest();
          }, 1);
          return cb(true);
        }

        self._paypro = paypro;
        self.setForm(paypro.toAddress, (paypro.amount * satToUnit).toFixed(self.unitDecimals), paypro.memo);
        return cb();
      });
    }, 1);
  };

  this.setFromUri = function(uri) {
    var self = this;

    function sanitizeUri(uri) {
      // Fixes when a region uses comma to separate decimals
      var regex = /[\?\&]amount=(\d+([\,\.]\d+)?)/i;
      var match = regex.exec(uri);
      if (!match || match.length === 0) {
        return uri;
      }
      var value = match[0].replace(',', '.');
      var newUri = uri.replace(regex, value);
      return newUri;
    };

    var satToUnit = 1 / this.unitToSatoshi;

    // URI extensions for Payment Protocol with non-backwards-compatible request
    if ((/^bitcoin:\?r=[\w+]/).exec(uri)) {
      uri = decodeURIComponent(uri.replace('bitcoin:?r=', ''));
      this.setFromPayPro(uri, function(err) {
        if (err) {
          return err;
        }
      });
    } else {
      uri = sanitizeUri(uri);

      if (!bitcore.URI.isValid(uri)) {
        return uri;
      }
      var parsed = new bitcore.URI(uri);

      var addr = parsed.address ? parsed.address.toString() : '';
      var message = parsed.message;

      var amount = parsed.amount ?
        (parsed.amount.toFixed(0) * satToUnit).toFixed(this.unitDecimals) : 0;


      if (parsed.r) {
        this.setFromPayPro(parsed.r, function(err) {
          if (err && addr && amount) {
            self.setForm(addr, amount, message);
            return addr;
          }
        });
      } else {
        this.setForm(addr, amount, message);
        return addr;
      }
    }

  };

  this.onAddressChange = function(value) {
    this.resetError();
    if (!value) return '';

    if (this._paypro)
      return value;

    if (value.indexOf('bitcoin:') === 0) {
      return this.setFromUri(value);
    } else if (/^https?:\/\//.test(value)) {
      return this.setFromPayPro(value);
    } else {
      return value;
    }
  };

  // History 

  function strip(number) {
    return (parseFloat(number.toPrecision(12)));
  }

  this.getUnitName = function() {
    return this.unitName;
  };

  this.getAlternativeIsoCode = function() {
    return this.alternativeIsoCode;
  };

  this.openTxModal = function(btx) {
    $rootScope.modalOpened = true;
    var self = this;
    var fc = profileService.focusedClient;
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.btx = btx;
      $scope.settings = walletSettings;
      $scope.color = fc.backgroundColor;
      $scope.copayerId = fc.credentials.copayerId;
      $scope.isShared = fc.credentials.n > 1;

      $scope.getAmount = function(amount) {
        return self.getAmount(amount);
      };

      $scope.getUnitName = function() {
        return self.getUnitName();
      };

      $scope.getShortNetworkName = function() {
        var n = fc.credentials.network;
        return n.substring(0, 4);
      };

      $scope.copyAddress = function(addr) {
        if (!addr) return;
        self.copyAddress(addr);
      };

      $scope.cancel = lodash.debounce(function() {
        $modalInstance.dismiss('cancel');
      }, 0, 1000);

    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/tx-details.html',
      windowClass: animationService.modalAnimated.slideRight,
      controller: ModalInstanceCtrl,
    });

    var disableCloseModal = $rootScope.$on('closeModal', function() {
      modalInstance.dismiss('cancel');
    });

    modalInstance.result.finally(function() {
      $rootScope.modalOpened = false;
      disableCloseModal();
      var m = angular.element(document.getElementsByClassName('reveal-modal'));
      m.addClass(animationService.modalAnimated.slideOutRight);
    });
  };

  this.hasAction = function(actions, action) {
    return actions.hasOwnProperty('create');
  };

  this._doSendAll = function(amount) {
    this.setForm(null, amount, null);
  };

  this.sendAll = function() {
    var self = this;
    self.error = null;
    self.setOngoingProcess(gettextCatalog.getString('Calculating fee'));
    $rootScope.$emit('Local/SetFeeSendMax', function(currentFeePerKb, availableMaxBalance, feeToSendMaxStr) {
      self.setOngoingProcess();
      if (lodash.isNull(currentFeePerKb)) {
        self.error = gettext('Could not calculate fee');
        $scope.$apply();
        return;
      }
      self.lockedCurrentFeePerKb = currentFeePerKb;
      var msg = gettextCatalog.getString("{{fee}} will be deducted for bitcoin networking fees", {
        fee: feeToSendMaxStr
      });

      $scope.$apply();
      confirmDialog.show(msg, function(confirmed) {
        if (confirmed) {
          self._doSendAll(availableMaxBalance);
        } else {
          self.resetForm();
        }
      });
    });
  };

  /* Start setup */

  this.bindTouchDown();
  if (profileService.focusedClient) {
    this.setAddress();
    this.setSendFormInputs();
  }
});

angular.module('copayApp').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"(possible double spend)":"(mögliche Doppelausgabe)","(Trusted)":"(Vertraut)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} wird als Netzwerkgebühr abgezogen","{{index.m}}-of-{{index.n}}":"{{index.m}}-von-{{index.n}}","{{index.txProgress}} transactions downloaded":"{{index.txProgress}} Transaktionen werden heruntergeladen","{{item.m}}-of-{{item.n}}":"{{item.m}}-von-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} Wallets importiert. Beträge werden gescannt. Bitte auf die Aktualisierung des Gesamtsaldos warten","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Ein Zahlungsvorschlag kann gelöscht werden, wenn 1) Du diesen erzeugt hast und noch kein anderer Copayer unterschrieben hat, oder 2) 24 Stunden vergangen sind, seit der Vorschlag erstellt wurde.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>WENN DER ZUGRIFF AUF DAS COPAY WALLET ODER DEN VERSCHLÜSSELTEN PRIVATEN SCHLÜSSELN VERLOREN GEHT UND KEINE SICHERUNG DES WALLETS UND KORRESPONDIERENDEM PASSWORT EXISTIERT, DANN WIRD BESTÄTIGT UND AKZEPTIERT, DASS AUF ALLE MIT DIESEM WALLET VERBUNDENEN BITCOIN KEIN ZUGRIFF MEHR MÖGLICH IST.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>ODER</b> 1 Exportdatei des Wallets und und die noch benötigten Wallet-Seeds (z.B. für ein 3-5 Wallet: 1 Exportdatei + 2 Wallet-Seeds eines anderen Copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>ODER</b> der Wallet-Seed <b>aller</b> Copayer des Wallets","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>ODER</b> die Wallet-Seeds <b>aller</b> Copayer des Wallets","A multisignature bitcoin wallet":"Ein Bitcoin Wallet mit Mehrfachunterschriften","About Copay":"Über Copay","Accept":"Akzeptieren","Account":"Benutzerkonto","Account Number":"Kontonummer","Activity":"Aktivität","Add a new entry":"Einen neuen Eintrag hinzufügen","Add a Seed Passphrase":"Hinzufügen einer Seed-Passphrase","Add an optional passphrase to secure the seed":"Um den Seed zu sichern, geben Sie optional eine Passphrase ein","Add wallet":"Wallet hinzufügen","Address":"Adresse","Address Type":"Adresstyp","Advanced":"Erweitert","Alias":"Alias","Alias for <i>{{index.walletName}}</i>":"Alias für <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Alle Beiträge zur Übersetzung von Copay sind willkommen. Melde Dich bei crowdin.com an verbinde Dich mit dem Copay-Projekt über","All transaction requests are irreversible.":"Transaktionen können unmöglich rückgängig gemacht werden.","Alternative Currency":"Alternative Währung","Amount":"Betrag","Amount below dust threshold":"Betrag unter Schwellenwert","Amount in":"Betrag in","Are you sure you want to delete the backup words?":"Sollen diese Sicherungsworte wirklich gelöscht werden?","Are you sure you want to delete this wallet?":"Soll das Wallet wirklich gelöscht werden?","Available Balance":"Verfügbarer Gesamtbetrag","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Durchschnittliche Zeit für die Bestätigung der Transaktion: {{fee.nbBlocks * 10}} Minuten","Back":"Zurück","Backup":"Sicherung","Backup failed":"Backup ist fehlgeschlagen","Backup Needed":"Backup wird benötigt","Backup now":"Jetzt sichern","Backup words deleted":"Sicherungsworte gelöscht","Bad wallet invitation":"Ungültige Einladung","Balance By Address":"Guthaben nach Adresse","BIP32 path for address derivation":"BIP32 Pfad für die Adressen-Ableitung","Bitcoin address":"Bitcoinadresse","Bitcoin Network Fee Policy":"Bitcoin-Netzwerk Gebührenübersicht","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Für Bitcoin-Transaktionen können Gebühren hinzugefügt werden. Transaktionen mit höheren Gebühren werden meist schneller verarbeitet und bestätigt. Die tatsächlichen Gebühren werden anhand der Netzwerklast und der ausgewählte Richtlinie bestimmt.","Bitcoin URI is NOT valid!":"Bitcoin URI ist NICHT gültig!","Broadcast Payment":"Zahlung übermitteln","Broadcasting Payment":"Übermittlung der Zahlung","Broadcasting transaction":"Übermittlung der Transaktion","Browser unsupported":"Der eingesetzte Browser wird nicht unterstützt","Buy &amp; Sell Bitcoin":"Bitcoin kaufen &amp; verkaufen","Cancel":"Abbruch","CANCEL":"ABBRUCH","Cannot join the same wallet more that once":"An einem Wallet kann nicht mehrfach teilgenommen werden","Certified by":"Zertifiziert von","Changing wallet alias only affects the local wallet name.":"Änderung der Aliases hat nur Auswirkungen auf den lokalen Namen des Wallets","Choose a backup file from your computer":"Bitte eine Sicherungsdatei vom Computer wählen","Clear cache":"Cache leeren","Close":"Schließen","Color":"Farbe","Commit hash":"Hash übertragen","Confirm":"Bestätigen","Confirm your wallet seed":"Bestätigen Sie Ihren Wallet-Seed","Confirmations":"Bestätigungen","Congratulations!":"Herzlichen Glückwunsch!","Connecting to {{create.hwWallet}} Wallet...":"Verbindung zum {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Verbindung zum {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Verbindung zum {{join.hwWallet}} Wallet...","Continue":"Weiter","Copayer already in this wallet":"Copayer nimmt bereits teil","Copayer already voted on this spend proposal":"Copayer hat schon für diesen Zahlungsvorschlag angestimmt","Copayer data mismatch":"Copayer Datenkonflikt","Copayers":"Copayer","Copied to clipboard":"In die Zwischenablage kopiert","Copy this text as it is to a safe place (notepad or email)":"Diesen Text an einem sichern Ort einfügen (Notepad oder E-Mail)","Copy to clipboard":"In die Zwischenablage kopieren","Could not accept payment":"Zahlung kann nicht akzeptiert werden","Could not access Wallet Service: Not found":"Auf den Wallet-Dienst konnte nicht zugegriffen werden: Nicht gefunden","Could not broadcast payment":"Zahlung konnte nicht gesendet werden","Could not create address":"Adresse konnte nicht erstellt werden","Could not create payment proposal":"Es kann kein Zahlungsvorschlag erzeugt werden","Could not create using the specified extended private key":"Erzeugung mit erweiterten privaten Schlüssel nicht möglich","Could not create using the specified extended public key":"Erzeugung mit dem angegebenen erweiterten öffentlichen Schlüssel nicht möglich","Could not create: Invalid wallet seed":"Erzeugung nicht möglich: Ungültiger Wallet-Seed","Could not decrypt":"Entschlüsselung nicht möglich","Could not decrypt file, check your password":"Datei kann nicht entschlüsselt werden, bitte das Passwort überprüfen","Could not delete payment proposal":"Zahlungsvorschlag konnte nicht gelöscht werden","Could not fetch payment information":"Zahlungsinformationen können nicht abgerufen werden","Could not import":"Import nicht möglich","Could not import. Check input file and password":"Import nicht möglich. Bitte Datei und Passwort überprüfen","Could not join wallet":"Beteiligung am Wallet nicht möglich","Could not recognize a valid Bitcoin QR Code":"Es konnte kein gültiger Bitcoin-QR-Code erkannt werden","Could not reject payment":"Zahlung konnte nicht abgelehnt werden","Could not send payment":"Zahlung kann nicht gesendet werden","Could not update Wallet":"Wallet kann nicht aktualisiert werden","Create":"Erzeugen","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Ein {{requiredCopayers}}-von-{{totalCopayers}} Wallet erzeugen","Create new wallet":"Neues Wallet erzeugen","Create, join or import":"NEU | TEILNAHME | IMPORT","Created by":"Erstellt von","Creating transaction":"Transaktion erstellen","Creating Wallet...":"Wallet erstellen...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Aktuelle Gebühr für dieses Einstellung: {{fee.feePerKBUnit}}/KiB","Date":"Datum","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Das Entschlüsseln eines Paperwallets kann auf diesem Gerät bis zu 5 Minuten dauern. Bitte abwarten und die App nicht beenden.","Delete it and create a new one":"Löschen und neues Wallet erzeugen","Delete Payment Proposal":"Zahlungsvorschlag löschen","Delete seed words":"Seed-Wörter löschen","Delete wallet":"Wallet löschen","Delete Wallet":"Wallet löschen","Delete words":"Wörter löschen","Deleting payment":"Zahlung löschen","Derivation Path":"Ableitungsstruktur","Derivation Strategy":"Ableitungstrategie","Details":"Details","Disabled":"Deaktiviert","Do not include private key":"Den privaten Schlüssel nicht einbeziehen","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Wird deine Sprache auf Crowdin nicht angezeigt? Kontaktiere den Support von Crowdin, denn wir würden deine Sprache gerne hinzufügen.","Done":"Fertig","Download":"Herunterladen","Economy":"Wirtschaftlich","Edit":"Bearbeiten","Email":"E-Mail","Email for wallet notifications":"E-Mail für Wallet Benachrichtigungen","Email Notifications":"Benachrichtigunen per E-Mail","Encrypted export file saved":"Verschlüsselte Exportdatei gespeichert","Enter the seed words (BIP39)":"Seed-Wörter eingeben (BIP39)","Enter your passphrase":"Geben Sie Ihre Passphrase ein","Enter your password":"Passwort eingeben","Error at Wallet Service":"Fehler beim Wallet-Dienst","Error creating wallet":"Fehler beim Erstellen des Wallets","Error importing wallet:":"Fehler beim Import des Wallets","Expires":"Gültig bis","Export options":"Export-Optionen","Export to file":"In eine Datei exportieren","Export Wallet":"Wallet exportieren","Extended Public Keys":"Erweiterte öffentliche Schlüssel","Failed to export":"Fehler beim Exportieren","Failed to import wallets":"Import des Wallets fehlgeschlagen","Family vacation funds":"Familienurlaub","Fee":"Gebühr","Fetching Payment Information":"Zahlungsinformationen abrufen","File/Text Backup":"Datei/Text Sicherung","Finish":"Beenden","French":"Français","Funds are locked by pending spend proposals":"Beträge sind durch ausstehende Zahlungsvorschläge gesperrt","Funds found":"Beträge gefunden","Funds received":"Beträge empfangen","Funds will be transferred to":"Beträge werden überwiesen an","Generate new address":"Neue Adresse erzeugen","Generate QR Code":"QR-Code generieren","Generating .csv file...":"CSV-Datei erzeugen...","German":"Deutsch","Getting address for wallet {{selectedWalletName}} ...":"Ermittle die Adresse des Wallets {{selectedWalletName}}...","Global preferences":"Globale Einstellungen","Greek":"Griechisch","Hardware wallet":"Hardware-Wallet","Have a Backup from Copay v0.9?":"Ist eine Copay v0.9 Sicherung vorhanden","Hide advanced options":"Erweiterte Optionen ausblenden","I affirm that I have read, understood, and agree with these terms.":"Ich bestätige, dass ich diese Bedingungen gelesen habe, diese verstehe und diesen zustimme.","I AGREE. GET STARTED":"Ich stimme zu. Lege los!","Import":"Import","Import backup":"Importiere Sicherung","Import from the Cloud?":"Aus der Cloud importieren","Import here":"Hier importieren","Import wallet":"Wallet importieren","Importing wallet...":"Wallet wird importiert...","Importing...":"Importiere...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"Die Autoren der Software, Mitarbeiter und Partner von Bitpay, Inhaber von Urheberrechten oder Bitpay Inc., haften in keinem Fall für Schäden oder Ansprüche, die sich im Rahmen einer Klage zum Vertrag, unerlaubter Handlung, auf andere Weise oder aus bzw. im Zusammenhang mit der Software ergeben.","Incorrect address network":"Falsche Netzwerk-Adresse","Insufficient funds":"Nicht ausreichendes Guthaben","Insufficient funds for fee":"Nicht ausreichendes Guthaben für die Gebühr","Invalid":"Ungültig","Invalid account number":"Ungültige Kontonummer","Invalid address":"Ungültige Adresse","Invalid derivation path":"Ungültige Ableitungsstruktur","Invalid Touch ID":"Ungültige Touch-ID","Invitation to share a Copay Wallet":"Einladung zum Copay-Wallet teilen","Italian":"Italienisch","Japanese":"日本語","John":"Sascha","Join":"Teilnehmen","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Copay Wallet beitreten. Hier ist der Einladungscode: {{secret}} Die Desktopversion oder die App fürs Handy kann auf https://copay.io heruntergeladen werden","Join shared wallet":"Gemeinschaftliches Wallet","Joining Wallet...":"Teilnahme am Wallet einrichten...","Key already associated with an existing wallet":"Schlüssel ist bereits mit einem existierenden Wallet verbunden","Label":"Beschreibung","Language":"Sprache","Last Wallet Addresses":"Letzte Wallet-Adressen","Learn more about Copay backups":"Erfahren Sie mehr über Copay-Sicherungen","Learn more about Wallet Migration":"Mehr über die Migration von Wallets erfahren","locked by pending payments":"durch ausstehende Zahlungen gesperrt","Locktime in effect. Please wait to create a new spend proposal":"Zeitsperre aktiv. Bitte mit neuem Zahlungsvorschlag warten","Locktime in effect. Please wait to remove this spend proposal":"Zeitsperre aktiv. Bitte auf die Entfernung des Zahlungsvorschlags warten","Make a payment to":"Sende eine Zahlung an","me":"Ich","Me":"Ich","Memo":"Notiz","Merchant message":"Händlernachricht","Message":"Nachricht","Moved":"Verschoben","Multiple recipients":"Mehrere Empfänger","My Bitcoin address":"Eigene Bitcoinadresse","My contacts":"Meine Kontakte","My wallets":"Meine Wallets","Network":"Netzwerk","Network connection error":"Netzwerkverbindungsfehler","New Payment Proposal":"Neue Zahlungsvorschlag","New Random Seed":"Neuer Zufalls-Seed","No hardware wallets supported on this device":"Hardware-Wallets werden auf diesem Gerät nicht unterstützt","No transactions yet":"Noch keine Transaktionen","Normal":"Normal","Not authorized":"Nicht berechtigt","Not completed":"Nicht abgeschlossen","Not valid":"Nicht gültig","Note":"Notiz","Official English Disclaimer":"Offizieller englischer Haftungsausschluss","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Sobald Sie Ihren Wallet-Seed kopiert haben, wird empfohlen, diesen vom Gerät zu löschen.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Nur die Haupt (unveränderbaren) Adressen werden angezeigt. Die Adressen in dieser Liste sind momentan noch nicht lokal überprüft.","optional":"zusätzlich","Paper Wallet Private Key":"Privater Schlüssel des Paperwallets","Participants":"Teilnehmer","Passphrase":"Passphrase","Password":"Passwort","Password needed":"Passwort benötigt","Passwords do not match":"Passwörter stimmen nicht überein","Paste invitation here":"Einladung hier einfügen","Paste the backup plain text code":"Den Klartext der Sicherung einfügen","Paste your paper wallet private key here":"Privaten Schlüssel des Paperwallets hier einfügen","Pay To":"Zahle an","Payment Accepted":"Zahlung angenommen","Payment accepted, but not yet broadcasted":"Zahlung akzeptiert, aber noch nicht übermittelt","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Zahlung akzeptiert. Sie wird durch Glidera übermittelt. Falls ein Problem auftritt, kann sie nach einer Wartezeit von 6 Stunden gelöscht werden.","Payment details":"Zahlungsdetails","Payment Proposal":"Zahlungsvorschlag","Payment Proposal Created":"Zahlungsvorschlag erstellt","Payment Proposal Rejected":"Zahlungsvorschlag abgelehnt","Payment Proposal Rejected by Copayer":"Zahlungsvorschlag wurde vom Copayer abgelehnt","Payment Proposal Signed by Copayer":"Zahlungsvorschlag wurde vom Copayer abgezeichnet","Payment Proposals":"Zahlungsvorschläge","Payment Protocol Invalid":"Ungültiges Zahlungsprotokoll","Payment Protocol not supported on Chrome App":"Zahlungsprotokoll wird nicht von der Chrome App unterstützt","Payment Rejected":"Zahlung abgelehnt","Payment request":"Zahlungsanforderung","Payment Sent":"Zahlung gesendet","Payment to":"Zahlung an","Pending Confirmation":"Ausstehende Bestätigung","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Wallet dauerhaft löschen. DIESE AKTION KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN","Personal Wallet":"Persönliches Wallet","Please accept to export two public keys from the Trezor app":"Bitte akzeptieren Sie das Exportieren von zwei öffentlichen Schlüsseln in der Trezor-App","Please enter the required fields":"Bitte die benötigten Felder ausfüllen","Please enter the seed words":"Bitte geben Sie die Seed-Wörter ein","Please enter the wallet seed":"Bitte geben Sie den Wallet-Seed ein","Please tap the words in order to confirm your backup phrase is correctly written.":"Bitte tippen Sie auf die Wörter, um zu bestätigen, dass Ihre Backup-Phrase richtig geschrieben ist.","Please upgrade Copay to perform this action":"Bitte Copay aktualisieren, um diese Aktion auszuführen","Please, select your backup file":"Bitte die Sicherungsdatei wählen","Portuguese":"Português","Preparing backup...":"Sicherung wird vorbereitet...","Press again to exit":"Zum Beenden erneut drücken","Priority":"höchste Priorität","QR Code":"QR-Code","QR-Scanner":"QR-Scanner","Receive":"Empfangen","Received":"Empfangen","Recipients":"Empfänger","Reconnecting to Wallet Service...":"Neuverbindung zum Wallet Service... ","Recreate":"Wiederherstellen","Recreating Wallet...":"Wallet wiederherstellen...","Reject":"Ablehnen","Rejecting payment":"Zahlung ablehenen","Release Information":"Information zur Veröffentlichung","Remove":"Entfernen","Repeat password":"Passwort wiederholen","Request a specific amount":"Einen bestimmten Betrag anfordern","Request Password":"Passwort anfordern","Requesting Ledger Wallet to sign":"Anfrage eine Ledger Wallet zu unterschreiben","Required":"Benötigt","Required number of signatures":"Erforderliche Anzahl von Signaturen","Russian":"Pусский","Save":"Speichern","Saving preferences...":"Speichere Einstellungen","Scan addresses for funds":"Adresse auf neue Beträge überprüfen","Scan Fingerprint":"Fingerabdruck scannen","Scan Finished":"Überprüfung abgeschlossen","Scan status finished with error":"Überprüfung wurde mit Fehlern beendet","Scan Wallet Funds":"Prüfe Beträge des Wallets","Scan your fingerprint please":"Scannen Sie bitte Ihren Fingerabdruck","Scanning wallet funds...":"Prüfe Wallet auf neue Beträge...","Scanning Wallet funds...":"Prüfe Wallet auf neue Beträge...","Security preferences":"Sicherheitseinstellungen","See it on the blockchain":"Im Blockchain anzeigen","Seed passphrase":"Seed Passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Eine Sicherungsdatei auswählen","Select a wallet":"Wallet wählen","Self-signed Certificate":"Selbstsigniertes Zertifikat","Send":"Senden","Send addresses by email":"Adressen per e-Mail versenden","Send All":"Alle senden","Send by email":"Per E-Mail versenden","Sending":"Senden","Sending funds...":"Sende Beträge...","Sent":"Gesendet","Server":"Server","Server response could not be verified":"Antwort des Servers konnte nicht verifiziert werden","Session log":"Sitzungsprotokoll","SET":"EINRICHTEN","Set default url":"Festlegen der Standard-URL","Set up a password":"Passwort einrichten","Set up an Export Password":"Einrichten eines Kennworts für den Export","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Das Einrichten einer E-Mail Benachrichtigung schwächt die Privatsphäre, wenn der Wallet Service Anbieter kompromittiert wurde. Der Angreifer  kann jedoch nur Wallet Adresse und Guthaben erfahren, mehr nicht.","Settings":"Einstellungen","Share address":"Adresse teilen","Share invitation":"Einladung teilen","Share this invitation with your copayers":"Einladung mit Copayern teilen","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Um Zahlungen zu empfangen, die hier angegebene Adresse teilen. Um die Privatsphäre zu schützen wird nach jeder Nutzung eine neue Adresse erzeugt.","Shared Wallet":"Wallet teilen","Show advanced options":"Erweiterte Optionen anzeigen","Show all":"Zeige alle","Show Wallet Seed":"Wallet Seed anzeigen","Signatures rejected by server":"Signaturen wurden vom Server abgelehnt","Signing payment":"Zahlung unterschreiben","Spanish":"Español","Specify Seed...":"Geben Sie den Seed ein...","Spend proposal is not accepted":"Zahlungsvorschlag wurde nicht akzeptiert","Spend proposal not found":"Zahlungsvorschlag wurde nicht gefunden","Success":"Erfolgreich","Sweep paper wallet":"Paperwallet löschen","Sweep Wallet":"Wallet löschen","Tap to retry":"Zum Wiederholen antippen","Terms of Use":"Nutzungsbedingungen","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"Die Autoren der Software, Mitarbeiter und Partner von Bitpay, Inhaber von Urheberrechten und BitPay, Inc. können nicht Ihre privaten Schlüssel oder Kennwörter abrufen, wenn diese verloren gehen oder vergessen werden und können die Durchführung von Transaktionen, auch nach Bestätigungen, nicht garantieren, da sie keine Kontrolle über das Bitcoin-Netzwerk haben.","The Ledger Chrome application is not installed":"Die Chrome-Anwendung für Ledger ist nicht installiert","The payment was created but could not be completed. Please try again from home screen":"Die Zahlung wurde erzeugt, kann aber nicht abgeschlossen werden. Bitte erneut über die Startseite versuchen","The payment was created but could not be signed. Please try again from home screen":"Die Zahlung wurde erzeugt, kann aber nicht unterschrieben werden. Bitte erneut über die Startseite versuchen","The payment was removed by creator":"Die Zahlung wurde vom Ersteller entfernt","The payment was signed but could not be broadcasted. Please try again from home screen":"Die Zahlung wurde unterschrieben, kann aber nicht übertragen werden. Bitte erneut über die Startseite versuchen","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"Der private Schlüssel für dieses Wallet ist verschlüsselt. Beim Export bleibt der privaten Schlüssel verschlüsselt im Exportarchiv.","The seed could require a passphrase to be imported":"Der Seed könnte eine Passphrase benötigen, um importiert zu werden","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"Die Software erzeugt kein Benutzerkonto, bei dem Bitpay oder sonstige Dritte als Finanzvermittler oder Verwalter der Bitcoin fungieren.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"Die Software, die genutzt werden soll, fungiert als freies, quelloffenes und digitales mehrfachunterschriften Wallet.","The spend proposal is not pending":"Der Zahlungsvorschlag ist nicht ausstehend","The wallet \"{{walletName}}\" was deleted":"Wallet \"{{walletName}}\" wurde gelöscht","There are no wallets to make this payment":"Es gibt keine Wallets, um diese Zahlung auszuführen","There is an error in the form":"Es ist ein Fehler im Formular aufgetreten","This transaction has become invalid; possibly due to a double spend attempt.":"Diese Transaktion ist wurde ungültig; dies kann durch eine versuchte Doppelzahlung verursacht worden sein.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Dieses Wallet ist nicht beim angegebenen Bitcore Wallet Service (BWS) registriert. Bitte aus den lokalen Informationen wiederherstellen","Time":"Zeit","To":"An","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"Voraussetzungen um dieses <b>geteilte</b> {{index.m}}-{{index.n}} Wallet wiederherzustellen","too long!":"zu lang!","Total Locked Balance":"Ingesamt gesperrter Gesamtsaldo","Total number of copayers":"Gesamtanzahl der Copayer","Transaction":"Transaktion","Transaction already broadcasted":"Transaktion wurde bereits übermittelt","Transaction History":"Transaktionsverlauf","Translation Credits":"Danksagung an die Übersetzer","Translators":"Übersetzer","Try again":"Nochmal versuchen","Type the Seed Phrase (usually 12 words)":"Geben Sie den Seed ein (in der Regel 12 Wörter)","Unable to send transaction proposal":"Transaktionsvorschlag kann nicht gesendet werden","Unconfirmed":"Unbestätigt","Unit":"Währungseinheit","Unsent transactions":"Nicht vesendete Transaktionen","Updating transaction history. Please stand by.":"Aktualisieren des Transaktionsverlaufs. Bitte warten.","Updating Wallet...":"Wallet aktualisieren...","Use Unconfirmed Funds":"Unbestätigte Mittel einsetzen","Username":"Benutzername","Version":"Version","View":"Ansicht","Waiting for copayers":"Warte auf copayer","Waiting...":"Warte...","Wallet already exists":"Wallet exstiert bereits","Wallet Already Imported:":"Wallet bereits importiert:","Wallet already in Copay:":"Wallet bereits in Copay:","Wallet Configuration (m-n)":"Wallet-Konfiguration (m-n)","Wallet Export":"Wallet-Export","Wallet Id":"Wallet-Id","Wallet incomplete and broken":"Wallet unvollständig oder defekt","Wallet Information":"Wallet-Informationen","Wallet Invitation":"Wallet Einladung","Wallet Invitation is not valid!":"Wallet Einladung nicht gültig!","Wallet is full":"Maximale Teilnehmerzahl erreicht","Wallet is locked":"Wallet ist gesperrt","Wallet is not complete":"Wallet ist unvollständig","Wallet name":"Name des Wallets","Wallet Name (at creation)":"Wallet-Name (bei der Erzeugung)","Wallet Network":"Wallet-Netzwerk","Wallet not found":"Wallet nicht gefunden","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet ist nicht beim Wallet-Service registiert. Aus \"Wallet erzeugen\" mit \"Erweiterten Optionen\" neu erzeugen um den Seed zu setzen","Wallet Seed":"Wallet-Seed","Wallet Seed could require a passphrase to be imported":"Der Import des Wallet-Seeds erfordert möglicherweise eine Passphrase","Wallet seed is invalid":"Ungültiger Wallet-Seed","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet-Seed ist nicht verfügbar. Dieser kann noch über Erweiterter Export &gt; Exportieren ausgegeben werden.","Wallet service not found":"Wallet-Dienst nicht gefunden","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNUNG: Ohne das Hinzufügen des privaten Schlüssels, ist es möglich das Guthaben und die Transaktionshistorie einzusehen, sowie Zahlungsvorschläge zu erzeugen. Allerdings können Vorschläge nicht ausgeführt (unterschrieben) werden und es ist <b>kein Zugriff auf Guthaben möglich</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNUNG: Die Passphrase kann nicht wiederhergestellt werden. <b>Sicherstellen, das diese notiert wurde</b>. Das Wallet kann ohne Passphrase nicht wiederhergestellt werden.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNUNG: Der private Schlüssel ist nicht verfügbar. Dieser Export ermöglicht das Guthaben und die Transaktionshistorie zu prüfen, sowie Zahlungsvorschläge zu erzeugen. Allerdings können Vorschläge nicht ausgeführt (unterschrieben) werden und so ist <b>kein Zugriff auf Guthaben möglich</b>.","Warning: this transaction has unconfirmed inputs":"Warnung: Diese Transaktion hat unbestätigte Eingänge","WARNING: UNTRUSTED CERTIFICATE":"WARNUNG: NICHT VERTRAUENSWÜRDIGES ZERTIFIKAT","WARNING: Wallet not registered":"WARNUNG: Wallet nicht registriert","Warning!":"Warnung!","We reserve the right to modify this disclaimer from time to time.":"Wir behalten uns das Recht vor, diese Erklärung von Zeit zu Zeit zu ändern.","WELCOME TO COPAY":"Willkommen bei COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"Solange sich diese Software im Betastadium befindet und weiterhin durch Feedback der Open-Source Nutzer und Entwickler-Community verbessert wird, können wir nicht garantieren, dass diese frei von Fehlern ist.","Write your wallet seed":"Notiere den Wallet-Seed","Wrong number of seed words:":"Falsche Anzahl von Seed-Worten:","Wrong password":"Falsches Passwort","Yes":"Ja","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"Sie bestätigen, die Software nach eigenem Ermessen und in Übereinstimmung der anwendbaren Gesetze zu verwenden.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"Sie sind verantwortlich für die Verwahrung Ihrer Kennwörter, privaten Schlüsselpaaren, PINs und anderen Codes, die zum Zugriff auf die Software verwendet werden.","You assume any and all risks associated with the use of the software.":"Sie übernehmen allen Risiken im Zusammenhang mit der Nutzung der Software.","You backed up your wallet. You can now restore this wallet at any time.":"Sie haben Ihre Wallet gesichert. Sie können sie nun jederzeit wiederherstellen.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"Das Wallet kann sicher auf einem anderen Gerät installiert und von mehreren Geräten gleichzeitig verwendet werden.","You do not have a wallet":"Kein Wallet vorhanden","You need the wallet seed to restore this personal wallet. Write it down and keep them somewhere safe.":"Sie benötigen den Wallet-Seed, um Ihre persönliche Wallet wiederherzustellen. Schreiben Sie sich ihn auf und bewahren Sie ihn an einem sicheren Ort auf.","Your backup password":"Passwort zur Sicherung","Your export password":"Ihr Passwort für den Export","Your nickname":"Name des Teilnehmers","Your password":"Passwort","Your profile password":"Profilpasswort","Your wallet has been imported correctly":"Das Wallet wurde korrekt importiert","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Der Schlüssel des Wallets wird verschlüsselt. Das Passwort kann nicht wiederhergestellt werden. Bitte sicherstellen, dass dieses notiert wurde.","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Das Wallet und der Zugriff auf den Server, die die Erzeugung des ersten Wallets steuern. Es werden noch {{index.m}} Schlüssel benötigt."});
    gettextCatalog.setStrings('el', {"(possible double spend)":"(πιθανό διπλό ξόδεμα)","(Trusted)":"(Trusted)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}}, θα προεξοφληθεί ώς τέλος του δικτύου bitcoin","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} τα πορτοφόλια εισάχθηκαν. Σάρωση χρημάτων σε εξέλιξη. Περιμένετε για να δείτε το τελικό σας υπόλοιπο","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"Μια πρόταση πληρωμής μπορεί να διαγραφεί εάν 1) είστε ο δημιουργός, και κανένας άλλος χρήστης του copay δεν έχει υπογράψει, ή 2) έχουν περάσει 24 ώρες απο την ώρα που η πρόταση δημιουργήθηκε.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>ΕΑΝ ΧΑΣΕΤΕ ΤΗΝ ΠΡΟΣΒΑΣΗ ΝΑ ΣΑΣ ΣΤΟ ΠΟΡΤΟΦΌΛΙ COPAY Ή ΣΤΑ ΚΡΥΠΤΟΓΡΑΦΗΜΕΝΑ ΙΔΙΩΤΙΚΑ ΣΑΣ ΚΛΕΙΔΙΑ ΚΑΙ ΔΕΝ ΑΠΟΘΗΚΕΥΣΑΤΕ ΧΩΡΙΣΤΆ ΕΝΑ ΑΝΤΙΓΡΑΦΟ ΑΣΦΑΛΕΙΑΣ ΤΟΥ ΠΟΡΤΟΦΟΛΙΟΥ ΚΑΙ ΤΟΥ ΑΝΤΙΣΤΟΙΧΟΥ ΚΩΔΙΚΟΥ ΠΡΌΣΒΑΣΗΣ, ΑΠΟΔΕΧΕΣΤΕ ΚΑΙ ΣΥΜΦΩΝΕΙΤΕ ΟΤΙ ΟΠΟΙΑΔΗΠΟΤΕ ΠΟΣΟΤΗΤΑ BITCOIN ΠΟΥ ΕΧΕΤΕ ΣΥΣΧΕΤΙΣΕΙ ΜΕ ΤΟ ΠΟΡΤΟΦΟΛΙ ΤΟΥ COPAY ΘΑ ΓΙΝΟΥΝ ΑΠΡΟΣΠΕΛΑΣΤΑ.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"Ένα πορτοφόλι bitcoin με δυνατότητα πολλαπλών υπογραφών","About Copay":"Σχετικά με το Copay","Accept":"Αποδοχή","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"Προσθήκη Πορτοφολιού","Address":"Διεύθυνση","Address Type":"Τύπος Διεύθυνσης","Advanced":"Για προχωρημένους","Advanced Send":"Προηγμένη αποστολή","Agree":"Συμφωνώ","Alias for <i>{{index.walletName}}</i>":"Ψευδώνυμο για <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Όλες οι εισηγήσεις στην μετάφραση του Copay είναι ευπρόσδεκτες. Εγγραφείτε στο crowdin.com για να συμμετάσχετε στο έργο Copay","All transaction requests are irreversible.":"Όλες οι αιτήσεις για συναλλαγές είναι αμετάκλητες.","Already have a wallet?":"Έχετε ήδη πορτοφόλι?","Alternative Currency":"Εναλλακτικό Νόμισμα","Amount":"Ποσό","Amount below dust threshold":"Ποσότητα κάτω από το όριο","Amount in":"Ποσό εισόδου","Applying changes":"Αποδοχή αλλαγών","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"Είσαι σίγουρος ότι θέλετε να διαγράψετε αυτό το πορτοφόλι?","Available Balance":"Διαθέσιμο Υπόλοιπο","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Μέσος χρόνος επιβεβαίωσης: {{fee.nbBlocks * 10}} λεπτά","Back":"Πίσω","Backup":"Αντίγραφο Ασφαλείας","Backup now":"Πάρτε Αντίγραφο Ασφαλείας τώρα","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Κακή πρόσκληση πορτοφολιού","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"Πρίν λάβετε χρήματα, προτέινεται ισχυρά να πάρετε αντίγραφο ασφαλείας των κλειδιών του πορτοφολιού σας.","Bitcoin address":"Διεύθυνση Bitcoin","Bitcoin Network Fee Policy":"Πολιτική Χρέωσης Δικτύου Bitcoin","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Οι Bitcoin συναλλαγές μπορεί να περιλαμβάνουν μια αμοιβή που εισπράτουν οι ανθρακωρύχοι στο δίκτυο. Όσο υψηλότερο το τέλος, τόσο μεγαλύτερο το κίνητρο ενός ανθρακωρύχου να συμπεριλάβει αυτή τη συναλλαγή σε ένα μπλοκ. Οι αμοιβές καθορίζονται με βάση το φορτίο του δικτύου και την επιλεγμένη πολιτική.","Bitcoin URI is NOT valid!":"Το σύστημα Bitcoin URI δεν είναι έγκυρο!","Broadcast Payment":"Μετάδοση Πληρωμής","Broadcasting Payment":"Μεταδίδω την Πληρωμή","Broadcasting transaction":"Μεταδίδοντας την συναλλαγή","Browser unsupported":"Ο πλοηγός δέν υποστηρίζεται","Cancel":"Άκυρο","CANCEL":"ΑΚΥΡΟ","Cannot join the same wallet more that once":"Δεν μπορείτε να ενταχθείτε στο ίδιο πορτοφόλι περισσότερες απο μία φορές","Certified by":"Πιστοποιήθηκε από","Changing wallet alias only affects the local wallet name.":"Αλλάζοντας το ψευδώνυμο του πορτοφολιού επηρεάζει μόνο το τοπικό όνομα πορτοφολιού.","Choose a backup file from your computer":"Επιλέξτε ένα αντίγραφο ασφαλείας απο τον υπολογιστή σας","Choose a wallet to send funds":"Επιλέξτε ένα πορτοφόλι για να στείλετε χρήματα","Close":"Κλείσιμο","Color":"Χρώμα","Commit hash":"Δέσμευση λύσης","Confirm":"Επιβεβαίωση","Confirmations":"Επιβεβαιώσεις","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayers ήδη σε αυτό το πορτοφόλι","Copayer already voted on this spend proposal":"Copayer που έχουν ήδη ψηφίσει αυτή την πρόταση","Copayer data mismatch":"Ασυμφωνία δεδομένων του copayer","Copayers":"Μέλη του πορτοφολιού Copay","Copied to clipboard":"Αντιγράφηκε στο πρόχειρο","Copy this text as it is to a safe place (notepad or email)":"Αντιγράψτε αυτο το κείμενο ώς έχει σε ασφαλές μέρος (σε εφαρμογή κειμένου ή ηλεκτρονικό ταχυδρομείο)","Copy to clipboard":"Αντιγραφή στο πρόχειρο","Could not accept payment":"Δεν μπορέσαμε να δεχθούμε την πληρωμή","Could not access Wallet Service: Not found":"Δεν ήταν δυνατή η πρόσβαση στην υπηρεσία του πορτοφολιού: δεν βρέθηκε","Could not broadcast payment":"Δεν μπορέσαμε να μεταδώσουμε την πληρωμή","Could not create address":"Δεν μπορέσαμε να δημιουργήσουμε την διεύθυνση","Could not create payment proposal":"Δεν ήταν δυνατή η δημιουργία πρότασης πληρωμής","Could not create using the specified extended private key":"Δεν ήταν δυνατή η δημιουργία χρησιμοποιώντας το συγκεκριμένο ιδιωτικό κλειδί επέκτασης","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Δεν ήταν δυνατή η αποκρυπτογράφηση του αρχείου, ελέγξτε τον κωδικό σας","Could not delete payment proposal":"Δεν είναι δυνατή η διαγραφή της πρότασης πληρωμής","Could not fetch payment information":"Δεν ήταν δυνατή η ανάκτηση των στοιχείων πληρωμής","Could not fetch transaction history":"Δεν ήταν δυνατή η λήψη του ιστορικού συναλλαγών","Could not import":"Could not import","Could not import. Check input file and password":"Δεν ήταν δυνατή η εισαγωγή. Ελέγξτε το αρχείο και τον κωδικό πρόσβασης","Could not join wallet":"Δεν μπορείτε να συμμετάσχετε στο πορτοφόλι","Could not recognize a valid Bitcoin QR Code":"Δεν ήταν δυνατή η αναγνώριση ενός έγκυρου κωδικού QR για Βitcoin","Could not reject payment":"Δεν μπορέσαμε να απορρίψουμε την πληρωμή","Could not send payment":"Δεν είναι δυνατή η αποστολή της πληρωμής","Could not update Wallet":"Δεν ήταν δυνατή η ενημέρωση του πορτοφολιού","Create":"Δημιουργία","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Δημιουργία {{requiredCopayers}} των {{totalCopayers}} του πορτοφολιού","Create new wallet":"Δημιουργήστε νέο πορτοφόλι","Create, join or import":"Δημιουργία, συμμετοχή ή εισαγωγή","Created by":"Δημιουργήθηκε από","Creating Profile...":"Δημιουργία του Προφίλ...","Creating transaction":"Δημιουργία συναλλαγής","Creating Wallet...":"Δημιουργία του Πορτοφολιού...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Σημερινό ποσοστό αμοιβής για αυτήν την πολιτική: {{fee.feePerKBUnit}}/kiB","Date":"Ημερομηνία","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"Διαγράψετε το και δημιουργήστε ένα νέο","Delete Payment Proposal":"Διαγράψτε την Πρόταση Πληρωμής","Delete wallet":"Διαγραφή Πορτοφολιού","Delete Wallet":"Διαγραφή Πορτοφολιού","DELETE WORDS":"DELETE WORDS","Deleting payment":"Διαγραφή πληρωμής","Derivation Strategy":"Derivation Strategy","Details":"Λεπτομέρειες","Disabled":"Απενεργοποιημένο","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Δεν βλέπετε τη γλώ��σα σας στο Crowdin; Επικοινωνήστε με τον ιδιοκτήτη στο Crowdin! Θα θέλαμε να υποστηρίξουμε τη γλώσσα σας.","Download":"Download","Download CSV file":"Κατεβάστε το αρχείο CSV","Economy":"Οικονομία","Email":"Email","Email for wallet notifications":"Το ηλεκτρονικό σας ταχυδρομείο για τις ειδοποιήσεις του πορτοφόλιού σας","Email Notifications":"Ειδοποιήσεις Email","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"Παρακαλώ εισάγετε τον κωδικό σας","Error at Wallet Service":"Σφάλμα στην υπηρεσία του πορτοφολιού","Error creating wallet":"Σφάλμα στην δημιουργία πορτοφολιού","Error importing wallet:":"Σφάλμα στην εισαγωγή πορτοφολίου:","Expires":"Λήγει","Export":"Εξαγωγή","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"Αποτυχία εισαγωγής πορτοφολιού","Family vacation funds":"Χρήματα διακοπών της οικογένειας","Fee":"Αμοιβή","Fee Policy":"Τέλος πολιτικής","Fee policy for this transaction":"Τέλος πολιτικής για τη συγκεκριμένη συναλλαγή","Fetching Payment Information":"Λήψη Πληροφοριών Πληρωμής","File/Text Backup":"File/Text Backup","French":"Γαλλικά","Funds are locked by pending spend proposals":"Τα χρήματα είναι κλειδωμένα από εν αναμονή προτάσεις αποστολής","Funds found":"Funds found","Funds received":"Χρήματα ελήφθησαν","Funds will be transfered to":"Funds will be transfered to","Generate new address":"Δημιουργία νέας διεύθυνσης","Generate QR Code":"Δημιουργία Κώδικα QR","Generating .csv file...":"Δημιουργία .csv αρχείου...","German":"Γερμανικά","GET STARTED":"ΞΕΚΙΝΗΣΤΕ","Getting address for wallet {{selectedWalletName}} ...":"Λήψη διεύθυνσης για το πορτοφόλι {{selectedWalletName}} ...","Global settings":"Καθολικές ρυθμίσεις","Go back":"Πάμε πίσω","Greek":"Ελληνικά","Hardware wallet":"Υλικό πορτοφόλι","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Έχετε ένα αντίγραφο ασφαλείας από το Copay έκδοση 0.9?","Hide advanced options":"Απόκρυψη Προχωρημένων επιλογών","Hide Wallet Seed":"Hide Wallet Seed","History":"Ιστορικό","Home":"Αρχική Σελίδα","I affirm that I have read, understood, and agree with these terms.":"Βεβαιώνω ότι έχω διαβάσει, κατανοήσει και συμφωνήσει με αυτούς τους όρους.","Import":"Εισαγωγή","Import backup":"Εισαγωγή αντιγράφου ασφαλείας","Import from Ledger":"Import from Ledger","Import from the Cloud?":"Εισαγωγή από το σύννεφο?","Import from TREZOR":"Import from TREZOR","Import here":"Εισαγωγή εδώ","Import wallet":"Εισαγωγή πορτοφολιού","Importing wallet...":"Εισάγεται το πορτοφόλι ...","Importing...":"Εισαγωγή ...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"Σε καμία περίπτωση οι συντάκτες του λογισμικού, οι συνεργάτες του Bitpay, οι κατόχοι πνευματικών δικαιωμάτων, ή η BitPay α.ε. ευθύνεται για οποιαδήποτε αξίωση, ζημία ή άλλη ευθύνη, είτε βαση κάποιας σύμβασης, αδικοπραξίας, ή άλλο, που προκύπτει από την σχέση σας με το λογισμικό.","Incorrect address network":"Εσφαλμένη διεύθυνση δικτύου","Insufficient funds":"Ανεπαρκές χρηματικό υπόλοιπο","Insufficient funds for fee":"Ανεπαρκής χρηματοδότηση για την αμοιβή","Invalid":"Μη έγκυρο","Invalid address":"Μη έγκυρη διεύθυνση","Invitation to share a Copay Wallet":"Πρόσκληση για τον διαμοιρασμό ενός πορτοφολιού Copay","Italian":"Ιταλικά","Japanese":"Ιαπωνικά","John":"Ιωάννης","Join":"Συμμετοχή","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Συμμετάσχετε στο πορτοφόλι μου Copay. Εδώ είναι ο κωδικός πρόσκλησης: {{secret}} μπορείτε να κατεβάσετε το Copay για το τηλέφωνο σας ή τον υπολογιστή σας στο https://copay.io","Join shared wallet":"Συμμετοχή σε κοινόχρηστο πορτοφόλι","Joining Wallet...":"Εισαγωγή στο Πορτοφόλι...","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"Γλώσσα","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"Μάθετε περισσότερα για τη Μετανάστευση Πορτοφολιού","Loading...":"Φόρτωση…","locked by pending payments":"κλειδωμένο από εκκρεμούσες πληρωμές","Locktime in effect. Please wait to create a new spend proposal":"Κλείδωμα σε ισχύ. Σας παρακαλώ περιμένετε για να δημιουργήσετε μια νέα πρόταση","Locktime in effect. Please wait to remove this spend proposal":"Κλείδωμα σε ισχύ. Σας παρακαλώ περιμένετε για να αφαιρέσετε αυτή την πρόταση","Make a payment to":"Κάντε μια πληρωμή σε","me":"me","Me":"Εγώ","Memo":"Σημείωση","Merchant message":"Μήνυμα Εμπόρου","Message":"Μήνυμα","More":"Περισσότερα","Moved":"Μετακινήθηκε","Multisignature wallet":"Πορτοφόλι Πολλών Υπογραφών","My Bitcoin address":"Η  διεύθυνση Bitcoin μου","Network":"Δίκτυο","Network connection error":"Σφάλμα σύνδεσης δικτύου","New Payment Proposal":"Νέα Πρόταση Πληρωμής","No Private key":"Δεν υπάρχει ιδιωτικό κλειδί","No transactions yet":"Δεν υπάρχουν συναλλαγές ακόμα","Normal":"Κανονική","Not authorized":"Δεν επιτρέπεται","Not valid":"Δεν είναι έγκυρη","Note":"Σημείωση","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"προαιρετικό","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"Συμμετέχοντες","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Κωδικός πρόσβασης","Password needed":"Κωδικός πρόσβασης απαιτείται","Passwords do not match":"Οι κωδικοί πρόσβασης δεν ταιριάζουν","Paste invitation here":"Επικολλήστε την πρόσκληση σας εδώ","Paste the backup plain text code":"Επικολλήστε τον κώδικα δημιουργίας αντιγράφων ασφαλείας εδώ","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Πληρωμή Πρός","Payment Accepted":"Πληρωμή Αποδεκτή","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Λεπτομέρειες πληρωμής","Payment Proposal":"Πρόταση Πληρωμής","Payment Proposal Created":"Πρόταση Πληρωμής Δημιουργήθηκε","Payment Proposal Rejected":"Πρόταση Πληρωμής Απορρίφθηκε","Payment Proposal Rejected by Copayer":"Το Copayer Απέρριψε την Πρόταση Πληρωμής","Payment Proposal Signed by Copayer":"Η Πρόταση Πληρωμής Υπογράφηκε από το Copayer","Payment Proposals":"Πρόταση Πληρωμής","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Το Πρωτόκολλο Πληρωμής δεν υποστηρίζεται στην εφαρμογή Chrome","Payment rejected":"Πληρωμή Απερρίφθη","Payment Rejected":"Πληρωμή Απερρίφθη","Payment request":"Αίτηση πληρωμής","Payment sent":"Πληρωμή Εστάλη","Payment Sent":"Πληρωμή Εστάλη","Payment to":"Πληρωμή σε","Pending Confirmation":"Υπό επιβεβαίωση","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Να διαγράφεί μόνιμα αυτό το πορτοφόλι? ΑΥΤΗ Η ΕΝΕΡΓΕΙΑ ΔΕΝ ΜΠΟΡΕΙ ΝΑ ΑΝΤΙΣΤΡΑΦΕΙ","Personal Wallet":"Προσωπικό πορτοφόλι","Please enter the required fields":"Παρακαλώ εισάγετε τα απαιτούμενα πεδία","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Παρακαλώ αναβαθμίστε το Copay για να εκτελέσετε αυτήν την ενέργεια","Please, select your backup file":"Παρακαλώ, επιλέξτε το αρχείο αντιγράφου ασφαλείας","Portuguese":"Πορτογαλικά","Preferences":"Προτιμήσεις","Preparing backup...":"Προετοιμασία δημιουργίας αντιγράφων ασφαλείας...","Priority":"Προτεραιότητα","QR Code":"Κωδικός QR","QR-Scanner":"Σαρωτής QR","Receive":"Λάβετε","Received":"Ληφθέντα","Recipients":"Παραλήπτες","Reconnecting to Wallet Service...":"Γίνεται επανασύνδεση στην Υπηρεσία Πορτοφολιού...","Recreate":"Αναδημιουργία","Recreating Wallet...":"Αναδημιουργία πορτοφολιού...","Reject":"Απόρριψη","Rejecting payment":"Απόρριψη πληρωμής","Release Information":"Πληροφορίες Έκδοσης","Repeat password":"Επανάληψη κωδικού","Request a specific amount":"Ζητήστε ένα συγκεκριμένο ποσό","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Απαιτείτε","Required number of signatures":"Required number of signatures","Retrying...":"Επανάληψη...","Russian":"Ρωσσικά","Save":"Αποθήκευση","Saving preferences...":"Αποθήκευση προτιμήσεων...","Scan addresses for funds":"Σάρωση διευθύνσεων για χρήματα","Scan Finished":"Η σάρωση ολοκληρώθηκε","Scan status finished with error":"Η σάρωση έχει τελειώσει με σφάλματα","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Σάρωση χρημάτων Πορτοφολιού...","See it on the blockchain":"Δείτε τη συναλλαγή στην αλυσίδα συναλλαγών","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Επιλέξτε ένα αρχείο αντιγράφου ασφαλείας","Select a wallet":"Επιλέξτε ένα πορτοφόλι","Self-signed Certificate":"Self-signed Certificate","Send":"Αποστολή","Send All":"Αποστολή Όλων","Send all by email":"Send all by email","Send by email":"Αποστολή με email","Sending funds...":"Sending funds...","Sent":"Εξερχόμενα","Server":"Διακομιστής","Server response could not be verified":"Server response could not be verified","Session log":"Ημερολόγιο συνεδριών","SET":"Ορισμός","Set up a Export Password":"Set up a Export Password","Set up a password":"Ορίστε έναν κωδικό πρόσβασης","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Ενεργοποιώντας τις ενημερώσεις μέσω ηλεκτρονικού ταχυδρομείου μπορεί να μειωθεί η ιδιωτικότητα σας, εάν ο πάροχος του πορτοφολιού παραβιαστεί. Οι πληροφορίες που θα διαθέτει ένας εισβολέας θα περιλαμβάνουν τις διευθύνσεις του πορτοφόλιου σας και το ποσόν τω�� χρημάτων σας, αλλά τίποτα περισσότερο.","settings":"ρυθμίσεις","Share address":"Μοιραστείτε τη διεύθυνση","Share invitation":"Μοιραστείτε μια πρόσκληση","Share this invitation with your copayers":"Μοιραστείτε αυτήν την πρόσκ��ηση με άλλους copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Μοιραστείτε αυτή τη διεύθυνση πορτοφόλιού ώστε να λάβετε πληρωμές. Για την προστασία της ιδιωτικότητας σας, νέες διευθύνσεις δημιουργούνται αυτόματα μόλις χρησιμοποιήσετε τις παλιές.","Shared Wallet":"Κοινόχρηστο πορτοφόλι","Show advanced options":"Εμφάνιση προχωρημένων επιλογών","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Οι υπογραφές απορρίφθηκαν από το διακομιστή","Signing payment":"Υπογραφή πληρωμής","SKIP BACKUP":"ΠΑΡΑΛΕΙΨΗ ΔΗΜΙΟΥΡΓΙΑΣ ΑΝΤΙΓΡΑΦΩΝ ΑΣΦΑΛΕΙΑΣ","Spanish":"Ισπανικά","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"Η πρόταση δεν έγινε αποδεκτή","Spend proposal not found":"Η πρόταση δεν βρέθηκε","Still not done":"Still not done","Success":"Επιτυχία","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Πατήστε για να προσπαθήσετε ξανά","Terms of Use":"Όροι Χρήσης","Testnet":"Δοκιμαστικό Δίκτυο","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"Οι συγγραφείς του λογισμικού, οι εργαζόμενοι και οι συνεργάτες του Bitpay, οι κατόχοι πνευματικών δικαιωμάτων, και η BitPay α.ε., δεν μπορούν να ανακτήσουν ιδιωτικά κλειδιά ή τους κωδικούς πρόσβασης σας, εάν χάσετε ή ξεχασετε αυτούς και δεν μπορούν να εγγυηθούν την επιβεβαίωση της συναλλαγής, δεδομένου ότι δεν έχουν τον έλεγχο του δικτύου Bitcoin.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"Η πληρωμή δημιουργήθηκε, αλλά δεν ήταν δυνατό να ολοκληρωθεί. Παρακαλώ ξαναπροσπαθήστε από την αρχική οθόνη","The payment was created but could not be signed. Please try again from home screen":"Η πληρωμή δημιουργήθηκε, αλλά δεν μπορούσε να υπογραφεί. Παρακαλώ ξαναπροσπαθήστε από την αρχική οθόνη","The payment was removed by creator":"Η πληρωμή έχει αφαιρεθεί από τον δημιουργό της","The payment was signed but could not be broadcasted. Please try again from home screen":"Η πληρωμή έχει υπογραφεί αλλά δεν μπορούσε να μεταδοθεί. Παρακαλώ ξαναπροσπαθήστε από την αρχική οθόνη","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"Το λογισμικό δεν αποτελεί ένα λογαριασμό όπου το BitPay ή άλλα τρίτα μέρη χρησιμεύουν ως ενδιάμεσοι χρηματοπιστωτικοί οργανισμοί ή θεματοφύλακες των bitcoin σας.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"Το λογισμικό που πρόκειται να χρησιμοποιήσετε λειτουργεί ως ένα δωρεάν, ανοικτού κώδικα και πολλαπλών υπογραφών ψηφιακό πορτοφόλι.","The spend proposal is not pending":"Δεν εκκρεμεί η πρόταση","The wallet \"{{walletName}}\" was deleted":"Διαγράφηκε το πορτοφόλι \"{{walletName}}\"","There are no wallets to make this payment":"Δεν υπάρχουν πορτοφόλια για να πραγματοποιηθεί η πληρωμή","There is an error in the form":"Υπάρχει ένα λάθος στη φόρμα εισαγωγής","This transaction has become invalid; possibly due to a double spend attempt.":"Αυτή η συναλλαγή είναι άκυρη, πιθανόν λόγω μιας προσπάθειας διπλού ξοδέματος.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Το πορτοφόλι δεν έχει καταχωρηθεί στη Βάση Δεδομένων Πορτοφολιών Bitcore (BWS). Μπορείτε να την ξαναδημιουργήσετε από τις τοπικές πληροφορίες.","Time":"Ώρα","To":"Προς","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"Στο μέγιστο βαθμό που επιτρέπει το δίκαιο, το λογισμικό παρέχεται \"ως έχει\" και καμία δήλωση ή εγγύηση μπορεί να γίνει του κάθε είδους, ρητή ή σιωπηρή, συμπεριλαμβανομένων, αλλά μη περιορισμένων, των εγγυήσεων εμπορευσιμότητας, καταλληλότητας ή συγκεκριμένου σκοπού και νομιμότητας.","too long!":"πάρα πολύ μεγάλο μέγεθος!","Total":"Συνολικά","Total Locked Balance":"Συνολικό Κλειδωμένο Υπόλοιπο","Total number of copayers":"Total number of copayers","Transaction":"Συναλλαγή","Transaction already broadcasted":"Συναλλαγή που έχει ήδη μεταδοθεί","Translation Credits":"Λεπτομέρειες Μετάφρασης","Translators":"Μεταφραστές","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Δεν είναι δυνατή η αποστολή πρότασης συναλλαγής","Unconfirmed":"Ανεπιβεβαίωτες","Unit":"Μονάδα","Unsent transactions":"Μη Απεσταλμένες συναλλαγές","Updating Wallet...":"Ενημέρωση πορτοφολιού...","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Χρήση Ανεπιβεβαίωτων Ποσών","Username":"Username","Version":"Έκδοση","View":"View","Waiting for copayers":"Αναμονή για copayers","Waiting...":"Σε αναμονή...","Wallet":"Πορτοφόλι","Wallet Alias":"Ψευδώνυμο Πορτοφολιού","Wallet already exists":"Υπάρχει ήδη το πορτοφόλι","Wallet Already Imported:":"Το Πορτοφόλι έχει ήδη εισαχθεί:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Πορτοφόλι ελλιπές και χαλασμένο","Wallet Information":"Wallet Information","Wallet Invitation":"Πρόσκληση πορτοφολιού","Wallet Invitation is not valid!":"Η πρόσκληση πορτοφολιού δεν είναι έγκυρη!","Wallet is full":"Το πορτοφόλι είναι γεμάτο","Wallet is not complete":"Το πορτοφόλι δεν είναι πλήρες","Wallet name":"Όνομα πορτοφολιού","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Το πορτοφόλι δεν βρέθηκε","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Η υπηρεσία του πορτοφολιού δεν βρέθηκε","WARNING: Backup needed":"Προειδοποίηση: Δημιουργία αντιγράφων ασφαλείας απαιτείται","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Προειδοποίηση: αυτή η συναλλαγή έχει ανεπιβεβαίωτες εισροές","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"Προειδοποίηση: Το πορτοφόλι δεν έχει καταχωρηθεί","Warning!":"Προειδοποίηση!","We reserve the right to modify this disclaimer from time to time.":"Διατηρούμε το δικαίωμα να τροποποιήσουμε αυτή την αποποίηση ευθυνών από καιρό σε καιρό.","WELCOME TO COPAY":"ΚΑΛΩΣ ΗΛΘΑΤΕ ΣΤΟ COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"Ενώ το λογισμικό έχει υποβληθεί σε δοκιμή beta και συνεχίζει να βελτιώνεται από χρήστες ανοικτού κώδικα και την κοινότητα των προγραμματιστών, εμείς δεν μπορούμε να εγγυηθούμε ότι δεν θα υπάρξει κανένα σφάλμα στο λογισμικό.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"Λάθος κωδικός πρόσβασης","Yes":"Ναι","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"Αναγνωρίζετε ότι η χρήση αυτού του λογισμικού είναι στην κρίση σας και σε συμφωνία με όλους τους ισχύοντες νόμους.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"Είστε υπεύθυνος για τη διαφύλαξή των κωδικών πρόσβασής σας, το ιδιωτικό ζεύγος κλειδιών, τετραψήφιων κωδικών PIN και οποιουσδήποτε άλλους κωδικούς που χρησιμοποιείτε για να έχετε πρόσβαση στο λογισμικό.","You assume any and all risks associated with the use of the software.":"Αναλάμβανετε κάθε κινδύνο που συνδέεται με τη χρήση του λογισμικού.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"Δεν έχετε πορτοφόλι","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"Ο  κωδικός πρόσβασης των αντιγράφων ασφαλείας σας","Your export password":"Your export password","Your nickname":"Το ψευδώνυμό σας","Your password":"Ο κωδικός σας","Your profile password":"Ο κωδικός πρόσβασης του προφίλ σας","Your wallet has been imported correctly":"Το πορτοφόλι σας έχει εισαχθεί σωστά","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('es', {"(possible double spend)":"(Posible doble gasto)","(Trusted)":"(De confianza)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} se descontará por comisión de la red bitcoin","{{index.m}}-of-{{index.n}}":"{{index.m}}-de-{{index.n}}","{{index.txProgress}} transactions downloaded":"{{index.txProgress}} transacciones descargadas","{{item.m}}-of-{{item.n}}":"{{item.m}}-de-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} monederos importados. Búsqueda de fondos en progreso. Espere a ver el balance actualizado","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Una propuesta de pago puede ser eliminada si 1) Ud. es el creador, y ningún otro copayer la haya firmado, o 2) hayan transcurrido 24 horas desde la creación de la propuesta.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>SI UD. PIERDE ACCESO A SU MONEDERO COPAY O A SUS CLAVES PRIVADAS ENCRIPTADAS Y NO HA GUARDADO POR SEPARADO UNA COPIA DE SEGURIDAD DE SU MONEDERO Y CONTRASEÑA CORRESPONDIENTES, USTED RECONOCE Y ACEPTA QUE CUALQUIER BITCOIN QUE HA ASOCIADO CON ESE MONEDERO COPAY SERÁ INACCESIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>O</b> 1 archivo del monedero exportado y el quórum restante de semillas del monedero (por ejemplo en un monedero 3-5: 1 archivo de monedero exportado + 2 semillas del monedero de cualquiera de los otros copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>O</b> la semilla del monedero de <b>todos</b> los copayers del monedero","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>O</b> las semillas del monedero de <b>todos</b> los copayers del monedero","A multisignature bitcoin wallet":"Monedero multifirma de bitcoin","About Copay":"Acerca de Copay","Accept":"Aceptar","Account":"Cuenta","Account Number":"Número de cuenta","Activity":"Actividad","Add a new entry":"Agregar una nueva entrada","Add a Seed Passphrase":"Agregar una contraseña a la semilla","Add an optional passphrase to secure the seed":"Agregar una contraseña opcional para asegurar la semilla","Add wallet":"Agregar monedero","Address":"Dirección","Address Type":"Tipo de Dirección","Advanced":"Avanzado","Alias":"Alias","Alias for <i>{{index.walletName}}</i>":"Alias de <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Todas las contribuciones a la traducción de Copay son bienvenidas. Regístrese en crowdin.com y únase al proyecto Copay en","All transaction requests are irreversible.":"Todas las solicitudes de transacciones son irreversibles.","Alternative Currency":"Moneda Alternativa","Amount":"Importe","Amount below dust threshold":"Importe debajo del umbral permitido","Amount in":"Importe en","Are you sure you want to delete the backup words?":"¿Está seguro que quiere eliminar las palabras de la copia de seguridad?","Are you sure you want to delete this wallet?":"¿Estas seguro de borrar este monedero?","Available Balance":"Balance disponible","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Tiempo promedio de confirmación: {{fee.nbBlocks * 10}} minutos","Back":"Volver","Backup":"Copia de seguridad","Backup failed":"Falló la copia de seguridad","Backup Needed":"Se requiere hacer copia de seguridad","Backup now":"Realizar copia de seguridad ahora","Backup words deleted":"Las palabras de la copia de seguridad fueron borradas","Bad wallet invitation":"Invitación incorrecta al monedero","Balance By Address":"Balance por Dirección","Before receiving funds, it is highly recommended you backup your wallet. If you lose this device, it is impossible to access your funds without a backup.":"Antes de recibir fondos, se recomienda realizar una copia de seguridad de su monedero. Si pierde este dispositivo, es imposible tener acceso a sus fondos sin una copia de seguridad.","BIP32 path for address derivation":"BIP32 para el camino de derivación de direcciones","Bitcoin address":"Dirección bitcoin","Bitcoin Network Fee Policy":"Política de Comisión de la Red Bitcoin","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Las transacciones de Bitcoin pueden incluir una comisión colectada por los mineros en la red. Cuanto mayor sea la comisión, mayor será el incentivo para que el minero incluya esa transacción en un bloque. Las comisiones reales se determinan en base a la carga de la red y a la política seleccionada.","Bitcoin URI is NOT valid!":"¡Bitcoin URI no es válida!","Broadcast Payment":"Enviar Pago","Broadcasting Payment":"Enviando el Pago","Broadcasting transaction":"Enviando transacción","Browser unsupported":"Navegador no soportado","Buy &amp; Sell Bitcoin":"Comprar &amp; Vender Bitcoin","Calculating fee":"Calculando comisión","Cancel":"Cancelar","CANCEL":"CANCELAR","Cannot join the same wallet more that once":"No puede unirse al mismo monedero más de una vez","Certified by":"Certificado por","Changing wallet alias only affects the local wallet name.":"Cambiar el alias del monedero solo afecta al nombre del monedero local.","Choose a backup file from your computer":"Seleccione el archivo de copia de seguridad de su computadora","Clear cache":"Limpiar cache","Close":"Cerrar","Color":"Color","Commit hash":"Commit hash","Confirm":"Confirmar","Confirm your wallet seed":"Confirmar su semilla del monedero","Confirmations":"Confirmaciones","Congratulations!":"¡Felicitaciones!","Connecting to {{create.hwWallet}} Wallet...":"Conectando al monedero {{create.hwWallet}}...","Connecting to {{import.hwWallet}} Wallet...":"Conectando al monedero {{import.hwWallet}}...","Connecting to {{join.hwWallet}} Wallet...":"Conectando al monedero {{join.hwWallet}}...","Continue":"Continuar","Copayer already in this wallet":"Ya se encuentra en este monedero","Copayer already voted on this spend proposal":"Ya ha votado en esta propuesta de gasto","Copayer data mismatch":"Discrepancia en los datos del Copayer","Copayers":"Copayers","Copied to clipboard":"Copiado al portapapeles","Copy this text as it is to a safe place (notepad or email)":"Copiar el texto como esta en un lugar seguro (bloc de notas o correo electrónico)","Copy to clipboard":"Copiar al portapapeles","Could not accept payment":"No se pudo aceptar el pago","Could not access Wallet Service: Not found":"No se pudo acceder a Wallet Service: No encontrado","Could not broadcast payment":"No se pudo enviar el pago","Could not calculate fee":"No se pudo calcular la comisión","Could not create address":"No se pudo crear la dirección","Could not create payment proposal":"No se pudo crear la propuesta de pago","Could not create using the specified extended private key":"No se pudo crear el monedero usando la clave privada ingresada","Could not create using the specified extended public key":"No se pudo crear con la clave pública extendida especificada","Could not create: Invalid wallet seed":"No se pudo crear: semilla del monedero no válida","Could not decrypt":"No se pudo descifrar","Could not decrypt file, check your password":"No se pudo desencriptar el archivo, verifique su contraseña","Could not delete payment proposal":"No se pudo eliminar la propuesta de pago","Could not fetch payment information":"No se pudo obtener información del pago","Could not import":"No se pudo importar","Could not import. Check input file and password":"No se pudo importar. Verifique el archivo y contraseña","Could not join wallet":"No se pudo unir al monedero","Could not recognize a valid Bitcoin QR Code":"No se reconoció el código QR de Bitcoin válido","Could not reject payment":"No se pudo rechazar el pago","Could not send payment":"No se pudo enviar el pago","Could not update Wallet":"No se pudo actualizar el monedero","Create":"Crear","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Crea monedero {{requiredCopayers}}-de-{{totalCopayers}}","Create new wallet":"Crear un nuevo monedero","Create, join or import":"Crear, unirse o importar","Created by":"Creado por","Creating transaction":"Creando transacción","Creating Wallet...":"Creando monedero...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Comisión actual para esta política: {{fee.feePerKBUnit}}/kiB","Date":"Fecha","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Descifrar un monedero de papel podría tomar alrededor de 5 minutos en este dispositivo. Por favor, sea paciente y mantenga la aplicación abierta.","Delete it and create a new one":"Borrar y crear uno nuevo","Delete Payment Proposal":"Eliminar Propuesta de Pago","Delete seed words":"Eliminar palabras de la semilla","Delete wallet":"Eliminar monedero","Delete Wallet":"Eliminar Monedero","Delete words":"Eliminar palabras","Deleting payment":"Eliminando el pago","Derivation Path":"Camino de derivación","Derivation Strategy":"Estrategia de derivación","Details":"Detalles","Disabled":"Deshabilitado","Do not include private key":"No incluir la clave privada","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"¿No ve su idioma en Crowdin? Contáctese con el encargado del proyecto! Nos encantaría soportar su idioma.","Done":"Listo","Download":"Descargar","Economy":"Económico","Edit":"Editar","Email":"Correo electrónico","Email for wallet notifications":"Correo electrónico para notificaciones del monedero","Email Notifications":"Notificaciones por Correo electrónico","Empty addresses limit reached. New addresses cannot be generated.":"Se ha alcanzado el límite de direcciones vacías. No se pueden generar nuevas direcciones.","Encrypted export file saved":"El archivo cifrado se ha exportado y guardado","Enter the seed words (BIP39)":"Ingrese las palabras de la semilla (BIP39)","Enter your passphrase":"Ingrese su contraseña","Enter your password":"Ingrese su contraseña","Error at Wallet Service":"Error en Wallet Service","Error creating wallet":"Error al crear monedero","Error importing wallet:":"Error al importar monedero: ","Expires":"Expira","Export options":"Opciones de exportación","Export to file":"Exportar a archivo","Export Wallet":"Exportar Monedero","Extended Public Keys":"Claves Públicas Extendidas","Failed to export":"Error al exportar","Failed to import wallets":"Error al importar monederos","Failed to verify backup. Please check your information":"No se pudo comprobar la copia de seguridad. Por favor verifique su información","Family vacation funds":"Fondos para vacaciones en familia","Fee":"Comisión","Fetching Payment Information":"Obteniendo información del pago","File/Text Backup":"Archivo/Texto","Finish":"Finalizar","French":"Francés","Funds are locked by pending spend proposals":"Los fondos están bloqueados por propuestas de gastos pendientes","Funds found":"Fondos encontrados","Funds received":"Fondos Recibidos","Funds will be transferred to":"Los fondos serán transferidos a","Generate new address":"Generar nueva dirección","Generate QR Code":"Generar código QR","Generating .csv file...":"Generando archivo .csv...","German":"Alemán","Getting address for wallet {{selectedWalletName}} ...":"Obteniendo direcciones para el monedero {{selectedWalletName}} ...","Global preferences":"Preferencias globales","Greek":"Griego","Hardware wallet":"Monedero de Hardware","Have a Backup from Copay v0.9?":"¿Tiene una copia de seguridad de Copay v0.9?","Hide advanced options":"Ocultar opciones avanzadas","I affirm that I have read, understood, and agree with these terms.":"Confirmo haber leído, entendido y aceptado estos términos.","I AGREE. GET STARTED":"DE ACUERDO. COMENZAR","Import":"Importar","Import backup":"Importar copia de seguridad","Import from the Cloud?":"¿Importar de la Nube?","Import here":"Importar aquí","Import wallet":"Importar monedero","Importing wallet...":"Importando monedero...","Importing...":"Importando...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"En ningún caso los autores, empleados y afiliados de Bitpay, los titulares de derechos de autor, o BitPay, Inc. serán declarados responsables de los reclamos, daños o cualquier otra responsabilidad, ya sea en una acción de contrato, agravio o de otra manera, que surja fuera de la conexión con el software.","In order to verify your wallet backup, please type your passphrase:":"Con el fin de verificar la copia de seguridad del monedero, por favor escriba su contraseña:","Include address book and history cache":"Incluir libreta de direcciones e historial","Incorrect address network":"Dirección de red incorrecta","Insufficient funds":"Fondos insuficientes","Insufficient funds for fee":"Fondos insuficientes para el pago de la comisión","Invalid":"Inválido","Invalid account number":"Número de cuenta inválido","Invalid address":"Dirección inválida","Invalid derivation path":"Camino de derivación no válido","Invalid Touch ID":"Touch ID inválido","Invitation to share a Copay Wallet":"Invitación para compartir un monedero de Copay","Italian":"Italiano","Japanese":"Japonés","John":"Juan","Join":"Unirse","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Únase a mi monedero Copay. Aquí esta el código de invitación: {{secret}}. Puedes descargar Copay a su teléfono o computadora desde https://copay.io","Join shared wallet":"Unirse a un monedero compartido","Joining Wallet...":"Uniéndose al monedero...","Key already associated with an existing wallet":"La clave ya esta asociada a un monedero existente","Label":"Etiqueta","Language":"Idioma","Last Wallet Addresses":"Últimas Direcciones del Monedero","Learn more about Copay backups":"Más información sobre copias de seguridad en Copay","Learn more about Wallet Migration":"Más información acerca de como Migrar un Monedero","locked by pending payments":"bloqueado por pagos pendientes","Locktime in effect. Please wait to create a new spend proposal":"Bloqueo temporal. Por favor espere para crear una nueva propuesta de gasto","Locktime in effect. Please wait to remove this spend proposal":"Bloqueo temporal. Por favor espere para eliminar esta propuesta de gasto","Make a payment to":"Hacer un pago a","me":"yo","Me":"Yo","Memo":"Nota","Merchant message":"Mensaje del negocio","Message":"Mensaje","Moved":"Movido","Multiple recipients":"Varios destinatarios","My Bitcoin address":"Mi dirección Bitcoin","My contacts":"Mis contactos","My wallets":"Mis monederos","Need to do backup":"Necesita hacer una copias de seguridad","Network":"Red","Network connection error":"Error de conexión a la red","New Payment Proposal":"Nueva Propuesta de Pago","New Random Seed":"Nueva Semilla Aleatoria","No hardware wallets supported on this device":"No hay monederos hardware compatibles con este dispositivo","No transactions yet":"Sin transacciones todavía","Normal":"Normal","Not authorized":"No autorizado","Not completed":"No completado","Not valid":"No válido","Note":"Nota","Official English Disclaimer":"Renuncia oficial en inglés","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Una vez que se copia la semilla del monedero, se recomienda eliminarla de este dispositivo.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Sólo las direcciones principales aparecen (no las usadas para el vuelto). Las direcciones de esta lista no fueron verificadas localmente en este momento.","optional":"opcional","Paper Wallet Private Key":"Clave privada del monedero de papel","Participants":"Participantes","Passphrase":"Contraseña","Password":"Contraseña","Password needed":"Contraseña requerida","Passwords do not match":"Las contraseñas no coinciden","Paste invitation here":"Pegar invitación aquí","Paste the backup plain text code":"Pegar copia de seguridad en texto plano","Paste your paper wallet private key here":"Pegar la clave privada del monedero aquí","Pay To":"Pagar A","Payment Accepted":"Pago Aceptado","Payment accepted, but not yet broadcasted":"Pago aceptado, pero aún no fue enviado","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Pago aceptado. Se transmitirá por Glidera. En caso de que haya un problema, puede eliminar la transacción 6 horas después de fue creada.","Payment details":"Detalles del pago","Payment Proposal":"Propuesta de Pago","Payment Proposal Created":"Propuesta de Pago Creada","Payment Proposal Rejected":"Propuesta de Pago Rechazada","Payment Proposal Rejected by Copayer":"Propuesta de Pago Rechazada por Copayer","Payment Proposal Signed by Copayer":"Propuesta de Pago Firmada por Copayer","Payment Proposals":"Propuestas de Pago","Payment Protocol Invalid":"Protocolo de Pago Inválido","Payment Protocol not supported on Chrome App":"El protocolo de pago no está soportado en Chrome","Payment Rejected":"Pago Rechazado","Payment request":"Solicitud de pago","Payment Sent":"Pago Enviado","Payment to":"Pago a","Pending Confirmation":"Confirmación Pendiente","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Borrar permanentemente este monedero. ESTA ACCIÓN NO PUEDE SER REVERTIDA","Personal Wallet":"Monedero Personal","Please accept to export two public keys from the Trezor app":"Por favor acepte para exportar dos claves públicas de la aplicación Trezor","Please enter the required fields":"Por favor ingrese los campos requeridos","Please enter the seed words":"Por favor ingrese las palabras de la semilla","Please enter the wallet seed":"Por favor ingrese la semilla del monedero","Please tap the words in order to confirm your backup phrase is correctly written.":"Por favor presione las palabras para confirmar que su copia de seguridad está correctamente escrita.","Please upgrade Copay to perform this action":"Por favor actualice Copay para realizar esta acción","Please, select your backup file":"Por favor, seleccione el archivo de copia de seguridad","Portuguese":"Portugués","Preparing backup...":"Preparando copia de seguridad...","Press again to exit":"Presione nuevamente para salir","Priority":"Prioritario","QR Code":"Código QR","QR-Scanner":"Lector de QR","Receive":"Recibir","Received":"Recibido","Recipients":"Destinatarios","Reconnecting to Wallet Service...":"Reconectando a Wallet Service...","Recreate":"Recrear","Recreating Wallet...":"Recreando Monedero...","Reject":"Rechazar","Rejecting payment":"Rechazando el pago","Release Information":"Información de la versión","Remove":"Eliminar","Repeat password":"Escriba nuevamente la contraseña","Request a specific amount":"Solicitar importe específico","Request Password":"Solicitar Contraseña","Requesting Ledger Wallet to sign":"Solicitando el Monedero Ledger para firmar","Required":"Requerido","Required number of signatures":"Número requerido de firmas","Russian":"Ruso","Save":"Guardar","Saving preferences...":"Guardando preferencias...","Scan addresses for funds":"Busca direcciones con fondos","Scan Fingerprint":"Lector de huella digital","Scan Finished":"Búsqueda Finalizada","Scan status finished with error":"La búsqueda finalizó con error","Scan Wallet Funds":"Buscar fondos del monedero","Scan your fingerprint please":"Por favor ingrese su huella digital","Scanning wallet funds...":"Buscando fondos en el monedero...","Scanning Wallet funds...":"Buscando fondos en el Monedero...","Security preferences":"Preferencias de seguridad","See it on the blockchain":"Ver en la blockchain","Seed passphrase":"Contraseña de la semilla","Seed Passphrase":"Contraseña de la Semilla","Select a backup file":"Seleccionar el archivo de copia de seguridad","Select a wallet":"Seleccionar un monedero","Self-signed Certificate":"Certificado autofirmado","Send":"Enviar","Send addresses by email":"Enviar las direcciones por email","Send All":"Enviar Todo","Send by email":"Enviar por correo electrónico","Sending":"Enviando","Sending funds...":"Enviando fondos...","Sent":"Enviado","Server":"Servidor","Server response could not be verified":"La respuesta del servidor no se ha podido verificar","Session log":"Registro de sesión","SET":"ESTABLECER","Set default url":"Establecer URL predeterminada","Set up a password":"Configurar una contraseña","Set up an Export Password":"Configurar una contraseña al exportar","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Configurar notificaciones por correo electrónico podría debilitar su privacidad, si el proveedor de Wallet Service se ve comprometido. La información disponible para un atacante incluiría sus direcciones del monedero y su balance, pero no más.","Settings":"Configuración","Share address":"Compartir dirección","Share invitation":"Compartir invitación","Share this invitation with your copayers":"Compartir esta invitación con sus copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Compartir esta dirección para recibir pagos. Para proteger su privacidad, se generan nuevas direcciones automáticamente luego de recibir un pago.","Shared Wallet":"Monedero Compartido","Show advanced options":"Mostrar opciones avanzadas","Show all":"Mostrar todo","Show Wallet Seed":"Mostrar Semilla del Monedero","Signatures rejected by server":"Firmas rechazadas por el servidor","Signing payment":"Firmando el pago","Spanish":"Español","Specify Seed...":"Especificar la Semilla...","Spend proposal is not accepted":"La propuesta de gasto no se ha aceptado","Spend proposal not found":"La propuesta de gasto no se ha encontrado","Success":"Listo","Sweep paper wallet":"Importar monedero en papel","Sweep Wallet":"Importar Monedero","Tap to retry":"Toque para reintentar","Terms of Use":"Términos de Uso","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"Los autores de los software, empleados y afiliados de Bitpay, los titulares de derechos de autor, y BitPay, Inc. no pueden recuperar sus claves privadas o contraseñas si se pierde o se olvida de ellos y no se puede garantizar la confirmación de la transacción, ya que no tienen control sobre la red Bitcoin.","The Ledger Chrome application is not installed":"La aplicación Ledger de Chrome no esta instalada","The payment was created but could not be completed. Please try again from home screen":"El pago fue creado pero no se pudo completar. Por favor intente nuevamente desde la pantalla de inicio","The payment was created but could not be signed. Please try again from home screen":"El pago fue creado pero no se pudo firmar. Por favor intente nuevamente desde la pantalla de inicio","The payment was removed by creator":"El pago fue eliminado por el creador","The payment was signed but could not be broadcasted. Please try again from home screen":"El pago fue firmado pero no pudo ser enviado. Por favor intente nuevamente desde la pantalla de inicio","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"La clave privada de este monedero esta cifrada. Exportándola mantiene la clave privada cifrada en el archivo de exportación.","The seed could require a passphrase to be imported":"La semilla puede requerir una contraseña para ser importada","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"El software no constituye una cuenta donde BitPay u otras terceras partes sirven como intermediarios financieros o custodios de su bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"El software que va a utilizar es un monedero digital de código abierto y multi-firmas.","The spend proposal is not pending":"La propuesta de gasto no esta pendiente","The wallet \"{{walletName}}\" was deleted":"El monedero \"{{walletName}}\" fue eliminado","There are no wallets to make this payment":"No dispone de monederos para realizar este pago","There is an error in the form":"Hay un error en el formulario","This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"Esta semilla fue creada con una contraseña. Para recuperar el monedero son necesarias las palabras y la contraseña.","This transaction has become invalid; possibly due to a double spend attempt.":"Esta transacción se ha invalidado; posiblemente debido a un intento de doble gasto.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Este monedero no esta registrado en el servidor de Bitcore Wallet Service (BWS). Debe recrearlo con la información local disponible.","Time":"Hora","To":"Para","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"Para restaurar el monedero <b>compartido</b> {{index.m}}-{{index.n}} necesitará","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"En la máxima medida permitida por la ley, este software se proporciona \"tal cual está\" y no asume la responsabilidad ni ofrece garantías de ningún tipo, expresa o implícita, incluyendo, pero no limitado a las garantías comerciales, de conveniencia o a un propósito particular.","too long!":"¡demasiado largo!","Total Locked Balance":"Balance Total Bloqueado","Total number of copayers":"Número total de copayers","Transaction":"Transacción","Transaction already broadcasted":"La transacción ya fue enviada","Transaction History":"Historial de Transacciones","Translation Credits":"Créditos de traducción","Translators":"Traductores","Try again":"Vuelva a intentarlo","Type the Seed Phrase (usually 12 words)":"Escriba la frase de la semilla (generalmente de 12 palabras)","Unable to send transaction proposal":"No se puede enviar la propuesta de transacción","Unconfirmed":"Sin confirmar","Unit":"Unidad","Unsent transactions":"Transacciones no enviadas","Updating transaction history. Please stand by.":"Actualizando el historial de transacciones. Por favor aguarde un momento.","Updating Wallet...":"Actualizando Monedero...","Use Unconfirmed Funds":"Utilizar los fondos sin confirmar","Username":"Nombre de usuario","Version":"Versión","View":"Ver","Waiting for copayers":"Esperando a los demás copayers","Waiting...":"Esperando...","Wallet already exists":"El monedero ya existe","Wallet Already Imported:":"Este monedero ya se ha importado:","Wallet already in Copay:":"El Monedero ya existe en Copay:","Wallet Configuration (m-n)":"Configuración del Monedero (m-n)","Wallet Export":"Exportar Monedero","Wallet Id":"Id del Monedero","Wallet incomplete and broken":"Monedero incompleto y roto","Wallet Information":"Información del Monedero","Wallet Invitation":"Invitación para unirse al monedero","Wallet Invitation is not valid!":"¡Invitación no válida!","Wallet is full":"El monedero está completo","Wallet is locked":"Monedero bloqueado","Wallet is not complete":"El monedero no esta completo","Wallet name":"Nombre del monedero","Wallet Name (at creation)":"Nombre del Monedero (al crear)","Wallet Network":"Red del Monedero","Wallet not found":"Monedero no encontrado","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Monedero no registrado en Wallet Service. Volver a \"Crear Monedero\", usando \"Opciones avanzadas\" para ingresar la semilla","Wallet Seed":"Semilla de Monedero","Wallet Seed could require a passphrase to be imported":"La Semilla del Monedero podría requerir una contraseña para ser importada","Wallet seed is invalid":"La semilla del monedero no es válida","Wallet seed not available. You can still export it from Advanced &gt; Export.":"La semilla del monedero no está disponible. Todavía puede exportar desde Avanzado &gt; Exportar.","Wallet service not found":"Wallet Service no encontrado","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ADVERTENCIA: No incluir la clave privada permite verificar el saldo del monedero, historial de transacciones y crear propuestas de gastos. Sin embargo, no permite aprobar propuestas (firmar), así que <b>los fondos no serán accesibles al exportar</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"ADVERTENCIA: No se puede recuperar esta contraseña. <b>Asegúrese de escribirla</b>. El monedero no puede ser restaurado sin esta contraseña.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ADVERTENCIA: La clave privada de este monedero no está disponible. La exportación permite verificar el saldo del monedero, historial de transacciones y crear propuestas de gastos en la exportación. Sin embargo, no permite aprobar propuestas (firmar), así que <b>los fondos no serán accesibles al exportar</b>.","Warning: this transaction has unconfirmed inputs":"Advertencia: esta operación tiene entradas sin confirmar","WARNING: UNTRUSTED CERTIFICATE":"ADVERTENCIA: NO ES DE CONFIANZA EL CERTIFICADO","WARNING: Wallet not registered":"ADVERTENCIA: Monedero no registrado","Warning!":"¡Advertencia!","We reserve the right to modify this disclaimer from time to time.":"Nos reservamos el derecho a modificar el presente aviso legal de vez en cuando.","WELCOME TO COPAY":"BIENVENIDO A COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"Mientras que el software ha experimentado pruebas en beta y aún sigue mejorando mediante la retroalimentación de la comunidad de desarrollador y usuarios de código abierto, no podemos garantizar que no habrá errores en el software.","Write your wallet seed":"Escriba la semilla de su monedero","Wrong number of seed words:":"Número incorrecto de palabras:","Wrong password":"Contraseña incorrecta","Yes":"Si","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"Usted reconoce que el uso de este software es bajo tu propia responsabilidad y en cumplimiento con todas las leyes aplicables.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"Usted es responsable de la custodia de sus contraseñas, pares de claves privadas, PIN y cualquier otro código que se utiliza para acceder al software.","You assume any and all risks associated with the use of the software.":"Usted asume todos los riesgos asociados con el uso del software.","You backed up your wallet. You can now restore this wallet at any time.":"Ya realizó una copia de seguridad de su monedero. Ahora puede restaurarlo en cualquier momento.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"Con seguridad puede instalar su monedero en otro dispositivo y usarlo desde varios dispositivos al mismo tiempo.","You do not have a wallet":"No tiene ningún monedero","You need the wallet seed to restore this personal wallet. Write it down and keep them somewhere safe.":"Necesita la semilla del monedero para restaurarlo. Anótela y guárdelas en un lugar seguro.","Your backup password":"Contraseña de la copia de seguridad","Your export password":"Contraseña al exportar","Your nickname":"Sobrenombre","Your password":"Contraseña","Your profile password":"Contraseña del perfil","Your wallet has been imported correctly":"El monedero se ha importado correctamente","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"La clave del monedero se cifrará. La contraseña no puede ser recuperada. Asegúrese de escribirla","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Semilla del monedero y acceso al servidor que coordina la creación del monedero inicial. Aún necesita las {{index.m}} claves para gastar los fondos."});
    gettextCatalog.setStrings('fr', {"(possible double spend)":"(double dépense éventuelle)","(Trusted)":"(Approuvé)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} seront déduits pour les frais de réseau Bitcoin","{{index.m}}-of-{{index.n}}":"{{index.m}}-sur-{{index.n}}","{{index.txProgress}} transactions downloaded":"{{index.txProgress}} transactions téléchargées","{{item.m}}-of-{{item.n}}":"{{item.m}}-sur-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} portefeuilles importés. L'analyse des fonds a démarré. Le solde va se mettre à jour","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Une proposition de paiement peut être supprimée si vous en êtes le créateur et qu'aucun des autres copayers n'a signé, ou si 24 heures sont passées depuis la création de la proposition.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>SI VOUS PERDEZ L'ACCÈS À VOTRE PORTEFEUILLE COPAY OU À VOS CLÉS PRIVÉES CHIFFRÉES ET QUE VOUS N'AVEZ PAS ENTREPOSÉ SÉPARÉMENT UNE SAUVEGARDE DE VOTRE PORTEFEUILLE ET LES MOTS DE PASSE CORRESPONDANT, VOUS RECONNAISSEZ ET ACCEPTEZ QUE LES BITCOINS QUE VOUS AVEZ ASSOCIÉ À CE PORTEFEUILLE COPAY DEVIENNENT INACCESSIBLES.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OU</b> 1 fichier d'exportation de portefeuille et le quorum restant en graines de portefeuilles (ex. dans un portefeuille 3-5 : 1 fichier d'exportation de portefeuille + 2 graines de portefeuilles de n'importe quels autres copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OU</b> la graine de portefeuille de <b>tous</b> les copayers dans le portefeuille","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OU</b> les graines de portefeuilles de <b>tous</b> les copayers dans le portefeuille","A multisignature bitcoin wallet":"Un portefeuille bitcoin multi-signatures","About Copay":"À propos de Copay","Accept":"Accepter","Account":"Compte","Account Number":"Numéro de compte","Activity":"Activité","Add a new entry":"Ajouter une nouvelle entrée","Add a Seed Passphrase":"Ajouter une phrase de passe de graine","Add an optional passphrase to secure the seed":"Ajoutez une phrase de passe optionnelle pour sécuriser la graine","Add wallet":"Ajouter portefeuille","Address":"Adresse","Address Type":"Type d'adresse","Advanced":"Paramètres avancés","Alias":"Alias","Alias for <i>{{index.walletName}}</i>":"Alias pour <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Toutes les contributions à la traduction de Copay sont les bienvenues. Inscrivez-vous sur crowdin.com et rejoignez le projet Copay sur","All transaction requests are irreversible.":"Toutes les transactions sont irréversibles.","Alternative Currency":"Devise alternative","Amount":"Montant","Amount below dust threshold":"Montant en dessous du seuil minimal recommandé","Amount in":"Montant en","Are you sure you want to delete the backup words?":"Êtes-vous sûr de vouloir supprimer les mots de sauvegarde ?","Are you sure you want to delete this wallet?":"Êtes-vous certain de vouloir supprimer ce portefeuille ?","Available Balance":"Solde disponible","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Temps de confirmation moyen : {{fee.nbBlocks * 10}} minutes","Back":"Retour","Backup":"Sauvegarder","Backup failed":"La sauvegarde a échoué","Backup Needed":"Sauvegarde nécessaire","Backup now":"Sauvegarder","Backup words deleted":"Mots de sauvegarde supprimés","Bad wallet invitation":"Mauvaise invitation de portefeuille","Balance By Address":"Solde par adresse","Before receiving funds, it is highly recommended you backup your wallet. If you lose this device, it is impossible to access your funds without a backup.":"Avant de recevoir des fonds, il est fortement recommandé de sauvegarder votre portefeuille. Si vous perdez cet appareil, il est impossible d'accéder à vos fonds sans une sauvegarde.","BIP32 path for address derivation":"Chemin BIP32 pour la dérivation de l'adresse","Bitcoin address":"Adresse Bitcoin","Bitcoin Network Fee Policy":"Stratégie des frais de réseau Bitcoin","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Les transactions Bitcoin peuvent inclure des frais prélevés par les mineurs du réseau. Plus les frais sont élevés, et plus un mineur sera incité à inclure cette transaction dans un bloc. Les frais actuels sont déterminés en fonction de la charge du réseau et de la stratégie sélectionnée.","Bitcoin URI is NOT valid!":"L'URI Bitcoin n'est pas valide !","Broadcast Payment":"Diffuser le paiement","Broadcasting Payment":"Diffusion du paiement","Broadcasting transaction":"Diffusion de la transaction","Browser unsupported":"Navigateur non supporté","Buy &amp; Sell Bitcoin":"Acheter &amp; Vendre des Bitcoins","Calculating fee":"Calcul des frais","Cancel":"Annuler","CANCEL":"ANNULER","Cannot join the same wallet more that once":"Impossible de rejoindre le même portefeuille plus d'une fois","Certified by":"Certifié par","Changing wallet alias only affects the local wallet name.":"La modification d'un alias de portefeuille affecte uniquement le nom du portefeuille local.","Choose a backup file from your computer":"Choisissez un fichier de sauvegarde depuis votre ordinateur","Clear cache":"Vider le cache","Close":"Fermer","Color":"Couleur","Commit hash":"Commit hash","Confirm":"Confirmer","Confirm your wallet seed":"Confirmez votre graine de portefeuille","Confirmations":"Confirmations","Congratulations!":"Félicitations !","Connecting to {{create.hwWallet}} Wallet...":"Connexion au portefeuille {{create.hwWallet}}...","Connecting to {{import.hwWallet}} Wallet...":"Connexion au portefeuille {{import.hwWallet}}...","Connecting to {{join.hwWallet}} Wallet...":"Connexion au portefeuille {{join.hwWallet}}...","Continue":"Continuer","Copayer already in this wallet":"Copayer déjà dans ce portefeuille","Copayer already voted on this spend proposal":"Le Copayer a déjà voté pour cette proposition de dépense","Copayer data mismatch":"Les données Copayer ne correspondent pas","Copayers":"Copayers","Copied to clipboard":"Copié dans le presse-papier","Copy this text as it is to a safe place (notepad or email)":"Copiez ce texte présenté tel quel vers un endroit sûr (bloc-notes ou e-mail)","Copy to clipboard":"Copier dans le presse-papier","Could not accept payment":"Impossible d'accepter le paiement","Could not access Wallet Service: Not found":"Impossible d'accéder au Wallet Service : Introuvable","Could not broadcast payment":"Impossible de diffuser le paiement","Could not calculate fee":"Impossible de calculer les frais","Could not create address":"Impossible de créer l'adresse","Could not create payment proposal":"Impossible de créer la proposition de paiement","Could not create using the specified extended private key":"Impossible de créer en utilisant la clé privée étendue spécifiée","Could not create using the specified extended public key":"Impossible de créer en utilisant la clé publique étendue spécifiée","Could not create: Invalid wallet seed":"Impossible de créer : Graine de portefeuille invalide","Could not decrypt":"Impossible de déchiffrer","Could not decrypt file, check your password":"Impossible de déchiffrer le fichier, vérifiez votre mot de passe","Could not delete payment proposal":"Impossible de supprimer la proposition de paiement","Could not fetch payment information":"Impossible de récupérer les informations de paiement","Could not import":"Impossible d'importer","Could not import. Check input file and password":"Impossible d'importer. Vérifiez le fichier d'entrée et le mot de passe","Could not join wallet":"Impossible de rejoindre le portefeuille","Could not recognize a valid Bitcoin QR Code":"Impossible de reconnaître un code QR Bitcoin valide","Could not reject payment":"Impossible de rejeter le paiement","Could not send payment":"Impossible d'envoyer le paiement","Could not update Wallet":"Impossible de mettre à jour le portefeuille","Create":"Créer","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Créer un portefeuille {{requiredCopayers}}-sur-{{totalCopayers}}","Create new wallet":"Créer","Create, join or import":"Créer, rejoindre ou importer","Created by":"Créée par","Creating transaction":"Création de la transaction","Creating Wallet...":"Création du portefeuille...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Frais actuels pour cette stratégie : {{fee.feePerKBUnit}}/kiB","Date":"Date","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Le déchiffrement d'un portefeuille de papier peut prendre environ 5 minutes sur cet appareil. Veuillez être patient et gardez l'application ouverte.","Delete it and create a new one":"Le supprimer et en créer un nouveau","Delete Payment Proposal":"Supprimer la proposition de paiement","Delete seed words":"Supprimer les mots de la graine","Delete wallet":"Supprimer le portefeuille","Delete Wallet":"Supprimer le portefeuille","Delete words":"Supprimer les mots","Deleting payment":"Suppression du paiement","Derivation Path":"Chemin de dérivation","Derivation Strategy":"Stratégie de dérivation","Details":"Détails","Disabled":"Désactivé","Do not include private key":"Ne pas inclure la clé privée","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Vous ne voyez pas votre langue sur Crowdin ? Contactez le propriétaire sur Crowdin ! Nous serions ravis de prendre en charge votre langue.","Done":"Terminé","Download":"Télécharger","Economy":"Économique","Edit":"Editer","Email":"E-mail","Email for wallet notifications":"E-mail pour les notifications de portefeuille","Email Notifications":"Notifications e-mail","Empty addresses limit reached. New addresses cannot be generated.":"La limite d'adresses vides a été atteinte. Les nouvelles adresses ne peuvent plus être générées.","Encrypted export file saved":"Le fichier d'exportation chiffré a été enregistré","Enter the seed words (BIP39)":"Écrivez les mots de la graine (BIP39)","Enter your passphrase":"Entrez votre phrase de passe","Enter your password":"Écrivez votre mot de passe","Error at Wallet Service":"Erreur au niveau de Wallet Service","Error creating wallet":"Erreur de création du portefeuille","Error importing wallet:":"Erreur d'importation du portefeuille :","Expires":"Expire","Export options":"Options d'exportation","Export to file":"Exporter vers un fichier","Export Wallet":"Exporter le portefeuille","Extended Public Keys":"Clés publiques étendues","Failed to export":"Impossible d'exporter","Failed to import wallets":"Impossible d'importer les portefeuilles","Failed to verify backup. Please check your information":"Impossible de vérifier la sauvegarde. Veuillez vérifier vos informations","Family vacation funds":"Fonds pour les vacances familiales","Fee":"Frais","Fetching Payment Information":"Récupération des informations de paiement","File/Text Backup":"Fichier/Texte","Finish":"Terminer","French":"Français","Funds are locked by pending spend proposals":"Les fonds sont verrouillés par des propositions de dépenses en attente","Funds found":"Fonds trouvés","Funds received":"Fonds reçus","Funds will be transferred to":"Les fonds seront transférés à","Generate new address":"Générer une nouvelle adresse","Generate QR Code":"Générer un code QR","Generating .csv file...":"Génération du fichier .csv...","German":"Allemand","Getting address for wallet {{selectedWalletName}} ...":"Obtention d'une adresse pour le portefeuille {{selectedWalletName}} ...","Global preferences":"Préférences globales","Greek":"Grec","Hardware wallet":"Portefeuille matériel","Have a Backup from Copay v0.9?":"Vous avez une sauvegarde de Copay v0.9 ?","Hide advanced options":"Masquer les options avancées","I affirm that I have read, understood, and agree with these terms.":"Je confirme que j'ai lu, compris et suis d'accord avec ces conditions.","I AGREE. GET STARTED":"J’ACCEPTE. COMMENCER","Import":"Importer","Import backup":"Importer la sauvegarde","Import from the Cloud?":"Importer depuis le Cloud ?","Import here":"Importer ici","Import wallet":"Importer","Importing wallet...":"Importation du portefeuille...","Importing...":"Importation...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"En aucun cas les auteurs du logiciel, employés et sociétés affiliés de Bitpay, détenteurs de droits d'auteur, ou BitPay, Inc. ne peuvent être tenus responsables de toute réclamation, dommages ou autre responsabilité, que ce soit dans une action contractuelle, délictuelle ou autre, découlant ou en étant en connexion avec le logiciel.","In order to verify your wallet backup, please type your passphrase:":"Afin de vérifier votre sauvegarde de portefeuille, veuillez saisir votre phrase de passe :","Include address book and history cache":"Inclure le répertoire et le cache de l'historique","Incorrect address network":"Adresse réseau incorrecte","Insufficient funds":"Fonds insuffisants","Insufficient funds for fee":"Fonds insuffisants pour les frais","Invalid":"Invalide","Invalid account number":"Numéro de compte invalide","Invalid address":"Adresse invalide","Invalid derivation path":"Chemin de dérivation invalide","Invalid Touch ID":"Touch ID invalide","Invitation to share a Copay Wallet":"Invitation pour partager un portefeuille Copay","Italian":"Italien","Japanese":"Japonais","John":"John","Join":"Rejoindre","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Rejoignez mon portefeuille Copay. Voici le code d'invitation : {{secret}} Vous pouvez télécharger Copay pour votre téléphone ou pour votre ordinateur sur https://copay.io","Join shared wallet":"Rejoindre","Joining Wallet...":"Connexion au portefeuille...","Key already associated with an existing wallet":"La clé est déjà associée avec un portefeuille existant","Label":"Étiquette","Language":"Langue","Last Wallet Addresses":"Dernières adresses du portefeuille","Learn more about Copay backups":"En savoir plus sur les sauvegardes de Copay","Learn more about Wallet Migration":"En savoir plus sur la migration de portefeuille","locked by pending payments":"verrouillés par les paiements en attente","Locktime in effect. Please wait to create a new spend proposal":"Locktime effectif. Veuillez patienter pour créer une nouvelle proposition de dépense","Locktime in effect. Please wait to remove this spend proposal":"Locktime effectif. Veuillez patienter pour supprimer cette proposition de dépense","Make a payment to":"Faire un paiement à","me":"moi","Me":"Moi","Memo":"Note","Merchant message":"Message marchand","Message":"Message","Moved":"Déplacé","Multiple recipients":"Plusieurs destinataires","My Bitcoin address":"Mon adresse Bitcoin","My contacts":"Mes contacts","My wallets":"Mes portefeuilles","Need to do backup":"Vous devez faire une sauvegarde","Network":"Réseau","Network connection error":"Erreur de connexion réseau","New Payment Proposal":"Nouvelle proposition de paiement","New Random Seed":"Nouvelle graine aléatoire","No hardware wallets supported on this device":"Aucun portefeuille matériel pris en charge sur cet appareil","No transactions yet":"Aucune transaction","Normal":"Normale","Not authorized":"Non autorisé","Not completed":"Inachevée","Not valid":"Non valide","Note":"Note","Official English Disclaimer":"Clause de non-responsabilité anglaise officielle","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Une fois que vous avez écrit votre graine de portefeuille, il est recommandé de la supprimer de cet appareil.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Seules les adresses principales (pas celles de change) sont indiquées. Les adresses sur cette liste n'ont pas été vérifiées localement à ce moment.","optional":"optionnelle","Paper Wallet Private Key":"Clé privée du portefeuille de papier","Participants":"Participants","Passphrase":"Phrase de passe","Password":"Mot de passe","Password needed":"Mot de passe nécessaire","Passwords do not match":"Le mot de passe ne correspond pas","Paste invitation here":"Collez l'invitation ici","Paste the backup plain text code":"Collez le code texte de sauvegarde","Paste your paper wallet private key here":"Collez ici votre clé privée du portefeuille de papier","Pay To":"Payer à","Payment Accepted":"Paiement accepté","Payment accepted, but not yet broadcasted":"Paiement accepté, mais pas encore diffusé","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Paiement accepté. Il sera diffusé par Glidera. Dans le cas où il y a un problème, il peut être supprimé 6 heures après avoir été créé.","Payment details":"Détails du paiement","Payment Proposal":"Proposition de paiement","Payment Proposal Created":"Proposition de paiement créée","Payment Proposal Rejected":"Proposition de paiement rejetée","Payment Proposal Rejected by Copayer":"Proposition de paiement rejetée par les Copayer","Payment Proposal Signed by Copayer":"Proposition de paiement signée par les Copayers","Payment Proposals":"Propositions de paiement","Payment Protocol Invalid":"Protocole de paiement invalide","Payment Protocol not supported on Chrome App":"Le protocole de paiement n'est pas supporté sur l'application Chrome","Payment Rejected":"Paiement rejeté","Payment request":"Demande de paiement","Payment Sent":"Paiement envoyé","Payment to":"Paiement à","Pending Confirmation":"Confirmations en attente","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Supprimer définitivement ce portefeuille.<br><b>CETTE ACTION NE PEUT PAS ÊTRE ANNULÉE</b>","Personal Wallet":"Portefeuille personnel","Please accept to export two public keys from the Trezor app":"Veuillez accepter d'exporter deux clés publiques depuis l'appli Trezor","Please enter the required fields":"Veuillez saisir les champs requis","Please enter the seed words":"Veuillez saisir les mots de la graine","Please enter the wallet seed":"Veuillez saisir la graine de portefeuille","Please tap the words in order to confirm your backup phrase is correctly written.":"Veuillez sélectionner les mots afin de confirmer que votre phrase de sauvegarde est correctement écrite.","Please upgrade Copay to perform this action":"Veuillez mettre à jour Copay pour effectuer cette action","Please, select your backup file":"Veuillez sélectionner votre fichier de sauvegarde","Portuguese":"Portugais","Preparing backup...":"Préparation de la sauvegarde...","Press again to exit":"Appuyez de nouveau pour quitter","Priority":"Prioritaire","QR Code":"Code QR","QR-Scanner":"QR-Scanner","Receive":"Recevoir","Received":"Reçus","Recipients":"Destinataire(s)","Reconnecting to Wallet Service...":"Reconnexion au service de portefeuille...","Recreate":"Recréer","Recreating Wallet...":"Recréation du portefeuille...","Reject":"Rejeter","Rejecting payment":"Rejet du paiement","Release Information":"Informations de version","Remove":"Supprimer","Repeat password":"Confirmez le mot de passe","Request a specific amount":"Demander un montant précis","Request Password":"Demander un mot de passe","Requesting Ledger Wallet to sign":"Demande de signature au portefeuille Ledger","Required":"Requis","Required number of signatures":"Nombre requis de signatures","Russian":"Russe","Save":"Enregistrer","Saving preferences...":"Enregistrement des préférences...","Scan addresses for funds":"Analyser les adresses pour des fonds","Scan Fingerprint":"Scanner l'empreinte digitale","Scan Finished":"Analyse terminée","Scan status finished with error":"Analyse terminée avec des erreurs","Scan Wallet Funds":"Analyser les fonds du portefeuille","Scan your fingerprint please":"Veuillez scanner votre empreinte digitale","Scanning wallet funds...":"Analyse des fonds du portefeuille...","Scanning Wallet funds...":"Analyse des fonds du portefeuille...","Security preferences":"Préférences de sécurité","See it on the blockchain":"Voir sur la chaîne de blocs","Seed passphrase":"Phrase de passe de la graine","Seed Passphrase":"Phrase de passe de la graine","Select a backup file":"Sélectionner un fichier de sauvegarde","Select a wallet":"Sélectionner un portefeuille","Self-signed Certificate":"Certificat auto-signé","Send":"Envoyer","Send addresses by email":"Envoyer les adresses par e-mail","Send All":"Tout envoyer","Send by email":"Envoyer par e-mail","Sending":"Envoi","Sending funds...":"Envoi des fonds...","Sent":"Envoyés","Server":"Serveur","Server response could not be verified":"La réponse du serveur n'a pas pu être vérifiée","Session log":"Journal de session","SET":"APPLIQUER","Set default url":"Définir l'url par défaut","Set up a password":"Spécifiez un mot de passe","Set up an Export Password":"Définir un mot de passe d'exportation","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Appliquer des notifications e-mail peut affaiblir votre vie privée si le fournisseur du service de portefeuille est compromis. Les informations disponibles à un attaquant incluent les adresses de votre portefeuille et leurs soldes, mais rien de plus.","Settings":"Paramètres","Share address":"Partager l'adresse","Share invitation":"Partager l'invitation","Share this invitation with your copayers":"Partagez cette invitation avec vos copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Partagez cette adresse de portefeuille pour recevoir des paiements. Pour protéger votre anonymat, de nouvelles adresses sont générées automatiquement une fois que vous les utilisez.","Shared Wallet":"Portefeuille partagé","Show advanced options":"Afficher les options avancées","Show all":"Tout montrer","Show Wallet Seed":"Afficher la graine de portefeuille","Signatures rejected by server":"Signatures rejetées par le serveur","Signing payment":"Signature du paiement","Spanish":"Espagnol","Specify Seed...":"Spécification de la graine...","Spend proposal is not accepted":"La proposition de dépense n'est pas acceptée","Spend proposal not found":"Propostion de dépense introuvable","Success":"Succès","Sweep paper wallet":"Balayer un portefeuille de papier","Sweep Wallet":"Balayer un portefeuille","Tap to retry":"Tapotez pour réessayer","Terms of Use":"Conditions d'utilisation","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"Les auteurs de ce logiciel, employés et sociétés affiliés à BitPay, détenteurs de droits d'auteur, et BitPay, Inc. ne peuvent pas récupérer vos clés privées ou mots de passe si vous les perdez et ne peuvent pas garantir la confirmation des transactions étant donné qu'ils n'ont pas de contrôle sur le réseau Bitcoin.","The Ledger Chrome application is not installed":"L'application Ledger pour Chrome n'est pas installée","The payment was created but could not be completed. Please try again from home screen":"Le paiement a été créé mais n'a pas pu être achevé. Veuillez réessayer depuis l'écran d'accueil","The payment was created but could not be signed. Please try again from home screen":"Le paiement a été créé mais n'a pas pu être signé. Veuillez réessayer depuis l'écran d'accueil","The payment was removed by creator":"Le paiement a été supprimé par le créateur","The payment was signed but could not be broadcasted. Please try again from home screen":"Le paiement a été signé mais ne peut pas être diffusé. Veuillez réessayer depuis l'écran d'accueil","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"La clé privée de ce portefeuille est chiffrée. L'exportation conserve le chiffrement dans l'archive exportée.","The seed could require a passphrase to be imported":"La graine pourrait exiger une phrase de passe pour être importée","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"Le logiciel ne constitue pas un compte où BitPay, ou des tiers, agissent comme des intermédiaires financiers ou dépositaires de vos bitcoins.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"Le logiciel que vous êtes sur le point d'utiliser fonctionne comme un portefeuille numérique gratuit, open source et multi-signatures.","The spend proposal is not pending":"La proposition de dépense n'est pas en attente","The wallet \"{{walletName}}\" was deleted":"Le portefeuille \"{{walletName}}\" a été supprimé","There are no wallets to make this payment":"Il n'y a pas de portefeuilles pour faire ce paiement","There is an error in the form":"Il y a une erreur dans la forme","This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"Cette graine a été créée avec une phrase de passe. Pour récupérer ce portefeuille, le mnémonique et la phrase de passe sont nécessaires.","This transaction has become invalid; possibly due to a double spend attempt.":"Cette transaction est devenue invalide ; il s'agit peut-être d'une tentative de double dépense.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Ce portefeuille n'est pas enregistré dans le Bitcore Wallet Service (BWS) donné. Vous pouvez le recréer depuis l'information locale.","Time":"Ancienneté","To":"À","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"Pour restaurer ce portefeuille <b>partagé</b> {{index.m}}-{{index.n}} vous aurez besoin de","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"Dans toute la mesure permise par la loi, ce logiciel est fourni “tel quel” et aucune représentation ou garantie ne peut être faite de toute nature, expresse ou implicite, y compris, mais sans s'y limiter, aux garanties de qualité marchande, à la conformité ou à un usage particulier et absent de contrefaçon.","too long!":"trop long !","Total Locked Balance":"Solde verrouillé total","Total number of copayers":"Nombre total de copayers","Transaction":"Transaction","Transaction already broadcasted":"Transaction déjà diffusée","Transaction History":"Historique des transactions","Translation Credits":"Crédits de traduction","Translators":"Traducteurs","Try again":"Réessayer","Type the Seed Phrase (usually 12 words)":"Tapez la phrase de graine (généralement de 12 mots)","Unable to send transaction proposal":"Impossible d'envoyer la proposition de transaction","Unconfirmed":"Non confirmée","Unit":"Unité","Unsent transactions":"Transactions non envoyées","Updating transaction history. Please stand by.":"Mise à jour de l'historique des transactions. Veuillez patienter.","Updating Wallet...":"Mise à jour du portefeuille...","Use Unconfirmed Funds":"Utiliser les fonds non confirmés","Username":"Nom d'utilisateur","Version":"Version","View":"Voir","Waiting for copayers":"Attente des copayers","Waiting...":"Attente...","Wallet already exists":"Le portefeuille existe déjà","Wallet Already Imported:":"Portefeuille déjà importé :","Wallet already in Copay:":"Portefeuille déjà existant dans Copay :","Wallet Configuration (m-n)":"Configuration du portefeuille (m-n)","Wallet Export":"Exportation du portefeuille","Wallet Id":"Id du portefeuille","Wallet incomplete and broken":"Portefeuille incomplet et cassé ","Wallet Information":"Informations du portefeuille","Wallet Invitation":"Invitation de portefeuille","Wallet Invitation is not valid!":"L'invitation de portefeuille n'est pas valide !","Wallet is full":"Le portefeuille est plein","Wallet is locked":"Le portefeuille est verrouillé","Wallet is not complete":"Le portefeuille n'est pas complet","Wallet name":"Nom du portefeuille","Wallet Name (at creation)":"Nom du portefeuille (à la création)","Wallet Network":"Réseau du portefeuille","Wallet not found":"Portefeuille introuvable","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Le portefeuille n'est pas enregistré au Wallet Service. Vous pouvez le recréer depuis « Créer » en utilisant les « Options avancées » pour appliquer votre graine","Wallet Seed":"Graine","Wallet Seed could require a passphrase to be imported":"La graine de portefeuille pourrait exiger une phrase de passe pour être importée","Wallet seed is invalid":"La graine de portefeuille est invalide","Wallet seed not available. You can still export it from Advanced &gt; Export.":"La graine de portefeuille n'est pas disponible. Vous pouvez toujours l'exporter depuis les Paramètres avancés &gt; Exporter.","Wallet service not found":"Wallet Service introuvable","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ATTENTION : Ne pas inclure la clé privée permet de vérifier le solde du portefeuille, l'historique des transactions, et de créer des demandes de dépenses depuis l'exportation. Cependant, cela ne permet pas d'approuver (signer) les propositions <b>et les fonds ne seront pas accessibles depuis l'exportation</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"ATTENTION : La phrase de passe ne peut être récupérée. <b>Veillez l'écrire sur papier</b>. Le portefeuille ne peut pas être restauré sans la phrase de passe.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ATTENTION : La clé privée de ce portefeuille n'est pas disponible. L'exportation permet de vérifier le solde du portefeuille, l'historique des transactions, et de créer des propositions de dépenses depuis l'exportation. Cependant, cela ne permet pas d'approuver (signer) les propositions <b>et les fonds ne seront pas accessibles depuis l'exportation</b>.","Warning: this transaction has unconfirmed inputs":"ATTENTION : Cette transaction a des entrées non confirmées","WARNING: UNTRUSTED CERTIFICATE":"ATTENTION : CERTIFICAT NON APPROUVÉ","WARNING: Wallet not registered":"ATTENTION : Portefeuille non enregistré","Warning!":"Attention !","We reserve the right to modify this disclaimer from time to time.":"Nous nous réservons le droit de modifier cette clause de non-responsabilité de temps à autre.","WELCOME TO COPAY":"BIENVENUE SUR COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"Bien que le logiciel ait subi des tests bêta et continue d'être amélioré par les retours d'utilisateurs et de développeurs de la communauté open source, nous ne pouvons pas garantir qu'il n'y aura plus de bugs dans le logiciel.","Write your wallet seed":"Écrivez votre graine de portefeuille","Wrong number of seed words:":"Nombre incorrect de mots de graine :","Wrong password":"Mauvais mot de passe","Yes":"Oui","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"Vous reconnaissez que votre utilisation de ce logiciel est à votre propre discrétion et est en conformité avec toutes les lois applicables.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"Vous êtes responsable de la sauvegarde de vos mots de passe, paires de clés privées, codes PIN et autres codes que vous utilisez pour accéder au logiciel.","You assume any and all risks associated with the use of the software.":"Vous assumez tous les risques associés à l'utilisation du logiciel.","You backed up your wallet. You can now restore this wallet at any time.":"Vous avez sauvegardé votre portefeuille. Vous pouvez maintenant restaurer ce portefeuille à n'importe quel moment.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"Vous pouvez installer en toute sécurité votre portefeuille sur un autre appareil et l'utiliser à partir de plusieurs périphériques en même temps.","You do not have a wallet":"Vous n'avez aucun portefeuille","You need the wallet seed to restore this personal wallet. Write it down and keep them somewhere safe.":"Vous avez besoin de la graine de portefeuille pour restaurer ce portefeuille personnel. Notez-la et conservez-la dans un endroit sûr.","Your backup password":"Votre mot de passe de sauvegarde","Your export password":"Votre mot de passe d'exportation","Your nickname":"Votre surnom","Your password":"Votre mot de passe","Your profile password":"Votre mot de passe de profil","Your wallet has been imported correctly":"Votre portefeuille a été correctement importé","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"La clé de votre portefeuille sera chiffrée. Le mot de passe ne peut pas être récupéré. N'oubliez pas de l'écrire","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Votre graine de portefeuille et l'accès au serveur qui a coordonné la création du portefeuille initial. Vous avez encore besoin de {{index.m}} clés pour dépenser."});
    gettextCatalog.setStrings('it', {"(possible double spend)":"(possibile doppia spesa)","(Trusted)":"(Fidato)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} verranno detratti come commissione del network","{{index.m}}-of-{{index.n}}":"{{index.m}}-di-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-di-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} portafogli importati. Scansione fondi in corso. Aspetta per vedere il bilancio aggiornato","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Una proposta di pagamento può essere eliminata se 1) Tu sei il creatore e nessun altro copayer ha firmato, oppure 2) Sono passate 24 ore da quando la proposta e' stata creata.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"Un portafoglio bitcoin multifirma","About Copay":"Circa Copay","Accept":"Accetta","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"Aggiungi un portafoglio","Address":"Indirizzo","Address Type":"Address Type","Advanced":"Avanzato","Advanced Send":"Invio Avanzato","Agree":"Acconsento","Alias for <i>{{index.walletName}}</i>":"Alias per <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Tutti i contributori alla traduzione di Copay sono i benvenuti. Iscriviti a crowdin e unisciti al progetto Copay presso","All transaction requests are irreversible.":"All transaction requests are irreversible.","Already have a wallet?":"Hai già un portafoglio?","Alternative Currency":"Valuta alternativa","Amount":"Ammontare","Amount below dust threshold":"Amount below dust threshold","Amount in":"Importo in","Applying changes":"Applicando le modifiche","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"Sei sicuro di voler eliminare questo portafoglio?","Available Balance":"Saldo disponibile","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Tempo medio di conferma: {{fee.nbBlocks * 10}} minuti","Back":"Indietro","Backup":"Backup","Backup now":"Esegui backup ora","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Invito al wallet non corretto","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"Prima di ricevere fondi, è altamente raccomandato eseguire il backup delle chiavi del portafoglio.","Bitcoin address":"Indirizzo Bitcoin","Bitcoin Network Fee Policy":"Criterio delle Commissioni del Bitcoin Network","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Le transazioni bitcoin possono includere una tassa raccolta dai minatori della rete. Più alto è il costo, maggiore sarà la possibilità di includere tale transazione in un blocco. Le tasse effettive sono determinate in base al carico della rete ed ai criteri selezionati.","Bitcoin URI is NOT valid!":"Il Bitcoin URI NON è valido!","Broadcast Payment":"Diffusione del Pagamento","Broadcasting Payment":"Diffondendo il Pagamento","Broadcasting transaction":"Diffondendo la transazione","Browser unsupported":"Browser non supportato","Cancel":"Annulla","CANCEL":"Annulla","Cannot join the same wallet more that once":"Non è possibile aggiungere un portafoglio più di una volta","Certified by":"Certificato da","Changing wallet alias only affects the local wallet name.":"Il cambiamento degli alias dei portafogli influenza solo il nome del portafoglio locale.","Choose a backup file from your computer":"Seleziona un file di backup dal tuo computer","Choose a wallet to send funds":"Seleziona un portafoglio per inviare fondi","Close":"Chiudi","Color":"Colore","Commit hash":"Commit hash","Confirm":"Conferma","Confirmations":"Conferme","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayer già in questo portafoglio","Copayer already voted on this spend proposal":"Copayer già votato su questa proposta","Copayer data mismatch":"Mancata corrispondenza dei dati del copayer","Copayers":"Copayers","Copied to clipboard":"Copiato negli appunti","Copy this text as it is to a safe place (notepad or email)":"Copia questo testo cosí com'è in un posto sicuro (blocco note o email)","Copy to clipboard":"Copia negli appunti","Could not accept payment":"Impossibile accettare il pagamento","Could not access Wallet Service: Not found":"Impossibile accedere al Wallet Service: non trovato","Could not broadcast payment":"Impossibile trasmettere il pagamento","Could not create address":"Impossibile creare un indirizzo","Could not create payment proposal":"Non posso creare la proposta di pagamento","Could not create using the specified extended private key":"Non posso crearlo utilizzando la chiave privata estesa specificata","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Impossibile decrittografare il file, controlla la tua password","Could not delete payment proposal":"Impossibile eliminare la proposta di pagamento","Could not fetch payment information":"Impossibile recuperare le informazioni di pagamento","Could not fetch transaction history":"Impossibile recuperare la cronologie delle transazioni","Could not import":"Could not import","Could not import. Check input file and password":"Impossibile importare. Verifica file importato e password","Could not join wallet":"Impossibile partecipare al portafoglio","Could not recognize a valid Bitcoin QR Code":"Impossibile riconoscere un Codice QR Bitcoin valido","Could not reject payment":"Impossibile rifiutare il pagamento","Could not send payment":"Impossibile inviare il pagamento","Could not update Wallet":"Impossibile aggiornare il Portafoglio","Create":"Crea","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Crea portafoglio {{requiredCopayers}}-di-{{totalCopayers}}","Create new wallet":"Crea nuovo portafoglio","Create, join or import":"Crea, partecipa o importa","Created by":"Creato da","Creating Profile...":"Creazione Profilo...","Creating transaction":"Creazione transazione","Creating Wallet...":"Creazione Portafoglio...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Tassa corrente per questa policy: {{fee.feePerKBUnit}}/kiB","Date":"Data","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"Eliminalo e creane uno nuovo","Delete Payment Proposal":"Elimina Proposta di Pagamento","Delete wallet":"Elimina portafoglio","Delete Wallet":"Elimina Portafoglio","DELETE WORDS":"DELETE WORDS","Deleting payment":"Eliminazione portafoglio","Derivation Strategy":"Derivation Strategy","Details":"Dettagli","Disabled":"Disabilitato","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Non vedi la tua lingua su Crowdin? Contatta il proprietario su Crowdin! Ci piacerebbe supportare la lingua.","Download":"Download","Download CSV file":"Scarica in formato CSV","Economy":"Economia","Email":"Email","Email for wallet notifications":"Email for wallet notifications","Email Notifications":"Notifiche Email","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"Inserisci la tua password","Error at Wallet Service":"Errore del Wallet Service","Error creating wallet":"Errore creazione portafoglio","Error importing wallet:":"Errore importazione portafoglio:","Expires":"Scadenza","Export":"Export","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"Impossibile importare portafogli","Family vacation funds":"Fondi vacanza di famiglia","Fee":"Tassa","Fee Policy":"Politica delle tasse","Fee policy for this transaction":"Commissioni per questa transazione","Fetching Payment Information":"Recuperando le informazioni del pagamento","File/Text Backup":"File/Text Backup","French":"Francese","Funds are locked by pending spend proposals":"I fondi sono bloccati in attesa della proposta di pagamento","Funds found":"Funds found","Funds received":"Fondi ricevuti","Funds will be transfered to":"Funds will be transfered to","Generate new address":"Genera un nuovo indirizzo","Generate QR Code":"Genera un codice QR","Generating .csv file...":"Genera un file .csv...","German":"Tedesco","GET STARTED":"INIZIA","Getting address for wallet {{selectedWalletName}} ...":"Ottengo l'indirizzo per il portafoglio {{selectedWalletName}}...","Global settings":"Impostazioni Globali","Go back":"Indietro","Greek":"Greco","Hardware wallet":"Hardware wallet","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Hai un Backup da Copay v0.9?","Hide advanced options":"Nascondi opzioni avanzate","Hide Wallet Seed":"Hide Wallet Seed","History":"Storico","Home":"Home","I affirm that I have read, understood, and agree with these terms.":"Affermo di aver letto, compreso e accettato questi termini.","Import":"Importa","Import backup":"Importa backup","Import from Ledger":"Import from Ledger","Import from the Cloud?":"Importare dal Cloud?","Import from TREZOR":"Import from TREZOR","Import here":"Importare qui","Import wallet":"Importa un portafoglio","Importing wallet...":"Importando il portafoglio...","Importing...":"Importando...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.","Incorrect address network":"Indirizzo della rete incorretto","Insufficient funds":"Fondi insufficienti","Insufficient funds for fee":"Fondi insufficienti per la commissione","Invalid":"Invalido","Invalid address":"Indirizzo non valido","Invitation to share a Copay Wallet":"Invito a condividere un portafoglio Copay","Italian":"Italiano","Japanese":"Giapponese","John":"John","Join":"Unisciti","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io","Join shared wallet":"Unisciti al portafoglio condiviso","Joining Wallet...":"Unendo al portafoglio...","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"Lingua","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"Ulteriori informazioni sulla migrazione di portafoglio","Loading...":"Loading...","locked by pending payments":"bloccati da pagamenti in sospeso","Locktime in effect. Please wait to create a new spend proposal":"Locktime in effetto. Si prega di attendere per creare una nuova proposta di pagamento","Locktime in effect. Please wait to remove this spend proposal":"Locktime in effetto. Si prega di attendere per rimuovere questa proposta di pagamento","Make a payment to":"Effettuare un pagamento a","me":"me","Me":"Io","Memo":"Nota","Merchant message":"Messaggio commerciale","Message":"Messaggio","More":"Di più","Moved":"Spostato","Multisignature wallet":"Portafoglio Multi-firma","My Bitcoin address":"Il mio indirizzo Bitcoin","Network":"Network","Network connection error":"Errore di connessione alla rete","New Payment Proposal":"Nuova proposta di pagamento","No Private key":"Nessuna chiave privata","No transactions yet":"Ancora nessuna transazione","Normal":"Normale","Not authorized":"Non autorizzato","Not valid":"Non valido","Note":"Nota","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"opzionale","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"Partecipanti","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Password","Password needed":"Password necessaria","Passwords do not match":"Le passwords non corrispondono","Paste invitation here":"Incolla qui l'invito","Paste the backup plain text code":"Incolla qui il codice di backup","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Paga A","Payment Accepted":"Pagamento Accettato","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Dettagli pagamento","Payment Proposal":"Proposta di Pagamento","Payment Proposal Created":"Proposta di Pagamento Creata","Payment Proposal Rejected":"Proposta di Pagamento Rifiutata","Payment Proposal Rejected by Copayer":"Proposta di Pagamento Rifiutata dai Copayers","Payment Proposal Signed by Copayer":"Proposta di Pagamento Firmata dai Copayers","Payment Proposals":"Proposte di Pagamento","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Proposta di Pagamento non supportata dall'applicazione Chrome","Payment rejected":"Payment rejected","Payment Rejected":"Pagamento Rifiutato","Payment request":"Richiesta di pagamento","Payment sent":"Payment sent","Payment Sent":"Pagamento Inviato","Payment to":"Pagamento a","Pending Confirmation":"In attesa di conferma","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Elimina definitivamente questo portafoglio. QUESTA AZIONE NON PUO' ESSERE INVERTITA","Personal Wallet":"Portafoglio Personale","Please enter the required fields":"Per favore completa i campi richiesti","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Si prega di aggiornare Copay per eseguire questa azione","Please, select your backup file":"Per favore, selezione il tuo file di backup","Portuguese":"Portoghese","Preferences":"Preferenze","Preparing backup...":"Preparando il backup...","Priority":"Priorità","QR Code":"Codice QR","QR-Scanner":"QR-Scanner","Receive":"Ricevi","Received":"Ricevuti","Recipients":"Destinatari","Reconnecting to Wallet Service...":"Riconnessione al Servizio Portafoglio...","Recreate":"Ricrea","Recreating Wallet...":"Ricreando Portafoglio...","Reject":"Rifiuta","Rejecting payment":"Rifiutando il pagamento","Release Information":"Informazioni Release","Repeat password":"Ripeti password","Request a specific amount":"Richiedi un importo specifico","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Richiesto","Required number of signatures":"Required number of signatures","Retrying...":"Sto riprovando...","Russian":"Russo","Save":"Salva","Saving preferences...":"Sto salvando le preferenze...","Scan addresses for funds":"Scansione degli indirizzi per fondi","Scan Finished":"Scansione terminata","Scan status finished with error":"La scansione è terminata con un errore","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Scansione fondi Portafoglio...","See it on the blockchain":"Guardala nella blockchain","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Seleziona un file di backup","Select a wallet":"Selezionare un portafoglio","Self-signed Certificate":"Self-signed Certificate","Send":"Invia","Send All":"Invia tutto","Send all by email":"Send all by email","Send by email":"Invia via email","Sending funds...":"Sending funds...","Sent":"Inviato","Server":"Server","Server response could not be verified":"Server response could not be verified","Session log":"Registro sessione","SET":"IMPOSTA","Set up a Export Password":"Set up a Export Password","Set up a password":"Imposta una password","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Impostando le notifiche e-mail potrebbe indebolire la tua privacy se il provider di servizio del portafoglio è compromesso. Le informazioni disponibili ad un utente malintenzionato potrebbero includere l'indirizzo del tuo portafoglio e il suo saldo, ma non di più.","settings":"impostazioni","Share address":"Condividi l'indirizzo","Share invitation":"Condividi l'invito","Share this invitation with your copayers":"Condividi questo invito con i tuoi copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Condividi questo indirizzo del portafoglio per ricevere pagamenti. Per proteggere la tua privacy, ad ogni utilizzo sono generati nuovi indirizzi.","Shared Wallet":"Portafoglio Condiviso","Show advanced options":"Mostra opzioni avanzate","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Firme rifiutate dal server","Signing payment":"Sto firmando il pagamento","SKIP BACKUP":"SALTA BACKUP","Spanish":"Spagnolo","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"La proposta di pagamento non è accettata","Spend proposal not found":"Proposta di pagamento non trovata","Still not done":"Still not done","Success":"Completato","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Tocca per riprovare","Terms of Use":"Termini di Utilizzo","Testnet":"Testnet","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"Il pagamento è stato creato ma è stato impossibile completarlo. Per favore prova di nuovo dalla schermata iniziale","The payment was created but could not be signed. Please try again from home screen":"Il pagamento è stato creato ma è stato impossibile firmarlo. Per favore prova di nuovo dalla schermata iniziale","The payment was removed by creator":"Il pagamento è stato rimosso dal creatore","The payment was signed but could not be broadcasted. Please try again from home screen":"Il pagamento è stato firmato ma non è stato possibile trasmetterlo. Per favore prova di nuovo dalla schermata principale","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"The software you are about to use functions as a free, open source, and multi-signature digital wallet.","The spend proposal is not pending":"La proposta di pagamento non è in sospeso","The wallet \"{{walletName}}\" was deleted":"Il portafoglio {{walletName}} è stato eliminato","There are no wallets to make this payment":"Non ci sono portafogli per effettuare questo pagamento","There is an error in the form":"C'è un errore nel form","This transaction has become invalid; possibly due to a double spend attempt.":"Questa transazione è diventata invalida; forse a causa di un tentativo di doppia spesa.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Questo portafoglio non è registrato al Bitcore Wallet Service (BWS). Puoi ricrearlo dalle informazioni locali.","Time":"Tempo","To":"A","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.","too long!":"troppo lungo!","Total":"Totale","Total Locked Balance":"Totale Importo Bloccato","Total number of copayers":"Total number of copayers","Transaction":"Transazione","Transaction already broadcasted":"Transazione già trasmessa","Translation Credits":"Ringraziamenti per la traduzione","Translators":"Traduttori","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Impossibile inviare la proposta di transazione","Unconfirmed":"Non confermato","Unit":"Unità","Unsent transactions":"Transazioni non inviate","Updating Wallet...":"Aggiornamento portafoglio...","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Usa i fondi non confermati","Username":"Username","Version":"Versione","View":"View","Waiting for copayers":"In attesa di copayers","Waiting...":"In attesa...","Wallet":"Wallet","Wallet Alias":"Alias Portafoglio","Wallet already exists":"Il portafoglio esiste già","Wallet Already Imported:":"Portafoglio già importato:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Portafoglio incompleto e danneggiato","Wallet Information":"Wallet Information","Wallet Invitation":"Invito Portafoglio","Wallet Invitation is not valid!":"Invito Portafoglio non valido!","Wallet is full":"Portafoglio è pieno","Wallet is not complete":"Portafoglio non è completo","Wallet name":"Nome Portafoglio","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Portafoglio non trovato","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Wallet service non trovato","WARNING: Backup needed":"AVVISO: Backup necessario","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Attenzione: questa transazione ha inputs non confermati","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"AVVISO: Portafoglio non registrato","Warning!":"Attenzione!","We reserve the right to modify this disclaimer from time to time.":"We reserve the right to modify this disclaimer from time to time.","WELCOME TO COPAY":"BENVENUTO A COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"Password sbagliata","Yes":"Sì","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.","You assume any and all risks associated with the use of the software.":"You assume any and all risks associated with the use of the software.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"Non hai un portafoglio","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"La tua password di backup","Your export password":"Your export password","Your nickname":"Il tuo nickname","Your password":"La tua password","Your profile password":"La tua password del profilo","Your wallet has been imported correctly":"Il tuo portafoglio è stato importato correttamente","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('ja', {"(possible double spend)":"(二重払い可能性あり)","(Trusted)":"(信頼済み)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} のビットコインネットワーク手数料が差し引かれます。","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{index.txProgress}} transactions downloaded":"{{index.txProgress}} 個の取引ダウンロード済み","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} 個のウォレットをインポートしました。残高照会中のため、少々お待ち下さい。","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* 送金の提案の取下げは①他のウォレット参加者に署名されていなかった場合、提案者に提案を取り下げることができます。②提案の起案から24時間が経っても解決しなかった場合、全員に取り下げることができます。","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>Copayウォレットとその中にある秘密鍵の情報を紛失してしまい、尚且つバックアップが無い、若しくはそのバックアップを暗号化した際のパスワードが分からないなどの状況に陥ってしまえば、そのウォレットに含まれた全てのビットコインが永久送金不可能となってしまうことを認識し、同意するものとします。</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>または</b> 従来ウォレットエクスポートファイル１つに加えて残りの必須人数の復元フレーズ (例： 3-of-5 ウォレットでは従来ウォレットバックアップ１つに加え、他の参加者２人分の復元フレーズさえあればウォレットは復元できます)","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>または</b> 参加者 <b>全員</b> のウォレット復元フレーズ","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>または</b> 参加者 <b>全員</b> のウォレット復元フレーズ","A multisignature bitcoin wallet":"マルチシグネチャビットコインウォレット","About Copay":"Copayについて","Accept":"承諾","Account":"ポケット","Account Number":"ポケット番号","Activity":"履歴","Add a new entry":"新規追加","Add a Seed Passphrase":"復元フレーズ用のパスワードを追加","Add an optional passphrase to secure the seed":"フレーズを守るために任意のパスワードをかけて下さい","Add wallet":"ウォレットを追加","Address":"アドレス","Address Type":"アドレスの種類","Advanced":"上級者向け","Alias":"通称","Alias for <i>{{index.walletName}}</i>":"<i>{{index.walletName}}</i> の通称設定","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Copayの翻訳は簡単に投稿することができます。crowdin.comのアカウント作成の後、自由にご参加いただけるプロジェクトページはこちら","All transaction requests are irreversible.":"署名が完了してしまった取引は取り消しが不可能となります。","Alternative Currency":"表示通貨","Amount":"金額","Amount below dust threshold":"最小送金額を下回っています。","Amount in":"換算済金額","Are you sure you want to delete the backup words?":"復元フレーズを削除してもよろしいですか？","Are you sure you want to delete this wallet?":"本当にこのウォレットを削除しても\n宜しいですか？","Available Balance":"送金可能残高","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"承認までの時間(平均)： {{fee.nbBlocks * 10}} 分","Back":"戻る","Backup":"バックアップ","Backup failed":"バックアップ失敗","Backup Needed":"要バックアップ","Backup now":"今すぐバックアップ","Backup words deleted":"復元フレーズを削除しました。","Bad wallet invitation":"不正なウォレット招待コード","Balance By Address":"アドレスごとの残高","Before receiving funds, it is highly recommended you backup your wallet. If you lose this device, it is impossible to access your funds without a backup.":"お金を受け取る前に、このウォレットのバックアップを取っておくことを強く推奨します。一ウォレットごとにバックアップは一回です。バックアップを取らないまま、この端末が紛失・故障されてしまったら全残高が消失されてしまいます。","BIP32 path for address derivation":"階級アドレス派生のパス","Bitcoin address":"ビットコインアドレス","Bitcoin Network Fee Policy":"ビットコインネットワークの手数料設定","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"円滑な送金をしていただくために、ビットコインの送金には少量の手数料を付けることが義務付けられております。この手数料はビットコインのネットワークを運用する人たちに寄付され、より高い手数料であればより優先的にブロックに含まれ、承認されます。選択された手数料基準やネットワークの混雑状況により、実際に払われる手数料が変動することがあります。","Bitcoin URI is NOT valid!":"Bitcoin URI が無効です！","Broadcast Payment":"取引送信","Broadcasting Payment":"取引送信中","Broadcasting transaction":"取引送信中","Browser unsupported":"ブラウザ未対応","Buy &amp; Sell Bitcoin":"ビットコインの購入&amp;売却","Cancel":"キャンセル","CANCEL":"キャンセル","Cannot join the same wallet more that once":"同じ端末で同じウォレットに複数回参加することができません。","Certified by":"証明元：","Changing wallet alias only affects the local wallet name.":"ウォレット通称を変更しても、この端末でしか変わりません。","Choose a backup file from your computer":"パソコンからバックアップファイルを選択して下さい。","Clear cache":"キャッシュを消去","Close":"閉じる","Color":"色","Commit hash":"コミットのハッシュ値","Confirm":"確認","Confirm your wallet seed":"復元フレーズを確認","Confirmations":"承認回数","Congratulations!":"おめでとうございます！","Connecting to {{create.hwWallet}} Wallet...":"{{create.hwWallet}} Wallet に接続中…","Connecting to {{import.hwWallet}} Wallet...":"{{import.hwWallet}} Wallet に接続中…","Connecting to {{join.hwWallet}} Wallet...":"{{join.hwWallet}} Wallet に接続中…","Continue":"続ける","Copayer already in this wallet":"ウォレット参加者が既に存在しています。","Copayer already voted on this spend proposal":"ウォレット参加者が既に送金の提案の意思表明をしています。","Copayer data mismatch":"ウォレット参加者のデータ不整合","Copayers":"ウォレット参加者","Copied to clipboard":"クリップボードにコピーしました","Copy this text as it is to a safe place (notepad or email)":"このテキストを安全な場所に貼り付けて保管して下さい (メモ帳やメールの下書きなど)","Copy to clipboard":"クリップボードへコピー","Could not accept payment":"送金を承認できませんでした。","Could not access Wallet Service: Not found":"Wallet Serviceにアクセスできませんでした: 見つかりません","Could not broadcast payment":"送金を配信できませんでした。","Could not create address":"アドレスを生成できませんでした。","Could not create payment proposal":"送金の提案を作成できませんでした","Could not create using the specified extended private key":"指定された拡張秘密鍵で作成できませんでした。","Could not create using the specified extended public key":"指定された拡張公開鍵で作成できませんでした。","Could not create: Invalid wallet seed":"作成できません：ウォレットの復元フレーズが不正です。","Could not decrypt":"解読できませんでした","Could not decrypt file, check your password":"複合化できませんでした。パスワードが正しいかご確認下さい。","Could not delete payment proposal":"送金の提案を削除できませんでした","Could not fetch payment information":"支払い情報が取得できませんでした。","Could not import":"インポートできませんでした。","Could not import. Check input file and password":"インポートできませんでした。入力ファイルとパスワードが正しいかご確認下さい。","Could not join wallet":"ウォレットに参加できませんでした。","Could not recognize a valid Bitcoin QR Code":"有効なビットコインQRコードが認識できませんでした。","Could not reject payment":"送金を却下できませんでした。","Could not send payment":"送金できませんでした。","Could not update Wallet":"ウォレットが更新できませんでした。","Create":"作成","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"{{requiredCopayers}}-of-{{totalCopayers}} ウォレットを作成","Create new wallet":"新規ウォレット作成","Create, join or import":"作成、参加、インポート","Created by":"作成者","Creating transaction":"取引作成中…","Creating Wallet...":"ウォレット作成中…","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"この手数料基準の現レート： {{fee.feePerKBUnit}}/kiB","Date":"日付","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"暗号化されたペーパーウォレットはこの端末だと解読に5分以上掛かる場合がございます。アプリを閉じたり他のアプリに切り替えたりせずに、終了するまでそのままお待ち下さい。","Delete it and create a new one":"削除して新規作成","Delete Payment Proposal":"送金の提案を削除","Delete seed words":"復元フレーズの単語を削除する","Delete wallet":"ウォレットを削除","Delete Wallet":"ウォレットを削除","Delete words":"単語データを削除する","Deleting payment":"取引削除中…","Derivation Path":"派生パス","Derivation Strategy":"派生パス","Details":"詳細","Disabled":"無効","Do not include private key":"秘密鍵を含めない","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"ご自分の言語はCrowdinで見当たりませんか？Crowdinの管理者に連絡とってみてください。是非とも対応したく思っております。","Done":"完了","Download":"ダウンロード","Economy":"節約","Edit":"編集","Email":"メールアドレス","Email for wallet notifications":"メールによるウォレットのお知らせ","Email Notifications":"メールのお知らせ","Empty addresses limit reached. New addresses cannot be generated.":"未使用アドレスを生成しすぎたため、これ以上アドレスを生成することができません。","Encrypted export file saved":"暗号化されたバックアップ保存しました","Enter the seed words (BIP39)":"復元フレーズの単語をご入力下さい。","Enter your passphrase":"復元フレーズ用のパスワードを入力して下さい","Enter your password":"パスワードを入力して下さい。","Error at Wallet Service":"Wallet Serviceにてエラー","Error creating wallet":"ウォレット作成時にエラー","Error importing wallet:":"ウォレットインポート時にエラー：","Expires":"有効期限：","Export options":"エクスポート設定","Export to file":"ファイルへのエクスポート","Export Wallet":"ウォレットをエクスポート","Extended Public Keys":"拡張公開鍵","Failed to export":"エクスポートに失敗しました。","Failed to import wallets":"ウォレットのインポート失敗しました","Failed to verify backup. Please check your information":"バックアップを確認できませんでした。転記した情報をご確認ください。","Family vacation funds":"家族旅行貯金","Fee":"手数料","Fetching Payment Information":"支払い情報要求しています…","File/Text Backup":"ファイル/テキストのバックアップから","Finish":"完了","French":"フランス語","Funds are locked by pending spend proposals":"協議中の送金の提案により、資金がロックされています。","Funds found":"残高がありました","Funds received":"着金あり","Funds will be transferred to":"送金先","Generate new address":"新規アドレスを生成","Generate QR Code":"QRコードを生成","Generating .csv file...":"CSVファイル作成中…","German":"ドイツ語","Getting address for wallet {{selectedWalletName}} ...":"「{{selectedWalletName}}」のアドレスを取得中…","Global preferences":"アプリ設定","Greek":"ギリシャ語","Hardware wallet":"ハードウェアウォレット","Have a Backup from Copay v0.9?":"Copay v0.9 のバックアップをお持ちですか？","Hide advanced options":"詳細設定を非表示","I affirm that I have read, understood, and agree with these terms.":"内容をよく読み、理解し、同意します。","I AGREE. GET STARTED":"同意して始めます","Import":"インポート","Import backup":"バックアップをインポート","Import from the Cloud?":"クラウドからのインポートを行いますか？","Import here":"ここでインポート","Import wallet":"ウォレットをインポート","Importing wallet...":"ウォレットインポート中…","Importing...":"インポート中…","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"和訳は簡単な要約と考えて下さい。","In order to verify your wallet backup, please type your passphrase:":"ウォレットのバックアップを確認するためには、復元フレーズ用のパスワードをご入力下さい。","Include address book and history cache":"アドレス帳と履歴のキャッシュを含める","Incorrect address network":"アドレスのネットワークが不正です。","Insufficient funds":"残高不足","Insufficient funds for fee":"手数料付けるには残高が足りません","Invalid":"無効","Invalid account number":"無効なポケット番号です。","Invalid address":"不正アドレス","Invalid derivation path":"無効な派生パス","Invalid Touch ID":"認証できませんでした","Invitation to share a Copay Wallet":"Copay共有ウォレットへの招待","Italian":"イタリア語","Japanese":"日本語","John":"山田太郎","Join":"参加","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Copayの共有ウォレット作りました： {{secret}} この招待コードを入力して、ウォレットに参加して下さい。アプリのダウンロードは https://copay.io にてどうぞ！","Join shared wallet":"共有ウォレットに参加","Joining Wallet...":"ウォレット参加中…","Key already associated with an existing wallet":"この鍵は既存のウォレットにて登録されています","Label":"ラベル","Language":"言語設定","Last Wallet Addresses":"最新ウォレットアドレス","Learn more about Copay backups":"Copay のバックアップの種類について","Learn more about Wallet Migration":"ウォレット移行について詳しく","locked by pending payments":"未対応送金の提案によりロック中","Locktime in effect. Please wait to create a new spend proposal":"Locktime待ち中です。新しい送金の提案が作成できるまであとしばらくお待ち下さい。","Locktime in effect. Please wait to remove this spend proposal":"Locktime待ち中です。この送金の提案が削除できるまであとしばらくお待ち下さい。","Make a payment to":"支払いは次の宛先へ","me":"自分","Me":"自分","Memo":"メモ","Merchant message":"お店からのメッセージ：","Message":"メッセージ","Moved":"移動済","Multiple recipients":"複数送金先","My Bitcoin address":"私のビットコインアドレス：","My contacts":"連絡先","My wallets":"アプリ内ウォレット","Need to do backup":"バックアップを行う必要があります。","Network":"ネットワーク","Network connection error":"ネットワーク接続エラー","New Payment Proposal":"新しい送金の提案","New Random Seed":"新規フレーズ作成","No hardware wallets supported on this device":"この端末ではハードウェアウォレットがサポートされていません","No transactions yet":"取引がありません","Normal":"通常","Not authorized":"権限がありません。","Not completed":"未完了","Not valid":"無効です","Note":"メモ","Official English Disclaimer":"公式免責事項 (英語)","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"復元フレーズを控えたら、このデバイスから削除することをおすすめします。","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"受け取り用のアドレスしか表示していません。現時点ではローカルの端末ではアドレスの正確性を二重確認していなくて、サーバーを信じる必要があります。","optional":"任意","Paper Wallet Private Key":"ペーパーウォレット秘密鍵","Participants":"参加者","Passphrase":"パスワード","Password":"パスワード","Password needed":"パスワードが必要","Passwords do not match":"パスワードが一致しません","Paste invitation here":"招待コードをこちらへ貼り付けて下さい","Paste the backup plain text code":"バックアップの文字をここに貼り付けて下さい","Paste your paper wallet private key here":"ペーパーウォレットの秘密鍵をここに貼り付けて下さい","Pay To":"支払い先","Payment Accepted":"支払いが完了しました","Payment accepted, but not yet broadcasted":"取引が承認されましたが、まだ送信していません。","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"取引が承認されました。Glideraより送信されます。問題があった場合、送金命令を出す６時間以内に取り消すことができます。","Payment details":"支払いの詳細","Payment Proposal":"送金の提案","Payment Proposal Created":"送金の提案が作成されました","Payment Proposal Rejected":"送金の提案が却下されました","Payment Proposal Rejected by Copayer":"送金の提案が他の参加者によって却下されました。","Payment Proposal Signed by Copayer":"送金の提案が他の参加者によって署名されました。","Payment Proposals":"送金の提案","Payment Protocol Invalid":"ペイメントプロトコルが不正です。","Payment Protocol not supported on Chrome App":"クロームのアプリではペイメントプロトコールがサポートされていません。","Payment Rejected":"送金が却下されました","Payment request":"支払い請求","Payment Sent":"送金が完了しました","Payment to":"支払い先","Pending Confirmation":"承認待ち","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"永久にこのウォレットを削除します。\n二度と取り戻せない行為ですのどご注意下さい。","Personal Wallet":"個人用ウォレット","Please accept to export two public keys from the Trezor app":"Trezorアプリにて承諾してください。公開鍵が二つがTrezorデバイスよりインポートされます。","Please enter the required fields":"必須項目をご入力下さい","Please enter the seed words":"復元フレーズをご入力下さい","Please enter the wallet seed":"シード(復元)フレーズをご入力下さい","Please tap the words in order to confirm your backup phrase is correctly written.":"正しい順番に単語をタップして、ちゃんと書き留めてあることをご確認下さい。","Please upgrade Copay to perform this action":"この操作を実行するにはCopayを最新バージョンに更新してください","Please, select your backup file":"バックアップファイルを選択","Portuguese":"ポルトガル語","Preparing backup...":"バックアップを準備中...","Press again to exit":"もう一度押して終了","Priority":"優先","QR Code":"QRコード","QR-Scanner":"QRコードを読み取って下さい","Receive":"受取","Received":"受取済み","Recipients":"受取人","Reconnecting to Wallet Service...":"Wallet Serviceへ再接続しています…","Recreate":"再登録","Recreating Wallet...":"ウォレットを再作成中…","Reject":"却下","Rejecting payment":"送金の提案却下中","Release Information":"リリース情報","Remove":"削除","Repeat password":"パスワードを再入力","Request a specific amount":"指定金額を要求","Request Password":"パスワードをリクエスト","Requesting Ledger Wallet to sign":"Ledger Walletに署名を要求しています。","Required":"入力必須","Required number of signatures":"必要な署名の数を選択","Russian":"ロシア語","Save":"保存","Saving preferences...":"設定を保存中…","Scan addresses for funds":"アドレスの残高照会","Scan Fingerprint":"指紋スキャン","Scan Finished":"スキャン完了","Scan status finished with error":"スキャンがエラーに終わりました","Scan Wallet Funds":"ウォレット残高照会","Scan your fingerprint please":"指紋をスキャンしてください","Scanning wallet funds...":"ウォレット残高照会中…","Scanning Wallet funds...":"ウォレット残高照会中…","Security preferences":"セキュリティ設定","See it on the blockchain":"ブロックチェーンで詳細を閲覧","Seed passphrase":"復元フレーズ用のパスワード","Seed Passphrase":"復元フレーズ用のパスワード","Select a backup file":"バックアップファイルを選択","Select a wallet":"ウォレットを選択","Self-signed Certificate":"自己署名証明書","Send":"送信","Send addresses by email":"ビットコインアドレスをメールにて共有","Send All":"全額を送金","Send by email":"メールで送信","Sending":"送信中","Sending funds...":"送金中...","Sent":"送金済み","Server":"サーバー","Server response could not be verified":"サーバーからの返答を検証できませんでした","Session log":"セッションのログ","SET":"指定","Set default url":"デフォルトURLに設定","Set up a password":"パスワードを設定","Set up an Export Password":"バックアップ用のパスワードを設定","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"メールのお知らせを有効にすると、悪意のあるサーバー運用者ならあなたの全てのアドレスとそれぞれの残高・履歴情報が把握できプライバシーの侵害に繋がる可能性があります。","Settings":"設定","Share address":"アドレスを共有","Share invitation":"招待コードを共有","Share this invitation with your copayers":"ウォレット参加���に\nこの招待コードを\n送って下さい。","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"これを人に共有することでビットコインを送ってもらうことができます。プライバシー向上の観点から、アドレスが1回でも使用されたら新しいアドレスが自動生成されます。","Shared Wallet":"共有ウォレットに参加","Show advanced options":"詳細設定を表示","Show all":"すべて表示","Show Wallet Seed":"ウォレットの復元フレーズを表示","Signatures rejected by server":"サーバーより署名が却下されました。","Signing payment":"送金の提案署名中","Spanish":"スペイン語","Specify Seed...":"フレーズ指定…","Spend proposal is not accepted":"送金の提案が受諾されませんでした。","Spend proposal not found":"送金の提案が見つかりませんでした。","Success":"成功","Sweep paper wallet":"ペーパーウォレットの全残高インポート","Sweep Wallet":"ウォレットの全残高インポート","Tap to retry":"タップしてやり直し","Terms of Use":"利用規約","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"このソフトの開発者、BitPayの従業員とその関係者、著作権所有者、BitPay, Inc. 自体もパスワード・秘密鍵・パスワードなどへのアクセスが不可能なため、教えることがだきません、なお、ビットコインのネットワークへの影響が無いので、取引の取り消しや優先的な承認などはできません。","The Ledger Chrome application is not installed":"Ledgerのクロームアプリがインストールされていません。","The payment was created but could not be completed. Please try again from home screen":"送金の提案は作成されましたが完了できませんでした。ホーム画面からやり直して下さい。","The payment was created but could not be signed. Please try again from home screen":"送金の提案は作成されましたが署名できませんでした。ホーム画面からやり直して下さい。","The payment was removed by creator":"送金の提案が作成者により削除されました","The payment was signed but could not be broadcasted. Please try again from home screen":"送金の提案は署名されましたが送信できませんでした。ホーム画面からやり直して下さい。","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"このウォレットの秘密鍵が暗号化されています。バックアップをエクスポートすると秘密鍵が暗号化された状態でバックアップアーカイブとして守られます。","The seed could require a passphrase to be imported":"復元フレーズにパスワードをかけた場合、ここにパスワードを入力して下さい。","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"BitPay, Inc. 若しくはその他の第三者がアクセス権限を管理する、若しくはデジタル資産の代理保管を行うサービスではありません。","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"当ソフトウェアは無料のオープンソースプロジェクトで、マルチシグネチャを用いるデジタルウォレットです。","The spend proposal is not pending":"送金の提案が協議中ではありません。","The wallet \"{{walletName}}\" was deleted":"ウォレット \"{{walletName}}\" が削除されました","There are no wallets to make this payment":"送金可能なウォレットがありません","There is an error in the form":"フォームにエラーがありました","This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"この復元フレーズにパスワードがかかっています。このウォレットを復元するためには、復元フレーズに加え、パスワードも必要です。","This transaction has become invalid; possibly due to a double spend attempt.":"この取引が無効になりました。二重払いの可能性があります。","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"現在設定中のBitcore Wallet Service (BWS) サーバーにて、このウォレットの登録がありません。再登録を行うこともできます。","Time":"時刻","To":"宛先","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"この {{index.m}}-of-{{index.n}} <b>共有</b>ウォレットを復元するに必要なものは","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"このソフトはそのままの提供となり、このソフトの利用に関わるあらゆる責任とリスクを自己責任で被り、利用するものとし、いかなる損害が発生しても、このソフトの開発者、BitPayの従業員とその関係者、著作権所有者、BitPay, Inc. 自体も責任を求めることは無いと誓います。","too long!":"長すぎます！","Total Locked Balance":"ロック中の残高","Total number of copayers":"参加人数を選択して下さい。","Transaction":"取引","Transaction already broadcasted":"取引は既に配信されました。","Transaction History":"取引履歴","Translation Credits":"翻訳ボランティアの皆さん","Translators":"翻訳者","Try again":"もう一度やり直してください。","Type the Seed Phrase (usually 12 words)":"復元フレーズの単語 (通常 12 個) を入力して下さい。","Unable to send transaction proposal":"取引提案を送れませんでした。","Unconfirmed":"未承認","Unit":"単位","Unsent transactions":"未送信取引","Updating transaction history. Please stand by.":"取引履歴を更新します。しばらくお待ちください。","Updating Wallet...":"ウォレット更新中…","Use Unconfirmed Funds":"未承認ビットコインを使用","Username":"ユーザー名","Version":"バージョン","View":"表示","Waiting for copayers":"ウォレット参加者を待っています","Waiting...":"少々お待ち下さい…","Wallet already exists":"既存のウォレットです","Wallet Already Imported:":"ウォレットがすでにインポート済み：","Wallet already in Copay:":"Copay内の既存のウォレットです","Wallet Configuration (m-n)":"ウォレット構成 (m-of-n)","Wallet Export":"ウォレットのエクスポート","Wallet Id":"ウォレットID","Wallet incomplete and broken":"ウォレットが未完成で破損しています","Wallet Information":"ウォレット詳細","Wallet Invitation":"ウォレット招待","Wallet Invitation is not valid!":"ウォレット招待コードが無効です！","Wallet is full":"ウォレットがいっぱいです。","Wallet is locked":"ウォレットがロックされています。","Wallet is not complete":"ウォレットが未完成です。","Wallet name":"ウォレット名","Wallet Name (at creation)":"ウォレット名 (作成時)","Wallet Network":"ウォレットのネットワーク","Wallet not found":"ウォレットが見つかりません。","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"このウォレットは Wallet Service にて登録されていません。再び「新規作成」メニューから詳細設定を選び、復元フレーズをご入力下さい。","Wallet Seed":"ウォレットの復元フレーズ","Wallet Seed could require a passphrase to be imported":"復元フレーズにパスワードをかけることができるのでかけてある場合はインポート時に必要です。","Wallet seed is invalid":"ウォレットシードが不正です。","Wallet seed not available. You can still export it from Advanced &gt; Export.":"ウォレットの復元フレーズがありません。バックアップファイルの作成は「上級者向け」⇒「エクスポート」からアクセスできます。","Wallet service not found":"Wallet serviceが見つかりません。","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"注意：このウォレットは秘密鍵がありません。残高の確認、取引履歴の確認、送金の提案ができます。しかし、<b>送金の提案を承諾 (署名) できません</b>。","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"注意：パスワードを復元することができませんしリセットできません。<b>絶対に忘れないようにしてください。</b>パスワードなしにこのバックアップファイルを復元することはできません。","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"注意：このウォレットは秘密鍵がありません。残高の確認、取引履歴の確認、送金の提案ができます。しかし、<b>送金の提案を承諾 (署名) できません</b>。","Warning: this transaction has unconfirmed inputs":"注意: この取引は未承認資金が含まれており、承認されるまで商品等をお渡しするのを待つことをお勧めします。","WARNING: UNTRUSTED CERTIFICATE":"警告: 信頼されていない証明書","WARNING: Wallet not registered":"注意：ウォレットが未登録","Warning!":"注意！","We reserve the right to modify this disclaimer from time to time.":"下記に英語の規約がありますので、英語が理解できる方は是非熟読して下さい。","WELCOME TO COPAY":"ようこそ COPAY へ","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"このソフトは長いテスト期間を経てリリースしましたが、今後バグや不具合が見つからないという保障はございません。","Write your wallet seed":"復元フレーズを書き留めて下さい","Wrong number of seed words:":"単語の数が間違っています：","Wrong password":"不正なパスワード","Yes":"はい","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"この規約に同意することで、自己責任で利用するものとし、このソフトを用いてお住まいの地域の法令の違反はしないことを意味します。","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"このソフトを正常に利用するために必要なパスワード、秘密鍵、暗証番号などの秘密情報は自己責任で管理するものとします。","You assume any and all risks associated with the use of the software.":"この規約の言葉や表現のニュアンスによる解釈が必要となった場合、規約の元である英語のものを正とします。","You backed up your wallet. You can now restore this wallet at any time.":"新しいウォレットを正常にバックアップできました。いつでもこのウォレットが復元できます。","You can safely install your wallet on another device and use it from multiple devices at the same time.":"安全にウォレットを別のデバイスにインポートして、同じウォレットを複数の端末でご利用いただけます。","You do not have a wallet":"ウォレットがありません","You need the wallet seed to restore this personal wallet. Write it down and keep them somewhere safe.":"この個人用ウォレットを復元するには復元フレーズが必要です。紙などに書き留めておき、安全な場所で保管して下さい。","Your backup password":"バックアップパスワード","Your export password":"バックアップパスワード","Your nickname":"自分のハンドルネーム","Your password":"パスワード","Your profile password":"プロフィールパスワード","Your wallet has been imported correctly":"ウォレットが正常にインポートされました。","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"ウォレットの鍵が暗号化されます。Copayではパスワードをリセットしてくれる機能がありませんので、パスワードを忘れないよう、控えておいて下さい。","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"ウォレットの復元フレーズとそのウォレットが登録してあるサーバーへのアクセスが最低条件です。ただし、送金完了させるにはまだ {{index.m}} 個の鍵が他の参加者の間で持っていないといけませんので、他の参加者のバックアップも合わせてご確認下さい。"});
    gettextCatalog.setStrings('ko', {"(possible double spend)":"(이중 사용 가능성 있음)","(Trusted)":"(Trusted)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} will be deducted for bitcoin networking fees","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} 개의 지갑을 가져왔습니다. 잔액을 조회하고 있습니다. 갱신된 잔액을 확인하려면 기다려 주세요","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* 지불제안은 다음 조건이 만족할 때 지울 수 있습니다. 1) 당신이 작성자이고, 다른 지갑 참여자가 사인하지 않았을 때, 또는 2) 제안이 작성된 지 24시간 이상이 지났을 때.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"다중서명 비트코인 지갑","About Copay":"Copay에 대하여","Accept":"승인","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"지갑 추가","Address":"주소","Address Type":"Address Type","Advanced":"고급","Advanced Send":"Advanced Send","Agree":"동의","Alias for <i>{{index.walletName}}</i>":"<i>{{index.walletName}}</i>의 별명","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at","All transaction requests are irreversible.":"All transaction requests are irreversible.","Already have a wallet?":"이미 지갑을 가지고 있나요?","Alternative Currency":"표시 통화","Amount":"금액","Amount below dust threshold":"Amount below dust threshold","Amount in":"Amount in","Applying changes":"변경 사항 적용 중","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"정말로 지갑을 삭제하시겠습니까?","Available Balance":"사용 가능한 잔액","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Average confirmation time: {{fee.nbBlocks * 10}} minutes","Back":"뒤로","Backup":"백업","Backup now":"지금 백업","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Bad wallet invitation","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"비트코인을 받기 전에 지갑의 키를 백업하길 강력히 권장합니다.","Bitcoin address":"비트코인 주소","Bitcoin Network Fee Policy":"비트코인 네트워크 수수료 설정","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.","Bitcoin URI is NOT valid!":"비트코인 URI가 유효하지 않습니다!","Broadcast Payment":"Broadcast Payment","Broadcasting Payment":"결제 전송 중","Broadcasting transaction":"Broadcasting transaction","Browser unsupported":"지원되지 않는 브라우저","Cancel":"취소","CANCEL":"취소","Cannot join the same wallet more that once":"Cannot join the same wallet more that once","Certified by":"Certified by","Changing wallet alias only affects the local wallet name.":"Changing wallet alias only affects the local wallet name.","Choose a backup file from your computer":"컴퓨터에서 백업 파일을 골라주세요","Choose a wallet to send funds":"돈을 보낼 지갑을 선택해주세요","Close":"닫기","Color":"색상","Commit hash":"커밋 해시","Confirm":"Confirm","Confirmations":"승인횟수","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayer already in this wallet","Copayer already voted on this spend proposal":"Copayer already voted on this spend proposal","Copayer data mismatch":"Copayer data mismatch","Copayers":"Copayers","Copied to clipboard":"Copied to clipboard","Copy this text as it is to a safe place (notepad or email)":"이 텍스트를 있는 그대로 복사해두세요(메모장이나 이메일등으로)","Copy to clipboard":"클립보드에 복사","Could not accept payment":"Could not accept payment","Could not access Wallet Service: Not found":"Could not access Wallet Service: Not found","Could not broadcast payment":"Could not broadcast payment","Could not create address":"Could not create address","Could not create payment proposal":"Could not create payment proposal","Could not create using the specified extended private key":"Could not create using the specified extended private key","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Could not decrypt file, check your password","Could not delete payment proposal":"Could not delete payment proposal","Could not fetch payment information":"Could not fetch payment information","Could not fetch transaction history":"거래내역을 가져올 수 없습니다","Could not import":"Could not import","Could not import. Check input file and password":"가져올 수 없습니다. 파일과 패스워드를 확인해 주세요","Could not join wallet":"Could not join wallet","Could not recognize a valid Bitcoin QR Code":"유효한 비트코인 QR코드를 인식할 수 없었습니다","Could not reject payment":"Could not reject payment","Could not send payment":"Could not send payment","Could not update Wallet":"지갑을 업데이트할 수 없습니다","Create":"작성","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"{{requiredCopayers}}-of-{{totalCopayers}} 지갑 만들기","Create new wallet":"새로운 지갑 만들기","Create, join or import":"만들기, 참가하기, 불러오기","Created by":"작성자","Creating Profile...":"프로필 만드는 중..","Creating transaction":"Creating transaction","Creating Wallet...":"지갑 만드는 중...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB","Date":"날짜","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"이 지갑을 삭제하고 새로운 지갑 만들기","Delete Payment Proposal":"지불제안 삭제","Delete wallet":"지갑 삭제","Delete Wallet":"지갑 삭제","DELETE WORDS":"DELETE WORDS","Deleting payment":"Deleting payment","Derivation Strategy":"Derivation Strategy","Details":"상세","Disabled":"Disabled","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.","Download":"Download","Download CSV file":"CSV 파일 다운로드","Economy":"Economy","Email":"Email","Email for wallet notifications":"Email for wallet notifications","Email Notifications":"이메일 알림","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"패스워드를 입력해주세요","Error at Wallet Service":"Error at Wallet Service","Error creating wallet":"지갑 생성 중 오류","Error importing wallet:":"지갑 가져오는 중 오류","Expires":"Expires","Export":"Export","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"지갑 가져오기 실패","Family vacation funds":"가족 휴가 자금","Fee":"수수료","Fee Policy":"Fee Policy","Fee policy for this transaction":"Fee policy for this transaction","Fetching Payment Information":"Fetching Payment Information","File/Text Backup":"File/Text Backup","French":"French","Funds are locked by pending spend proposals":"Funds are locked by pending spend proposals","Funds found":"Funds found","Funds received":"Funds received","Funds will be transfered to":"Funds will be transfered to","Generate new address":"새로운 주소 생성","Generate QR Code":"Generate QR Code","Generating .csv file...":".csv 파일 생성중...","German":"German","GET STARTED":"시작하기","Getting address for wallet {{selectedWalletName}} ...":"'{{selectedWalletName}}' 지갑의 주소 얻는 중...","Global settings":"전역 설정","Go back":"뒤로 가기","Greek":"Greek","Hardware wallet":"Hardware wallet","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Copay v0.9용 백업을 가지고 계신가요?","Hide advanced options":"Hide advanced options","Hide Wallet Seed":"Hide Wallet Seed","History":"내역","Home":"홈","I affirm that I have read, understood, and agree with these terms.":"I affirm that I have read, understood, and agree with these terms.","Import":"가져오기","Import backup":"백업 가져오기","Import from Ledger":"Import from Ledger","Import from the Cloud?":"클라우드에서 가져올까요?","Import from TREZOR":"Import from TREZOR","Import here":"Import here","Import wallet":"지갑 가져오기","Importing wallet...":"지갑 가져오는 중...","Importing...":"가져오는 중...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.","Incorrect address network":"Incorrect address network","Insufficient funds":"Insufficient funds","Insufficient funds for fee":"Insufficient funds for fee","Invalid":"Invalid","Invalid address":"Invalid address","Invitation to share a Copay Wallet":"Invitation to share a Copay Wallet","Italian":"Italian","Japanese":"Japanese","John":"John","Join":"참가","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io","Join shared wallet":"공유지갑에 참가","Joining Wallet...":"지갑에 참가하는 중...","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"언어","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"지갑 이동에 대해 더 알아보기","Loading...":"Loading...","locked by pending payments":"locked by pending payments","Locktime in effect. Please wait to create a new spend proposal":"Locktime in effect. Please wait to create a new spend proposal","Locktime in effect. Please wait to remove this spend proposal":"Locktime in effect. Please wait to remove this spend proposal","Make a payment to":"Make a payment to","me":"me","Me":"나","Memo":"메모","Merchant message":"Merchant message","Message":"메시지","More":"More","Moved":"Moved","Multisignature wallet":"다중서명 지갑","My Bitcoin address":"나의 비트코인 주소","Network":"네트워크","Network connection error":"Network connection error","New Payment Proposal":"새 지불제안","No Private key":"No Private key","No transactions yet":"No transactions yet","Normal":"Normal","Not authorized":"Not authorized","Not valid":"Not valid","Note":"메모","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"선택사항","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"참가자","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Password","Password needed":"비밀번호가 필요합니다","Passwords do not match":"비밀번호가 일치하지 않습니다","Paste invitation here":"Paste invitation here","Paste the backup plain text code":"Paste the backup plain text code","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Pay To","Payment Accepted":"Payment Accepted","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Payment details","Payment Proposal":"지불제안","Payment Proposal Created":"Payment Proposal Created","Payment Proposal Rejected":"Payment Proposal Rejected","Payment Proposal Rejected by Copayer":"Payment Proposal Rejected by Copayer","Payment Proposal Signed by Copayer":"Payment Proposal Signed by Copayer","Payment Proposals":"지불제안","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Payment Protocol not supported on Chrome App","Payment rejected":"Payment rejected","Payment Rejected":"Payment Rejected","Payment request":"Payment request","Payment sent":"Payment sent","Payment Sent":"Payment Sent","Payment to":"Payment to","Pending Confirmation":"Pending Confirmation","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED","Personal Wallet":"Personal Wallet","Please enter the required fields":"Please enter the required fields","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Please upgrade Copay to perform this action","Please, select your backup file":"Please, select your backup file","Portuguese":"Portuguese","Preferences":"Preferences","Preparing backup...":"Preparing backup...","Priority":"Priority","QR Code":"QR코드","QR-Scanner":"QR스캐너","Receive":"Receive","Received":"Received","Recipients":"Recipients","Reconnecting to Wallet Service...":"Reconnecting to Wallet Service...","Recreate":"Recreate","Recreating Wallet...":"Recreating Wallet...","Reject":"거절","Rejecting payment":"Rejecting payment","Release Information":"Release Information","Repeat password":"패스워드 다시 입력","Request a specific amount":"Request a specific amount","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Required","Required number of signatures":"Required number of signatures","Retrying...":"다시 시도 중...","Russian":"Russian","Save":"Save","Saving preferences...":"Saving preferences...","Scan addresses for funds":"Scan addresses for funds","Scan Finished":"Scan Finished","Scan status finished with error":"Scan status finished with error","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Scanning Wallet funds...","See it on the blockchain":"블록체인에서 보기","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"백업 파일 선택","Select a wallet":"Select a wallet","Self-signed Certificate":"Self-signed Certificate","Send":"Send","Send All":"Send All","Send all by email":"Send all by email","Send by email":"Send by email","Sending funds...":"Sending funds...","Sent":"Sent","Server":"서버","Server response could not be verified":"Server response could not be verified","Session log":"세션 로그","SET":"SET","Set up a Export Password":"Set up a Export Password","Set up a password":"패스워드 설정","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.","settings":"설정","Share address":"Share address","Share invitation":"Share invitation","Share this invitation with your copayers":"Share this invitation with your copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.","Shared Wallet":"공유 지갑","Show advanced options":"Show advanced options","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Signatures rejected by server","Signing payment":"Signing payment","SKIP BACKUP":"백업 건너뛰기","Spanish":"Spanish","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"Spend proposal is not accepted","Spend proposal not found":"Spend proposal not found","Still not done":"Still not done","Success":"성공","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Tap to retry","Terms of Use":"이용약관","Testnet":"Testnet","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"The payment was created but could not be completed. Please try again from home screen","The payment was created but could not be signed. Please try again from home screen":"The payment was created but could not be signed. Please try again from home screen","The payment was removed by creator":"The payment was removed by creator","The payment was signed but could not be broadcasted. Please try again from home screen":"The payment was signed but could not be broadcasted. Please try again from home screen","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"The software you are about to use functions as a free, open source, and multi-signature digital wallet.","The spend proposal is not pending":"The spend proposal is not pending","The wallet \"{{walletName}}\" was deleted":"The wallet \"{{walletName}}\" was deleted","There are no wallets to make this payment":"There are no wallets to make this payment","There is an error in the form":"There is an error in the form","This transaction has become invalid; possibly due to a double spend attempt.":"This transaction has become invalid; possibly due to a double spend attempt.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.","Time":"시간","To":"To","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.","too long!":"너무 깁니다!","Total":"Total","Total Locked Balance":"Total Locked Balance","Total number of copayers":"Total number of copayers","Transaction":"Transaction","Transaction already broadcasted":"Transaction already broadcasted","Translation Credits":"Translation Credits","Translators":"Translators","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Unable to send transaction proposal","Unconfirmed":"Unconfirmed","Unit":"단위","Unsent transactions":"Unsent transactions","Updating Wallet...":"Updating Wallet...","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Use Unconfirmed Funds","Username":"Username","Version":"버전","View":"View","Waiting for copayers":"Waiting for copayers","Waiting...":"대기 중...","Wallet":"Wallet","Wallet Alias":"지갑 별명","Wallet already exists":"이미 존재하는 지갑입니다","Wallet Already Imported:":"이미 가져온 지갑:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Wallet incomplete and broken","Wallet Information":"Wallet Information","Wallet Invitation":"지갑 초대","Wallet Invitation is not valid!":"지갑 초대가 유효하지 않습니다!","Wallet is full":"Wallet is full","Wallet is not complete":"Wallet is not complete","Wallet name":"지갑 이름","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Wallet not found","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Wallet service not found","WARNING: Backup needed":"경고: 백업이 필요합니다","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Warning: this transaction has unconfirmed inputs","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"WARNING: Wallet not registered","Warning!":"경고!","We reserve the right to modify this disclaimer from time to time.":"We reserve the right to modify this disclaimer from time to time.","WELCOME TO COPAY":"WELCOME TO COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"잘못된 비밀번호","Yes":"Yes","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.","You assume any and all risks associated with the use of the software.":"You assume any and all risks associated with the use of the software.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"지갑이 없습니다","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"백업 패스워드","Your export password":"Your export password","Your nickname":"당신의 닉네임","Your password":"당신의 비밀번호","Your profile password":"프로필 패스워드","Your wallet has been imported correctly":"지갑을 정상적으로 가져왔습니다","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('nl', {"(possible double spend)":"(mogelijk dubbel besteed)","(Trusted)":"(Trusted)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} will be deducted for bitcoin networking fees","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Een betalingsvoorstel kan worden verwijderd als 1) u de aanmaker bent, en geen andere medebetaler heeft ondertekend, of 2) 24 uur zijn verstreken sinds het voorstel werd aangemaakt.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"A multisignature bitcoin wallet","About Copay":"About Copay","Accept":"Accept","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"Add wallet","Address":"Address","Address Type":"Address Type","Advanced":"Advanced","Advanced Send":"Advanced Send","Agree":"Agree","Alias for <i>{{index.walletName}}</i>":"Alias for <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at","All transaction requests are irreversible.":"All transaction requests are irreversible.","Already have a wallet?":"Already have a wallet?","Alternative Currency":"Alternative Currency","Amount":"Amount","Amount below dust threshold":"Amount below dust threshold","Amount in":"Amount in","Applying changes":"Applying changes","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"Are you sure you want to delete this wallet?","Available Balance":"Available Balance","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Average confirmation time: {{fee.nbBlocks * 10}} minutes","Back":"Back","Backup":"Backup","Backup now":"Backup now","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Bad wallet invitation","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"Before receiving funds, it is highly recommended you backup your wallet keys.","Bitcoin address":"Bitcoin address","Bitcoin Network Fee Policy":"Bitcoin Network Fee Policy","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.","Bitcoin URI is NOT valid!":"Bitcoin URI is NOT valid!","Broadcast Payment":"Broadcast Payment","Broadcasting Payment":"Broadcasting Payment","Broadcasting transaction":"Broadcasting transaction","Browser unsupported":"Browser unsupported","Cancel":"Cancel","CANCEL":"CANCEL","Cannot join the same wallet more that once":"Cannot join the same wallet more that once","Certified by":"Certified by","Changing wallet alias only affects the local wallet name.":"Changing wallet alias only affects the local wallet name.","Choose a backup file from your computer":"Choose a backup file from your computer","Choose a wallet to send funds":"Choose a wallet to send funds","Close":"Close","Color":"Color","Commit hash":"Commit hash","Confirm":"Confirm","Confirmations":"Confirmations","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayer already in this wallet","Copayer already voted on this spend proposal":"Copayer already voted on this spend proposal","Copayer data mismatch":"Copayer data mismatch","Copayers":"Copayers","Copied to clipboard":"Copied to clipboard","Copy this text as it is to a safe place (notepad or email)":"Copy this text as it is to a safe place (notepad or email)","Copy to clipboard":"Copy to clipboard","Could not accept payment":"Could not accept payment","Could not access Wallet Service: Not found":"Could not access Wallet Service: Not found","Could not broadcast payment":"Could not broadcast payment","Could not create address":"Could not create address","Could not create payment proposal":"Could not create payment proposal","Could not create using the specified extended private key":"Could not create using the specified extended private key","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Could not decrypt file, check your password","Could not delete payment proposal":"Could not delete payment proposal","Could not fetch payment information":"Could not fetch payment information","Could not fetch transaction history":"Could not fetch transaction history","Could not import":"Could not import","Could not import. Check input file and password":"Could not import. Check input file and password","Could not join wallet":"Could not join wallet","Could not recognize a valid Bitcoin QR Code":"Could not recognize a valid Bitcoin QR Code","Could not reject payment":"Could not reject payment","Could not send payment":"Could not send payment","Could not update Wallet":"Could not update Wallet","Create":"Create","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Create {{requiredCopayers}}-of-{{totalCopayers}} wallet","Create new wallet":"Create new wallet","Create, join or import":"Create, join or import","Created by":"Created by","Creating Profile...":"Creating Profile...","Creating transaction":"Creating transaction","Creating Wallet...":"Creating Wallet...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB","Date":"Date","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"Delete it and create a new one","Delete Payment Proposal":"Delete Payment Proposal","Delete wallet":"Delete wallet","Delete Wallet":"Delete Wallet","DELETE WORDS":"DELETE WORDS","Deleting payment":"Deleting payment","Derivation Strategy":"Derivation Strategy","Details":"Details","Disabled":"Disabled","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.","Download":"Download","Download CSV file":"Download CSV file","Economy":"Economy","Email":"Email","Email for wallet notifications":"Email for wallet notifications","Email Notifications":"Email Notifications","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"Enter your password","Error at Wallet Service":"Error at Wallet Service","Error creating wallet":"Error creating wallet","Error importing wallet:":"Error importing wallet:","Expires":"Expires","Export":"Export","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"Failed to import wallets","Family vacation funds":"Family vacation funds","Fee":"Fee","Fee Policy":"Fee Policy","Fee policy for this transaction":"Fee policy for this transaction","Fetching Payment Information":"Fetching Payment Information","File/Text Backup":"File/Text Backup","French":"French","Funds are locked by pending spend proposals":"Funds are locked by pending spend proposals","Funds found":"Funds found","Funds received":"Funds received","Funds will be transfered to":"Funds will be transfered to","Generate new address":"Generate new address","Generate QR Code":"Generate QR Code","Generating .csv file...":"Generating .csv file...","German":"German","GET STARTED":"GET STARTED","Getting address for wallet {{selectedWalletName}} ...":"Getting address for wallet {{selectedWalletName}} ...","Global settings":"Global settings","Go back":"Go back","Greek":"Greek","Hardware wallet":"Hardware wallet","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Have a Backup from Copay v0.9?","Hide advanced options":"Hide advanced options","Hide Wallet Seed":"Hide Wallet Seed","History":"History","Home":"Home","I affirm that I have read, understood, and agree with these terms.":"I affirm that I have read, understood, and agree with these terms.","Import":"Import","Import backup":"Import backup","Import from Ledger":"Import from Ledger","Import from the Cloud?":"Import from the Cloud?","Import from TREZOR":"Import from TREZOR","Import here":"Import here","Import wallet":"Import wallet","Importing wallet...":"Importing wallet...","Importing...":"Importing...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.","Incorrect address network":"Incorrect address network","Insufficient funds":"Insufficient funds","Insufficient funds for fee":"Insufficient funds for fee","Invalid":"Invalid","Invalid address":"Invalid address","Invitation to share a Copay Wallet":"Invitation to share a Copay Wallet","Italian":"Italian","Japanese":"Japanese","John":"John","Join":"Join","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io","Join shared wallet":"Join shared wallet","Joining Wallet...":"Joining Wallet...","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"Language","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"Learn more about Wallet Migration","Loading...":"Loading...","locked by pending payments":"locked by pending payments","Locktime in effect. Please wait to create a new spend proposal":"Locktime in effect. Please wait to create a new spend proposal","Locktime in effect. Please wait to remove this spend proposal":"Locktime in effect. Please wait to remove this spend proposal","Make a payment to":"Make a payment to","me":"me","Me":"Me","Memo":"Memo","Merchant message":"Merchant message","Message":"Message","More":"More","Moved":"Moved","Multisignature wallet":"Multisignature wallet","My Bitcoin address":"My Bitcoin address","Network":"Network","Network connection error":"Network connection error","New Payment Proposal":"New Payment Proposal","No Private key":"No Private key","No transactions yet":"No transactions yet","Normal":"Normal","Not authorized":"Not authorized","Not valid":"Not valid","Note":"Note","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"optional","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"Participants","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Password","Password needed":"Password needed","Passwords do not match":"Passwords do not match","Paste invitation here":"Paste invitation here","Paste the backup plain text code":"Paste the backup plain text code","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Pay To","Payment Accepted":"Payment Accepted","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Payment details","Payment Proposal":"Payment Proposal","Payment Proposal Created":"Payment Proposal Created","Payment Proposal Rejected":"Payment Proposal Rejected","Payment Proposal Rejected by Copayer":"Payment Proposal Rejected by Copayer","Payment Proposal Signed by Copayer":"Payment Proposal Signed by Copayer","Payment Proposals":"Payment Proposals","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Payment Protocol not supported on Chrome App","Payment rejected":"Payment rejected","Payment Rejected":"Payment Rejected","Payment request":"Payment request","Payment sent":"Payment sent","Payment Sent":"Payment Sent","Payment to":"Payment to","Pending Confirmation":"Pending Confirmation","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED","Personal Wallet":"Personal Wallet","Please enter the required fields":"Please enter the required fields","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Please upgrade Copay to perform this action","Please, select your backup file":"Please, select your backup file","Portuguese":"Portuguese","Preferences":"Preferences","Preparing backup...":"Preparing backup...","Priority":"Priority","QR Code":"QR Code","QR-Scanner":"QR-Scanner","Receive":"Receive","Received":"Received","Recipients":"Recipients","Reconnecting to Wallet Service...":"Reconnecting to Wallet Service...","Recreate":"Recreate","Recreating Wallet...":"Recreating Wallet...","Reject":"Reject","Rejecting payment":"Rejecting payment","Release Information":"Release Information","Repeat password":"Repeat password","Request a specific amount":"Request a specific amount","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Required","Required number of signatures":"Required number of signatures","Retrying...":"Retrying...","Russian":"Russian","Save":"Save","Saving preferences...":"Saving preferences...","Scan addresses for funds":"Scan addresses for funds","Scan Finished":"Scan Finished","Scan status finished with error":"Scan status finished with error","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Scanning Wallet funds...","See it on the blockchain":"See it on the blockchain","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Select a backup file","Select a wallet":"Select a wallet","Self-signed Certificate":"Self-signed Certificate","Send":"Send","Send All":"Send All","Send all by email":"Send all by email","Send by email":"Send by email","Sending funds...":"Sending funds...","Sent":"Sent","Server":"Server","Server response could not be verified":"Server response could not be verified","Session log":"Session log","SET":"SET","Set up a Export Password":"Set up a Export Password","Set up a password":"Set up a password","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.","settings":"settings","Share address":"Share address","Share invitation":"Share invitation","Share this invitation with your copayers":"Share this invitation with your copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.","Shared Wallet":"Shared Wallet","Show advanced options":"Show advanced options","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Signatures rejected by server","Signing payment":"Signing payment","SKIP BACKUP":"SKIP BACKUP","Spanish":"Spanish","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"Spend proposal is not accepted","Spend proposal not found":"Spend proposal not found","Still not done":"Still not done","Success":"Success","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Tap to retry","Terms of Use":"Terms of Use","Testnet":"Testnet","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"The payment was created but could not be completed. Please try again from home screen","The payment was created but could not be signed. Please try again from home screen":"The payment was created but could not be signed. Please try again from home screen","The payment was removed by creator":"The payment was removed by creator","The payment was signed but could not be broadcasted. Please try again from home screen":"The payment was signed but could not be broadcasted. Please try again from home screen","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"The software you are about to use functions as a free, open source, and multi-signature digital wallet.","The spend proposal is not pending":"The spend proposal is not pending","The wallet \"{{walletName}}\" was deleted":"The wallet \"{{walletName}}\" was deleted","There are no wallets to make this payment":"There are no wallets to make this payment","There is an error in the form":"There is an error in the form","This transaction has become invalid; possibly due to a double spend attempt.":"This transaction has become invalid; possibly due to a double spend attempt.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.","Time":"Time","To":"To","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.","too long!":"too long!","Total":"Total","Total Locked Balance":"Total Locked Balance","Total number of copayers":"Total number of copayers","Transaction":"Transaction","Transaction already broadcasted":"Transaction already broadcasted","Translation Credits":"Translation Credits","Translators":"Translators","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Unable to send transaction proposal","Unconfirmed":"Unconfirmed","Unit":"Unit","Unsent transactions":"Unsent transactions","Updating Wallet...":"Updating Wallet...","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Use Unconfirmed Funds","Username":"Username","Version":"Version","View":"View","Waiting for copayers":"Waiting for copayers","Waiting...":"Waiting...","Wallet":"Wallet","Wallet Alias":"Wallet Alias","Wallet already exists":"Wallet already exists","Wallet Already Imported:":"Wallet Already Imported:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Wallet incomplete and broken","Wallet Information":"Wallet Information","Wallet Invitation":"Wallet Invitation","Wallet Invitation is not valid!":"Wallet Invitation is not valid!","Wallet is full":"Wallet is full","Wallet is not complete":"Wallet is not complete","Wallet name":"Wallet name","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Wallet not found","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Wallet service not found","WARNING: Backup needed":"WARNING: Backup needed","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Warning: this transaction has unconfirmed inputs","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"WARNING: Wallet not registered","Warning!":"Warning!","We reserve the right to modify this disclaimer from time to time.":"We reserve the right to modify this disclaimer from time to time.","WELCOME TO COPAY":"WELCOME TO COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"Wrong password","Yes":"Yes","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.","You assume any and all risks associated with the use of the software.":"You assume any and all risks associated with the use of the software.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"You do not have a wallet","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"Your backup password","Your export password":"Your export password","Your nickname":"Your nickname","Your password":"Your password","Your profile password":"Your profile password","Your wallet has been imported correctly":"Your wallet has been imported correctly","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('pt', {"(possible double spend)":"(possible double spend)","(Trusted)":"(Trusted)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} will be deducted for bitcoin networking fees","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} carteiras importadas. Recursos de digitalização em andamento. Espere para ver o saldo atualizado","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"Uma carteira de bitcoin multi-assinada","About Copay":"Sobre a Copay","Accept":"Aceitar","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"Adicionar carteira","Address":"Endereço","Address Type":"Address Type","Advanced":"Avançado","Advanced Send":"Advanced Send","Agree":"Concordar","Alias for <i>{{index.walletName}}</i>":"Alias for <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at","All transaction requests are irreversible.":"All transaction requests are irreversible.","Already have a wallet?":"Já tem uma carteira?","Alternative Currency":"Moeda Alternativa","Amount":"﻿Valor","Amount below dust threshold":"Amount below dust threshold","Amount in":"Montante em","Applying changes":"Aplicar alterações","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"Tem certeza que deseja excluir esta carteira?","Available Balance":"Saldo Disponível","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Average confirmation time: {{fee.nbBlocks * 10}} minutes","Back":"Voltar","Backup":"Backup","Backup now":"Backup agora","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Bad wallet invitation","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"Antes de receber fundos, é altamente recomendável que você faça backup de suas chaves de carteira.","Bitcoin address":"Endereço Bitcoin","Bitcoin Network Fee Policy":"Bitcoin Network Fee Policy","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.","Bitcoin URI is NOT valid!":"Bitcoin URI não é válido!","Broadcast Payment":"Transmitir Pagamento","Broadcasting Payment":"Transmitindo Pagamento","Broadcasting transaction":"Transmitindo transação","Browser unsupported":"Navegador não suportado","Cancel":"Cancelar","CANCEL":"CANCELAR","Cannot join the same wallet more that once":"Cannot join the same wallet more that once","Certified by":"Certificado por","Changing wallet alias only affects the local wallet name.":"Alterando o apelido da carteira somente afeta o nome da carteira local.","Choose a backup file from your computer":"Escolha um arquivo de backup do seu computador","Choose a wallet to send funds":"Choose a wallet to send funds","Close":"Fechar","Color":"Cor","Commit hash":"Commit de hash","Confirm":"Confirm","Confirmations":"Confirmações","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayer already in this wallet","Copayer already voted on this spend proposal":"Copayer already voted on this spend proposal","Copayer data mismatch":"Copayer data mismatch","Copayers":"Copayers","Copied to clipboard":"Copied to clipboard","Copy this text as it is to a safe place (notepad or email)":"Copie este texto como está para um lugar seguro (bloco de notas ou e-mail)","Copy to clipboard":"Copiar para área de transferência","Could not accept payment":"Could not accept payment","Could not access Wallet Service: Not found":"Could not access Wallet Service: Not found","Could not broadcast payment":"Could not broadcast payment","Could not create address":"Could not create address","Could not create payment proposal":"Não foi possível criar proposta de pagamento","Could not create using the specified extended private key":"Não foi possível criar usando a chave privada estendida especificada","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Não foi possível descriptografar o arquivo, verifique sua senha","Could not delete payment proposal":"Could not delete payment proposal","Could not fetch payment information":"Não foi possível obter a informação do pagamento","Could not fetch transaction history":"Não foi possível obter o histórico de transação","Could not import":"Could not import","Could not import. Check input file and password":"Não foi possível importar. Verifique o arquivo de entrada e senha","Could not join wallet":"Could not join wallet","Could not recognize a valid Bitcoin QR Code":"Could not recognize a valid Bitcoin QR Code","Could not reject payment":"Could not reject payment","Could not send payment":"Não foi possível enviar o pagamento","Could not update Wallet":"Não é possível atualizar carteira","Create":"Criar","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Create {{requiredCopayers}}-of-{{totalCopayers}} wallet","Create new wallet":"Criando nova carteira","Create, join or import":"Criar, participar ou importar","Created by":"Criado por","Creating Profile...":"Criando Perfil…","Creating transaction":"Criando transação","Creating Wallet...":"Criando Carteira…","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB","Date":"Data","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"Apagar e criar um novo","Delete Payment Proposal":"Excluir Proposta de Pagamento","Delete wallet":"Excluir carteira","Delete Wallet":"Excluir Carteira","DELETE WORDS":"DELETE WORDS","Deleting payment":"Excluindo pagamento","Derivation Strategy":"Derivation Strategy","Details":"Detalhes","Disabled":"Desabilitado","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.","Download":"Download","Download CSV file":"Download CSV file","Economy":"Economy","Email":"Email","Email for wallet notifications":"Email for wallet notifications","Email Notifications":"Notificações por E-mail","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"Digite sua senha","Error at Wallet Service":"Error at Wallet Service","Error creating wallet":"Erro na criação da carteira","Error importing wallet:":"Erro importando carteira:","Expires":"﻿Expira","Export":"Export","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"Falha ao importar carteiras","Family vacation funds":"Fundos de férias com a família","Fee":"Fee","Fee Policy":"Fee Policy","Fee policy for this transaction":"Fee policy for this transaction","Fetching Payment Information":"Buscando Informação de Pagamento","File/Text Backup":"File/Text Backup","French":"Francês","Funds are locked by pending spend proposals":"Funds are locked by pending spend proposals","Funds found":"Funds found","Funds received":"Fundos recebidos","Funds will be transfered to":"Funds will be transfered to","Generate new address":"Gerar novo endereço","Generate QR Code":"Generate QR Code","Generating .csv file...":"Generating .csv file...","German":"Alemão","GET STARTED":"COMEÇAR","Getting address for wallet {{selectedWalletName}} ...":"Getting address for wallet {{selectedWalletName}} ...","Global settings":"Configurações globais","Go back":"Go back","Greek":"Grego","Hardware wallet":"Hardware wallet","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Tem um Backup do Copay v 0.9?","Hide advanced options":"Hide advanced options","Hide Wallet Seed":"Hide Wallet Seed","History":"História","Home":"Início","I affirm that I have read, understood, and agree with these terms.":"I affirm that I have read, understood, and agree with these terms.","Import":"Importar","Import backup":"Importar backup","Import from Ledger":"Import from Ledger","Import from the Cloud?":"Importar da nuvem?","Import from TREZOR":"Import from TREZOR","Import here":"Importar aqui","Import wallet":"Importar carteira","Importing wallet...":"Importando carteira…","Importing...":"Importando…","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.","Incorrect address network":"Incorrect address network","Insufficient funds":"Insufficient funds","Insufficient funds for fee":"Insufficient funds for fee","Invalid":"Invalid","Invalid address":"Invalid address","Invitation to share a Copay Wallet":"Invitation to share a Copay Wallet","Italian":"Italiano","Japanese":"﻿Japonês","John":"John","Join":"Participar","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io","Join shared wallet":"Associando carteira compartilhada","Joining Wallet...":"Associando-se a Carteira…","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"Idioma","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"Saiba mais sobre Migração de Carteira","Loading...":"Loading...","locked by pending payments":"bloqueado por pagamentos pendentes","Locktime in effect. Please wait to create a new spend proposal":"Locktime in effect. Please wait to create a new spend proposal","Locktime in effect. Please wait to remove this spend proposal":"Locktime in effect. Please wait to remove this spend proposal","Make a payment to":"Fazer um pagamento para","me":"me","Me":"Eu","Memo":"Nota","Merchant message":"Mensagem do Comerciante","Message":"Mensagem","More":"Mais","Moved":"Movido","Multisignature wallet":"Carteira multi-assinada","My Bitcoin address":"Meu endereço Bitcoin","Network":"Rede","Network connection error":"Network connection error","New Payment Proposal":"Nova Proposta de Pagamento","No Private key":"No Private key","No transactions yet":"Nenhuma transação ainda","Normal":"Normal","Not authorized":"Not authorized","Not valid":"Inválido","Note":"Nota","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"opcional","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"Participantes","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Senha","Password needed":"Senha necessária","Passwords do not match":"As senhas não coincidem","Paste invitation here":"Cole o convite aqui","Paste the backup plain text code":"Cole o texto puro do backup aqui","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Pagar Para","Payment Accepted":"﻿Pagamento Aceito","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Detalhes do pagamento","Payment Proposal":"Proposta de Pagamento","Payment Proposal Created":"Proposta de Pagamento Criada","Payment Proposal Rejected":"Proposta de Pagamento Rejeitada","Payment Proposal Rejected by Copayer":"Proposta de Pagamento Rejeitada pelo Copayer","Payment Proposal Signed by Copayer":"Proposta de Pagamento Assinada pelo Copayer","Payment Proposals":"Propostas de Pagamento","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Protocolo de pagamento não suportado no Chrome App","Payment rejected":"Payment rejected","Payment Rejected":"Pagamento Rejeitado","Payment request":"Pedido de pagamento","Payment sent":"Payment sent","Payment Sent":"Pagamento Enviado","Payment to":"Pagamento para","Pending Confirmation":"Pending Confirmation","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED","Personal Wallet":"Carteira Pessoal","Please enter the required fields":"Por favor, preencha os campos obrigatórios","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Please upgrade Copay to perform this action","Please, select your backup file":"Por favor, selecione seu arquivo de backup","Portuguese":"Português","Preferences":"Preferências","Preparing backup...":"Preparing backup...","Priority":"Priority","QR Code":"QR Code","QR-Scanner":"QR-Scanner","Receive":"﻿Receber","Received":"Recebido","Recipients":"Recipients","Reconnecting to Wallet Service...":"Reconectando ao Serviço de Carteira…","Recreate":"Recriado","Recreating Wallet...":"Recriando Carteira…","Reject":"Rejeitar","Rejecting payment":"Rejeitando pagamento","Release Information":"Liberar Informação","Repeat password":"Repetir Senha","Request a specific amount":"Request a specific amount","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Obrigatório","Required number of signatures":"Required number of signatures","Retrying...":"Repetindo…","Russian":"Russian","Save":"Salvar","Saving preferences...":"Salvando preferências…","Scan addresses for funds":"Pesquisando endereços por fundos","Scan Finished":"Pesquisa Finalizada","Scan status finished with error":"Pesquisa de status finalizada com erro","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Pesquisando fundos de carteira…","See it on the blockchain":"Veja no blockchain","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Selecione um arquivo de backup","Select a wallet":"Selecione uma carteira","Self-signed Certificate":"Self-signed Certificate","Send":"Enviar","Send All":"Send All","Send all by email":"Send all by email","Send by email":"Enviar por E-mail","Sending funds...":"Sending funds...","Sent":"Enviado","Server":"Servidor","Server response could not be verified":"Server response could not be verified","Session log":"Log da sessão","SET":"DEFINIR","Set up a Export Password":"Set up a Export Password","Set up a password":"Configure uma senha","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Configurar notificações de e-mail pode enfraquecer sua privacidade se o prestador de serviços de carteira está comprometido. As informações disponíveis para um invasor podem incluir seus endereços carteira e seu saldo, nada mais.","settings":"configurações","Share address":"Compartilhar endereço","Share invitation":"Compartilhar convite","Share this invitation with your copayers":"Compartilhe este convite com seus copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Compartilhe este endereço da carteira para receber pagamentos. Para proteger sua privacidade, novos endereços são gerados automaticamente cada vez que você usá-los.","Shared Wallet":"Compartilhar Carteira","Show advanced options":"Show advanced options","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Signatures rejected by server","Signing payment":"Pagamento assinado","SKIP BACKUP":"PULAR BACKUP","Spanish":"Espanhol","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"Spend proposal is not accepted","Spend proposal not found":"Spend proposal not found","Still not done":"Still not done","Success":"Sucesso","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Bata para repetir","Terms of Use":"Terms of Use","Testnet":"Testnet","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"O pagamento foi criado mas não pode ser completado. Por favor, tente novamente a partir da tela inicial.","The payment was created but could not be signed. Please try again from home screen":"The payment was created but could not be signed. Please try again from home screen","The payment was removed by creator":"O pagamento foi removido pelo criador","The payment was signed but could not be broadcasted. Please try again from home screen":"The payment was signed but could not be broadcasted. Please try again from home screen","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"The software you are about to use functions as a free, open source, and multi-signature digital wallet.","The spend proposal is not pending":"The spend proposal is not pending","The wallet \"{{walletName}}\" was deleted":"A carteira “{{walletName}}” foi removida","There are no wallets to make this payment":"There are no wallets to make this payment","There is an error in the form":"Existe um erro no formulário","This transaction has become invalid; possibly due to a double spend attempt.":"This transaction has become invalid; possibly due to a double spend attempt.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Esta carteira não está registrada no dado serviço Wallet Service Bitcore (BWS) informado. Você pode recriá-la a partir da informação local.","Time":"﻿Hora","To":"Para","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.","too long!":"muito tempo!","Total":"Total","Total Locked Balance":"Saldo Total Bloqueado","Total number of copayers":"Total number of copayers","Transaction":"Transação","Transaction already broadcasted":"Transaction already broadcasted","Translation Credits":"Translation Credits","Translators":"Translators","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Impossível enviar a proposta de transação","Unconfirmed":"Não confirmado","Unit":"﻿Unidade","Unsent transactions":"Transações não enviadas","Updating Wallet...":"Atualizando Carteira…","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Use Unconfirmed Funds","Username":"Username","Version":"﻿Versão","View":"View","Waiting for copayers":"Aguardando copayers","Waiting...":"Aguardando…","Wallet":"Wallet","Wallet Alias":"Apelido da Carteira","Wallet already exists":"A carteira já existe","Wallet Already Imported:":"Carteira já importada:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Carteira incompleta e quebrada","Wallet Information":"Wallet Information","Wallet Invitation":"Convite para Carteira","Wallet Invitation is not valid!":"O convite para carteira não é válido!","Wallet is full":"Wallet is full","Wallet is not complete":"Wallet is not complete","Wallet name":"Nome da carteira","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Wallet not found","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Wallet service not found","WARNING: Backup needed":"Atenção: Backup necessário","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Warning: this transaction has unconfirmed inputs","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"Atenção: Carteira não registrada","Warning!":"Atenção!","We reserve the right to modify this disclaimer from time to time.":"We reserve the right to modify this disclaimer from time to time.","WELCOME TO COPAY":"BEM-VINDO A COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"Senha errada","Yes":"Sim","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.","You assume any and all risks associated with the use of the software.":"You assume any and all risks associated with the use of the software.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"Você não tem uma carteira","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"Sua senha de backup","Your export password":"Your export password","Your nickname":"Seu apelido","Your password":"Sua senha","Your profile password":"Sua senha de perfil","Your wallet has been imported correctly":"Sua carteira foi importada corretamente","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('ru', {"(possible double spend)":"(возможна двойная трата)","(Trusted)":"(Доверенный)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} будет использовано для оплаты комиссии","{{index.m}}-of-{{index.n}}":"{{index.m}}-из-{{index.n}}","{{index.txProgress}} transactions downloaded":"{{index.txProgress}} транзакций скачено","{{item.m}}-of-{{item.n}}":"{{item.m}}-из-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} кошельки импортированы, идёт сканирование. Дождитесь обновлённого баланса","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Предложенный платёж может быть удалён если 1) вы создали этот платёж и никто его еще не подписал, или если 2) прошло более 24 часов с момента его создания.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>ЕСЛИ ВЫ ПОТЕРЯЕТЕ ДОСТУП К ВАШЕМУ КОШЕЛЬКУ COPAY ИЛИ ВАШИМ ЗАШИФРОВАННЫМ ЗАКРЫТЫМ КЛЮЧАМ, ПРИ ТОМ ЧТО У ВАС НЕТ ОТДЕЛЬНОЙ РЕЗЕРВНОЙ КОПИИ ВАШЕГО КОШЕЛЬКА И СООТВЕТСТВУЮЩЕМУ ЕМУ ПАРОЛЯ, ВЫ ПРИЗНАЁТЕ И СОГЛАШАЕТЕСЬ С ТЕМ ЧТО ВСЕ БИТКОЙНЫ АССОЦИИРОВАННЫЕ С ЭТИМ КОШЕЛЬКОМ СТАНУТ НЕДОСТУПНЫ.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>ИЛИ</b> один экспортный файл и кворум остальных мнемоник (например в кошельке 3-5: экспортный файл и две мнемонику двух любых совладельцев).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>ИЛИ</b> мнемоника <b>всех</b> совладельцев кошелька","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>ИЛИ</b> мнемоники <b>всех</b> совладельцев кошелька","A multisignature bitcoin wallet":"Биткойн-кошелёк с мультиподписью","About Copay":"О Copay","Accept":"Принять","Account":"Аккаунт","Account Number":"Номер аккаунта","Activity":"Активность","Add a new entry":"Добавить новую запись","Add a Seed Passphrase":"Укажите пароль мнемоники","Add an optional passphrase to secure the seed":"Вы можете указать пароль мнемоники для большей безопасности","Add wallet":"Добавить кошелёк","Address":"Адрес","Address Type":"Тип адреса","Advanced":"Дополнительные возможности","Alias":"Псевдоним","Alias for <i>{{index.walletName}}</i>":"Псевдоним для <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Любой вклад в перевод Copay приветствуются. Регистрируйтесь на crowdin.com и присоединяйтесь к проекту Copay на","All transaction requests are irreversible.":"Все транзакции являются необратимыми.","Alternative Currency":"Альтернативная валюта","Amount":"Сумма","Amount below dust threshold":"Сумма ниже минимального порога","Amount in":"Сумма в","Are you sure you want to delete the backup words?":"Вы точно хотите удалить эту резервную копию?","Are you sure you want to delete this wallet?":"Вы точно хотите удалить этот кошелек?","Available Balance":"Доступный баланс","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Среднее время подтверждения: {{fee.nbBlocks * 10}} минут","Back":"Назад","Backup":"Резервное копирование","Backup failed":"Сбой резервного копирования","Backup Needed":"Требуется резервное копирование","Backup now":"Создать резервную копию","Backup words deleted":"Резервная копия удалена","Bad wallet invitation":"Недействительное приглашение","Balance By Address":"Баланс на адресах","Before receiving funds, it is highly recommended you backup your wallet. If you lose this device, it is impossible to access your funds without a backup.":"До получения средств настоятельно рекомендуется создать резервную копию кошелька. Если вы потеряете это устройство, без резервной копии доступ к средствам будет невозможен.","BIP32 path for address derivation":"Укажите BIP32 для генерации адресов","Bitcoin address":"Биткойн-адрес","Bitcoin Network Fee Policy":"Политика комиссии в сети Биткойн","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Биткойн-транзакции могут включать комиссию, собираемую майнерами в сети. Чем выше комиссия, тем больше стимул для майнера включить транзакцию в блок. Фактическая комиссия определяется на основе сетевой нагрузки и выбранной политики.","Bitcoin URI is NOT valid!":"Биткойн URI недействителен!","Broadcast Payment":"Отправить платёж","Broadcasting Payment":"Отправка платежа","Broadcasting transaction":"Отправка транзакции","Browser unsupported":"Браузер не поддерживается","Buy &amp; Sell Bitcoin":"Торговля биткойн","Calculating fee":"Вычисление комиссии","Cancel":"Отмена","CANCEL":"ОТМЕНА","Cannot join the same wallet more that once":"Нельзя присоединиться к одному и тому же кошельку более одного раза","Certified by":"Сертифицирован","Changing wallet alias only affects the local wallet name.":"Изменение псевдонима кошелька сохраняется только локально.","Choose a backup file from your computer":"Выберите файл резервной копии","Clear cache":"Очистить кэш","Close":"Закрыть","Color":"Цвет","Commit hash":"Хэш версии","Confirm":"Подтвердить","Confirm your wallet seed":"Подтвердите мнемонику","Confirmations":"Подтверждения","Congratulations!":"Поздравляем!","Connecting to {{create.hwWallet}} Wallet...":"Подключаемся к кошельку {{create.hwWallet}}...","Connecting to {{import.hwWallet}} Wallet...":"Подключаемся к кошельку {{import.hwWallet}}...","Connecting to {{join.hwWallet}} Wallet...":"Подключаемся к кошельку {{join.hwWallet}}...","Continue":"Продолжить","Copayer already in this wallet":"Совладелец кошелька уже присоединился","Copayer already voted on this spend proposal":"Совладелец кошелька уже проголосовал по этому предложению платежа","Copayer data mismatch":"Несоответствие данных совладельца кошелька","Copayers":"Совладельцы кошелька","Copied to clipboard":"Скопировано в буфер обмена","Copy this text as it is to a safe place (notepad or email)":"Скопируйте этот текст как есть (в блокнот или письмо)","Copy to clipboard":"Скопировать в буфер обмена","Could not accept payment":"Не удалось принять платёж","Could not access Wallet Service: Not found":"Не удалось получить доступ к серверу Bitcore: не найден","Could not broadcast payment":"Не удалось отправить платёж","Could not calculate fee":"Не удалось вычислить комиссию","Could not create address":"Не удалось создать адрес","Could not create payment proposal":"Не удалось создать предложение платежа","Could not create using the specified extended private key":"Не удалось создать используя указанный расширенный закрытый ключ","Could not create using the specified extended public key":"Не удалось создать используя указанный расширенный открытый ключ","Could not create: Invalid wallet seed":"Не удалось создать: недействительная мнемоника","Could not decrypt":"Не удалось расшифровать","Could not decrypt file, check your password":"Не удалось расшифровать файл, проверьте пароль","Could not delete payment proposal":"Не удалось удалить предложение платежа","Could not fetch payment information":"Не удалось получить информацию о платеже","Could not import":"Не удалось импортировать","Could not import. Check input file and password":"Не удалось импортировать. Проверьте импортируемый файл и пароль","Could not join wallet":"Не удалось присоединиться к кошельку","Could not recognize a valid Bitcoin QR Code":"Не удалось распознать адрес в QR-коде","Could not reject payment":"Не удалось отклонить платёж","Could not send payment":"Не удалось отправить платёж","Could not update Wallet":"Не удалось обновить кошелёк","Create":"Создать","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Создать кошелёк {{requiredCopayers}}-из-{{totalCopayers}}","Create new wallet":"Создать новый кошелёк","Create, join or import":"Создать, присоединиться или импортировать","Created by":"Создан","Creating transaction":"Создание транзакции","Creating Wallet...":"Создание кошелька...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Текущая комиссия для этой политики: {{fee.feePerKBUnit}}/kiB","Date":"Дата","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Расшифровка бумажного кошелька может занять до пяти минут на этом устройстве. Пожалуйста, будьте терпеливы и держите приложение открытым.","Delete it and create a new one":"Удалите и создайте заново","Delete Payment Proposal":"Удалить предложенный платёж","Delete seed words":"Удалить мнемонику","Delete wallet":"Удалить кошелёк","Delete Wallet":"Удалить кошелёк","Delete words":"Удалить мнемонику","Deleting payment":"Удаление платежа","Derivation Path":"Путь деривации","Derivation Strategy":"Стратегия деривации","Details":"Подробности","Disabled":"Отключены","Do not include private key":"Не включать закрытый ключ","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Не видите свой язык на Crowdin? Свяжитесь с владельцем по Crowdin! Мы с удовольствием поддержим ваш язык.","Done":"Завершено","Download":"Скачать","Economy":"Экономичная","Edit":"Редактировать","Email":"Email","Email for wallet notifications":"Укажите email для получения уведомлений","Email Notifications":"Email-уведомления","Empty addresses limit reached. New addresses cannot be generated.":"Достигнут предел пустых адресов. Новые адреса больше не могут быть сгенерированы.","Encrypted export file saved":"Зашифрованная резервная копия сохранена","Enter the seed words (BIP39)":"Введите мнемонику (BIP39)","Enter your passphrase":"Укажите пароль мнемоники","Enter your password":"Введите пароль","Error at Wallet Service":"Ошибка на сервере Bitcore","Error creating wallet":"Ошибка создания кошелька","Error importing wallet:":"Ошибка импорта кошелька:","Expires":"Срок действия","Export options":"Параметры экспорта","Export to file":"Экспорт в файл","Export Wallet":"Экспорт кошелька","Extended Public Keys":"Расширенные открытые ключи","Failed to export":"Не удалось экспортировать","Failed to import wallets":"Не удалось импортировать кошельки","Failed to verify backup. Please check your information":"Не удалось проверить резервную копию. Пожалуйста, сверьте введённую информацию","Family vacation funds":"Отпускной бюджет","Fee":"Комиссия","Fetching Payment Information":"Извлечение информации о платеже","File/Text Backup":"Из файла","Finish":"Готово","French":"французский","Funds are locked by pending spend proposals":"Средства заблокированы ожидающим предложением платежа","Funds found":"Средства найдены","Funds received":"Получен перевод","Funds will be transferred to":"Средства будут переведены на","Generate new address":"Создать новый адрес","Generate QR Code":"Сгенерировать QR-код","Generating .csv file...":"Создание .сsv-файла...","German":"немецкий","Getting address for wallet {{selectedWalletName}} ...":"Получение адреса для кошелька {{selectedWalletName}}...","Global preferences":"Глобальные предпочтения","Greek":"греческий","Hardware wallet":"Аппаратный кошелёк","Have a Backup from Copay v0.9?":"Есть резервная копия из Copay v0.9?","Hide advanced options":"Скрыть дополнительные настройки","I affirm that I have read, understood, and agree with these terms.":"Я подтверждаю, что я прочитал(а), понял(а) и согласен(а) с настоящими условиями.","I AGREE. GET STARTED":"СОГЛАСЕН. ПРИСТУПИМ","Import":"Импорт","Import backup":"Импорт резервной копии","Import from the Cloud?":"Импортировать из облака?","Import here":"Импортировать сюда","Import wallet":"Импорт кошелька","Importing wallet...":"Импорт кошелька...","Importing...":"Импорт...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"Ни при каких обстоятельствах авторы программного обеспечения, сотрудники и филиалов Bitpay, правообладатели, или BitPay Inc. не могут быть ответственным за любые претензии, убытки или нести иную ответственность, будь то действие контракта, деликта или иным образом вытекающие из или в связи с программным обеспечением.","In order to verify your wallet backup, please type your passphrase:":"Для проверки резервной копии кошелька необходимо указать пароль мнемоники:","Include address book and history cache":"Включить адресную книгу и историю транзакций","Incorrect address network":"Неверный адрес","Insufficient funds":"Недостаточно средств","Insufficient funds for fee":"Недостаточно средств на комиссию","Invalid":"Недействительно","Invalid account number":"Недопустимый номер аккаунта","Invalid address":"Неверный адрес","Invalid derivation path":"Недействительный путь деривации","Invalid Touch ID":"Неподходящий Touch ID","Invitation to share a Copay Wallet":"Приглашение присоединиться к кошельку Copay","Italian":"итальянский","Japanese":"японский","John":"John","Join":"Присоединиться","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Присоединяйся к моему кошельку Copay. Код приглашения: {{secret}} Ты можешь загрузить Copay для своего телефона или настольного компьютера на сайте https://copay.io","Join shared wallet":"Присоединиться к общему кошельку","Joining Wallet...":"Присоединение к кошельку...","Key already associated with an existing wallet":"Ключ уже связан с существующим кошельком","Label":"Метка","Language":"Язык","Last Wallet Addresses":"Последние адреса","Learn more about Copay backups":"Узнайте больше о резервном копировании","Learn more about Wallet Migration":"Узнайте больше о переносе кошелька","locked by pending payments":"заблокировано неподтверждёнными платежами","Locktime in effect. Please wait to create a new spend proposal":"Действует блокировка. Пожалуйста, подождите, чтобы создать новое предложение платежа","Locktime in effect. Please wait to remove this spend proposal":"Действует блокировка. Пожалуйста, подождите, чтобы удалить это предложение платежа","Make a payment to":"Сделать платёж","me":"мне","Me":"Я","Memo":"Памятка","Merchant message":"Сообщение от продавца","Message":"Сообщение","Moved":"Перемещено","Multiple recipients":"Несколько получателей","My Bitcoin address":"Мой биткойн-адрес","My contacts":"Мои контакты","My wallets":"Мои кошельки","Need to do backup":"Необходимо создать резервную копию","Network":"Сеть","Network connection error":"Ошибка подключения","New Payment Proposal":"Новое предложение платежа","New Random Seed":"Новая случайная мнемоника","No hardware wallets supported on this device":"Аппаратные кошельки не поддерживаются на этом устройстве","No transactions yet":"Транзакций пока не было","Normal":"Обычная","Not authorized":"Не авторизован","Not completed":"Не завершено","Not valid":"Недействительно","Note":"Примечание","Official English Disclaimer":"Официальный оригинал","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Рекомендуется удалить мнемонику с устройства, как только вы скопировали её.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Отображаются только основные адреса (не со сдачей). Адреса в этом списке на данный момент ещё не были проверены локально.","optional":"необязательно","Paper Wallet Private Key":"Закрытый ключ бумажного кошелька","Participants":"Участники","Passphrase":"Пароль импортируемого кошелька","Password":"Пароль","Password needed":"Нужен пароль","Passwords do not match":"Пароли не совпадают","Paste invitation here":"Вставьте приглашение сюда","Paste the backup plain text code":"Вставьте код резервной копии обычным текстом","Paste your paper wallet private key here":"Вставьте закрытый ключ бумажного кошелька сюда","Pay To":"Отправить платёж","Payment Accepted":"Платёж принят","Payment accepted, but not yet broadcasted":"Платёж принят, но пока не отправлен","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Платёж принят и будет отправлен Glidera. В случае проблем он может быть удалён спустя шесть часов после создания.","Payment details":"Детали платежа","Payment Proposal":"Предложение платежа","Payment Proposal Created":"Создано предложение платежа","Payment Proposal Rejected":"Предложение платежа отклонено","Payment Proposal Rejected by Copayer":"Предложение платежа отклонено совладельцем кошелька","Payment Proposal Signed by Copayer":"Предложение платежа подписано совладельцем кошелька","Payment Proposals":"Предложение платежа","Payment Protocol Invalid":"Недействительный протокол оплаты","Payment Protocol not supported on Chrome App":"Платёжный протокол не поддерживается в приложении Chrome","Payment Rejected":"Платёж отклонён","Payment request":"Запрос платежа","Payment Sent":"Платёж отправлен","Payment to":"Платёж","Pending Confirmation":"Ожидание подтверждения","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Окончательно удалить этот кошелёк. ЭТО ДЕЙСТВИЕ НЕ МОЖЕТ БЫТЬ ОТМЕНЕНО","Personal Wallet":"Личный кошелёк","Please accept to export two public keys from the Trezor app":"Примите два публичных ключа от приложения Trezor","Please enter the required fields":"Пожалуйста, заполните необходимые поля","Please enter the seed words":"Введите мнемонику","Please enter the wallet seed":"Введите мнемонику","Please tap the words in order to confirm your backup phrase is correctly written.":"Коснитесь слов чтобы подтвердить, что ваша резервная копия корректно записана.","Please upgrade Copay to perform this action":"Пожалуйста, обновите Copay для выполнения этого действия","Please, select your backup file":"Пожалуйста, выберите ваш файл резервной копии","Portuguese":"португальский","Preparing backup...":"Подготовка резервной копии...","Press again to exit":"Нажмите еще раз для выхода","Priority":"Приоритетная","QR Code":"QR-код","QR-Scanner":"QR-сканер","Receive":"Получить","Received":"Получен","Recipients":"Получатели","Reconnecting to Wallet Service...":"Повторное подключение к серверу Bitcore...","Recreate":"Создать заново","Recreating Wallet...":"Воссоздаю кошелёк...","Reject":"Отклонить","Rejecting payment":"Отклонение платежа","Release Information":"Информация о выпуске","Remove":"Удалить","Repeat password":"Повторите пароль","Request a specific amount":"Запросить определенную сумму","Request Password":"Запросить пароль","Requesting Ledger Wallet to sign":"Запрашиваем Ledger для подписания транзакции","Required":"Необходимо","Required number of signatures":"Требуемое число подписей","Russian":"русский","Save":"Сохранить","Saving preferences...":"Сохранение настроек...","Scan addresses for funds":"Просканировать адреса для обнаружения средств","Scan Fingerprint":"Сканирование отпечатка пальца","Scan Finished":"Сканирование завершено","Scan status finished with error":"Сканирование завершено с ошибкой","Scan Wallet Funds":"Сканирование кошелька","Scan your fingerprint please":"Пожалуйста отсканируйте ваш отпечаток пальца","Scanning wallet funds...":"Сканирование адресов кошелька...","Scanning Wallet funds...":"Сканирование адресов кошелька...","Security preferences":"Настройки безопасности","See it on the blockchain":"Посмотреть в блокчейне","Seed passphrase":"Пароль мнемоники","Seed Passphrase":"Пароль мнемоники","Select a backup file":"Выберите файл резервной копии","Select a wallet":"Выберите кошелёк","Self-signed Certificate":"Самозаверенные сертификат","Send":"Отправить","Send addresses by email":"Отправить адреса по email","Send All":"Отправить все","Send by email":"Отправить на email","Sending":"Отправка","Sending funds...":"Отправка средств...","Sent":"Отправлено","Server":"Сервер","Server response could not be verified":"Ответ сервера не может быть проверен","Session log":"Журнал сеанса","SET":"УСТАНОВИТЬ","Set default url":"Установить адресом по-умолчанию","Set up a password":"Задайте пароль","Set up an Export Password":"Задайте пароль","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Включение email-уведомлений может ослабить вашу конфиденциальность, если владелец сервера Bitcore будет скомпрометирован. Информация доступная злоумышленнику будет включать адреса вашего кошелька и его баланс, но ничего больше.","Settings":"Параметры","Share address":"Отправить адрес","Share invitation":"Отправить приглашение","Share this invitation with your copayers":"Отправьте приглашение совладельцам кошелька","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Используйте этот адрес для получения платежей. Для защиты вашей конфиденциальности, новые адреса создаются как только вы использовали старые.","Shared Wallet":"Общий кошелёк","Show advanced options":"Показать дополнительные настройки","Show all":"Пок��зать все","Show Wallet Seed":"Показать мнемонику","Signatures rejected by server":"П����писи отклонены сервером","Signing payment":"Подписание платежа","Spanish":"испанский","Specify Seed...":"Укажите мнемонику...","Spend proposal is not accepted":"Предложение платежа не принято","Spend proposal not found":"Предложение платежа не найдено","Success":"Успешно","Sweep paper wallet":"Пополнить с бумажного кошелька","Sweep Wallet":"Считать кошелёк","Tap to retry":"Повторить","Terms of Use":"Условия использования","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"Авторы данного программного обеспечения, сотрудники и помощники Bitpay, владельцы авторских прав и BitPay Inc. не могут восстановить закрытые ключи или пароли если вы потеряете или забудете их, и не могут гарантировать подтверждение транзакции, так как они не имеют контроля над сетью Биткойн.","The Ledger Chrome application is not installed":"Приложение Ledger для Chrome не установлено","The payment was created but could not be completed. Please try again from home screen":"Платёж был создан, но не может быть завершен. Пожалуйста, попробуйте снова с гл��вной страницы","The payment was created but could not be signed. Please try again from home screen":"Платёж был создан, но не может быть подписан. Пожалуйста, попробуйте снова с главной страницы","The payment was removed by creator":"Платёж был удалён его создателем","The payment was signed but could not be broadcasted. Please try again from home screen":"Платёж был подписан, но не может быть отправлен. Пожалуйста, попробуйте снова с главной страницы","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"Закрытый ключ этого кошелька зашифрован, и останется зашифрован в экспортируемом архиве.","The seed could require a passphrase to be imported":"Мнемоника может быть защищена паролем","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"Программное обеспечение не представляет собой счет, обслуживаемый BitPay или иным третьим лицам в качестве финансовых посредников или хранителями ваших биткойнов.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"Программное обеспечение, которое вы начнёте сейчас использовать, функционирует как свободное, открытое программное обеспечение, и цифровой кошелёк с мультиподписью.","The spend proposal is not pending":"Предложение платежа не в ожидании","The wallet \"{{walletName}}\" was deleted":"Кошелёк «{{walletName}}» был удален","There are no wallets to make this payment":"Нет кошельков, чтобы осуществить этот платёж","There is an error in the form":"Ошибка в форме","This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"Эта мнемоника была создана с паролем. Для восстановления необходимо указать пароль.","This transaction has become invalid; possibly due to a double spend attempt.":"Эта транзакция стала недействительной; возможно из-за попытки двойной траты.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Это кошелёк не зарегистрирован на данном сервере Bitcore. Вы можете воссоздать его из локальной информации.","Time":"Время","To":"Кому","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"Для восстановления этого {{index.m}}-{{index.n}} <b>общего</b> кошелька вам понадобится","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"В максимальной степени, разрешенной законом, данное программное обеспечение предоставляется “как есть” и без каких-либо явных, или подразумеваемых, заверений или гарантий, включая, но не ограничиваясь, товарную гарантии, пригодность для конкретной цели и ненарушения прав на интеллектуальную собственность.","too long!":"слишком долго!","Total Locked Balance":"Всего заблокировано средств","Total number of copayers":"Количество совладельцев","Transaction":"Транзакция","Transaction already broadcasted":"Транзакция уже отправлена","Transaction History":"История транзакций","Translation Credits":"Благодарность за перевод","Translators":"Переводчики","Try again":"Попрoбуйте снова","Type the Seed Phrase (usually 12 words)":"Введите мнемонику (обычно двенадцать слов)","Unable to send transaction proposal":"Не удается отправить предложение транзакции","Unconfirmed":"Неподтверждено","Unit":"Единица измерения","Unsent transactions":"Неотправленные транзакции","Updating transaction history. Please stand by.":"Обновление истории транзакций. Пожалуйста подождите.","Updating Wallet...":"Обновление кошелька...","Use Unconfirmed Funds":"Использовать неподтверждённые средства","Username":"Имя пользователя","Version":"Версия","View":"Просмотреть","Waiting for copayers":"Ожидание совладельцев кошелька","Waiting...":"Ожидание...","Wallet already exists":"Кошелёк уже существует","Wallet Already Imported:":"Кошелек уже импортирован:","Wallet already in Copay:":"Кошелек уже в Copay:","Wallet Configuration (m-n)":"Конфигурация кошелька (m-n)","Wallet Export":"Экспорт кошелька","Wallet Id":"Идентификатор кошелька","Wallet incomplete and broken":"Сбой: кошелёк не работает","Wallet Information":"Информация о кошельке","Wallet Invitation":"Приглашение присоединиться к кошельку","Wallet Invitation is not valid!":"Приглашение присоединиться к кошельку недействительно!","Wallet is full":"Все уже присоединены","Wallet is locked":"Кошелёк заблокирован","Wallet is not complete":"Не все ещё присоединились","Wallet name":"Название кошелька","Wallet Name (at creation)":"Название кошелька (при создании)","Wallet Network":"Сеть кошелька","Wallet not found":"Кошелёк не найден","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Кошелёк не зарегистрирован на сервере Bitcore. Пересоздайте кошелёк воспользовавшись дополнительными настройками чтобы указать мнемонику","Wallet Seed":"Мнемоника","Wallet Seed could require a passphrase to be imported":"Для импортирования может потребоваться указать пароль","Wallet seed is invalid":"Мнемоника недействительна","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Мнемоника кошелька недоступна. Вы все ещё можете экспортировать его в настройках кошелька \"Дополнительные возможности &gt; Экспорт кошелька\".","Wallet service not found":"Сервер Bitcore не найден","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ВНИМАНИЕ: если экспортируемый файл не включает закрытый ключ, поэтому позволит только просматривать баланс, историю транзакций и предлагать платежи. Однако, его нельзя будет использовать для одобрения (подписания) предложенных платежей, поэтому <b>средства не будет доступны из экспортируемого файла</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"ВНИМАНИЕ: Пароль нельзя восстановить. <b>Убедитесь, что вы его записали</b>. Этот кошелёк нельзя будет восстановить без пароля.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"ВНИМАНИЕ: Закрытый ключ этого кошелька недоступен. Экспортируемый файл позволит только просматривать баланс, историю транзакций и предлагать платежи. Однако, его нельзя будет использовать для одобрения (подписания) предложенных платежей, поэтому <b>средства не будет доступны из экспортируемого файла</b>.","Warning: this transaction has unconfirmed inputs":"Предупреждение: эта транзакция имеет неподтвержденные входы","WARNING: UNTRUSTED CERTIFICATE":"ВНИМАНИЕ: НЕНАДЕЖНЫЙ СЕРТИФИКАТ","WARNING: Wallet not registered":"ВНИМАНИЕ: Кошелёк не зарегистрирован","Warning!":"Внимание!","We reserve the right to modify this disclaimer from time to time.":"Мы оставляем за собой право время от времени изменять данный отказ от ответственности.","WELCOME TO COPAY":"ДОБРО ПОЖАЛОВАТЬ В COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"Пока программное обеспечение находится на этапе тестирования и продолжает улучшаться благодаря обратной связи от пользователей и сообщества разработчиков, мы не можем гарантировать, что в программном обеспечении не будет никаких ошибок.","Write your wallet seed":"Запишите мнемонику","Wrong number of seed words:":"Неподходящее количество слов в мнемонике:","Wrong password":"Неверный пароль","Yes":"Да","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"Вы подтверждаете, что вы используете программное обеспечение по вашему собственному усмотрению и в соответствии с применяемыми законами.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"Вы ответственны за хранение ваших паролей, открытых и закрытых ключей, ПИНов и других кодов, которые вы используете для доступа к программному обеспечению.","You assume any and all risks associated with the use of the software.":"Вы берете на себя все риски связанные с использованием данного программного обеспечения.","You backed up your wallet. You can now restore this wallet at any time.":"Резервная копия создана. Теперь вы можете восстановить кошелёк в любое время.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"Вы можете установить ваш кошелек на другое устройство и использовать его с нескольких устройств одновременно.","You do not have a wallet":"У вас нет кошелька","You need the wallet seed to restore this personal wallet. Write it down and keep them somewhere safe.":"Для восстановления этого кошелька нужна мнемоника. Запишите её и надёжно спрячьте.","Your backup password":"Пароль резервной копии","Your export password":"Пароль экспортируемого файла","Your nickname":"Ваше имя","Your password":"Ваш пароль","Your profile password":"Пароль вашего профиля","Your wallet has been imported correctly":"Ваш кошелёк был успешно импортирован","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Ключ вашего кошелька будет зашифрован. Пароль нельзя восстановить. Убедитесь, что вы его записали","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Мнемоника кошелька и доступ к серверу, координировавшему начальное создание кошелька. Вам всё ещё нужно {{index.m}} для совершения платежей."});
    gettextCatalog.setStrings('sq', {"(possible double spend)":"(possible double spend)","(Trusted)":"(Trusted)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} will be deducted for bitcoin networking fees","{{index.m}}-of-{{index.n}}":"{{index.m}}-of-{{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.m}}-of-{{item.n}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>","<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).":"<b>OR</b> 1 wallet export file and the remaining quorum of wallet seeds (e.g. in a 3-5 wallet: 1 wallet export file + 2 wallet seeds of any of the other copayers).","<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seed of <b>all</b> copayers in the wallet","<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet":"<b>OR</b> the wallet seeds of <b>all</b> copayers in the wallet","A multisignature bitcoin wallet":"A multisignature bitcoin wallet","About Copay":"Rreth Copay","Accept":"Prano","Add a Seed Passphrase":"Add a Seed Passphrase","Add an optional passphrase to secure the seed":"Add an optional passphrase to secure the seed","Add wallet":"Shto kuletë","Address":"Adresa","Address Type":"Address Type","Advanced":"Avancuar","Advanced Send":"Dërgim i avancuar","Agree":"Pranoj","Alias for <i>{{index.walletName}}</i>":"Nofka për <i>{{index.walletName}}</i>","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at","All transaction requests are irreversible.":"All transaction requests are irreversible.","Already have a wallet?":"Tashmë keni një kuletë?","Alternative Currency":"Monedhë alternative","Amount":"Shuma","Amount below dust threshold":"Amount below dust threshold","Amount in":"Shuma në","Applying changes":"Duke aplikuar ndryshimet","Are you sure you want to delete the backup words?":"Are you sure you want to delete the backup words?","Are you sure you want to delete this wallet?":"Jeni i sigurtë që doni të fshini këtë kuletë?","Available Balance":"Shuma në dispozicion","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Koha mesatare e konfirmimit: {{fee.nbBlocks * 10}} minuta","Back":"Prapa","Backup":"Kopje rezervë","Backup now":"Krijo kopjen rezervë tani","Backup words deleted":"Backup words deleted","Bad wallet invitation":"Bad wallet invitation","Balance By Address":"Balance By Address","Before receiving funds, it is highly recommended you backup your wallet keys.":"Before receiving funds, it is highly recommended you backup your wallet keys.","Bitcoin address":"Bitcoin adresa","Bitcoin Network Fee Policy":"Bitcoin Network Fee Policy","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.","Bitcoin URI is NOT valid!":"Bitcoin URI NUK është valid!","Broadcast Payment":"Transmeto pagesën","Broadcasting Payment":"Duke transmetuar pagesën","Broadcasting transaction":"Duke transmetuar transaksionin","Browser unsupported":"Shfletues i pambështetur","Cancel":"Anulo","CANCEL":"ANULO","Cannot join the same wallet more that once":"Cannot join the same wallet more that once","Certified by":"Çertifikuar nga","Changing wallet alias only affects the local wallet name.":"Ndërrimi i nofkës së kuletës ndikon vetëm në emrin lokal të kuletës.","Choose a backup file from your computer":"Choose a backup file from your computer","Choose a wallet to send funds":"Choose a wallet to send funds","Close":"Close","Color":"Color","Commit hash":"Commit hash","Confirm":"Confirm","Confirmations":"Confirmations","Connecting to {{create.hwWallet}} Wallet...":"Connecting to {{create.hwWallet}} Wallet...","Connecting to {{import.hwWallet}} Wallet...":"Connecting to {{import.hwWallet}} Wallet...","Connecting to {{join.hwWallet}} Wallet...":"Connecting to {{join.hwWallet}} Wallet...","Copayer already in this wallet":"Copayer already in this wallet","Copayer already voted on this spend proposal":"Copayer already voted on this spend proposal","Copayer data mismatch":"Copayer data mismatch","Copayers":"Copayers","Copied to clipboard":"Copied to clipboard","Copy this text as it is to a safe place (notepad or email)":"Copy this text as it is to a safe place (notepad or email)","Copy to clipboard":"Copy to clipboard","Could not accept payment":"Could not accept payment","Could not access Wallet Service: Not found":"Could not access Wallet Service: Not found","Could not broadcast payment":"Could not broadcast payment","Could not create address":"Could not create address","Could not create payment proposal":"Could not create payment proposal","Could not create using the specified extended private key":"Could not create using the specified extended private key","Could not create using the specified extended public key":"Could not create using the specified extended public key","Could not create: Invalid wallet seed":"Could not create: Invalid wallet seed","Could not decrypt":"Could not decrypt","Could not decrypt file, check your password":"Could not decrypt file, check your password","Could not delete payment proposal":"Could not delete payment proposal","Could not fetch payment information":"Could not fetch payment information","Could not fetch transaction history":"Could not fetch transaction history","Could not import":"Could not import","Could not import. Check input file and password":"Could not import. Check input file and password","Could not join wallet":"Could not join wallet","Could not recognize a valid Bitcoin QR Code":"Could not recognize a valid Bitcoin QR Code","Could not reject payment":"Could not reject payment","Could not send payment":"Could not send payment","Could not update Wallet":"Could not update Wallet","Create":"Create","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"Create {{requiredCopayers}}-of-{{totalCopayers}} wallet","Create new wallet":"Create new wallet","Create, join or import":"Create, join or import","Created by":"Created by","Creating Profile...":"Creating Profile...","Creating transaction":"Creating transaction","Creating Wallet...":"Creating Wallet...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB","Date":"Date","Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.":"Decrypting a paper wallet could take around 5 minutes on this device. please be patient and keep the app open.","Delete it and create a new one":"Delete it and create a new one","Delete Payment Proposal":"Delete Payment Proposal","Delete wallet":"Delete wallet","Delete Wallet":"Delete Wallet","DELETE WORDS":"DELETE WORDS","Deleting payment":"Deleting payment","Derivation Strategy":"Derivation Strategy","Details":"Details","Disabled":"Disabled","Do not include private key":"Do not include private key","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.","Download":"Download","Download CSV file":"Download CSV file","Economy":"Economy","Email":"Email","Email for wallet notifications":"Email for wallet notifications","Email Notifications":"Email Notifications","Encrypted export file saved":"Encrypted export file saved","Enter the seed words (BIP39)":"Enter the seed words (BIP39)","Enter your password":"Enter your password","Error at Wallet Service":"Error at Wallet Service","Error creating wallet":"Error creating wallet","Error importing wallet:":"Error importing wallet:","Expires":"Expires","Export":"Export","Export options":"Export options","Extended Public Keys":"Extended Public Keys","External Private Key:":"External Private Key:","Failed to export":"Failed to export","Failed to import wallets":"Failed to import wallets","Family vacation funds":"Family vacation funds","Fee":"Fee","Fee Policy":"Fee Policy","Fee policy for this transaction":"Fee policy for this transaction","Fetching Payment Information":"Fetching Payment Information","File/Text Backup":"File/Text Backup","French":"French","Funds are locked by pending spend proposals":"Funds are locked by pending spend proposals","Funds found":"Funds found","Funds received":"Funds received","Funds will be transfered to":"Funds will be transfered to","Generate new address":"Generate new address","Generate QR Code":"Generate QR Code","Generating .csv file...":"Generating .csv file...","German":"German","GET STARTED":"GET STARTED","Getting address for wallet {{selectedWalletName}} ...":"Getting address for wallet {{selectedWalletName}} ...","Global settings":"Global settings","Go back":"Go back","Greek":"Greek","Hardware wallet":"Hardware wallet","Hardware Wallet":"Hardware Wallet","Have a Backup from Copay v0.9?":"Have a Backup from Copay v0.9?","Hide advanced options":"Hide advanced options","Hide Wallet Seed":"Hide Wallet Seed","History":"History","Home":"Home","I affirm that I have read, understood, and agree with these terms.":"I affirm that I have read, understood, and agree with these terms.","Import":"Import","Import backup":"Import backup","Import from Ledger":"Import from Ledger","Import from the Cloud?":"Import from the Cloud?","Import from TREZOR":"Import from TREZOR","Import here":"Import here","Import wallet":"Import wallet","Importing wallet...":"Importing wallet...","Importing...":"Importing...","In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.":"In no event shall the authors of the software, employees and affiliates of Bitpay, copyright holders, or BitPay, Inc. be held liable for any claim, damages or other liability, whether in an action of contract, tort, or otherwise, arising from, out of or in connection with the software.","Incorrect address network":"Incorrect address network","Insufficient funds":"Insufficient funds","Insufficient funds for fee":"Insufficient funds for fee","Invalid":"Invalid","Invalid address":"Invalid address","Invitation to share a Copay Wallet":"Invitation to share a Copay Wallet","Italian":"Italian","Japanese":"Japanese","John":"John","Join":"Join","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io","Join shared wallet":"Join shared wallet","Joining Wallet...":"Joining Wallet...","Key already associated with an existing wallet":"Key already associated with an existing wallet","Language":"Language","Last Wallet Addresses":"Last Wallet Addresses","Learn more about Copay backups":"Learn more about Copay backups","Learn more about Wallet Migration":"Learn more about Wallet Migration","Loading...":"Loading...","locked by pending payments":"locked by pending payments","Locktime in effect. Please wait to create a new spend proposal":"Locktime in effect. Please wait to create a new spend proposal","Locktime in effect. Please wait to remove this spend proposal":"Locktime in effect. Please wait to remove this spend proposal","Make a payment to":"Make a payment to","me":"me","Me":"Me","Memo":"Memo","Merchant message":"Merchant message","Message":"Message","More":"More","Moved":"Moved","Multisignature wallet":"Multisignature wallet","My Bitcoin address":"My Bitcoin address","Network":"Network","Network connection error":"Network connection error","New Payment Proposal":"New Payment Proposal","No Private key":"No Private key","No transactions yet":"No transactions yet","Normal":"Normal","Not authorized":"Not authorized","Not valid":"Not valid","Note":"Note","Official English Disclaimer":"Official English Disclaimer","Once you have copied your wallet seed down, it is recommended to delete it from this device.":"Once you have copied your wallet seed down, it is recommended to delete it from this device.","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.","optional":"optional","Paper Wallet Private Key":"Paper Wallet Private Key","Participants":"Participants","Passphrase":"Passphrase","Passphrase (if you have one)":"Passphrase (if you have one)","Password":"Password","Password needed":"Password needed","Passwords do not match":"Passwords do not match","Paste invitation here":"Paste invitation here","Paste the backup plain text code":"Paste the backup plain text code","Paste your paper wallet private key here":"Paste your paper wallet private key here","Pay To":"Pay To","Payment Accepted":"Payment Accepted","Payment accepted, but not yet broadcasted":"Payment accepted, but not yet broadcasted","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.","Payment details":"Payment details","Payment Proposal":"Payment Proposal","Payment Proposal Created":"Payment Proposal Created","Payment Proposal Rejected":"Payment Proposal Rejected","Payment Proposal Rejected by Copayer":"Payment Proposal Rejected by Copayer","Payment Proposal Signed by Copayer":"Payment Proposal Signed by Copayer","Payment Proposals":"Payment Proposals","Payment Protocol Invalid":"Payment Protocol Invalid","Payment Protocol not supported on Chrome App":"Payment Protocol not supported on Chrome App","Payment rejected":"Payment rejected","Payment Rejected":"Payment Rejected","Payment request":"Payment request","Payment sent":"Payment sent","Payment Sent":"Payment Sent","Payment to":"Payment to","Pending Confirmation":"Pending Confirmation","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED","Personal Wallet":"Personal Wallet","Please enter the required fields":"Please enter the required fields","Please enter the seed words":"Please enter the seed words","Please enter the wallet seed":"Please enter the wallet seed","Please upgrade Copay to perform this action":"Please upgrade Copay to perform this action","Please, select your backup file":"Please, select your backup file","Portuguese":"Portuguese","Preferences":"Preferences","Preparing backup...":"Preparing backup...","Priority":"Priority","QR Code":"QR Code","QR-Scanner":"QR-Scanner","Receive":"Receive","Received":"Received","Recipients":"Recipients","Reconnecting to Wallet Service...":"Reconnecting to Wallet Service...","Recreate":"Recreate","Recreating Wallet...":"Recreating Wallet...","Reject":"Reject","Rejecting payment":"Rejecting payment","Release Information":"Release Information","Repeat password":"Repeat password","Request a specific amount":"Request a specific amount","Request Password for Spending Funds":"Request Password for Spending Funds","Requesting Ledger Wallet to sign":"Requesting Ledger Wallet to sign","Required":"Required","Required number of signatures":"Required number of signatures","Retrying...":"Retrying...","Russian":"Russian","Save":"Save","Saving preferences...":"Saving preferences...","Scan addresses for funds":"Scan addresses for funds","Scan Finished":"Scan Finished","Scan status finished with error":"Scan status finished with error","Scan Wallet Funds":"Scan Wallet Funds","Scanning wallet funds...":"Scanning wallet funds...","Scanning Wallet funds...":"Scanning Wallet funds...","See it on the blockchain":"See it on the blockchain","Seed passphrase":"Seed passphrase","Seed Passphrase":"Seed Passphrase","Select a backup file":"Select a backup file","Select a wallet":"Select a wallet","Self-signed Certificate":"Self-signed Certificate","Send":"Send","Send All":"Send All","Send all by email":"Send all by email","Send by email":"Send by email","Sending funds...":"Sending funds...","Sent":"Sent","Server":"Server","Server response could not be verified":"Server response could not be verified","Session log":"Session log","SET":"SET","Set up a Export Password":"Set up a Export Password","Set up a password":"Set up a password","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.","settings":"settings","Share address":"Share address","Share invitation":"Share invitation","Share this invitation with your copayers":"Share this invitation with your copayers","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.","Shared Wallet":"Shared Wallet","Show advanced options":"Show advanced options","Show Wallet Seed":"Show Wallet Seed","Signatures rejected by server":"Signatures rejected by server","Signing payment":"Signing payment","SKIP BACKUP":"SKIP BACKUP","Spanish":"Spanish","Specify your wallet seed":"Specify your wallet seed","Spend proposal is not accepted":"Spend proposal is not accepted","Spend proposal not found":"Spend proposal not found","Still not done":"Still not done","Success":"Success","Sweep paper wallet":"Sweep paper wallet","Sweep Wallet":"Sweep Wallet","Tap to retry":"Tap to retry","Terms of Use":"Terms of Use","Testnet":"Testnet","The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.":"The authors of the software, employees and affiliates of Bitpay, copyright holders, and BitPay, Inc. cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Bitcoin network.","The Ledger Chrome application is not installed":"The Ledger Chrome application is not installed","The payment was created but could not be completed. Please try again from home screen":"The payment was created but could not be completed. Please try again from home screen","The payment was created but could not be signed. Please try again from home screen":"The payment was created but could not be signed. Please try again from home screen","The payment was removed by creator":"The payment was removed by creator","The payment was signed but could not be broadcasted. Please try again from home screen":"The payment was signed but could not be broadcasted. Please try again from home screen","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.","The seed could require a passphrase to be imported":"The seed could require a passphrase to be imported","The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.":"The software does not constitute an account where BitPay or other third parties serve as financial intermediaries or custodians of your bitcoin.","The software you are about to use functions as a free, open source, and multi-signature digital wallet.":"The software you are about to use functions as a free, open source, and multi-signature digital wallet.","The spend proposal is not pending":"The spend proposal is not pending","The wallet \"{{walletName}}\" was deleted":"The wallet \"{{walletName}}\" was deleted","There are no wallets to make this payment":"There are no wallets to make this payment","There is an error in the form":"There is an error in the form","This transaction has become invalid; possibly due to a double spend attempt.":"This transaction has become invalid; possibly due to a double spend attempt.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.","Time":"Time","To":"To","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need","To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.":"To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement.","too long!":"too long!","Total":"Total","Total Locked Balance":"Total Locked Balance","Total number of copayers":"Total number of copayers","Transaction":"Transaction","Transaction already broadcasted":"Transaction already broadcasted","Translation Credits":"Translation Credits","Translators":"Translators","Type the Seed Word (usually 12 words)":"Type the Seed Word (usually 12 words)","Unable to send transaction proposal":"Unable to send transaction proposal","Unconfirmed":"Unconfirmed","Unit":"Unit","Unsent transactions":"Unsent transactions","Updating Wallet...":"Updating Wallet...","Use Ledger hardware wallet":"Use Ledger hardware wallet","Use TREZOR hardware wallet":"Use TREZOR hardware wallet","Use Unconfirmed Funds":"Use Unconfirmed Funds","Username":"Username","Version":"Version","View":"View","Waiting for copayers":"Waiting for copayers","Waiting...":"Waiting...","Wallet":"Wallet","Wallet Alias":"Wallet Alias","Wallet already exists":"Wallet already exists","Wallet Already Imported:":"Wallet Already Imported:","Wallet already in Copay:":"Wallet already in Copay:","Wallet Configuration (m-n)":"Wallet Configuration (m-n)","Wallet Export":"Wallet Export","Wallet Id":"Wallet Id","Wallet incomplete and broken":"Wallet incomplete and broken","Wallet Information":"Wallet Information","Wallet Invitation":"Wallet Invitation","Wallet Invitation is not valid!":"Wallet Invitation is not valid!","Wallet is full":"Wallet is full","Wallet is not complete":"Wallet is not complete","Wallet name":"Wallet name","Wallet Name (at creation)":"Wallet Name (at creation)","Wallet Network":"Wallet Network","Wallet not found":"Wallet not found","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed","Wallet Seed":"Wallet Seed","Wallet Seed could require a passphrase to be imported":"Wallet Seed could require a passphrase to be imported","Wallet seed is invalid":"Wallet seed is invalid","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Wallet seed not available. You can still export it from Advanced &gt; Export.","Wallet service not found":"Wallet service not found","WARNING: Backup needed":"WARNING: Backup needed","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.","Warning: this transaction has unconfirmed inputs":"Warning: this transaction has unconfirmed inputs","WARNING: UNTRUSTED CERTIFICATE":"WARNING: UNTRUSTED CERTIFICATE","WARNING: Wallet not registered":"WARNING: Wallet not registered","Warning!":"Warning!","We reserve the right to modify this disclaimer from time to time.":"We reserve the right to modify this disclaimer from time to time.","WELCOME TO COPAY":"WELCOME TO COPAY","While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.":"While the software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, we cannot guarantee that there will be no bugs in the software.","Write it down and keep them somewhere safe.":"Write it down and keep them somewhere safe.","Wrong number of seed words:":"Wrong number of seed words:","Wrong password":"Wrong password","Yes":"Yes","You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.":"You acknowledge that your use of this software is at your own discretion and in compliance with all applicable laws.","You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.":"You are responsible for safekeeping your passwords, private key pairs, PINs and any other codes you use to access the software.","You assume any and all risks associated with the use of the software.":"You assume any and all risks associated with the use of the software.","You can safely install your wallet on another device and use it from multiple devices at the same time.":"You can safely install your wallet on another device and use it from multiple devices at the same time.","You do not have a wallet":"You do not have a wallet","You need the wallet seed to restore this personal wallet.":"You need the wallet seed to restore this personal wallet.","Your backup password":"Your backup password","Your export password":"Your export password","Your nickname":"Your nickname","Your password":"Your password","Your profile password":"Your profile password","Your wallet has been imported correctly":"Your wallet has been imported correctly","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down","Your Wallet Seed":"Your Wallet Seed","Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend.":"Your wallet seed and access to the server that coordinated the initial wallet creation. You still need {{index.m}} keys to spend."});
    gettextCatalog.setStrings('tr', {"(possible double spend)":"(olası çift harcama)","(Trusted)":"(Güvenilir)","{{fee}} will be deducted for bitcoin networking fees":"{{fee}} bitcoin ağ ücreti olarak düşülecektir","{{index.m}}-of-{{index.n}}":"{{index.m}} te {{index.n}}","{{item.m}}-of-{{item.n}}":"{{item.n}} te {{item.m}}","{{len}} wallets imported. Funds scanning in progress. Hold on to see updated balance":"{{len}} cüzdanı içe aktarıldı. Fonlar taranırken ve güncellenirken bekleyiniz","* A payment proposal can be deleted if 1) you are the creator, and no other copayer has signed, or 2) 24 hours have passed since the proposal was created.":"* Ödeme isteği; 1) kaynağı sizseniz, başka bir kullanıcı tarafından imzalanmamışsa veya 2) üzerinden 24 saat geçmişse silinebilir.","<b>IF YOU LOSE ACCESS TO YOUR COPAY WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT COPAY WALLET WILL BECOME INACCESSIBLE.</b>":"<b>COPAY CÜZDANINIZA ERİŞİMİNİZİ KAYBEDER VEYA GEREKLİ ŞİFRESİ İLE BİRLİKTE CÜZDANINIZI ÖZEL ANAHTARLA BİRLİKTE YEDEKLEMEZSENİZ, COPAY CÜZDANINIZDAKİ BİTCOİN'LERE ERİŞİMİNİZİN KALMAYACAĞINI KABUL EDER VE ONAYLIYORSUNUZ DEMEKTİR.</b>","A multisignature bitcoin wallet":"Çoklu imzalı bitcoin cüzdanı","About Copay":"Copay Hakkında","Accept":"Onay","Add an optional passphrase to secure the seed":"Kurtarma sözcüklerinin güvenliği için opsiyonel parola ekle","Add wallet":"Cüzdan ekle","Address":"Adres","Address Type":"Adres Türü","Advanced":"Gelişmiş","Advanced Send":"Gelişmiş Gönderme","Agree":"Kabul","Alias for <i>{{index.walletName}}</i>":"<i>{{index.walletName}}</i> için takma ad","All contributions to Copay's translation are welcome. Sign up at crowdin.com and join the Copay project at":"Copay'nın çevirisi için tüm katkılarınızı bekliyoruz. Crowdin.com sitesine kayıt olun ve Copay Projesi'ne katılın","All transaction requests are irreversible.":"Işlem isteklerinin hiç biri geri alınamaz.","Already have a wallet?":"Zaten bir cüzdanınız var mı?","Alternative Currency":"Alternatif Para Birimi","Amount":"Tutar","Amount below dust threshold":"Kabul edilenden düşük miktar","Amount in":"Tutar","Are you sure you want to delete the backup words?":"Yedekleme kelimelerini silmek istediğinizden emin misiniz?","Are you sure you want to delete this wallet?":"Bu cüzdanı silmek istediğinizden emin misiniz?","Available Balance":"Kullanılabilir Bakiye","Average confirmation time: {{fee.nbBlocks * 10}} minutes":"Ortalama onay süresi: {{fee.nbBlocks * 10}} dakika","Back":"Geri","Backup":"Yedekleme","Backup now":"Şimdi yedekle","Backup words deleted":"Yedekleme kelimeleri silindi","Bad wallet invitation":"Geçersiz cüzdan daveti","Balance By Address":"Adrese göre Bakiye","Before receiving funds, it is highly recommended you backup your wallet keys.":"Para almadan önce cüzdanınızı mutlaka yedeklemeniz önerilir.","Bitcoin address":"Bitcoin adresi","Bitcoin Network Fee Policy":"Bitcoin ağ ücret politikası","Bitcoin transactions may include a fee collected by miners on the network. The higher the fee, the greater the incentive a miner has to include that transaction in a block. Actual fees are determined based on network load and the selected policy.":"Bitcoin işlemlerine ağda madenciler tarafından toplanan ücret dahildir. Daha yüksek ücret, madenciler için işleminizi bloklarına eklemek için daha teşvik edicidir. Gerçek ücretler ağ yüküne ve seçili ilkeye göre belirlenir.","Bitcoin URI is NOT valid!":"Bitcoin URI geçerli değil!","Broadcast Payment":"Ödemeyi Yayınla","Broadcasting Payment":"Ödeme Yayınlanıyor","Broadcasting transaction":"İşlem yayınlanıyor","Browser unsupported":"Desteklenmeyen tarayıcı","Cancel":"İptal","CANCEL":"İPTAL","Cannot join the same wallet more that once":"Aynı cüzdana birden fazla kez girilemez","Certified by":"Tarafından sertifikalı","Changing wallet alias only affects the local wallet name.":"Cüzdan takma adı değişikliği sadece yerel cüzdan adını etkiler.","Choose a backup file from your computer":"Bilgisayarınızdan bir yedek dosyası seçin","Close":"Kapat","Color":"Renk","Commit hash":"Commit hash","Confirm":"Onayla","Confirmations":"Onaylı","Copayer already in this wallet":"Copayer zaten bu cüzdan içinde","Copayer already voted on this spend proposal":"Copayer bu teklifi oylamış","Copayer data mismatch":"Copayer veri uyuşmazlığı","Copayers":"Copayers","Copied to clipboard":"Panoya kopyalandı","Copy this text as it is to a safe place (notepad or email)":"Bu metni güvenli bir yere kopyalayın (Not Defteri veya e-posta)","Copy to clipboard":"Panoya kopyala","Could not accept payment":"Ödeme kabul edilemedi","Could not access Wallet Service: Not found":"Cüzdan hizmetine erişilemedi: Bulunamadı","Could not broadcast payment":"Ödeme yayınlanamadı","Could not create address":"Adres oluşturulamadı","Could not create payment proposal":"Ödeme teklifi oluşturulamadı","Could not create using the specified extended private key":"Belirtilen genişletilmiş özel anahtar kullanılarak oluşturulamadı","Could not create using the specified extended public key":"Belirtilen genişletilmiş genel anahtar kullanılarak oluşturulamadı","Could not create: Invalid wallet seed":"Oluşturulamadı: geçersiz cüzdan kelimeleri","Could not decrypt file, check your password":"Dosyanın şifresi çözülemedi, parolanızı kontrol edin","Could not delete payment proposal":"Ödeme teklifi silinemedi","Could not fetch payment information":"Ödeme bilgileri alınamadı","Could not fetch transaction history":"İşlem geçmişi alınamadı","Could not import":"İçe alınamadı","Could not import. Check input file and password":"İçe alınamadı. Dosyayı ve parolanızı kontrol edin","Could not join wallet":"Cüzdana katılma başarısız","Could not recognize a valid Bitcoin QR Code":"Geçerli bir Bitcoin QR kodu tanımıyor","Could not reject payment":"Ödeme reddedilemedi","Could not send payment":"Ödeme gönderemedi","Could not update Wallet":"Cüzdan güncellenemedi","Create":"Oluştur","Create {{requiredCopayers}}-of-{{totalCopayers}} wallet":"{{totalCopayers}} {{requiredCopayers}} için cüzdan oluştur","Create new wallet":"Yeni cüzdan oluştur","Create, join or import":"Oluştur, birleştir veya içe al","Created by":"Oluşturan Kişi","Creating Profile...":"Profil oluşturuluyor...","Creating transaction":"İşlem oluşturuluyor","Creating Wallet...":"Cüzdan oluşturuluyor...","Current fee rate for this policy: {{fee.feePerKBUnit}}/kiB":"Bu ilke için geçerli ücret oranı: {{fee.feePerKBUnit}}/kiB","Date":"Tarih","Delete it and create a new one":"Sil ve yeni bir tane oluştur","Delete Payment Proposal":"Ödeme teklifini sil","Delete wallet":"Cüzdanı sil","Delete Wallet":"Cüzdanı Sil","DELETE WORDS":"KELİMELERİ SİL","Deleting payment":"Ödeme siliniyor","Derivation Strategy":"Türetme Stratejisi","Details":"Ayrıntılar","Disabled":"Devre Dışı","Do not include private key":"Özel anahtarı dahil etme","Don't see your language on Crowdin? Contact the Owner on Crowdin! We'd love to support your language.":"Kendi dilinizi görmüyor musunuz? Crowdin kurucusu ile irtibata geçin! Dilinizi desteklemekten mutluluk duyarız.","Download":"İndir","Download CSV file":"CSV dosyasını indir","Economy":"Ekonomik","Email":"E-posta","Email for wallet notifications":"E-posta ile cüzdan bildirimleri","Email Notifications":"E-posta Bildirimleri","Encrypted export file saved":"Dışa alınan şifrelenmiş dosya kaydedildi","Enter the seed words (BIP39)":"Kurtarma sözcüklerini girin (BIP39)","Enter your password":"Parolanızı girin","Error at Wallet Service":"Cüzdan hizmeti hatası","Error creating wallet":"Cüzdan oluşturma hatası","Error importing wallet:":"Cüzdan içe alma hatası:","Expires":"Sona Erme","Export options":"Dışa aktarma seçenekleri","Extended Public Keys":"Genişletilmiş Genel Anahtarlar","Failed to export":"Dışa aktarma başarısız oldu","Failed to import wallets":"Cüzdan içe alma başarısız oldu","Family vacation funds":"Aile tatil fonları","Fee":"Ücret","Fee Policy":"Ücret politikası","Fee policy for this transaction":"Bu işlem için ücret politikası","Fetching Payment Information":"Ödeme Bilgileri Alınıyor","File/Text Backup":"Dosya/Metin Yedekleme","French":"Fransızca","Funds are locked by pending spend proposals":"Fonlar bekleyen işlem teklifleri tarafından kilitlendi","Funds received":"Ödeme alındı","Generate new address":"Yeni adres oluştur","Generate QR Code":"QR kodu oluştur","Generating .csv file...":"Csv dosyası oluşturuluyor...","German":"Almanca","GET STARTED":"Başlarken","Getting address for wallet {{selectedWalletName}} ...":"{{selectedWalletName}} için cüzdan adresi alınıyor...","Global settings":"Genel ayarlar","Go back":"Geri dön","Greek":"Yunanca","Hardware wallet":"Donanım cüzdanı","Have a Backup from Copay v0.9?":"Copay v0.9 sürümünden bir yedeğiniz mi var?","Hide advanced options":"Gelişmiş seçenekleri gizle","Hide Wallet Seed":"Cüzdan Sözcüklerini Gizle","History":"Geçmiş","Home":"Ana sayfa","I affirm that I have read, understood, and agree with these terms.":"Bu koşulları okuduğumu, anladığımı ve kabul ettiğimi onaylıyorum.","Import":"İçe aktar","Import backup":"Yedeği içe aktar","Import from the Cloud?":"Yedeği buluttan mı aktaracaksınız?","Import here":"Buraya içe aktar","Import wallet":"Cüzdanı içe aktar","Importing wallet...":"Cüzdan içe aktarılıyor...","Importing...":"İçe aktarılıyor...","Incorrect address network":"Yanlış adres ağı","Insufficient funds":"Yetersiz bakiye","Insufficient funds for fee":"Ücret için yetersiz bakiye","Invalid":"Geçersiz","Invalid address":"Geçersiz adres","Invitation to share a Copay Wallet":"Copay cüzdanını paylaşmak için davet","Italian":"İtalyanca","Japanese":"Japonca","John":"John","Join":"Katıl","Join my Copay wallet. Here is the invitation code: {{secret}} You can download Copay for your phone or desktop at https://copay.io":"Copay cüzdanıma katılın. İşte davetiye kodu: {{secret}} Copay'i telefon veya masaüstü ortamlarına indirmek için https://copay.io","Join shared wallet":"Paylaşılan cüzdana katıl","Joining Wallet...":"Cüzdana katılınılıyor...","Language":"Dil","Last Wallet Addresses":"Son Cüzdan Adresleri","Learn more about Copay backups":"Copay yedeklemeleri hakkında daha fazla bilgi edinin","Learn more about Wallet Migration":"Cüzdan birleştirme hakkında daha fazla bilgi","Loading...":"Yükleneniyor...","locked by pending payments":"bekleyen ödemeler yüzünden kilitlendi","Locktime in effect. Please wait to create a new spend proposal":"Yeni bir harcama teklifi oluşturmak için lütfen biraz bekleyin","Locktime in effect. Please wait to remove this spend proposal":"Harcama teklifini kaldırmak için lütfen biraz bekleyin","Make a payment to":"Ödeme yapılacak kişi","me":"ben","Me":"Beni","Memo":"Kısa Not","Merchant message":"Tüccar mesajı","Message":"Mesajınız","Moved":"Taşındı","My Bitcoin address":"Bitcoin adresim","Network":"Ağ","Network connection error":"Ağ bağlantı hatası","New Payment Proposal":"Yeni ödeme teklifi","No transactions yet":"Henüz hiç bir işlem yok","Normal":"Normal","Not authorized":"Yetkili değil","Not valid":"Geçerli değil","Note":"Not","Official English Disclaimer":"Resmi İngilizce Yasal Uyarı","Only Main (not change) addresses are shown. The addresses on this list were not verified locally at this time.":"Yalnızca ana (değişmemiş) adresler gösteriliyor. Bu listedeki adresler yerel olarak şu anda doğrulanmadı.","optional":"isteğe bağlı","Participants":"Katılımcılar","Passphrase":"Parola","Password":"Parola","Password needed":"Parola gerekli","Passwords do not match":"Parolalar e��leşmiyor","Paste invitation here":"Daveti buraya yapıştır","Paste the backup plain text code":"Yedek düz metin kodu yapı��tır��n","Pay To":"Ödenecek Kişi","Payment Accepted":"Ödeme Kabul Edildi","Payment accepted, but not yet broadcasted":"Ödeme kabul edildi ama henüz yayınlanmadı","Payment accepted. It will be broadcasted by Glidera. In case there is a problem, it can be deleted 6 hours after it was created.":"Ödeme kabul edildi ve Glidera tarafından yayınlanacak. Bir sorun oluşması durumunda, yaratıldıktan 6 saat sonra silinebilir.","Payment details":"Ödeme detayları","Payment Proposal":"Ödeme Teklifi","Payment Proposal Created":"Ödeme Teklifi Oluşturuldu","Payment Proposal Rejected":"Ödeme Teklifi Reddedildi","Payment Proposal Rejected by Copayer":"Ödeme teklifi bir Copayer tarafından reddedildi","Payment Proposal Signed by Copayer":"Ödeme teklifi bir Copayer tarafından kabul edildi","Payment Proposals":"Ödeme Teklifleri","Payment Protocol Invalid":"Ödeme Protokolü Geçersiz","Payment Protocol not supported on Chrome App":"Ödeme Protokolü Chrome uygulaması üzerinde desteklenmiyor","Payment rejected":"Ödeme reddedildi","Payment Rejected":"Ödeme Reddedildi","Payment request":"Ödeme talebi","Payment sent":"Ödeme gönderildi","Payment Sent":"Ödeme Gönderildi","Payment to":"Ödenecek","Pending Confirmation":"Onay Bekleniyor","Permanently delete this wallet. THIS ACTION CANNOT BE REVERSED":"Bu cüzdanı kalıcı olarak sil. BU EYLEM GERİ ALINAMAZ","Personal Wallet":"Kişisel Cüzdan","Please enter the required fields":"Lütfen gerekli alanları girin","Please enter the seed words":"Lütfen kurtarma sözcüklerini girin","Please enter the wallet seed":"Lütfen cüzdan sözcüklerini girin","Please upgrade Copay to perform this action":"Bu eylemi gerçekleştirmek için lütfen Copay sürümünü yükseltin","Please, select your backup file":"Lütfen yedek dosyanızı seçin","Portuguese":"Portekizce","Preferences":"Tercihler","Preparing backup...":"Yedekleme hazırlan��yor...","Priority":"Öncelikli","QR Code":"QR Kodu","QR-Scanner":"QR-Tarayıcı","Receive":"Alma","Received":"Alındı","Recipients":"Alıcılar","Reconnecting to Wallet Service...":"Cüzdan servisine bağlanıyor...","Recreate":"Yeniden oluştur","Recreating Wallet...":"Cüzdan yeniden oluşturuluyor...","Reject":"Reddet","Rejecting payment":"Ödeme reddediliyor","Release Information":"Sürüm Bilgileri","Repeat password":"Şifreyi tekrarla","Request a specific amount":"Belirli bir miktar iste","Requesting Ledger Wallet to sign":"Ana defter, imzalanmak için isteniyor","Required":"Zorunlu","Required number of signatures":"Gerekli imza sayısı","Retrying...":"Yeniden deneniyor...","Russian":"Rusça","Save":"Kaydet","Saving preferences...":"Tercihler kaydediliyor...","Scan addresses for funds":"Fonlar için adresleri tara","Scan Finished":"Tarama tamamlandı","Scan status finished with error":"Tarama işlemi hatalı bitti","Scanning Wallet funds...":"Cüzdan para miktarı taranıyor...","See it on the blockchain":"Blockchain üzerinde gör","Seed passphrase":"Kurtarma sözcükleri parolası","Seed Passphrase":"Kurtarma Sözcükleri Parolası","Select a backup file":"Yedek dosyasını seçin","Select a wallet":"Bir cüzdan seçin","Self-signed Certificate":"Kendinden imzalı Sertifika","Send":"Gönder","Send All":"Tümünü Gönder","Send by email":"E-posta ile gönder","Sent":"Gönderildi","Server":"Sunucu","Server response could not be verified":"Sunucu yanıtı doğrulanamadı","Session log":"Oturum günlüğü","SET":"AYARLA","Set up a Export Password":"Dışa Alım parolası ayarla","Set up a password":"Parola ayarla","Setting up email notifications could weaken your privacy, if the wallet service provider is compromised. Information available to an attacker would include your wallet addresses and its balance, but no more.":"E-posta bildirimleri ayarlamak gizliliğinizi zayıflatabilir. Cüzdan sağlayıcısı ele geçirilirse, bazı bilgiler saldırganların eline geçebilir ancak bu bilgiler sadece cüzdan adresiniz ve bakiyeniz olacaktır.","Share address":"Adresi paylaş","Share invitation":"Davet paylaş","Share this invitation with your copayers":"Bu daveti copayers ile paylaş","Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.":"Ödemeler için bu cüzdan adresinizi paylaşın. Gizliliğinizi korumak için, her kullandığınızda yeni bir adres otomatik olarak üretilir.","Shared Wallet":"Paylaşımlı Cüzdan","Show advanced options":"Gelişmiş seçenekleri göster","Show Wallet Seed":"Cüzdan Kurtarma Sözcüklerini Göster","Signatures rejected by server":"İmzalar sunucu tarafından reddedildi","Signing payment":"Ödeme imzalanıyor","SKIP BACKUP":"YEDEKLEMEYİ GEÇ","Spanish":"İspanyolca","Spend proposal is not accepted":"Harcama teklifi kabul edilmedi","Spend proposal not found":"Harcama teklifi bulunamadı","Still not done":"Halen tamamlanmadı","Success":"Başarılı","Tap to retry":"Yeniden denemek için dokunun","Terms of Use":"Kullanım Şartları","Testnet":"TestNet","The Ledger Chrome application is not installed":"Ledger Chrome uygulaması kurulu değil","The payment was created but could not be completed. Please try again from home screen":"Ödeme oluşturuldu ancak tamamlanamadı. Lütfen ana ekrandan yeniden deneyin","The payment was created but could not be signed. Please try again from home screen":"Ödeme oluşturuldu ancak tamamlanamadı. Lütfen ana ekrandan yeniden deneyin","The payment was removed by creator":"Ödeme yaratıcısı tarafından kaldırıldı","The payment was signed but could not be broadcasted. Please try again from home screen":"Ödeme imzalandı ancak değil yayınlanmadı. Lütfen ana ekrandan yeniden deneyin","The private key for this wallet is encrypted. Exporting keep the private key encrypted in the export archive.":"Bu cüzdan için özel anahtar şifrelidir. Dışa alım durumunda yine şifreli kalacaktır.","The seed could require a passphrase to be imported":"Kurtarma sözcükleri içe alım için parola gerektirebilir","The spend proposal is not pending":"Harcama teklifi beklemede değil","The wallet \"{{walletName}}\" was deleted":"\"{{walletName}}\" cüzdanı silindi","There are no wallets to make this payment":"Bu ödemeyi yapmak için hiçbir cüzdan yok","There is an error in the form":"Formda bir hata oluştu","This transaction has become invalid; possibly due to a double spend attempt.":"Bu işlem muhtemel bir çift harcama girişimi yüzünden geçersiz hale geldi.","This wallet is not registered at the given Bitcore Wallet Service (BWS). You can recreate it from the local information.":"Bu cüzdan Bitcore cüzdan Servisi'ne (BWS) kayıtlı değil. Yerel bilgilerle yeniden oluşturabilirsiniz.","Time":"Zaman","To":"Alıcı","To restore this {{index.m}}-{{index.n}} <b>shared</b> wallet you will need":"{{index.m}}-{{index.n}} kurtarma için <b>paylaşılan</b> bir cüzdana ihtiyacınız var","too long!":"çok uzun!","Total":"Toplam","Total Locked Balance":"Toplam Kilitli Bakiye","Total number of copayers":"Copayers toplam sayısı","Transaction":"İşlem","Transaction already broadcasted":"İşlem zaten yayınlanmış","Translation Credits":"Çeviride Emeği Geneçler","Translators":"Çevirmenler","Type the Seed Word (usually 12 words)":"Kurtarma Sözcüklerini Girin (genelde 12 sözcük)","Unable to send transaction proposal":"İşlem teklifi gönderilemedi","Unconfirmed":"Onaylanmamış","Unit":"Birim","Unsent transactions":"Gönderilmemiş işlemler","Updating Wallet...":"Cüzdan güncelleniyor...","Use Unconfirmed Funds":"Doğrulanmamış fonları kullan","Username":"Kullanıcı adı","Version":"Sürüm","Waiting for copayers":"Copayers bekleniyor","Waiting...":"Bekliyor...","Wallet":"Cüzdan","Wallet Alias":"Cüzdan takma adı","Wallet already exists":"Cüzdan zaten var","Wallet Already Imported:":"Cüzdan zaten içe alındı:","Wallet already in Copay:":"Copay'de kayıtlı olan cüzdan:","Wallet Configuration (m-n)":"Cüzdan Yapılandırma (m-n)","Wallet Id":"Cüzdan Id","Wallet incomplete and broken":"Cüzdan eksik ve arızalı","Wallet Information":"Cüzdan Bilgisi","Wallet Invitation":"Cüzdan daveti","Wallet Invitation is not valid!":"Cüzdan daveti geçerli değil!","Wallet is full":"Cüzdan dolu","Wallet is not complete":"Cüzdan tamamlanmadı","Wallet name":"Cüzdan ismi","Wallet Name (at creation)":"Cüzdan ismi (oluşturmadaki)","Wallet Network":"Cüzdan Ağı","Wallet not found":"Cüzdan bulunamadı","Wallet not registed at the Wallet Service. Recreate it from \"Create Wallet\" using \"Advanced Options\" to set your seed":"Cüzdan kayıtlı değil. Kurtarma sözcükleri belirlemek için Cüzdan Servisinden kaydedebilirsiniz","Wallet Seed":"Cüzdan Kurtarma Sözcükleri","Wallet Seed could require a passphrase to be imported":"Cüzdan kurtarma sözcükleri içe alım için parola gerektirebilir","Wallet seed is invalid":"Cüzdan kurtarma sözcükleri geçersiz","Wallet seed not available. You can still export it from Advanced &gt; Export.":"Cüzdan kurtarma sözcükleri kullanılabilir değil. Yine de Gelişmiş &gt; Dışa Alım adımından dışa alabilirsiniz.","Wallet service not found":"Cüzdan hizmeti bulunamadı","WARNING: Backup needed":"Uyarı: Yedekleme gereklidir","WARNING: Not including the private key allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"Özel anahtar olmadan cüzdanınızdaki miktarı ve işlem geçmişini görebilir, ödeme isteği oluşturabilirsiniz ancak herhangi bir ödeme gönderemezsiniz (sign) yani cüzdandaki paraya <b>ulaşılamaz</b> olarak kalır.","WARNING: Passphrase cannot be recovered. <b>Be sure to write it down</b>. The wallet can not be restored without the passphrase.":"UYARI: Parola kurtarma seçeneği yoktur. <b>Bir yere yazdığınızdan emin olun</b>. Cüzdanınız parola olmadan kurtarılamaz.","WARNING: The private key of this wallet is not available. The export allows to check the wallet balance, transaction history, and create spend proposals from the export. However, does not allow to approve (sign) proposals, so <b>funds will not be accessible from the export</b>.":"UYARI: Bu cüzdan için için özel anahtar kullanılabilir değil. Özel anahtar olmadan cüzdanınızdaki miktarı ve işlem geçmişini görebilir, ödeme isteği oluşturabilirsiniz ancak herhangi bir ödeme gönderemezsiniz (sign) yani cüzdandaki paraya <b>ulaşılamaz</b> olarak kalır.","WARNING: This seed was created with a passphrase. To recover this wallet both the mnemonic and passphrase are needed.":"Kurtarma sözcükleri bir parola ile desteklendi. Bu cüzdanı kurtarmak için, kurtarma sözcüklerine ve parolaya ihtiyaç olacaktır.","Warning: this transaction has unconfirmed inputs":"Uyarı: Bu işlem doğrulanmamış girişler içeriyor","WARNING: UNTRUSTED CERTIFICATE":"UYARI: GÜVENİLİR OLMAYAN SERTİFİKA","WARNING: Wallet not registered":"UYARI: Cüzdan kayıtlı değil","Warning!":"Uyarı!","We reserve the right to modify this disclaimer from time to time.":"Zaman zaman bu reddi değiştirme hakkımızı saklı tutarız.","WELCOME TO COPAY":"COPAY'E HOŞGELDİNİZ","Write it down and keep them somewhere safe.":"Not edin ve güvenli bir yerde saklayın.","Wrong number of seed words:":"Kurtarma sözcükleri sayısı yanlış:","Wrong password":"Hatalı şifre","Yes":"Evet","You can safely install your wallet on another device and use it from multiple devices at the same time.":"Cüzdanınızı başka bir cihaza güvenle kurabilir ve aynı anda birden çok platformda kullanabilirsiniz.","You do not have a wallet":"Cüzdanınız yok","You need the wallet seed to restore this personal wallet.":"Bu cüzdanı yüklemek için kurtarma sözcüklerine ihtiyacınız var.","Your backup password":"Yedekleme parolanız","Your export password":"Dışa alım parolanız","Your nickname":"Takma adınız","Your password":"Parolanız","Your profile password":"Profil parolanız","Your wallet has been imported correctly":"Cüzdan başarıyla içe aktarıldı","Your wallet key will be encrypted. Password cannot be recovered. Be sure to write it down":"Cüzdan anahtarınız şifrelenecek ve parolanız için bir kurtarma seçeneği olmayacak. Parolanızı bir yere yazdığınızdan emin olun","Your Wallet Seed":"Cüzdan Kurtama Sözcükleriniz"});
/* jshint +W100 */
}]);
window.version="1.7.1";
window.commitHash="8138e5c";
'use strict';

angular.element(document).ready(function() {

  // Run copayApp after device is ready.
  var startAngular = function() {
    angular.bootstrap(document, ['copayApp']);
  };

  var handleBitcoinURI = function(url) {
    if (!url) return;
    if (url.indexOf('glidera') != -1) {
      url = '#/uri-glidera' + url.replace('bitcoin://glidera', '');
    } else {
      url = '#/uri-payment/' + url;
    }
    setTimeout(function() {
      window.location = url;
    }, 1000);
  };


  /* Cordova specific Init */
  if (window.cordova !== undefined) {

    document.addEventListener('deviceready', function() {

      var secondBackButtonPress = 'false';
      var intval = setInterval(function() {
        secondBackButtonPress = 'false';
      }, 5000);

      document.addEventListener('pause', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/pause///';
          }, 100);
        }
      }, false);

      document.addEventListener('resume', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/resume///';
          }, 100);
        }
        setTimeout(function() {
          var loc = window.location;
          var ignoreMobilePause = loc.toString().match(/(glidera|buy|sell)/) ? true : false;
          window.ignoreMobilePause = ignoreMobilePause;
        }, 100);
      }, false);

      // Back button event

      document.addEventListener('backbutton', function() {

        var loc = window.location;
        var fromDisclaimer = loc.toString().match(/disclaimer/) ? 'true' : '';
        var fromHome = loc.toString().match(/index\.html#\/$/) ? 'true' : '';
        if (!window.ignoreMobilePause) {
          window.location = '#/cordova/backbutton/' + fromHome + '/' + fromDisclaimer + '/' + secondBackButtonPress;
          if (secondBackButtonPress == 'true') {
            clearInterval(intval);
          } else {
            secondBackButtonPress = 'true';
          }
        }
        setTimeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
      }, false);

      document.addEventListener('menubutton', function() {
        window.location = '#/preferences';
      }, false);

      setTimeout(function() {
        navigator.splashscreen.hide();
      }, 1000);

      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
      window.handleOpenURL = handleBitcoinURI;

      window.plugins.touchid.isAvailable(
        function(msg) {
          window.touchidAvailable = true;
        }, // success handler: TouchID available
        function(msg) {
          window.touchidAvailable = false;
        } // error handler: no TouchID available
      );

      startAngular();
    }, false);
  } else {
    try {
      window.handleOpenURL = handleBitcoinURI;
      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
    } catch (e) {}

    startAngular();
  }

});

window.TREZOR_CHROME_URL = './bower_components/trezor-connect/chrome/wrapper.html';


this.TrezorConnect = (function () {
    'use strict';

    var chrome = window.chrome;
    var IS_CHROME_APP = chrome && chrome.app && chrome.app.window;

    var ERR_TIMED_OUT = 'Loading timed out';
    var ERR_WINDOW_CLOSED = 'Window closed';
    var ERR_WINDOW_BLOCKED = 'Window blocked';
    var ERR_ALREADY_WAITING = 'Already waiting for a response';
    var ERR_CHROME_NOT_CONNECTED = 'Internal Chrome popup is not responding.';

    var DISABLE_LOGIN_BUTTONS = window.TREZOR_DISABLE_LOGIN_BUTTONS || false;
    var CHROME_URL = window.TREZOR_CHROME_URL || './chrome/wrapper.html';
    var POPUP_URL = window.TREZOR_POPUP_URL || 'https://trezor.github.io/connect/popup/popup.html';
    var POPUP_PATH = window.TREZOR_POPUP_PATH || 'https://trezor.github.io/connect/';
    var POPUP_ORIGIN = window.TREZOR_POPUP_ORIGIN || 'https://trezor.github.io';

    var POPUP_INIT_TIMEOUT = 15000;

    /**
     * Public API.
     */
    function TrezorConnect() {

        var manager = new PopupManager();

        /**
         * Popup errors.
         */
        this.ERR_TIMED_OUT = ERR_TIMED_OUT;
        this.ERR_WINDOW_CLOSED = ERR_WINDOW_CLOSED;
        this.ERR_WINDOW_BLOCKED = ERR_WINDOW_BLOCKED;
        this.ERR_ALREADY_WAITING = ERR_ALREADY_WAITING;
        this.ERR_CHROME_NOT_CONNECTED = ERR_CHROME_NOT_CONNECTED;

        /**
         * @param {boolean} value
         */
        this.closeAfterSuccess = function (value) { manager.closeAfterSuccess = value; };

        /**
         * @param {boolean} value
         */
        this.closeAfterFailure = function (value) { manager.closeAfterFailure = value; };

        /**
         * @typedef XPubKeyResult
         * @param {boolean} success
         * @param {?string} error
         * @param {?string} xpubkey  serialized extended public key
         * @param {?string} path     BIP32 serializd path of the key
         */

        /**
         * Load BIP32 extended public key by path.
         *
         * Path can be specified either in the string form ("m/44'/1/0") or as
         * raw integer array. In case you omit the path, user is asked to select
         * a BIP32 account to export, and the result contains m/44'/0'/x' node
         * of the account.
         *
         * @param {?(string|array<number>)} path
         * @param {function(XPubKeyResult)} callback
         */
        this.getXPubKey = function (path, callback) {
            if (typeof path === 'string') {
                path = parseHDPath(path);
            }
            manager.sendWithChannel({
                type: 'xpubkey',
                path: path
            }, callback);
        };

        /**
         * @typedef SignTxResult
         * @param {boolean} success
         * @param {?string} error
         * @param {?string} serialized_tx      serialized tx, in hex, including signatures
         * @param {?array<string>} signatures  array of input signatures, in hex
         */

        /**
         * Sign a transaction in the device and return both serialized
         * transaction and the signatures.
         *
         * @param {array<TxInputType>} inputs
         * @param {array<TxOutputType>} outputs
         * @param {function(SignTxResult)} callback
         *
         * @see https://github.com/trezor/trezor-common/blob/master/protob/types.proto
         */
        this.signTx = function (inputs, outputs, callback) {
            manager.sendWithChannel({
                type: 'signtx',
                inputs: inputs,
                outputs: outputs
            }, callback);
        };

        /**
         * @typedef TxRecipient
         * @param {number} amount   the amount to send, in satoshis
         * @param {string} address  the address of the recipient
         */

        /**
         * Compose a transaction by doing BIP-0044 discovery, letting the user
         * select an account, and picking UTXO by internal preferences.
         * Transaction is then signed and returned in the same format as
         * `signTx`.  Only supports BIP-0044 accounts (single-signature).
         *
         * @param {array<TxRecipient>} recipients
         * @param {function(SignTxResult)} callback
         */
        this.composeAndSignTx = function (recipients, callback) {
            manager.sendWithChannel({
                type: 'composetx',
                recipients: recipients
            }, callback);
        };

        /**
         * @typedef RequestLoginResult
         * @param {boolean} success
         * @param {?string} error
         * @param {?string} public_key  public key used for signing, in hex
         * @param {?string} signature   signature, in hex
         */

        /**
         * Sign a login challenge for active origin.
         *
         * @param {?string} hosticon
         * @param {string} challenge_hidden
         * @param {string} challenge_visual
         * @param {string|function(RequestLoginResult)} callback
         *
         * @see https://github.com/trezor/trezor-common/blob/master/protob/messages.proto
         */
        this.requestLogin = function (
            hosticon,
            challenge_hidden,
            challenge_visual,
            callback
        ) {
            if (typeof callback === 'string') {
                // special case for a login through <trezor:login> button.
                // `callback` is name of global var
                callback = window[callback];
            }
            if (!callback) {
                throw new TypeError('TrezorConnect: login callback not found');
            }
            manager.sendWithChannel({
                type: 'login',
                icon: hosticon,
                challenge_hidden: challenge_hidden,
                challenge_visual: challenge_visual
            }, callback);
        };

        var LOGIN_CSS =
            '<style>@import url("@connect_path@/login_buttons.css")</style>';

        var LOGIN_ONCLICK =
            'TrezorConnect.requestLogin('
            + "'@hosticon@','@challenge_hidden@','@challenge_visual@','@callback@'"
            + ')';

        var LOGIN_HTML =
            '<div id="trezorconnect-wrapper">'
            + '  <a id="trezorconnect-button" onclick="' + LOGIN_ONCLICK + '">'
            + '    <span id="trezorconnect-icon"></span>'
            + '    <span id="trezorconnect-text">@text@</span>'
            + '  </a>'
            + '  <span id="trezorconnect-info">'
            + '    <a id="trezorconnect-infolink" href="https://www.buytrezor.com/"'
            + '       target="_blank">What is TREZOR?</a>'
            + '  </span>'
            + '</div>';

        /**
         * Find <trezor:login> elements and replace them with login buttons.
         * It's not required to use these special elements, feel free to call
         * `TrezorConnect.requestLogin` directly.
         */
        this.renderLoginButtons = function () {
            var elements = document.getElementsByTagName('trezor:login');

            for (var i = 0; i < elements.length; i++) {
                var e = elements[i];
                var text = e.getAttribute('text') || 'Sign in with TREZOR';
                var callback = e.getAttribute('callback') || '';
                var hosticon = e.getAttribute('icon') || '';
                var challenge_hidden = e.getAttribute('challenge_hidden') || '';
                var challenge_visual = e.getAttribute('challenge_visual') || '';

                // it's not valid to put markup into attributes, so let users
                // supply a raw text and make TREZOR bold
                text = text.replace('TREZOR', '<strong>TREZOR</strong>');

                e.parentNode.innerHTML =
                    (LOGIN_CSS + LOGIN_HTML)
                    .replace('@text@', text)
                    .replace('@callback@', callback)
                    .replace('@hosticon@', hosticon)
                    .replace('@challenge_hidden@', challenge_hidden)
                    .replace('@challenge_visual@', challenge_visual)
                    .replace('@connect_path@', POPUP_PATH);
            }
        };
    }

    /*
     * `getXPubKey()`
     */

    function parseHDPath(string) {
        return string
            .toLowerCase()
            .split('/')
            .filter(function (p) { return p !== 'm'; })
            .map(function (p) {
                var n = parseInt(p);
                if (p[p.length - 1] === "'") { // hardened index
                    n = n | 0x80000000;
                }
                return n;
            });
    }

    /*
     * Popup management
     */

    function ChromePopup(url, name, width, height) {
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        var opts = {
            id: name,
            innerBounds: {
                width: width,
                height: height,
                left: left,
                top: top
            }
        };

        var closed = function () {
            if (this.onclose) {
                this.onclose(false); // never report as blocked
            }
        }.bind(this);

        var opened = function (w) {
            this.window = w;
            this.window.onClosed.addListener(closed);
        }.bind(this);

        chrome.app.window.create(url, opts, opened);

        this.name = name;
        this.window = null;
        this.onclose = null;
    }

    function ChromeChannel(popup, waiting) {
        var port = null;

        var respond = function (data) {
            if (waiting) {
                var w = waiting;
                waiting = null;
                w(data);
            }
        };

        var setup = function (p) {
            if (p.name === popup.name) {
                port = p;
                port.onMessage.addListener(respond);
                chrome.runtime.onConnect.removeListener(setup);
            }
        };

        chrome.runtime.onConnect.addListener(setup);

        this.respond = respond;

        this.close = function () {
            chrome.runtime.onConnect.removeListener(setup);
            port.onMessage.removeListener(respond);
            port.disconnect();
            port = null;
        };

        this.send = function (value, callback) {
            if (waiting === null) {
                waiting = callback;

                if (port) {
                    port.postMessage(value);
                } else {
                    throw new Error(ERR_CHROME_NOT_CONNECTED);
                }
            } else {
                throw new Error(ERR_ALREADY_WAITING);
            }
        };
    }

    function Popup(url, origin, name, width, height) {
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        var opts =
            'width=' + width +
            ',height=' + height +
            ',left=' + left +
            ',top=' + top +
            ',menubar=no' +
            ',toolbar=no' +
            ',location=no' +
            ',personalbar=no' +
            ',status=no';
        var w = window.open(url, name, opts);

        var interval;
        var blocked = w.closed;
        var iterate = function () {
            if (w.closed) {
                clearInterval(interval);
                if (this.onclose) {
                    this.onclose(blocked);
                }
            }
        }.bind(this);
        interval = setInterval(iterate, 100);

        this.window = w;
        this.origin = origin;
        this.onclose = null;
    }

    function Channel(popup, waiting) {

        var respond = function (data) {
            if (waiting) {
                var w = waiting;
                waiting = null;
                w(data);
            }
        };

        var receive = function (event) {
            if (event.source === popup.window && event.origin === popup.origin) {
                respond(event.data);
            }
        };

        window.addEventListener('message', receive);

        this.respond = respond;

        this.close = function () {
            window.removeEventListener('message', receive);
        };

        this.send = function (value, callback) {
            if (waiting === null) {
                waiting = callback;
                popup.window.postMessage(value, popup.origin);
            } else {
                throw new Error(ERR_ALREADY_WAITING);
            }
        };
    }

    function ConnectedChannel(p) {

        var ready = function () {
            clearTimeout(this.timeout);
            this.popup.onclose = null;
            this.ready = true;
            this.onready();
        }.bind(this);

        var closed = function (blocked) {
            clearTimeout(this.timeout);
            this.channel.close();
            if (blocked) {
                this.onerror(new Error(ERR_WINDOW_BLOCKED));
            } else {
                this.onerror(new Error(ERR_WINDOW_CLOSED));
            }
        }.bind(this);

        var timedout = function () {
            this.popup.onclose = null;
            if (this.popup.window) {
                this.popup.window.close();
            }
            this.channel.close();
            this.onerror(new Error(ERR_TIMED_OUT));
        }.bind(this);

        if (IS_CHROME_APP) {
            this.popup = new ChromePopup(p.chromeUrl, p.name, p.width, p.height);
            this.channel = new ChromeChannel(this.popup, ready);
        } else {
            this.popup = new Popup(p.url, p.origin, p.name, p.width, p.height);
            this.channel = new Channel(this.popup, ready);
        }

        this.timeout = setTimeout(timedout, POPUP_INIT_TIMEOUT);

        this.popup.onclose = closed;

        this.ready = false;
        this.onready = null;
        this.onerror = null;
    }

    function PopupManager() {
        var cc = null;

        var closed = function () {
            cc.channel.respond(new Error(ERR_WINDOW_CLOSED));
            cc.channel.close();
            cc = null;
        };

        var open = function (callback) {
            cc = new ConnectedChannel({
                name: 'trezor-connect',
                width: 600,
                height: 500,
                origin: POPUP_ORIGIN,
                path: POPUP_PATH,
                url: POPUP_URL,
                chromeUrl: CHROME_URL
            });
            cc.onready = function () {
                cc.popup.onclose = closed;
                callback(cc.channel);
            };
            cc.onerror = function (error) {
                cc = null;
                callback(error);
            };
        }.bind(this);

        this.closeAfterSuccess = true;
        this.closeAfterFailure = true;

        this.close = function () {
            if (cc && cc.popup.window) {
                cc.popup.window.close();
            }
        };

        this.waitForChannel = function (callback) {
            if (cc) {
                if (cc.ready) {
                    callback(cc.channel);
                } else {
                    callback(new Error(ERR_ALREADY_WAITING));
                }
            } else {
                open(callback);
            }
        };

        this.sendWithChannel = function (message, callback) {

            var respond = function (response) {
                var succ = response.success && this.closeAfterSuccess;
                var fail = !response.success && this.closeAfterFailure;
                if (succ || fail) {
                    this.close();
                }
                callback(response);
            }.bind(this);

            var onresponse = function (response) {
                if (response instanceof Error) {
                    var error = response;
                    respond({ success: false, error: error.message });
                } else {
                    respond(response);
                }
            };

            var onchannel = function (channel) {
                if (channel instanceof Error) {
                    var error = channel;
                    respond({ success: false, error: error.message });
                } else {
                    channel.send(message, onresponse);
                }
            };

            this.waitForChannel(onchannel);
        };
    }

    var exports = new TrezorConnect();

    if (!IS_CHROME_APP && !DISABLE_LOGIN_BUTTONS) {
        exports.renderLoginButtons();
    }

    return exports;

}());
