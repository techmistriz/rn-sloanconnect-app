import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showConfirmAlert,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import {BLEService} from 'src/services/BLEService/BLEService';
import {
  PERMISSIONS_RESULTS,
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
} from 'src/utils/Permissions';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import {cloneDeep} from 'src/services/BLEService/cloneDeep';
import {DeviceExtendedProps} from '../DeviceSearching/types';
import {filterBLEDevices} from '../DeviceSearching/helper';

type DeviceExtendedByUpdateTime = Device & {updateTimestamp: number};
const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 5000;
const WAITING_TIMEOUT = 10000;

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const [requirePermissionAllowed, setRequirePermissionAllowed] =
    useState(false);
  const connectedDevice: any = BLEService.getDevice();
  var timeoutId: any = null;

  /** Function comments */
  useEffect(() => {
    // consoleLog('useEffect manageRequirePermissions==>');
    manageRequirePermissions();
  }, []);

  /** Function comments */
  useEffect(() => {
    // consoleLog('useEffect setTimeout==>', requirePermissionAllowed);
    if (requirePermissionAllowed) {
      // consoleLog('useEffect setTimeout requirePermissionAllowed in==>');

      timeoutId = setTimeout(() => {
        // consoleLog('setTimeout==>', timeoutId);
        clearTimeout(timeoutId);
        BLEService.manager.stopDeviceScan();
        NavigationService.navigate('NoDeviceFound');
      }, WAITING_TIMEOUT);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [requirePermissionAllowed]);

  /** Function comments */
  useEffect(() => {
    // consoleLog('useEffect onStateChange==>');
    if (requirePermissionAllowed) {
      const subscription = BLEService.manager.onStateChange(state => {
        // consoleLog('ActivateDevice state==>', state);
        if (state === 'PoweredOn') {
          subscription.remove();
          __scanDevices();
        }
        if (state === 'PoweredOff') {
          enableBluetooth();
        }
      }, true);
      return () => subscription.remove();
    }
  }, [BLEService.manager, requirePermissionAllowed]);

  /** Function comments */
  const enableBluetooth = async () => {
    const isEnable = await BLEService.manager.enable();
    consoleLog('ActivateDevice isEnable==>', isEnable);
  };

  /** Function comments */
  const __scanDevices = async () => {
    // consoleLog('__scanDevices==>');
    if (connectedDevice?.id) {
      try {
        const isDeviceConnected = await BLEService.isDeviceConnected(
          connectedDevice?.id,
        );
        if (isDeviceConnected) {
          await BLEService.disconnectDeviceById(connectedDevice?.id);
        }
      } catch (error) {
        consoleLog('__scanDevices error', error);
      }
    }
    // setFoundDevices([]);
    BLEService.initializeBLE().then(() =>
      BLEService.scanDevices(
        (device: Device) => {
          const filterDevice: DeviceExtendedProps = filterBLEDevices(device);
          consoleLog('device?.localName==>', filterDevice?.localName);
          if (filterDevice) {
            clearTimeout(timeoutId);
            BLEService.manager.stopDeviceScan();
            NavigationService.navigate('DeviceSearching');
          }
        },
        null,
        false,
      ),
    );
  };

  /** Function comments */
  const onLogout = async () => {
    const result = await showConfirmAlert('Are you sure?');
    if (result) {
      dispatch(loginResetDataAction());
      // dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  /** Function for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    consoleLog('manageRequirePermissions called==>');
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    // consoleLog('__checkBluetoothPermissions', __checkBluetoothPermissions);

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__requestBluetoothPermissions', __requestBluetoothPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    const __checkLocationPermissions = await checkLocationPermissions();
    // consoleLog('__checkLocationPermissions', __checkLocationPermissions);

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __checkLocationPermissions = await requestLocationPermissions();
      if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__checkLocationPermissions', __checkLocationPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    if (status == 0) {
      setRequirePermissionAllowed(true);
    }
  };

  return (
    <Wrap autoMargin={false} style={styles.container}>
      <Image
        // @ts-ignore
        source={getImgSource(Images?.activateFaucet)}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          opacity: 0.7,
        }}
        resizeMode="cover"
        // blurRadius={1}
      />
      <Header haslogOutButton onLogoutPress={onLogout} />
      <Wrap autoMargin={false} style={styles.sectionContainer}>
        <Wrap autoMargin={false} style={styles.section1}>
          <Typography
            size={22}
            text={`Activate\n Your Device`}
            style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
            color={Theme.colors.white}
            ff={Theme.fonts.ThemeFontMedium}
          />
          <Typography
            size={14}
            text={`Wave your hand 3 times in front\n of sensor within 10 seconds\n to activate you product.`}
            style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
            color={Theme.colors.white}
            ff={Theme.fonts.ThemeFontRegular}
          />
        </Wrap>
      </Wrap>
    </Wrap>
  );
};

export default Index;
