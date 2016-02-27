
'use strict';

angular.module('iguanaApp.services').factory('fileStorageService', 
  function(lodash, $log) {
  
  var root = {}, _fs, _dir;

  root.init = function(cb) {
    console.log("initializing Filesystem");
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(PERSISTENT, 10000000000, onFileSystemSuccess, fail);
    
    //if (_dir) return cb(null, _fs, _dir);

    function onFileSystemSuccess(fileSystem) {
      console.log('File system started: ', fileSystem.name, fileSystem.root.name);
      _fs = fileSystem;
              /*root.getDir(function(err, newDir) {
        if (err || !newDir.nativeURL) return cb(err);
        _dir = newDir;
        $log.debug("Got main dir:", _dir.nativeURL);
        return cb(null, _fs, _dir);
      });*/
    }

    function fail(evt) {
      var msg = 'Could not init file system: ' + evt.target.error.code;
      console.log(msg);
      return cb(msg);
    };


    /*navigator.webkitPersistentStorage.requestQuota(10000000000,
    function(bytes) {
      naclCommon.updateStatus(
          'Allocated ' + bytes + ' bytes of persistent storage. Running the first time will take 17 seconds to load');
      },
    fail);*/
    
    
  };
/*
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
            return cb(null, this.result);
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
   
  root.create = function(name, value, callback) {
    root.get(name,
      function(err, data) {
        if (data) {
          return callback('EEXISTS');
        } else {
          return root.set(name, value, callback);
        }
      });
  };*/

  return root;
});


'use strict';

angular.module('iguanaApp.services').factory('localStorageService', 
  function(isChromeApp, nodeWebkit, $timeout) {
  
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

/// Step 2
'use strict';

angular.module('iguanaApp.services').factory('storageService', 
  function(logHeader, fileStorageService, localStorageService, $log, lodash, isCordova) {

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
    // return cb(null, text);
    //
    // getUUID(function(uuid) {
    //   if (uuid) {
      $log.debug('Encrypting profile');
      text = sjcl.encrypt("profile", text, {
        iter: 10000
      });
      $log.debug("profile encrypted: ", text);
    //   }
      return cb(null, text);
    // });
  };


  var decryptOnMobile = function(text, cb) {
    var json;
    try {
      json = JSON.parse(text);
      $log.debug("Got value: ", json);
    } catch (e) {
      $log.debug("error descrypt: ", e);
    };

    if (!json) return cb('Could not access storage');

    if (!json.iter || !json.ct) {
      $log.debug('Profile is not encrypted');
      return cb(null, text);
    }

    $log.debug('Profile is encrypted');

    try {
      text = sjcl.decrypt("profile", text);

      $log.debug('Migrating to unencrypted profile');
      return storage.set('profile', text, function(err) {
        return cb(err, text);
      });
    } catch (e) {
      $log.debug('Decrypt error: ', e);
      return cb('Could not decrypt storage: device ID mismatch');
    };
      
      return cb(null, text);
  };



  root.tryToMigrate = function(cb) {
    if (!shouldUseFileStorage) return cb();

    localStorageService.get('profile', function(err, str) {
      if (err) return cb(err);
      if (!str) return cb();

      $log.debug('Starting Migration profile to File storage...');

      fileStorageService.create('profile', str, function(err) {
        if (err) cb(err);
        $log.debug('Profile Migrated successfully');

        localStorageService.get('config', function(err, c) {
          if (err) return cb(err);
          if (!c) return root.getProfile(cb);

          fileStorageService.create('config', c, function(err) {

            if (err) {
              $log.debug('Error migrating config: ignoring', err);
              return root.getProfile(cb);
            }
            $log.debug('Config Migrated successfully');
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