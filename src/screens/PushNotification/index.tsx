import React, {Component, useState, useEffect, useRef} from 'react';
import {Platform, AppState, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {showMessage} from 'react-native-flash-message';
import NavigationService, {
  globalNavRef,
} from 'src/services/NavigationService/NavigationService';
import {getItem, setItem} from 'src/services/StorageService/StorageService';
import {Fonts, Images} from 'src/assets';
import Theme from 'src/theme';
import {userProfileRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  PERMISSIONS_RESULTS,
  checkPushNotificationPermissionAndroid,
  checkPushNotificationPermissionIos,
  requestPushNotificationPermissionAndroid,
  requestPushNotificationPermissionIos,
  permissionDeniedBlockedAlert,
} from 'src/utils/Permissions';
import {consoleLog, showToastMessage} from 'src/utils/Helpers/HelperFunction';
import Network from 'src/network/Network';

export let pushNotificationRef: any;

/**
 * Push Notification Component
 */
const PushNotification = () => {
  const {token, user, type, loading} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  pushNotificationRef = useRef();

  let remoteInitialNotification: any;
  // let [appState, setAppState] = useState(AppState.currentState);
  const appState = useRef(AppState.currentState);

  /**handle app state change  */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /**componet life cycle method */
  useEffect(() => {
    manageRequirePermissions();
  }, [user]);

  /** Funcation for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    if (Platform.OS == 'android') {
      const checkPermissionStatus =
        await checkPushNotificationPermissionAndroid();
      consoleLog('checkPermissionStatus Android', checkPermissionStatus);
      if (checkPermissionStatus == PERMISSIONS_RESULTS.DENIED) {
        await requestPushNotificationPermissionAndroid();
      } else if (checkPermissionStatus == PERMISSIONS_RESULTS.BLOCKED) {
        await requestPushNotificationPermissionAndroid();
      } else {
        initPushNotification();
      }
    } else {
      const checkPermissionStatus = await checkPushNotificationPermissionIos();
      consoleLog('checkPermissionStatus Ios', checkPermissionStatus);
      if (checkPermissionStatus == PERMISSIONS_RESULTS.DENIED) {
        await requestPushNotificationPermissionIos();
      } else if (checkPermissionStatus == PERMISSIONS_RESULTS.BLOCKED) {
        await await requestPushNotificationPermissionIos();
      } else {
        initPushNotification();
      }
    }
  };

  const initPushNotification = async () => {
    getSetFCMToken();
    messaging().onTokenRefresh(async firebase_token => {
      const __firebase_token = await getItem('@FIREBASE_TOKEN');
      if (__firebase_token !== firebase_token) {
        getSetFCMToken(__firebase_token);
      }
    });

    // forground ( when app open ) in firebase notification
    messaging().onMessage(async (remoteMessage: any) => {
      consoleLog('onMessage remoteMessage==>', remoteMessage);
      if (appState?.current == 'active') {
        showToastMessage(
          remoteMessage?.notification?.title,
          'info',
          remoteMessage?.notification?.body,
        );
      }
    });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      consoleLog('onNotificationOpenedApp remoteMessage==>', remoteMessage);
      handleNotificationRedirection(remoteMessage?.data);
    });

    // executes when application is in background state.
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      consoleLog('setBackgroundMessageHandler remoteMessage==>', remoteMessage);
      // checkForPlanExpireNotification(remoteMessage?.data);
    });

    // If your app is closed
    remoteInitialNotification = messaging()
      .getInitialNotification()
      .then(notificationOpen => {
        consoleLog(
          'getInitialNotification notificationOpen==>',
          notificationOpen,
        );

        if (notificationOpen) {
          handleNotificationRedirection(notificationOpen?.data, true);
        }
        // checkForPlanExpireNotification(notificationOpen?.data);
      });
    checkForIOS();
  };

  /**check config for iOS platform */
  const checkForIOS = async () => {
    if (Platform.OS == 'ios') {
      // await messcomponentWillMountaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  /**gets the fcm token */
  const getSetFCMToken = async (firebase_token: string | null = '') => {
    try {
      if (!firebase_token) {
        firebase_token = await messaging().getToken();
      }
      consoleLog('firebase_token', firebase_token);
      if (firebase_token && token && type && user) {
        const options = {
          type: type,
          token: token,
          referrer: 'PushNotification',
        };
        let payload = {
          firebase_token: firebase_token,
        };

        const response = await Network(
          'profile/update',
          'POST',
          payload,
          options?.token,
        );
        consoleLog('getSetFCMToken response==>', response);
        setItem('@FIREBASE_TOKEN', firebase_token);
        // dispatch(userProfileRequestAction(payload, options));
      }
    } catch (error) {
      consoleLog('getSetFCMToken Error==>', error);
    }
  };

  /**
   *
   * @param {*} notification
   * @param {*} isFromKilledApp
   * Handling notification tap and redireaction
   */
  const handleNotificationRedirection = (
    notification: any,
    isFromKilledApp: boolean = false,
  ) => {
    if (notification) {
      let {PAGE_NAME, TYPE, PARAMS} = notification;

      var __PARAMS = {};
      if (typeof PARAMS === 'string') {
        __PARAMS = JSON.parse(PARAMS);
      } else {
        __PARAMS = PARAMS;
      }

      if (PAGE_NAME) {
        if (isFromKilledApp) {
          setTimeout(() => {
            // globalNavRef.navigate(PAGE_NAME, {
            //   referrer: 'PushNotification',
            //   ...__PARAMS,
            // });
          }, 4000);
        } else {
          // NavigationService.navigate(PAGE_NAME, {
          //   referrer: 'PushNotification',
          //   ...__PARAMS,
          // });
        }
      }
    }
  };

  /**componet render method */
  return <View />;
};

export default PushNotification;
