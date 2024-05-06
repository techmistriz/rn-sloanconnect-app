import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';

const connectedDevice = BLEService.getDevice();

/** getDeviceInfoNormalGen2 method for normal info */
export const getDeviceInfoNormalGen2 = async () => {
  const ADBDInformationARR = await getBDInformationDataGen2();

  return [...ADBDInformationARR];
};

/** getDeviceInfoAdvance method for advance */
export const getDeviceInfoAdvanceGen2 = async () => {
  // const StatisticsInformationArr = await getStatisticsInformationDataGen1();
  // const SettingLogs = await getSettingLogsDataGen1();
  // return [...StatisticsInformationArr, SettingLogs];
};

/** BDInformationData method for normal info */
const getBDInformationDataGen2 = () => {
  const deviceGen = BLEService.deviceGeneration;

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
