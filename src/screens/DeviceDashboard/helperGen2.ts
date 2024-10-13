import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {chunk, isObjectEmpty} from 'src/utils/Helpers/array';
import {addSeparatorInString, hexToDecimal, hexToString,} from 'src/utils/Helpers/encryption';

/** Function comments */
export const mappingDeviceDataIntegersGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  // consoleLog(
  //   'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES==>',
  //   __BLE_GATT_SERVICES,
  // );
  // consoleLog('mappingDeviceDataIntegersGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  // consoleLog(
  //   'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES_TMP==>',
  //   __BLE_GATT_SERVICES_TMP,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  // consoleLog(
  //   'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES_TMP2==>',
  //   __BLE_GATT_SERVICES_TMP2,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
    return result;
  }

  // 0x72 LEN # of IDs 32
  // 1 byte 1 byte 1 byte 1 byte
  // ­Byte Position 0: Start Flag, Ox72 signals the start of Integers write payload.
  // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
  // Byte Position 2: Integer value indicating how many Setting IDs to follow in Package.
  // Byte Position 3: Integer value 32 indicates the Setting Value Size 32 = 32-bit size.

  __allPack.forEach((element, index) => {
    if (element != '71ff04') {
      // consoleLog('mappingDeviceDataIntegersGen2 index==>', index);
      // consoleLog('mappingDeviceDataIntegersGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      // consoleLog('mappingDeviceDataIntegersGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '72') {
        // consoleLog(
        //   'mappingDeviceDataIntegersGen2 __elementArr==>',
        //   __elementArr,
        // );
        const lengthHex = __elementArr[2];
        const lengthDec = hexToDecimal(lengthHex);

        // consoleLog('mappingDeviceDataIntegersGen2 hexToDecimal==>', lengthDec);

        const __elementArrTmp = [...__elementArr];
        __elementArrTmp.splice(0, 4);
        // consoleLog(
        //   'mappingDeviceDataIntegersGen2 __elementArrTmp==>',
        //   __elementArrTmp,
        // );

        const __elementArrTmpChunk = chunk(__elementArrTmp, 5);
        __elementArrTmpChunk.splice(-1);
        // consoleLog(
        //   'mappingDeviceDataIntegersGen2 __elementArrTmpChunk==>',
        //   __elementArrTmpChunk,
        // );

        const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks[index]?.uuidData;
        // consoleLog('mappingDeviceDataIntegersGen2 __uuidData==>', __uuidData);

        if (isObjectEmpty(__uuidData)) {
          return false;
        }

        // consoleLog(
        //   'mappingDeviceDataIntegersGen2 __elementArrTmpChunk.length==>',
        //   __elementArrTmpChunk.length,
        // );
        // consoleLog(
        //   'mappingDeviceDataIntegersGen2 __uuidData.length==>',
        //   __uuidData.length,
        // );

        if (__elementArrTmpChunk.length < __uuidData.length) {
          return false;
        }

        __elementArrTmpChunk.forEach((characteristic, __index) => {
          // consoleLog(
          //   'mappingDeviceDataIntegersGen2 characteristic==>',
          //   characteristic,
          // );
          const __characteristic = [...characteristic];
          __characteristic.splice(0, 1);
          // consoleLog(
          //   'mappingDeviceDataIntegersGen2 __characteristic==>',
          //   __characteristic,
          // );
          const __characteristicHex = __characteristic.join('');
          // consoleLog(
          //   'mappingDeviceDataIntegersGen2 __characteristicHex==>',
          //   __characteristicHex,
          // );
          const __characteristicDec = hexToDecimal(__characteristicHex);
          // consoleLog(
          //   'mappingDeviceDataIntegersGen2 __characteristicDec==>',
          //   __characteristicDec,
          // );

          if (__uuidData?.[__index]?.value) {
            __uuidData[__index].value.currentValue = __characteristicDec;
          }
        });

        __BLE_GATT_SERVICES_TMP2.chunks[index].uuidData = __uuidData;
      }
    }
  });

  result = __BLE_GATT_SERVICES_TMP2;
  consoleLog('mappingDeviceDataIntegersGen2 result==>', result);
  return result;
};

/** Function comments */
export const mappingDeviceDataStringGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  // consoleLog(
  //   'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES==>',
  //   __BLE_GATT_SERVICES,
  // );
  // consoleLog('mappingDeviceDataStringGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  // consoleLog(
  //   'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES_TMP==>',
  //   __BLE_GATT_SERVICES_TMP,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  // consoleLog(
  //   'mappingDeviceDataStringGen2 __BLE_GATT_SERVICES_TMP2==>',
  //   __BLE_GATT_SERVICES_TMP2,
  // );
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
      // consoleLog('mappingDeviceDataStringGen2 index==>', index);
      // consoleLog('mappingDeviceDataStringGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      // consoleLog('mappingDeviceDataStringGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '73') {
        // consoleLog('mappingDeviceDataStringGen2 __elementArr==>', __elementArr);
        const lengthHex = __elementArr[2];
        const lengthDec = hexToDecimal(lengthHex);

        // consoleLog('mappingDeviceDataStringGen2 hexToDecimal==>', lengthDec);

        const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks?.[index]?.uuidData;
        // consoleLog('mappingDeviceDataStringGen2 __uuidData==>', __uuidData);

        if (isObjectEmpty(__uuidData)) {
          return false;
        }

        // Removing start flags
        const __elementArrTmp = [...__elementArr];
        const startFlags = __elementArrTmp.splice(0, 2);
        // consoleLog(
        //   'mappingDeviceDataStringGen2 __elementArrTmp==>',
        //   __elementArrTmp,
        // );
        // consoleLog('mappingDeviceDataStringGen2 startFlags==>', startFlags);

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
          // consoleLog(
          //   'mappingDeviceDataStringGen2 __characteristicTmp==>',
          //   __characteristicTmp,
          // );
          // consoleLog(
          //   'mappingDeviceDataStringGen2 removedArr==>',
          //   __keyValueArr,
          // );

          //
          const __keyValueArrTmp = [...__keyValueArr];
          const keyArr = __keyValueArrTmp.splice(0, characteristic?.name?.size);
          // consoleLog(
          //   'mappingDeviceDataStringGen2 __keyValueArrTmp==>',
          //   __keyValueArrTmp,
          // );
          // consoleLog('mappingDeviceDataStringGen2 keyArr==>', keyArr);

          // consoleLog("mappingDeviceDataStringGen2 characteristic==>", characteristic);
          // const __characteristic = [...characteristic];
          // __characteristic.splice(0, 1);
          // consoleLog("mappingDeviceDataStringGen2 __characteristic==>", __characteristic);
          const __characteristicHex = __keyValueArrTmp.join('');
          // consoleLog(
          //   'mappingDeviceDataStringGen2 __characteristicHex==>',
          //   __characteristicHex,
          // );
          const __characteristicValueInText = hexToString(__characteristicHex);
          // consoleLog(
          //   'mappingDeviceDataStringGen2 __characteristicValueInText==>',
          //   __characteristicValueInText,
          // );

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

/** Function comments */
export const mappingRealTimeDataGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  // consoleLog(
  //   'mappingRealTimeDataGen2 __BLE_GATT_SERVICES==>',
  //   __BLE_GATT_SERVICES,
  // );
  // consoleLog('mappingRealTimeDataGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  // consoleLog(
  //   'mappingRealTimeDataGen2 __BLE_GATT_SERVICES_TMP==>',
  //   __BLE_GATT_SERVICES_TMP,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  // consoleLog(
  //   'mappingRealTimeDataGen2 __BLE_GATT_SERVICES_TMP2==>',
  //   __BLE_GATT_SERVICES_TMP2,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
    return result;
  }

  // 0x72 LEN # of IDs 32
  // 1 byte 1 byte 1 byte 1 byte
  // ­Byte Position 0: Start Flag, Ox72 signals the start of Integers write payload.
  // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
  // Byte Position 2: Integer value indicating how many Setting IDs to follow in Package.
  // Byte Position 3: Integer value 32 indicates the Setting Value Size 32 = 32-bit size.

  __allPack.forEach((element, index) => {
    if (element != '71ff04') {
      // consoleLog('mappingRealTimeDataGen2 index==>', index);
      // consoleLog('mappingRealTimeDataGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      // consoleLog('mappingRealTimeDataGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '75') {
        // consoleLog('mappingRealTimeDataGen2 __elementArr==>', __elementArr);
        const lengthHex = __elementArr[2];
        const lengthDec = hexToDecimal(lengthHex);

        // consoleLog('mappingRealTimeDataGen2 hexToDecimal==>', lengthDec);

        const __elementArrTmp = [...__elementArr];
        __elementArrTmp.splice(0, 2);
        // consoleLog(
        //   'mappingRealTimeDataGen2 __elementArrTmp==>',
        //   __elementArrTmp,
        // );

        const __elementArrTmpChunk = chunk(__elementArrTmp, 1);
        // __elementArrTmpChunk.splice(-1);
        // consoleLog(
        //   'mappingRealTimeDataGen2 __elementArrTmpChunk==>',
        //   __elementArrTmpChunk,
        // );

        const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks[index]?.uuidData;
        // consoleLog('mappingRealTimeDataGen2 __uuidData==>', __uuidData);

        if (isObjectEmpty(__uuidData)) {
          return false;
        }

        // consoleLog(
        //   'mappingRealTimeDataGen2 __elementArrTmpChunk.length==>',
        //   __elementArrTmpChunk.length,
        // );
        // consoleLog(
        //   'mappingRealTimeDataGen2 __uuidData.length==>',
        //   __uuidData.length,
        // );

        if (__elementArrTmpChunk.length < __uuidData.length) {
          return false;
        }

        __elementArrTmpChunk.forEach((characteristic, __index) => {
          // consoleLog(
          //   'mappingRealTimeDataGen2 characteristic==>',
          //   characteristic,
          // );
          // __characteristic.splice(0, 1);
          // consoleLog(
          //   'mappingRealTimeDataGen2 __characteristic==>',
          //   __characteristic,
          // );
          // consoleLog(
          //   'mappingRealTimeDataGen2 __characteristicHex==>',
          //   __characteristicHex,
          // );
          const __characteristicDec = hexToDecimal(characteristic?.[0]);
          // consoleLog(
          //   'mappingRealTimeDataGen2 __characteristicDec==>',
          //   __characteristicDec,
          // );

          if (__uuidData?.[__index]?.value) {
            __uuidData[__index].value.currentValue = __characteristicDec;
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

/** Function comments */
export const mappingDataCollectionGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  // consoleLog(
  //   'mappingDataCollectionGen2 __BLE_GATT_SERVICES==>',
  //   __BLE_GATT_SERVICES,
  // );
  // consoleLog('mappingDataCollectionGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  // consoleLog(
  //   'mappingDataCollectionGen2 __BLE_GATT_SERVICES_TMP==>',
  //   __BLE_GATT_SERVICES_TMP,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  // consoleLog(
  //   'mappingDataCollectionGen2 __BLE_GATT_SERVICES_TMP2==>',
  //   __BLE_GATT_SERVICES_TMP2,
  // );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
    return result;
  }

  // 0x72 LEN # of IDs 32
  // 1 byte 1 byte 1 byte 1 byte
  // ­Byte Position 0: Start Flag, Ox72 signals the start of Integers write payload.
  // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
  // Byte Position 2: Integer value indicating how many Setting IDs to follow in Package.
  // Byte Position 3: Integer value 32 indicates the Setting Value Size 32 = 32-bit size.

  __allPack.forEach((element, index) => {
    if (element != '71ff04') {
      // consoleLog('mappingDataCollectionGen2 index==>', index);
      // consoleLog('mappingDataCollectionGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      // consoleLog('mappingDataCollectionGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '74') {
        // consoleLog('mappingDataCollectionGen2 __elementArr==>', __elementArr);
        const lengthHex = __elementArr[1];
        const lengthDec = hexToDecimal(lengthHex);

        // consoleLog('mappingDataCollectionGen2 hexToDecimal==>', lengthDec);

        const __elementArrTmp = [...__elementArr];
        __elementArrTmp.splice(0, 2);
        // consoleLog(
        //   'mappingDataCollectionGen2 __elementArrTmp==>',
        //   __elementArrTmp,
        // );

        const __elementArrTmpChunk = chunk(__elementArrTmp, 5);
        // __elementArrTmpChunk.splice(-1);
        // consoleLog(
        //   'mappingDataCollectionGen2 __elementArrTmpChunk==>',
        //   __elementArrTmpChunk,
        // );

        const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks[index]?.uuidData;
        // consoleLog('mappingDataCollectionGen2 __uuidData==>', __uuidData);

        if (isObjectEmpty(__uuidData)) {
          return false;
        }

        // consoleLog(
        //   'mappingDataCollectionGen2 __elementArrTmpChunk.length==>',
        //   __elementArrTmpChunk.length,
        // );
        // consoleLog(
        //   'mappingDataCollectionGen2 __uuidData.length==>',
        //   __uuidData.length,
        // );

        if (__elementArrTmpChunk.length < __uuidData.length) {
          return false;
        }

        __elementArrTmpChunk.forEach((characteristic, __index) => {
          // consoleLog(
          //   'mappingDataCollectionGen2 characteristic==>',
          //   characteristic,
          // );
          const __characteristic = [...characteristic];
          __characteristic.splice(0, 1);
          // consoleLog(
          //   'mappingDataCollectionGen2 __characteristic==>',
          //   __characteristic,
          // );
          const __characteristicHex = __characteristic.join('');
          // consoleLog(
          //   'mappingDataCollectionGen2 __characteristicHex==>',
          //   __characteristicHex,
          // );
          const __characteristicDec = hexToDecimal(__characteristicHex);
          // consoleLog(
          //   'mappingDataCollectionGen2 __characteristicDec==>',
          //   __characteristicDec,
          // );

          if (__uuidData?.[__index]?.value) {
            __uuidData[__index].value.currentValue = __characteristicDec;
          }
        });

        __BLE_GATT_SERVICES_TMP2.chunks[index].uuidData = __uuidData;
      }
    }
  });

  result = __BLE_GATT_SERVICES_TMP2;
  // consoleLog('mappingDataCollectionGen2 result==>', JSON.stringify(result));
  return result;
};
