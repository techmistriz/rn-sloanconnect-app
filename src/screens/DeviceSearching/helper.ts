import {Device} from 'react-native-ble-plx';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  cleanCharacteristic,
  getBleDeviceGeneration,
  getBleDeviceSerialNumber,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {DeviceExtendedProps} from './types';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

export const filterBLEDevices = (deviceRaw: DeviceExtendedProps): any => {
  const device = cleanCharacteristic(deviceRaw);
  var filterDevice = null;
  var deviceName = device?.localName ?? device?.name ?? '';
  // console.log('deviceName', deviceName);
  // deviceName = 'FAUCET ADSKU00 AYYSS';

  if (device && !isObjectEmpty(device) && deviceName != '') {
    device.deviceCustomName = deviceName;
    if (
      // true
      deviceName?.toUpperCase()?.includes('FAUCET') ||
      deviceName?.toUpperCase()?.includes('SL') ||
      deviceName?.toUpperCase()?.includes('FLUSHER')
    ) {
      const deviceTmp = {...device};
      deviceTmp.localName = deviceName;
      const deviceGen = getBleDeviceGeneration(deviceName);
      const deviceStaticData = getDeviceModelData(
        deviceTmp,
        BLE_DEVICE_MODELS,
        deviceGen,
      );
      const deviceSerialNumber = getBleDeviceSerialNumber(device, deviceGen);
      // consoleLog('filterBLEDevices deviceGen==>', deviceGen);
      // consoleLog('filterBLEDevices deviceSerialNumber==>', deviceSerialNumber);
      // consoleLog('filterBLEDevices deviceStaticData==>', deviceStaticData);

      var deviceNameArr = deviceName.split(' ');
      // consoleLog('deviceNameArr', deviceNameArr);
      if (Array.isArray(deviceNameArr) && deviceNameArr.length > 0) {
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
