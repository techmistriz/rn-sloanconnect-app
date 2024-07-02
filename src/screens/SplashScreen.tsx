import React, {Component, Fragment, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  AppState,
  BackHandler,
} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import constants from 'src/common/constants';
import {
  BleError,
  BleErrorCode,
  Device,
  State as BluetoothState,
} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {
  checkBluetoothPermissions,
  PERMISSIONS_RESULTS,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
  requestGeoLocationPermission,
  permissionDeniedBlockedAlert,
  openSettings,
} from 'src/utils/Permissions';
import AlertBox from 'src/components/AlertBox';
import RNExitApp from 'react-native-exit-app';

const REQUIRED_PERMISION_STATUS = 2;
const SplashScreen = ({navigation}: any) => {
  const {user, loading, token} = useSelector(
    (state: any) => state?.AuthReducer,
  );

  const [permissionStatus, setPermissionStatus] = useState(0);
  const [requirePermissionAllowed, setRequirePermissionAllowed] =
    useState(false);
  const [settingModal, setSettingModal] = useState<any>({
    status: false,
    title: '',
    message: '',
  });

  const [permissionModal, setPermissionModal] = useState<any>({
    status: false,
    title: '',
    message: '',
    permission: '',
    result: '',
  });
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  /** component hooks method for not in use*/
  useEffect(() => {
    consoleLog('AuthReducer SplashScreen==>', {user, token});
    if (typeof token != 'undefined' && token != null && token) {
      setTimeout(() => {
        navigation.replace('Welcome', {
          referrer: 'Login',
        });
        // navigation.replace('ProductDetails');
      }, 1500);
    } else {
      setTimeout(() => {
        navigation.replace('Welcome', {
          referrer: 'SplashScreen',
        });
        // navigation.replace('Login');
      }, 1500);
    }
  }, []);

  /** component hooks method for focus*/
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      consoleLog('SplashScreen useEffect focused');
      // manageRequirePermissions();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /** component hooks method for focus*/
  // useEffect(() => {
  //   consoleLog('SplashScreen useEffect appStateVisible==>', appStateVisible);
  //   if (appStateVisible == 'active') {
  //     manageRequirePermissions();
  //   }
  // }, [appStateVisible]);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === 'active'
  //     ) {
  //       // console.log('App has come to the foreground!');
  //       // manageRequirePermissions();
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);

  //     // console.log('AppState', {
  //     //   appState_current: appState.current,
  //     //   appStateVisible: appStateVisible,
  //     // });

  //     // if (appState.current == 'active') {
  //     //   manageRequirePermissions();
  //     // }
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  /** Function for manage permissions using in this screen */
  // useEffect(() => {
  //   consoleLog('SplashScreen useEffect permissionStatus==>', permissionStatus);
  //   if (permissionStatus == REQUIRED_PERMISION_STATUS) {
  //     setRequirePermissionAllowed(true);
  //   }
  // }, [permissionStatus]);

  /** Function for manage permissions using in this screen */
  // useEffect(() => {
  //   consoleLog('SplashScreen useEffect onStateChange==>', permissionStatus);
  //   const subscription = BLEService.manager.onStateChange(state => {
  //     consoleLog(
  //       'SplashScreen useEffect onStateChange inside==>',
  //       permissionStatus,
  //     );
  //     if (state === BluetoothState.PoweredOn) {
  //       subscription.remove();
  //       consoleLog('SplashScreen useEffect PoweredOn==>');
  //     } else if (state === BluetoothState.PoweredOff) {
  //       consoleLog('SplashScreen useEffect PoweredOff==>');
  //       permissionStatus >= 3 &&
  //         setPermissionModal({
  //           status: true,
  //           title: 'Bluetooth Disabled',
  //           message: 'Please enable Bluetooth',
  //           permission: 'BluetoothEnable',
  //           result: 'denied',
  //         });
  //     } else if (state === BluetoothState.Unsupported) {
  //       consoleLog('SplashScreen useEffect Unsupported==>');
  //       permissionStatus >= 3 &&
  //         setPermissionModal({
  //           status: true,
  //           title: 'Bluetooth Disabled',
  //           message: 'Please enable Bluetooth',
  //           permission: 'BluetoothUnsupported',
  //           result: 'denied',
  //         });
  //     } else if (state === BluetoothState.Unauthorized) {
  //       consoleLog('SplashScreen useEffect Unauthorized==>');
  //       permissionStatus >= 3 &&
  //         setPermissionModal({
  //           status: true,
  //           title: 'Bluetooth Permission',
  //           message: 'We need Bluetooth Permission for searching devices.',
  //           permission: 'Bluetooth',
  //           result: 'denied',
  //         });
  //     }
  //   }, true);

  //   // return subscription?.remove();
  // }, [permissionStatus]);

  /** Function for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    consoleLog('manageRequirePermissions called==>');
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    consoleLog(
      'manageRequirePermissions __checkBluetoothPermissions==>',
      __checkBluetoothPermissions,
    );

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
      status++;
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
        status++;
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Bluetooth Permission',
          message: 'We need Bluetooth Permission for searching devices.',
          permission: 'Bluetooth',
          result: 'denied',
        });
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        setSettingModal({
          status: true,
          title: 'Permission Blocked',
          message: `We need Bluetooth Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        });
      }
      consoleLog(
        'manageRequirePermissions __requestBluetoothPermissions==>',
        __requestBluetoothPermissions,
      );
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      setSettingModal({
        status: true,
        title: 'Bluetooth Permission Blocked',
        message: `We need Bluetooth Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      });
    }

    if (status > 0) {
      setPermissionStatus(status);
    } else {
      return false;
    }

    const __checkLocationPermissions = await checkLocationPermissions();
    consoleLog(
      'manageRequirePermissions __checkLocationPermissions==>',
      __checkLocationPermissions,
    );

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
      status++;
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestLocationPermissions = await requestLocationPermissions();
      if (__requestLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
        status++;
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Location Permission',
          message: 'We need Location Permission for searching devices.',
          permission: 'Location',
          result: 'denied',
        });
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        setSettingModal({
          status: true,
          title: 'Location Permission Blocked',
          message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        });
      }
      consoleLog(
        'manageRequirePermissions __requestLocationPermissions==>',
        __requestLocationPermissions,
      );
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      setSettingModal({
        status: true,
        title: 'Location Permission Blocked',
        message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      });
    }

    if (status > 0) {
      setPermissionStatus(status);
    } else {
      return false;
    }

    const locationService = await requestGeoLocationPermission();
    consoleLog('manageRequirePermissions locationService==>', locationService);

    if (locationService) {
      status++;
    }

    consoleLog(
      'manageRequirePermissions requestGeoLocationPermission locationService==>',
      locationService,
    );
    if (status > 0) {
      setPermissionStatus(status);
    } else {
      return false;
    }

    const bleState = await BLEService.manager.state();
    consoleLog('manageRequirePermissions bleState==>', bleState);

    if (bleState === BluetoothState.PoweredOn) {
      status++;
    } else if (bleState === BluetoothState.PoweredOff) {
      try {
        // await BLEService.manager.enable();
        consoleLog('manageRequirePermissions enabled==>');
      } catch (error: any) {
        consoleLog('manageRequirePermissions enable error==>', error);
        if (error?.errorCode === BleErrorCode?.BluetoothUnauthorized) {
          setPermissionModal({
            status: true,
            title: 'Bluetooth Disabled',
            message: 'Please enable Bluetooth',
            permission: 'BluetoothEnable',
            result: 'denied',
          });
        }
      }
    }

    if (status > 0) {
      setPermissionStatus(status);
    } else {
      return false;
    }
  };

  /** Function for manage permissions using in this screen */
  const requireBluetoothPermissions = async () => {
    consoleLog('requireBluetoothPermissions called==>');
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    consoleLog(
      'requireBluetoothPermissions __checkBluetoothPermissions==>',
      __checkBluetoothPermissions,
    );

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Bluetooth Permission',
          message: 'We need Bluetooth Permission for searching devices.',
          permission: 'Bluetooth',
          result: 'denied',
        });
        return false;
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        status++;

        setSettingModal({
          status: true,
          title: 'Permission Blocked',
          message: `We need Bluetooth Permission for searching devices\n You have previously denied this permission, So you have to manually allow this permission.`,
        });
        return false;
      }
      consoleLog(
        'requireBluetoothPermissions __requestBluetoothPermissions==>',
        __requestBluetoothPermissions,
      );
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      status++;
      setSettingModal({
        status: true,
        title: 'Permission Blocked',
        message: `We need Bluetooth Permission for searching devices\n You have previously denied this permission, So you have to manually allow this permission.`,
      });

      return false;
    }
  };

  /** Function for manage permissions using in this screen */
  const requireLocationPermissions = async () => {
    consoleLog('requireLocationPermissions called==>');
    let status = 0;
    const __checkLocationPermissions = await checkLocationPermissions();
    consoleLog(
      'requireLocationPermissions __checkLocationPermissions==>',
      __checkLocationPermissions,
    );

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestLocationPermissions = await requestLocationPermissions();
      if (__requestLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Location Permission',
          message: 'We need Location Permission for searching devices.',
          permission: 'Location',
          result: 'denied',
        });
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        status++;
        setSettingModal({
          status: true,
          title: 'Location Permission Blocked',
          message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        });
      }
      consoleLog(
        'manageRequirePermissions __requestLocationPermissions==>',
        __requestLocationPermissions,
      );
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      status++;
      setSettingModal({
        status: true,
        title: 'Location Permission Blocked',
        message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      });
    }
  };

  /** Function for manage permissions using in this screen */
  const requireBluetoothEnablePermissions = async () => {
    try {
      await BLEService.manager.enable();
      consoleLog('requireBluetoothEnablePermissions enabled==>');
    } catch (error: any) {
      consoleLog(
        'requireBluetoothEnablePermissions enable error==>',
        error?.errorCode,
      );

      if (
        // error?.errorCode === BleErrorCode?.OperationCancelled ||
        error?.errorCode === BleErrorCode?.BluetoothUnauthorized
      ) {
        setPermissionModal({
          status: true,
          title: 'Bluetooth Disabled',
          message: 'Please enable Bluetooth',
          permission: 'BluetoothEnable',
          result: 'denied',
        });
      }
    }
  };

  /** Function for manage permissions using in this screen */
  const handlePermissionPopup = async () => {
    const __permissionModal = {...permissionModal};
    setPermissionModal({
      ...permissionModal,
      status: false,
      permission: '',
      result: '',
    });

    consoleLog('__permissionModal==>', __permissionModal);

    if (__permissionModal?.result == 'denied') {
      if (__permissionModal?.permission == 'Bluetooth') {
        await requireBluetoothPermissions();
      } else if (__permissionModal?.permission == 'Location') {
        await requireLocationPermissions();
      } else if (__permissionModal?.permission == 'BluetoothEnable') {
        await requireBluetoothEnablePermissions();
      }
    }
  };

  return (
    <>
      {/* <StatusBar
        backgroundColor={Theme.colors.statusBarColor}
        barStyle="light-content"
      /> */}
      <Wrap autoMargin={false} style={styles.container}>
        <Image
          // @ts-ignore
          source={getImgSource(Images?.splashScreen)}
          style={{width: '100%', height: '100%', position: 'absolute'}}
          resizeMode="cover"
        />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Image
              // @ts-ignore
              source={getImgSource(Images?.appLogoWhite)}
              style={{width: '60%'}}
              resizeMode="contain"
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Typography
              size={12}
              text={`${constants.APP_NAME} ${constants.APP_VERSION}`}
              style={{textAlign: 'left', marginTop: 0}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={10}
              text={constants.RELEASE_TEXT}
              style={{textAlign: 'left', marginTop: 0}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontRegular}
            />
          </Wrap>
        </Wrap>
      </Wrap>
      <AlertBox
        visible={permissionModal?.status}
        title={permissionModal?.title}
        message={permissionModal?.message}
        onCancelPress={() => {
          setPermissionModal({
            ...permissionModal,
            status: false,
          });
          RNExitApp.exitApp();
        }}
        cancelText="Exit App"
        onOkayPress={() => {
          handlePermissionPopup();
        }}
        okayText="AGREE"
      />

      <AlertBox
        visible={settingModal?.status}
        title={settingModal?.title}
        message={settingModal?.message}
        onCancelPress={() => {
          setSettingModal(false);
          RNExitApp.exitApp();
        }}
        cancelText="Exit App"
        onOkayPress={() => {
          setSettingModal({
            status: false,
            title: '',
            message: '',
          });
          openSettings();
        }}
        okayText="Open Settings"
      />
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  section2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});
