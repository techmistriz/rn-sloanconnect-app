import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {base64EncodeDecode, base64ToText} from 'src/utils/Helpers/encryption';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty, chunk} from 'src/utils/Helpers/array';
import {
  hexToDecimal,
  addSeparatorInString,
  hexToString,
  base64ToHex,
} from 'src/utils/Helpers/encryption';

/** Function comments */
export const mappingDiagnosticGen2 = async (
  __BLE_GATT_SERVICES: any,
  __SERVICE_UUID: string,
  __CHARACTERISTIC_UUID: string,
  __allPack: string[],
) => {
  var result: any = [];
  consoleLog(
    'mappingDiagnosticGen2 __BLE_GATT_SERVICES==>',
    __BLE_GATT_SERVICES,
  );
  consoleLog('mappingDiagnosticGen2 __allPack==>', __allPack);

  const __BLE_GATT_SERVICES_TMP = __BLE_GATT_SERVICES?.[__SERVICE_UUID];
  consoleLog(
    'mappingDiagnosticGen2 __BLE_GATT_SERVICES_TMP==>',
    __BLE_GATT_SERVICES_TMP,
  );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
    return result;
  }

  const __BLE_GATT_SERVICES_TMP2 =
    __BLE_GATT_SERVICES_TMP?.characteristics?.[__CHARACTERISTIC_UUID];
  consoleLog(
    'mappingDiagnosticGen2 __BLE_GATT_SERVICES_TMP2==>',
    __BLE_GATT_SERVICES_TMP2,
  );
  if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
    return result;
  }

  // 1 byte 1 byte 1 byte 1 byte
  // ­Byte Position 0: Start Flag, Ox76 signals the start of Integers write payload.
  // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
  __allPack.forEach((element, index) => {
    if (element != '71ff04') {
      consoleLog('mappingDeviceDataStringGen2 index==>', index);
      consoleLog('mappingDeviceDataStringGen2 element==>', element);
      const __element = addSeparatorInString(element, 2, ' ');
      consoleLog('mappingDeviceDataStringGen2 __element==>', __element);
      const __elementArr = __element.split(' ');

      if (Array.isArray(__elementArr) && __elementArr?.[0] == '76') {
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

        __uuidData.forEach((characteristic: any, __index: number) => {
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
          const __characteristicValueInText = hexToDecimal(__characteristicHex);
          consoleLog(
            'mappingDeviceDataStringGen2 __characteristicValueInText==>',
            __characteristicValueInText,
          );

          if (__uuidData?.[__index]?.value) {
            __uuidData[__index].value.currentValue = __characteristicValueInText
              ?.toString()
              ?.trim();
          }
        });

        __BLE_GATT_SERVICES_TMP2.chunks[index].uuidData = __uuidData;
      }
    }
  });

  result = __BLE_GATT_SERVICES_TMP2;
  // consoleLog('mappingDiagnosticGen2 result==>', JSON.stringify(result));
  return result;
};

/** Function comments */
export const readingDiagnosticGen2 = async (
  characteristicMonitorDiagnosticMapped: any,
) => {
  const characteristicMonitorDeviceDataIntegersMapped =
    BLEService?.characteristicMonitorDeviceDataIntegersMapped;
  let RESULTS = [];

  //  Sensor result
  const __characteristicSensor =
    characteristicMonitorDiagnosticMapped?.chunks?.[0]?.uuidData?.[3];

  // consoleLog(
  //   'initialize __characteristicSensor==>',
  //   __characteristicSensor,
  // );

  RESULTS.push({
    name: 'Sensor',
    value: __characteristicSensor?.value?.currentValue,
    showInList: true,
  });

  //  Valve result
  const __characteristicValve =
    characteristicMonitorDiagnosticMapped?.chunks?.[0]?.uuidData?.[4];

  // consoleLog(
  //   'initialize __characteristicValve==>',
  //   JSON.stringify(__characteristicValve),
  // );

  RESULTS.push({
    name: 'Valve',
    value: __characteristicValve?.value?.currentValue,
    showInList: true,
  });

  //  Turbine result
  const __characteristicTurbine =
    characteristicMonitorDiagnosticMapped?.chunks?.[0]?.uuidData?.[5];

  // consoleLog(
  //   'initialize __characteristicTurbine==>',
  //   JSON.stringify(__characteristicTurbine),
  // );

  RESULTS.push({
    name: 'Turbine',
    value: __characteristicTurbine?.value?.currentValue,
    showInList: true,
  });

  //  Dispense result
  // const __characteristicDispense =
  //   characteristicMonitorDiagnosticMapped?.chunks?.[0]?.uuidData?.[3];

  // consoleLog(
  //   'initialize __characteristicDispense==>',
  //   JSON.stringify(cleanCharacteristic(__characteristicDispense)),
  // );

  // RESULTS.push({
  //   name: 'Water Dispense',
  //   value: __characteristicDispense?.value?.currentValue,
  //   showInList: true,
  // });

  //  Battery result
  const __characteristicBattery =
    characteristicMonitorDiagnosticMapped?.chunks?.[0]?.uuidData?.[7];
  // consoleLog(
  //   'initialize __characteristicBattery==>',
  //   JSON.stringify(__characteristicBattery),
  // );

  RESULTS.push({
    name: 'Battery Level at Diagnostic',
    value:
      __characteristicBattery?.value?.currentValue > 100
        ? 100
        : __characteristicBattery?.value?.currentValue,
    forceText: true,
    prefix: null,
    postfix: ' %',
    showInList: true,
  });

  //  DTLastDiagnostic result
  const __characteristicDTLastDiagnostic =
    characteristicMonitorDeviceDataIntegersMapped?.chunks?.[0]?.uuidData?.[13];

  consoleLog(
    'initialize __characteristicDTLastDiagnostic==>',
    JSON.stringify(__characteristicDTLastDiagnostic),
  );

  RESULTS.push({
    name: 'D/T of last diagnostic',
    value: __characteristicDTLastDiagnostic?.value?.currentValue,
    showInList: false,
  });

  return RESULTS;
};
