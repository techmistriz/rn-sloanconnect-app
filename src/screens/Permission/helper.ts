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
import {constants} from 'src/common';

/** Function for manage permissions using in this screen */
export const checkAllRequiredPermissions = async (returnType: number = 1) => {
  consoleLog('checkAllRequiredPermissions called==>');
  let status = 0;

  let permissionsStatus = {
    NearbyDevices: false,
    Location: false,
    GeoLocation: false,
    BluetoothState: false,
  };
  const __checkBluetoothPermissions = await checkBluetoothPermissions();
  consoleLog(
    'checkAllRequiredPermissions __checkBluetoothPermissions==>',
    __checkBluetoothPermissions,
  );

  if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
    status++;
    permissionsStatus.NearbyDevices = true;
  }

  const __checkLocationPermissions = await checkLocationPermissions();
  consoleLog(
    'checkAllRequiredPermissions __checkLocationPermissions==>',
    __checkLocationPermissions,
  );

  if (__checkLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
    // This required in android version upto 11
    constants.API_LEVEL <= 30 && status++;
    permissionsStatus.Location = true;
  }

  const __checkGeoLocationPermission = await checkGeoLocationPermission();
  consoleLog(
    'checkAllRequiredPermissions __checkGeoLocationPermission==>',
    __checkGeoLocationPermission,
  );

  if (__checkGeoLocationPermission) {
    // This required in android version upto 11
    constants.API_LEVEL <= 30 && status++;
    permissionsStatus.GeoLocation = true;
  }

  const bleState = await BLEService.manager.state();
  consoleLog('checkAllRequiredPermissions bleState==>', bleState);
  if (bleState === BluetoothState.PoweredOn) {
    status++;
    permissionsStatus.BluetoothState = true;
  }

  consoleLog('checkAllRequiredPermissions status==>', status);

  if (returnType == 2) {
    return permissionsStatus;
  }
  return status;
};
