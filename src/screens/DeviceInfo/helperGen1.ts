import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode, hexToDecimal} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';

const connectedDevice = BLEService.getDevice();

/** getDeviceInfoNormal method for normal info */
export const getDeviceInfoNormal = async () => {
  const ADBDInformationARR = await getBDInformationDataGen1();

  return [...ADBDInformationARR];
};

/** getDeviceInfoAdvance method for advance */
export const getDeviceInfoAdvance = async () => {
  const StatisticsInformationArr = await getStatisticsInformationDataGen1();
  const SettingLogs = await getSettingLogsDataGen1();

  return [...StatisticsInformationArr, SettingLogs];
};

/** BDInformationData method for normal info */
const getBDInformationDataGen1 = () => {
  // var deviceVersion = '01';
  var deviceGen = 'gen1';
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    deviceGen = getBleDeviceGeneration(__deviceName);
    // deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
  }

  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c900';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];

    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        if (
          typeof value?.uuid != 'undefined' &&
          value?.displayInList !== false &&
          (value?.generation == 'all' || value?.generation == deviceGen)
        ) {
          var characteristic = await BLEService.readCharacteristicForDevice(
            serviceUUID,
            value?.uuid,
          );

          var decodeValue = 'N/A';
          if (!isObjectEmpty(characteristic) && characteristic?.value) {
            decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
          }

          data.push({
            name: value?.name,
            uuid: value?.uuid,
            value: formatCharateristicValue(value, decodeValue),
          });
        }
      }
    }
    resolve(data);
  });
};

/** BDInformationData method for advance */
const getStatisticsInformationDataGen1 = () => {
  var deviceVersion = '01';
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    const deviceGen = getBleDeviceGeneration(__deviceName);
    deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
  }

  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c910';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];

    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        if (
          typeof value?.uuid != 'undefined' &&
          value?.displayInList !== false &&
          (value?.generation == 'all' || value?.generation == deviceVersion)
        ) {
          var characteristic = await BLEService.readCharacteristicForDevice(
            serviceUUID,
            value?.uuid,
          );

          if (typeof characteristic != 'undefined') {
            data.push({
              name: value?.name,
              uuid: value?.uuid,
              value: hexToDecimal(
                base64EncodeDecode(characteristic?.value, 'decode'),
              ),
            });
          }
          // consoleLog(
          //   'DeviceInfo initialize characteristic==>',
          //   JSON.stringify(characteristic),
          // );
        }
      }
    }

    resolve(data);
  });
};

/** BDInformationData method for advance */
const getSettingLogsDataGen1 = () => {
  var deviceGen = 'gen1';
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    deviceGen = getBleDeviceGeneration(__deviceName);
    // deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
  }

  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c920';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];
    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // consoleLog(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        try {
          if (
            typeof value?.uuid != 'undefined' &&
            value?.displayInList !== false &&
            (value?.generation == 'all' || value?.generation == deviceGen)
          ) {
            var characteristic = await BLEService.readCharacteristicForDevice(
              serviceUUID,
              value?.uuid,
            );

            var decodeValue = 'N/A';
            if (!isObjectEmpty(characteristic) && characteristic?.value) {
              decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
            }

            data.push({
              name: value?.name,
              uuid: value?.uuid,
              value: formatCharateristicValue(value, decodeValue),
              // value: decodeValue,
            });
          }
        } catch (error) {
          consoleLog('getSettingLogsData error==>', error);
        }
      }
    }
    resolve(data);
  });
};
