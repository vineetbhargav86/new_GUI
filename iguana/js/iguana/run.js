'use strict';

angular.element(document).ready(function() {

  var startAngular = function() {
    angular.bootstrap(document, ['iguanaApp']);
  };

  startAngular();
  /* Cordova specific Init */
/*  if (window.cordova !== undefined) {

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
*/
});

