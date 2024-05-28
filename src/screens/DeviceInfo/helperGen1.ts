import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode, hexToDecimal} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
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
  const statisticsInformationArr = await getStatisticsInformationDataGen1();
  const settingLogs = await getSettingLogsDataGen1();
  // consoleLog('getDeviceInfoAdvance settingLogs==>', settingLogs);
  return [...statisticsInformationArr, ...settingLogs];
};

/** BDInformationData method for normal info */
const getBDInformationDataGen1 = () => {
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
          (value?.generation == 'all' ||
            value?.generation == BLEService.deviceGeneration)
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
    deviceVersion = BLEService.deviceVersion;
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
              prefix: value?.prefix,
              postfix: value?.postfix,
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
  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c920';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];
    // consoleLog('getSettingLogsDataGen1 allServices==>', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // consoleLog(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        try {
          if (
            typeof value?.uuid != 'undefined' &&
            value?.displayInList !== false &&
            (value?.generation == 'all' ||
              value?.generation == BLEService.deviceGeneration)
          ) {
            var characteristic = await BLEService.readCharacteristicForDevice(
              serviceUUID,
              value?.uuid,
            );

            // consoleLog('getSettingLogsDataGen1 characteristic==>', characteristic);

            var decodeValue = 'N/A';
            if (!isObjectEmpty(characteristic) && characteristic?.value) {
              decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
            }

            // var extra = undefined;
            // if (value?.name == 'D/T of last factory reset') {
            //   // Phone of last factory reset
            //   var characteristic1 =
            //     await BLEService.readCharacteristicForDevice(
            //       'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
            //       'd0aba888-fb10-4dc9-9b17-bdd8f490c929',
            //     );

            //   // consoleLog('characteristic1==>', characteristic1?.value);
            //   if (!isObjectEmpty(characteristic1) && characteristic1?.value) {
            //     var decodeValue1 = base64EncodeDecode(
            //       characteristic1?.value,
            //       'decode',
            //     );

            //     // consoleLog('characteristic1 decodeValue1==>', decodeValue1);

            //     if (decodeValue1 == 'MANUAL') {
            //       // Operating hours since install
            //       var characteristic2 =
            //         await BLEService.readCharacteristicForDevice(
            //           'd0aba888-fb10-4dc9-9b17-bdd8f490c910',
            //           'd0aba888-fb10-4dc9-9b17-bdd8f490c911',
            //         );

            //       // consoleLog('characteristic2==>', characteristic2?.value);

            //       if (
            //         !isObjectEmpty(characteristic2) &&
            //         characteristic2?.value
            //       ) {
            //         var decodeValue2 = hexToDecimal(
            //           base64EncodeDecode(characteristic2?.value, 'decode'),
            //         );
            //         // consoleLog('characteristic1 decodeValue2==>', decodeValue2);
            //         extra = decodeValue2;
            //       }
            //     }
            //   }
            // }

            data.push({
              name: value?.name,
              uuid: value?.uuid,
              // extra: extra,
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
