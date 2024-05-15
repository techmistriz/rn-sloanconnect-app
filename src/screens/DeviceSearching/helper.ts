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
  const deviceName = device?.localName ?? device?.name;

  if (device && !isObjectEmpty(device) && deviceName) {
    device.deviceCustomName = deviceName;
    if (
      true
      // deviceName?.toUpperCase()?.includes('FAUCET') ||
      // deviceName?.toUpperCase()?.includes('SL')
    ) {
      var __deviceNameArr = deviceName.split(' ');
      // consoleLog('__deviceNameArr', __deviceNameArr);
      const deviceGen = getBleDeviceGeneration(deviceName);
      const deviceStaticData = getDeviceModelData(
        device,
        BLE_DEVICE_MODELS,
        deviceGen,
      );
      const deviceSerialNumber = getBleDeviceSerialNumber(device, deviceGen);

      if (
        Array.isArray(__deviceNameArr) &&
        __deviceNameArr.length > 0 &&
        deviceStaticData?.fullNameAllModel
      ) {
        if (__deviceNameArr[0] == 'SL') {
          __deviceNameArr[0] = 'FAUCET';
        }
        __deviceNameArr[1] = deviceStaticData?.fullNameAllModel;
        __deviceNameArr.push(deviceSerialNumber?.toUpperCase());
        device.deviceCustomName = __deviceNameArr.join(' ');
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
