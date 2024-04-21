import {Device} from 'react-native-ble-plx';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {getDeviceModelData} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {DeviceExtendedProps} from './types';

export const filterBLEDevices = (device: DeviceExtendedProps): any => {
  var filterDevice = null;
  const deviceName = device?.localName ?? device?.name;
  if (device && !isObjectEmpty(device) && deviceName) {
    if (
      deviceName?.toUpperCase()?.includes('FAUCET') ||
      deviceName?.toUpperCase()?.includes('SL')
    ) {
      var __deviceNameArr = deviceName.split(' ');
      // consoleLog('__deviceNameArr', __deviceNameArr);
      const deviceStaticData = getDeviceModelData(device, BLE_DEVICE_MODELS);

      if (
        Array.isArray(__deviceNameArr) &&
        __deviceNameArr.length > 0 &&
        deviceStaticData?.fullNameAllModel
      ) {
        __deviceNameArr[1] = deviceStaticData?.fullNameAllModel;
        device.localName = __deviceNameArr.join(' ');
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
