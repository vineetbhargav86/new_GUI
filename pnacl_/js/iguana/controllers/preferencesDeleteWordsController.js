'use strict';

angular.module('iguanaApp.controllers').controller('preferencesDeleteWordsController',
  function(go, gettext) {
    var self = this;
    // var fc = profileService.focusedClient;
    var msg = gettext('Are you sure you want to delete the backup words?');
    var successMsg = gettext('Backup words deleted');

    // if (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic)
    //   self.deleted = true;

    self.delete = function() {
      // confirmDialog.show(msg,
      //   function(ok) {
      //     if (ok) {
      //       // fc.clearMnemonic();
      //       // profileService.updateCredentialsFC(function() {
      //       //   notification.success(successMsg);
      //       //   go.walletHome();
      //       // });
      //     }
      //   });
    };

  });