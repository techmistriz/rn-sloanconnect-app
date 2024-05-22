import {Device} from 'react-native-ble-plx';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  getBleDeviceGeneration,
  getBleDeviceSerialNumber,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {DeviceExtendedProps} from './types';

export const filterBLEDevices = (device: DeviceExtendedProps): any => {
  var filterDevice = null;
  var deviceName = device?.localName ?? device?.name ?? 'Unknown';
  // deviceName = 'FAUCET ADSKU00 AYYSS';

  if (device && !isObjectEmpty(device) && deviceName) {
    device.deviceCustomName = deviceName;
    if (
      // true
      deviceName?.toUpperCase()?.includes('FAUCET') ||
      deviceName?.toUpperCase()?.includes('SL')
    ) {
      var deviceNameArr = deviceName.split(' ');
      // consoleLog('deviceNameArr', deviceNameArr);
      const deviceGen = getBleDeviceGeneration(deviceName);
      const deviceStaticData = getDeviceModelData(
        device,
        BLE_DEVICE_MODELS,
        deviceGen,
      );
      const deviceSerialNumber = getBleDeviceSerialNumber(device, deviceGen);

      if (
        Array.isArray(deviceNameArr) &&
        deviceNameArr.length > 0
      ) {
        if (deviceNameArr[0] == 'SL') {
          deviceNameArr[0] = 'FAUCET';
        }
        deviceNameArr[1] = deviceStaticData?.fullNameAllModel ?? 'UNKNOWN';
        deviceNameArr.push(deviceSerialNumber?.toUpperCase());
        device.deviceCustomName = deviceNameArr.join(' ');
      }
      // consoleLog('deviceStaticData', deviceStaticData);
      filterDevice = {
        ...device,
        modelStaticData: deviceStaticData,
      };
    }
  }

  return filterDevice;
};
