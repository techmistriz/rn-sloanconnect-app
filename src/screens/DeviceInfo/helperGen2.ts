import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  base64EncodeDecode,
  hexEncodeDecode,
  hexToString,
  addSeparatorInString,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';
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
  const data = await getDeviceDataString();
  return [...data];
};

/** getDeviceInfoAdvance method for advance */
export const getDeviceInfoAdvanceGen2 = async () => {
  // const StatisticsInformationArr = await getStatisticsInformationDataGen1();
  // const SettingLogs = await getSettingLogsDataGen1();
  // return [...StatisticsInformationArr, SettingLogs];
};

/** BDInformationData method for normal info */
const getDeviceDataString = () => {
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
        // consoleLog(`Key: ${key}, Value: ${JSON.stringify(value)}`);

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

/** Function comments */
export const mappingDeviceDataStringGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  consoleLog(
    'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES==>',
    __BLE_GATT_SERVICES,
  );
  consoleLog('mappingDeviceDataStringGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  consoleLog(
    'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES_TMP==>',
    __BLE_GATT_SERVICES_TMP,
  );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  consoleLog(
    'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES_TMP2==>',
    __BLE_GATT_SERVICES_TMP2,
  );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
    return result;
  }

  // 0x73 LEN # of IDs 32
  // 1 byte 1 byte 1 byte 1 byte
  // ­Byte Position 0: Start Flag, Ox72 signals the start of Integers write payload.
  // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
  // Byte Position 2: Integer value indicating how many Setting IDs to follow in Package.
  // Byte Position 3: Integer value 32 indicates the Setting Value Size 32 = 32-bit size.

  __allPack.forEach((element, index) => {
    if (element != '71ff04') {
      consoleLog('mappingDeviceDataStringGen2 index==>', index);
      consoleLog('mappingDeviceDataStringGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      consoleLog('mappingDeviceDataStringGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '73') {
        consoleLog('mappingDeviceDataStringGen2 __elementArr==>', __elementArr);
        const lengthHex = __elementArr[2];
        const lengthDec = hexToDecimal(lengthHex);

        consoleLog('mappingDeviceDataStringGen2 hexToDecimal==>', lengthDec);

        const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks?.[index]?.uuidData;
        consoleLog('mappingDeviceDataStringGen2 __uuidData==>', __uuidData);

        if (isObjectEmpty(__uuidData)) {
          return false;
        }

        // Removing start flags
        const __elementArrTmp = [...__elementArr];
        const startFlags = __elementArrTmp.splice(0, 2);
        consoleLog(
          'mappingDeviceDataStringGen2 __elementArrTmp==>',
          __elementArrTmp,
        );
        consoleLog('mappingDeviceDataStringGen2 startFlags==>', startFlags);

        // const __elementArrTmpChunk = chunk(__elementArrTmp, 5);
        // __elementArrTmpChunk.splice(-1);
        // consoleLog("mappingDeviceDataStringGen2 __elementArrTmpChunk==>", __elementArrTmpChunk);

        // consoleLog("mappingDeviceDataStringGen2 __elementArrTmpChunk.length==>", __elementArrTmpChunk.length);
        // consoleLog("mappingDeviceDataStringGen2 __uuidData.length==>", __uuidData.length);

        // if (__elementArrTmpChunk.length < __uuidData.length) {
        //     return false;
        // }

        __uuidData.forEach((characteristic: any, __index: number) => {
          //
          const __characteristicTmp = {...characteristic};
          const __keyValueArr = __elementArrTmp.splice(0, characteristic?.size);
          consoleLog(
            'mappingDeviceDataStringGen2 __characteristicTmp==>',
            __characteristicTmp,
          );
          consoleLog(
            'mappingDeviceDataStringGen2 removedArr==>',
            __keyValueArr,
          );

          //
          const __keyValueArrTmp = [...__keyValueArr];
          const keyArr = __keyValueArrTmp.splice(0, characteristic?.name?.size);
          consoleLog(
            'mappingDeviceDataStringGen2 __keyValueArrTmp==>',
            __keyValueArrTmp,
          );
          consoleLog('mappingDeviceDataStringGen2 keyArr==>', keyArr);

          // consoleLog("mappingDeviceDataStringGen2 characteristic==>", characteristic);
          // const __characteristic = [...characteristic];
          // __characteristic.splice(0, 1);
          // consoleLog("mappingDeviceDataStringGen2 __characteristic==>", __characteristic);
          const __characteristicHex = __keyValueArrTmp.join('');
          consoleLog(
            'mappingDeviceDataStringGen2 __characteristicHex==>',
            __characteristicHex,
          );
          const __characteristicValueInText = hexToString(__characteristicHex);
          consoleLog(
            'mappingDeviceDataStringGen2 __characteristicValueInText==>',
            __characteristicValueInText,
          );

          if (__uuidData?.[__index]?.value) {
            __uuidData[__index].value.currentValue =
              __characteristicValueInText?.trim();
          }
        });

        __BLE_GATT_SERVICES_TMP2.chunks[index].uuidData = __uuidData;
      }
    }
  });

  result = __BLE_GATT_SERVICES_TMP2;
  // consoleLog('mappingRealTimeDataGen2 result==>', JSON.stringify(result));
  return result;
};
