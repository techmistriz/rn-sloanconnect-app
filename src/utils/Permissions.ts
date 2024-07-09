import {
  checkMultiple,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  openSettings,
  requestNotifications,
  checkNotifications,
} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {consoleLog} from './Helpers/HelperFunction';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

const PERMISSIONS_RESULTS = Object({
  UNAVAILABLE: 'unavailable',
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
});

/**
 * Check GeoLocation permission
 */
const checkGeoLocationPermission = async () => {
  if (
    Platform.OS === 'android' &&
    parseInt(Platform?.constants?.Release) <= 12
  ) {
    try {
      const enableResult = await isLocationEnabled();
      // consoleLog('checkGeoLocationPermission enableResult', enableResult);
      return enableResult;
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    } catch (error: unknown) {
      if (error instanceof Error) {
        // consoleLog('requestGeoLocationPermission error==>', error?.message);
        return false;
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      }
    }
  } else {
    return true;
  }
};

/**
 * Request GeoLocation permission
 */
const requestGeoLocationPermission = async () => {
  if (
    Platform.OS === 'android' &&
    parseInt(Platform?.constants?.Release) <= 12
  ) {
    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      consoleLog('requestGeoLocationPermission enableResult', enableResult);
      return enableResult;
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    } catch (error: unknown) {
      if (error instanceof Error) {
        // consoleLog('requestGeoLocationPermission error==>', error?.message);
        return false;
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      }
    }
  } else {
    return true;
  }
};

/**
 * Check permission to access push notification
 */

const checkPushNotificationPermissionAndroid = async () => {
  const authorizationStatus = await checkNotifications();

  // consoleLog(
  //   'checkPushNotificationPermissionAndroid authorizationStatus==>',
  //   authorizationStatus,
  // );
  if (
    typeof authorizationStatus?.status != 'undefined' &&
    authorizationStatus?.status === RESULTS.GRANTED
  ) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const requestPushNotificationPermissionAndroid = async () => {
  const authorizationStatus = await requestNotifications(['alert', 'sound']);
  // consoleLog(
  //   'requestPushNotificationPermissionAndroid authorizationStatus==>',
  //   authorizationStatus,
  // );
  if (
    typeof authorizationStatus?.status != 'undefined' &&
    authorizationStatus?.status === RESULTS.GRANTED
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const __checkPushNotificationPermissionAndroid = () => {
  return new Promise(resolve => {
    checkMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS])
      .then((statuses: any) => {
        // consoleLog('statuses==>', statuses);
        let PERM_STATUS = resolvePermision([
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ]);
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access push notification
 */

const __requestPushNotificationPermissionAndroid = () => {
  return new Promise(resolve => {
    requestMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS])
      .then((statuses: any) => {
        // consoleLog('statuses==>', statuses);
        let PERM_STATUS = resolvePermision([
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ]);
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access push notification
 */

const checkPushNotificationPermissionIos = async () => {
  const authorizationStatus = await messaging().hasPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const requestPushNotificationPermissionIos = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access camera
 */
const checkCameraPermissions = () => {
  return new Promise(resolve => {
    checkMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.CAMERA]]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const requestCameraPermissions = () => {
  return new Promise(resolve => {
    requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.CAMERA]]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          // permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access camera
 */
const checkGalleryPermissions = () => {
  return new Promise(resolve => {
    checkMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const requestGalleryPermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
          ]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access camera
 */
const checkCameraGalleryPermissions = () => {
  return new Promise((resolve, reject) => {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.CAMERA],
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const requestCameraGalleryPermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.CAMERA],
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
          ]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permissions are allowed to the app camera and audio
 *@returns true if both permissions are allowed or not
 */
const checkCameraAndMicrophonePermissions = () => {
  return new Promise(resolve => {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
            statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.CAMERA],
            statuses[PERMISSIONS.IOS.MICROPHONE],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera and Audio
 */
const requestCameraAndMicrophonePermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then((statuses: any) => {
      let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
      if (Platform.OS === 'android') {
        PERM_STATUS = resolvePermision([
          statuses[PERMISSIONS.ANDROID.CAMERA],
          statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
        ]);
      } else if (Platform.OS === 'ios') {
        PERM_STATUS = resolvePermision([
          statuses[PERMISSIONS.IOS.CAMERA],
          statuses[PERMISSIONS.IOS.MICROPHONE],
        ]);
      }
      resolve(PERM_STATUS);
    });
  });
};

/**
 * Check permissions are allowed to the app camera and audio
 *@returns true if both permissions are allowed or not
 */
const checkMicrophonePermissions = () => {
  return new Promise(resolve => {
    checkMultiple([
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.IOS.MICROPHONE,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.MICROPHONE],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera and Audio
 */
const requestMicrophonePermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then((statuses: any) => {
      let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
      if (Platform.OS === 'android') {
        PERM_STATUS = resolvePermision([
          statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
        ]);
      } else if (Platform.OS === 'ios') {
        PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.MICROPHONE]]);
      }
      resolve(PERM_STATUS);
    });
  });
};

/**
 * Check permission to access ReadWriteExternal
 */
const checkReadWriteExternalStoragePermissions = () => {
  return new Promise(resolve => {
    var permReqArr: any = [
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ];
    if (parseInt(Platform.Version + '') < 33) {
      permReqArr = [
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ];
    }

    checkMultiple(permReqArr)
      .then((statuses: any) => {
        // consoleLog('statuses==>', statuses);

        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          var permStatusAndroidArr = [
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ];
          if (parseInt(Platform.Version + '') < 33) {
            permStatusAndroidArr = [
              statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
              statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
            ];
          }

          PERM_STATUS = resolvePermision(permStatusAndroidArr);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
            statuses[PERMISSIONS.IOS.PHOTO_LIBRARY],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access ReadWriteExternal
 */
const requestReadWriteExternalStoragePermissions = () => {
  return new Promise(resolve => {
    var permReqArr: any = [
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ];

    if (parseInt(Platform.Version + '') < 33) {
      permReqArr = [
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ];
    }

    requestMultiple(permReqArr)
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          var permStatusAndroidArr = [
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO],
            statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
          ];
          if (parseInt(Platform.Version + '') < 33) {
            permStatusAndroidArr = [
              statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
              statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
            ];
          }

          PERM_STATUS = resolvePermision(permStatusAndroidArr);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
            statuses[PERMISSIONS.IOS.PHOTO_LIBRARY],
          ]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          // permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const checkLocationPermissions = () => {
  return new Promise(resolve => {
    checkMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[
              (PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
            ],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
          ]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const requestLocationPermissions = () => {
  return new Promise((resolve, reject) => {
    requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[
              (PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
            ],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
          ]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          // permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access READ_SMS
 */
const checkMessagePermissions = () => {
  return new Promise(resolve => {
    checkMultiple([PERMISSIONS.ANDROID.READ_SMS, PERMISSIONS.IOS.CONTACTS])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.READ_SMS],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.CONTACTS]]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access READ_SMS
 */
const requestMessagePermissions = () => {
  return new Promise((resolve, reject) => {
    requestMultiple([PERMISSIONS.ANDROID.READ_SMS, PERMISSIONS.IOS.CONTACTS])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.READ_SMS],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.CONTACTS]]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access READ_CONTACTS
 */
const checkContactPermissions = () => {
  return new Promise(resolve => {
    checkMultiple([PERMISSIONS.ANDROID.READ_CONTACTS, PERMISSIONS.IOS.CONTACTS])
      .then((statuses: any) => {
        consoleLog('checkContactPermissions statuses =>', statuses);

        let PERM_STATUS = 'unknown';

        if (Platform.OS === 'android') {
          PERM_STATUS =
            statuses[PERMISSIONS.ANDROID.READ_CONTACTS] || PERM_STATUS;
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = statuses[PERMISSIONS.IOS.CONTACTS] || PERM_STATUS;
        }

        if (PERM_STATUS === RESULTS.GRANTED) {
          resolve(true);
        } else if (PERM_STATUS === RESULTS.BLOCKED) {
          permissionDeniedBlockedAlert();
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        resolve(false);
      });
  });
};

/**
 * Request permission to access READ_CONTACTS
 */
const requestContactPermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.READ_CONTACTS,
      PERMISSIONS.IOS.CONTACTS,
    ])
      .then((statuses: any) => {
        consoleLog('requestContactPermissions statuses =>', statuses);

        let PERM_STATUS = 'unknown';
        if (Platform.OS === 'android') {
          PERM_STATUS =
            statuses[PERMISSIONS.ANDROID.READ_CONTACTS] || PERM_STATUS;
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = statuses[PERMISSIONS.IOS.CONTACTS] || PERM_STATUS;
        }

        if (PERM_STATUS === RESULTS.GRANTED) {
          resolve(true);
        } else if (PERM_STATUS === RESULTS.BLOCKED) {
          permissionDeniedBlockedAlert();
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        resolve(false);
      });
  });
};

/**
 * Check permission to access camera
 */
const checkBluetoothPermissions = () => {
  return new Promise(resolve => {
    var permReqArr: any = [
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.IOS.BLUETOOTH,
    ];
    if (parseInt(Platform.Version + '') <= 30) {
      permReqArr = [
        PERMISSIONS.ANDROID?.BLUETOOTH,
        PERMISSIONS.ANDROID?.BLUETOOTH_ADMIN,
        PERMISSIONS.IOS.BLUETOOTH,
      ];
    }

    checkMultiple(permReqArr)
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          var permStatusAndroidArr = [
            statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN],
            statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
          ];
          if (parseInt(Platform.Version + '') <= 30) {
            permStatusAndroidArr = [
              statuses[PERMISSIONS.ANDROID?.BLUETOOTH],
              statuses[PERMISSIONS.ANDROID?.BLUETOOTH_ADMIN],
            ];
          }

          PERM_STATUS = resolvePermision(permStatusAndroidArr);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.BLUETOOTH]]);
        }
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera
 */
const requestBluetoothPermissions = () => {
  return new Promise(resolve => {
    var permReqArr: any = [
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.IOS.BLUETOOTH,
    ];
    if (parseInt(Platform.Version + '') <= 30) {
      permReqArr = [
        PERMISSIONS.ANDROID.BLUETOOTH,
        PERMISSIONS.ANDROID.BLUETOOTH_ADMIN,
        PERMISSIONS.IOS.BLUETOOTH,
      ];
    }

    requestMultiple(permReqArr)
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          var permStatusAndroidArr = [
            statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN],
            statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
          ];
          if (parseInt(Platform.Version + '') <= 30) {
            permStatusAndroidArr = [
              statuses[PERMISSIONS.ANDROID.BLUETOOTH],
              statuses[PERMISSIONS.ANDROID.BLUETOOTH_ADMIN],
            ];
          }

          PERM_STATUS = resolvePermision(permStatusAndroidArr);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.BLUETOOTH]]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          // permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Request permission to access camera,contact,location
 */
const requestAllPermissions = () => {
  return new Promise(resolve => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.ANDROID.READ_SMS,
      PERMISSIONS.ANDROID.READ_CONTACTS,
      PERMISSIONS.IOS.CONTACTS,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
      .then((statuses: any) => {
        let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        if (Platform.OS === 'android') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.ANDROID.CAMERA],
            statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
            statuses[PERMISSIONS.ANDROID.READ_SMS],
            statuses[PERMISSIONS.ANDROID.READ_CONTACTS],
            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
            statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
          ]);
        } else if (Platform.OS === 'ios') {
          PERM_STATUS = resolvePermision([
            statuses[PERMISSIONS.IOS.CAMERA],
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
            statuses[PERMISSIONS.IOS.CONTACTS],
            statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
          ]);
        }
        if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
          resolve(PERM_STATUS);
          permissionDeniedBlockedAlert();
        } else {
          resolve(PERM_STATUS);
        }
      })
      .catch(err => {
        // resolve(false);
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

const permissionDeniedBlockedAlert = (
  message: string = 'We need Some permissions. So please allow.',
) => {
  Alert.alert('Permission Request', message, [
    {
      text: 'Cancel',
      onPress: () => consoleLog('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OPEN SETTING',
      onPress: () => {
        consoleLog('OK Pressed');
        openSettings();
      },
    },
  ]);
};

const resolvePermision = (permissions: Array<any>) => {
  let PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;

  if (Array.isArray(permissions) && permissions.length) {
    PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;
    for (let index = 0; index < permissions.length; index++) {
      // consoleLog('permissions[index]', permissions[index]);
      if (permissions[index] == RESULTS.DENIED) {
        PERM_STATUS = PERMISSIONS_RESULTS.DENIED;
        break;
      } else if (permissions[index] == RESULTS.BLOCKED) {
        PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        break;
      }
    }
  } else {
    PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
  }

  return PERM_STATUS;
};

export {
  PERMISSIONS_RESULTS,
  openSettings,
  checkGeoLocationPermission,
  requestGeoLocationPermission,
  checkCameraPermissions,
  requestCameraPermissions,
  checkGalleryPermissions,
  requestGalleryPermissions,
  checkCameraGalleryPermissions,
  requestCameraGalleryPermissions,
  checkCameraAndMicrophonePermissions,
  requestCameraAndMicrophonePermissions,
  checkReadWriteExternalStoragePermissions,
  requestReadWriteExternalStoragePermissions,
  checkLocationPermissions,
  requestLocationPermissions,
  checkMessagePermissions,
  requestMessagePermissions,
  checkContactPermissions,
  requestContactPermissions,
  requestAllPermissions,
  permissionDeniedBlockedAlert,
  checkPushNotificationPermissionAndroid,
  requestPushNotificationPermissionAndroid,
  checkPushNotificationPermissionIos,
  requestPushNotificationPermissionIos,
  checkMicrophonePermissions,
  requestMicrophonePermissions,
  checkBluetoothPermissions,
  requestBluetoothPermissions,
};
