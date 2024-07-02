import React, {Component, Fragment, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, AppState} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import {Animated, Easing} from 'react-native';
import {constants} from 'src/common';
import {BLEService} from 'src/services';
import {
  BleError,
  BleErrorCode,
  Device,
  State as BluetoothState,
} from 'react-native-ble-plx';
import {
  checkBluetoothPermissions,
  PERMISSIONS_RESULTS,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
  requestGeoLocationPermission,
  openSettings,
} from 'src/utils/Permissions';
import AlertBox from 'src/components/AlertBox';
import RNExitApp from 'react-native-exit-app';
import {checkAllRequiredPermissions} from './helper';

const Permission = ({navigation, route}: any) => {
  const [permissionStatus, setPermissionStatus] = useState(0);
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
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  /** Function for manage permissions using in this screen */
  useEffect(() => {
    consoleLog(
      'PermissionScreen useEffect permissionStatus==>',
      permissionStatus,
    );

    if (permissionStatus == TOTAL_PERMISSION_REQUIRED) {
      BLEService.manager.state().then(bleState => {
        consoleLog('PermissionScreen useEffect bleState==>', bleState);
        if (bleState === BluetoothState.PoweredOn) {
          allPermissionGivenAndRedirect();
        }
      });
    }
  }, [permissionStatus]);

  /** Function for manage permissions using in this screen */
  useEffect(() => {
    __checkAllRequiredPermissions();
  }, []);

  /** Function for manage permissions using in this screen */
  // useEffect(() => {
  //   const subscription = BLEService.manager.onStateChange(state => {
  //     if (state === BluetoothState.PoweredOn) {
  //       subscription.remove();
  //       permissionSuccess();
  //     } else if (state === BluetoothState.PoweredOff) {
  //       permissionStatus >= 3 &&
  //         setPermissionModal({
  //           status: true,
  //           title: 'Bluetooth Disabled',
  //           message: 'Please enable Bluetooth',
  //           permission: 'BluetoothEnable',
  //           result: 'denied',
  //         });
  //     } else if (state === BluetoothState.Unsupported) {
  //       permissionStatus >= 3 &&
  //         setPermissionModal({
  //           status: true,
  //           title: 'Bluetooth Disabled',
  //           message: 'Please enable Bluetooth',
  //           permission: 'BluetoothUnsupported',
  //           result: 'denied',
  //         });
  //     } else if (state === BluetoothState.Unauthorized) {
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
  // }, [permissionStatus]);

  /** Function for manage permissions using in this screen */
  const __checkAllRequiredPermissions = async () => {
    const __checkAllRequiredPermissions = await checkAllRequiredPermissions();
    if (__checkAllRequiredPermissions == constants.TOTAL_PERMISSION_REQUIRED) {
      allPermissionGivenAndRedirect();
      return false;
    }
  };

  /** Function for manage permissions using in this screen */
  const allPermissionGivenAndRedirect = (
    shouldShowMessage: boolean = false,
  ) => {
    shouldShowMessage && showToastMessage('All permissions given.', 'success');
    NavigationService.replace('DeviceSearching');
  };

  /** Function for manage permissions using in this screen */
  const requestAllRequiredPermissions = async () => {
    const __checkAllRequiredPermissions = await checkAllRequiredPermissions();
    if (__checkAllRequiredPermissions == TOTAL_PERMISSION_REQUIRED) {
      allPermissionGivenAndRedirect(true);
      return false;
    }

    consoleLog('requestAllRequiredPermissions called==>');
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    consoleLog(
      'requestAllRequiredPermissions __checkBluetoothPermissions==>',
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
          message: `We need Bluetooth Permission for searching devices\nYou have previously denied these permissions, so you have to manually allow these permissions.`,
        });
      }
      consoleLog(
        'requestAllRequiredPermissions __requestBluetoothPermissions==>',
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
      'requestAllRequiredPermissions __checkLocationPermissions==>',
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
        'requestAllRequiredPermissions __requestLocationPermissions==>',
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
    consoleLog(
      'requestAllRequiredPermissions locationService==>',
      locationService,
    );

    if (locationService) {
      status++;
    }

    consoleLog(
      'requestAllRequiredPermissions requestGeoLocationPermission locationService==>',
      locationService,
    );
    if (status > 0) {
      setPermissionStatus(status);
    } else {
      return false;
    }

    const bleState = await BLEService.manager.state();
    consoleLog('requestAllRequiredPermissions bleState==>', bleState);

    if (bleState === BluetoothState.PoweredOn) {
      status++;
    } else if (bleState === BluetoothState.PoweredOff) {
      try {
        // await BLEService.manager.enable();
        consoleLog('requestAllRequiredPermissions enabled==>');
        status++;
      } catch (error: any) {
        consoleLog('requestAllRequiredPermissions enable error==>', error);
        status++;
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
    // let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    consoleLog(
      'requireBluetoothPermissions __checkBluetoothPermissions==>',
      __checkBluetoothPermissions,
    );

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
      await requireLocationPermissions();
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
        await requireLocationPermissions();
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Bluetooth Permission',
          message: 'We need Bluetooth Permission for searching devices.',
          permission: 'Bluetooth',
          result: 'denied',
        });
        return false;
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // status++;

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
      // status++;
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
    // let status = 0;
    const __checkLocationPermissions = await checkLocationPermissions();
    consoleLog(
      'requireLocationPermissions __checkLocationPermissions==>',
      __checkLocationPermissions,
    );

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
      await requireBluetoothEnablePermissions();
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestLocationPermissions = await requestLocationPermissions();
      if (__requestLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
        await requireBluetoothEnablePermissions();
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Location Permission',
          message: 'We need Location Permission for searching devices.',
          permission: 'Location',
          result: 'denied',
        });
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // status++;
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
      // status++;
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
    consoleLog('handlePermissionPopup called==>');
    const __permissionModal = {...permissionModal};
    setPermissionModal({
      ...permissionModal,
      status: false,
      permission: '',
      result: '',
    });

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
      <Wrap autoMargin={false} style={styles.container}>
        <Image
          source={getImgSource(Images?.splashScreen)}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0.1,
          }}
          resizeMode="cover"
        />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Image
              source={getImgSource(Images?.appLogoWithText)}
              style={{width: '50%', height: 80}}
              resizeMode="contain"
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Typography
              size={17}
              text="Permission"
              style={{textAlign: 'left', marginTop: 0}}
              color={Theme.colors.primaryColor}
              ff={Theme.fonts.ThemeFontBold}
            />
            <Typography
              size={13}
              text="We need some permissions"
              style={{textAlign: 'left', marginTop: 10}}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontRegular}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.section3}>
            <Wrap autoMargin={false} style={[{marginTop: 10}]}>
              <Button
                title="Allow Permissions & Proceed"
                onPress={() => {
                  requestAllRequiredPermissions();
                }}
              />
            </Wrap>
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
        cancelText="EXIT APP"
        onOkayPress={() => {
          handlePermissionPopup();
        }}
        okayText="ENABLE"
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

export default Permission;
