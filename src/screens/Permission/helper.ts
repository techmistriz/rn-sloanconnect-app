import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {BLEService} from 'src/services';
import {State as BluetoothState} from 'react-native-ble-plx';
import {
  checkBluetoothPermissions,
  PERMISSIONS_RESULTS,
  checkLocationPermissions,
  requestGeoLocationPermission,
  checkGeoLocationPermission,
} from 'src/utils/Permissions';

/** Function for manage permissions using in this screen */
export const checkAllRequiredPermissions = async () => {
  consoleLog('checkAllRequiredPermissions called==>');
  let status = 0;
  const __checkBluetoothPermissions = await checkBluetoothPermissions();
  consoleLog(
    'checkAllRequiredPermissions __checkBluetoothPermissions==>',
    __checkBluetoothPermissions,
  );

  if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
    status++;
  }

  const __checkLocationPermissions = await checkLocationPermissions();
  consoleLog(
    'checkAllRequiredPermissions __checkLocationPermissions==>',
    __checkLocationPermissions,
  );

  if (__checkLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
    status++;
  }

  const __checkGeoLocationPermission = await checkGeoLocationPermission();
  consoleLog(
    'checkAllRequiredPermissions __checkGeoLocationPermission==>',
    __checkGeoLocationPermission,
  );

  if (__checkGeoLocationPermission) {
    status++;
  }

  const bleState = await BLEService.manager.state();
  consoleLog('checkAllRequiredPermissions bleState==>', bleState);
  if (bleState === BluetoothState.PoweredOn) {
    status++;
  }

  consoleLog('checkAllRequiredPermissions status==>', status);
  return status;
};
