import {Alert, Linking, Platform, Share, ToastAndroid} from 'react-native';
import {constants} from '../../common';
import moment from 'moment';
import {
  addSeparatorInString,
  asciiToHex,
  base64EncodeDecode,
  base64ToDecimal,
  base64ToHex,
  base64ToText,
  decimalToHex,
  fromHexStringUint8Array,
  getTimestampInSeconds,
  hexEncodeDecode,
  hexToDecimal,
  toHexString,
} from './encryption';
import {BLEService} from 'src/services';
import {findObject, isObjectEmpty} from './array';
import StorageService from 'src/services/StorageService/StorageService';
import {consoleLog, parseDateTimeInFormat} from './HelperFunction';
import {BLE_GATT_SERVICES} from '../StaticData/BLE_GATT_SERVICES';
import BLE_CONSTANTS from '../StaticData/BLE_CONSTANTS';
import {sha256Bytes} from 'react-native-sha256';
import {Device} from 'react-native-ble-plx';

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export function setValue(value: any) {
  return value ?? '';
}

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export function findObjectFromObjectArray(
  value: any,
  data: Array<Object>,
  options: any,
) {
  var result: any = null;
  if (
    value &&
    data &&
    options &&
    Array.isArray(data) &&
    data.length &&
    typeof options?.searchKey !== 'undefined'
  ) {
    result = data.find((item: any) => {
      return item[options?.searchKey] == value;
    });
  }
  return result;
}

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export function findIndexById(data: any, item: any) {
  var index: number = 0;
  if (data && item && Array.isArray(data) && data.length) {
    index = data.findIndex(x => x.id === item?.id);
  }
  return index;
}

/**
 * // "localName": "FAUCET ADSKU02 T0224",
 * @param {*} str
 * function which convert First character into Capital letter of String
 */
export function getBleDeviceGeneration(str: string | null | undefined = '') {
  if (!str) return 'unknown';
  // if (str.search(/FAUCET/i) >= 0) {
  if (str?.toUpperCase()?.includes('FAUCET')) {
    return 'gen1';
    // } else if (str.search(/SL/i) >= 0) {
  } else if (str?.toUpperCase()?.includes('SL')) {
    return 'gen2';
  } else {
    return 'unknown';
  }
}

/**
 *
 * @param {*} connectedDevice
 * @param {*} gen
 * @returns result
 */
export function getBleDeviceVersion(connectedDevice: Device, gen = 'gen1') {
  var str = connectedDevice?.localName ?? connectedDevice?.name;

  if (!str) return '';
  var result = 'empty';
  // return result;
  if (gen == 'gen1') {
    var arr = str.split(' ');

    if (Array.isArray(arr) && arr.length > 1) {
      var __version = arr[1];
      if (__version) {
        result = __version.replace(/[^0-9]/g, '');
      }
    }
  } else if (gen == 'gen2') {
    const __manufacturerData = connectedDevice?.manufacturerData;
    if (!__manufacturerData) {
      return result;
    }
    const __manufacturerDataHex = base64ToHex(__manufacturerData);
    // consoleLog('__manufacturerDataHex==>', __manufacturerDataHex);
    const __manufacturerDataHexSpace = addSeparatorInString(
      __manufacturerDataHex,
      2,
      ' ',
    );
    // consoleLog('__manufacturerDataHex==>', __manufacturerDataHex);
    const __manufacturerDataHexArr = __manufacturerDataHexSpace.split(' ');
    // consoleLog('__manufacturerDataHexArr==>', __manufacturerDataHexArr);
    const modelNumber = __manufacturerDataHexArr?.[3];
    result = modelNumber ?? result;
    // consoleLog('modelNumber==>', modelNumber);
  } else if (gen == 'gen3') {
    var arr = str.split(' ');

    if (Array.isArray(arr) && arr.length > 1) {
      var __version = arr[1];
      if (__version) {
        result = __version.replace(/[^0-9]/g, '');
      }
    }
  } else if (gen == 'gen4') {
    var arr = str.split(' ');

    if (Array.isArray(arr) && arr.length > 1) {
      var __version = arr[1];
      if (__version) {
        result = __version.replace(/[^0-9]/g, '');
      }
    }
  }

  if (result == '00' || result == '0') {
    result = 'empty';
  }
  return result;
}

/**
 *
 * @param {*} connectedDevice: Device,
 * @param {*} gen
 * @returns result
 */
export function getBleDeviceSerialNumber(
  connectedDevice: Device,
  gen = 'gen1',
) {
  var str = connectedDevice?.localName ?? connectedDevice?.name;
  if (!str) return '';
  var result = '';
  if (gen == 'gen2') {
    const __manufacturerData = connectedDevice?.manufacturerData;
    if (!__manufacturerData) {
      return result;
    }
    const __manufacturerDataHex = base64ToHex(__manufacturerData);
    // consoleLog('__manufacturerDataHex==>', __manufacturerDataHex);
    const __manufacturerDataHexSpace = addSeparatorInString(
      __manufacturerDataHex,
      2,
      ' ',
    );
    // consoleLog('__manufacturerDataHex==>', __manufacturerDataHex);
    const __manufacturerDataHexArr = __manufacturerDataHexSpace.split(' ');
    // consoleLog('__manufacturerDataHexArr==>', __manufacturerDataHexArr);
    const __manufacturerDataHexArrTmp = [...__manufacturerDataHexArr];
    const serialNumber = __manufacturerDataHexArrTmp.splice(4, 4);
    result = serialNumber.join('');
    // consoleLog('modelNumber==>', modelNumber);
    // consoleLog('mappingDeviceDataStringGen2 serialNumber==>', serialNumber);
  }
  return result;
}

/**
 *
 * @param {*} connectedDevice
 * @param {*} BLE_DEVICE_MODELS
 * @returns device static model object
 */
export function getDeviceModelData(
  connectedDevice: any,
  BLE_DEVICE_MODELS: any,
  deviceGen: string,
) {
  var deviceStaticData = null;
  // localName have more relevant name indentification
  var deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (deviceName) {
    if (deviceGen && typeof BLE_DEVICE_MODELS[deviceGen] != 'undefined') {
      const deviceVersion = getBleDeviceVersion(connectedDevice, deviceGen);
      // consoleLog('getDeviceModelData deviceVersion==>', deviceVersion);
      const deviceModel = BLE_DEVICE_MODELS?.[deviceGen];
      // consoleLog('getDeviceModelData deviceModel==>', deviceModel);

      if (deviceModel && typeof deviceModel[deviceVersion] != 'undefined') {
        deviceStaticData = deviceModel[deviceVersion];
        // consoleLog('getDeviceModelData deviceStaticData==>', deviceStaticData);
      }
    }
  }

  return deviceStaticData;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function getDeviceService(
  serviceUUID: string,
  __BLE_GATT_SERVICES: any,
) {
  var result = null;
  if (typeof __BLE_GATT_SERVICES[serviceUUID] != 'undefined') {
    result = __BLE_GATT_SERVICES[serviceUUID];
  }

  return result;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function getDeviceCharacteristicsByServiceUUID(
  serviceUUID: string,
  __BLE_GATT_SERVICES: any,
) {
  var result = null;
  if (typeof __BLE_GATT_SERVICES[serviceUUID] != 'undefined') {
    result = __BLE_GATT_SERVICES[serviceUUID]?.characteristics ?? null;
  }

  return result;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function getDeviceCharacteristic(
  services: any,
  characteristicUUID: string,
) {
  var result = null;
  if (
    typeof services != 'undefined' &&
    typeof services?.characteristics != 'undefined' &&
    services?.characteristics &&
    typeof services?.characteristics?.[characteristicUUID] != 'undefined' &&
    services?.characteristics?.[characteristicUUID]
  ) {
    result = services?.characteristics?.[characteristicUUID];
  }
  return result;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function getDeviceCharacteristics(services: any) {
  var result = null;
  if (
    typeof services != 'undefined' &&
    typeof services?.characteristics != 'undefined' &&
    services?.characteristics
  ) {
    result = services?.characteristics;
  }
  return result;
}

export function getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
  serviceUUID: string,
  characteristicUUID: string,
  __BLE_GATT_SERVICES: any = BLE_GATT_SERVICES,
) {
  var result = null;
  if (serviceUUID && characteristicUUID) {
    const deviceService = getDeviceService(serviceUUID, __BLE_GATT_SERVICES);
    // consoleLog("deviceService", deviceService);
    result = getDeviceCharacteristic(deviceService, characteristicUUID);
  }

  return result;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function mapValue(characteristic: any, deviceStaticData: any = null) {
  var result = '-';
  var prefix = '';
  var postfix = '';

  if (characteristic?.value) {
    var decodedValue = base64EncodeDecode(characteristic?.value, 'decode');

    if (typeof deviceStaticData?.prefix != 'undefined') {
      prefix = deviceStaticData?.prefix;
    }

    if (typeof deviceStaticData?.postfix != 'undefined') {
      postfix = deviceStaticData?.postfix;
    }

    if (
      deviceStaticData &&
      decodedValue &&
      typeof deviceStaticData?.valueMapped != 'undefined' &&
      typeof deviceStaticData?.valueMapped[decodedValue] != 'undefined'
    ) {
      result = deviceStaticData?.valueMapped[decodedValue];
    } else {
      result = decodedValue;
    }
  }
  return `${prefix ?? ''}${result}${postfix ?? ''}`;
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const cleanCharacteristic = (characteristic: any) => {
  const __characteristic: any = {...characteristic};
  delete __characteristic._manager;
  return __characteristic;
};

/**
 *
 * @param {*} serviceUUID
 * @param {*} characteristicUUID
 * @returns result
 */
export const getBatteryLevel = async (
  serviceUUID: string,
  characteristicUUID: string,
) => {
  var batteryLevel = 0;
  // const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
  // const characteristicUUID = '00002a19-0000-1000-8000-00805f9b34fb';

  const __batteryLevelResponse = await BLEService.readCharacteristicForDevice(
    serviceUUID,
    characteristicUUID,
  );
  consoleLog(
    'getBatteryLevel __batteryLevelResponse==>',
    __batteryLevelResponse?.value,
  );
  //  ZA== => d => 64 => 100
  if (__batteryLevelResponse?.value) {
    // const hexEncodeValue = base64ToDecimal(__batteryLevelResponse?.value);
    const __base64ToHex = base64ToHex(__batteryLevelResponse?.value);
    const hexEncodeValue = hexToDecimal(__base64ToHex);
    // consoleLog('getBatteryLevel __base64ToHex==>', __base64ToHex);
    // consoleLog('getBatteryLevel hexEncodeValue==>', hexEncodeValue);
    // const decodedValue = base64EncodeDecode(__batteryLevelResponse?.value, 'decode');
    // const hexEncodeValue = hexToDecimal(
    //   hexEncodeDecode(decodedValue, 'encode'),
    // );

    // consoleLog('__batteryLevelResponse hexEncodeValue==>', hexEncodeValue);
    const __batteryLevel = Number(hexEncodeValue);

    if (__batteryLevel > 0 && __batteryLevel < 101) {
      batteryLevel = __batteryLevel;
    }
  }

  return batteryLevel;
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const getTotalWaterUsase = async (
  serviceUUID: string,
  characteristicUUID: string,
) => {
  // const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c940';
  // const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c949';
  var totalWaterUsage = 0;
  const __flowRate = await BLEService.readCharacteristicForDevice(
    serviceUUID,
    characteristicUUID,
  );
  // consoleLog(
  //   'getTotalWaterUsase __flowRate==>',
  //   JSON.stringify(__flowRate?.value),
  // );

  if (__flowRate?.value) {
    const flowRateDecodedValue = base64EncodeDecode(
      __flowRate?.value,
      'decode',
    );

    // consoleLog(
    //   'getTotalWaterUsase flowRateDecodedValue==>',
    //   flowRateDecodedValue,
    // );

    if (flowRateDecodedValue) {
      const __activationsDuration =
        await BLEService.readCharacteristicForDevice(
          BLE_CONSTANTS.GEN1.ACTIVATION_DURATION_SERVICE_UUID,
          BLE_CONSTANTS.GEN1.ACTIVATION_DURATION_CHARACTERISTIC_UUID,
        );

      // consoleLog(
      //   'getTotalWaterUsase __activationsDuration==>',
      //   JSON.stringify(__activationsDuration?.value),
      // );
      if (__activationsDuration?.value) {
        const activationsDurationDecodedValue = base64ToDecimal(
          __activationsDuration?.value,
        );

        // consoleLog(
        //   'getTotalWaterUsase activationsDurationDecodedValue==>',
        //   activationsDurationDecodedValue,
        // );

        var __flowRateDecodedValue = 0;
        var __activationsDurationHexEncodeValue = 0;

        if (flowRateDecodedValue) {
          __flowRateDecodedValue = Number(flowRateDecodedValue);
        }

        if (activationsDurationDecodedValue) {
          __activationsDurationHexEncodeValue = Number(
            activationsDurationDecodedValue,
          );
        }

        if (__activationsDurationHexEncodeValue) {
          const __totalWaterUsage =
            (__flowRateDecodedValue / 10 / 60) *
            __activationsDurationHexEncodeValue;
          totalWaterUsage = Number(__totalWaterUsage.toFixed(2));
        }
      }
    }
  }

  return totalWaterUsage;
};

/**
 *
 * @param {*} deviceSettingsData
 * @returns result
 */
export const saveSettings = async (
  deviceSettingsData: any,
): Promise<boolean | void> => {
  const promises = [];

  if (!isObjectEmpty(deviceSettingsData)) {
    // setLoading(true);
    for (const [key, value] of Object.entries(deviceSettingsData)) {
      if (
        typeof value != 'undefined' &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        for (let index = 0; index < value.length; index++) {
          const element = value[index];

          if (
            element?.serviceUUID &&
            element?.characteristicUUID &&
            element?.newValue != ''
          ) {
            // const x = await new Promise(r => setTimeout(r, t, i));
            var promise;
            if (BLEService.deviceGeneration == 'gen2') {
              promise =
                await BLEService.writeCharacteristicWithResponseForDevice2(
                  element?.serviceUUID,
                  element?.characteristicUUID,
                  fromHexStringUint8Array(element?.modfiedNewValue),
                );
            } else {
              promise =
                await BLEService.writeCharacteristicWithResponseForDevice(
                  element?.serviceUUID,
                  element?.characteristicUUID,
                  element?.newValue,
                );
            }

            promises.push(promise);
          }
        }
      }
    }
  }

  // const promise = await shortBurstsGen1();
  // promises.push(promise);

  // wait for all the promises in the promises array to resolve
  Promise.all(promises).then(results => {
    // all the fetch requests have completed, and the results are in the "results" array
    return true;
  });
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const updatePreviousSettings = async (
  connectedDevice: any,
  deviceSettingsData: any,
  __BLE_GATT_SERVICES: any,
) => {
  var DEVICE_PREVIOUS_SETTINGS_RAW = await StorageService.getItem(
    '@DEVICE_PREVIOUS_SETTINGS',
  );
  if (DEVICE_PREVIOUS_SETTINGS_RAW) {
    var DEVICE_PREVIOUS_SETTINGS = JSON.parse(DEVICE_PREVIOUS_SETTINGS_RAW);
    if (!isObjectEmpty(DEVICE_PREVIOUS_SETTINGS)) {
    }
  }

  // consoleLog(
  //   'DEVICE_PREVIOUS_SETTINGS',
  //   JSON.stringify(DEVICE_PREVIOUS_SETTINGS),
  // );

  const deviceGen = BLEService.deviceGeneration;
  const deviceVersion = getBleDeviceVersion(connectedDevice?.name, deviceGen);

  var DEVICE_NEW_SETTINGS =
    DEVICE_PREVIOUS_SETTINGS?.[deviceGen]?.[deviceVersion] ?? {};

  // consoleLog('DEVICE_NEW_SETTINGS', JSON.stringify(DEVICE_NEW_SETTINGS));

  for (const [key, value] of Object.entries(deviceSettingsData)) {
    if (
      typeof value != 'undefined' &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (
          element?.serviceUUID &&
          element?.characteristicUUID &&
          element?.newValue != '' &&
          element?.allowedInPreviousSetting != false
        ) {
          const __deviceStaticDataMain =
            getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
              element?.serviceUUID,
              element?.characteristicUUID,
              __BLE_GATT_SERVICES,
            );
          if (!isObjectEmpty(__deviceStaticDataMain)) {
            // DEVICE_NEW_SETTINGS.push({
            //   serviceUUID: element?.serviceUUID,
            //   characteristicUUID: element?.characteristicUUID,
            //   ...__deviceStaticDataMain,
            //   value: base64EncodeDecode(element?.newValue, 'decode'),
            // });

            DEVICE_NEW_SETTINGS = {
              ...DEVICE_NEW_SETTINGS,
              [element?.characteristicUUID]: {
                name: element?.name,
                serviceUUID: element?.serviceUUID,
                characteristicUUID: element?.characteristicUUID,
                ...__deviceStaticDataMain,
                value: element?.newValue,
              },
            };
          }
        }
      }
    }
  }

  const DEVICE_PREVIOUS_SETTINGS_SAVED = {
    ...DEVICE_PREVIOUS_SETTINGS,
    [deviceGen]: {
      [deviceVersion]: {
        ...DEVICE_NEW_SETTINGS,
      },
    },
  };

  // consoleLog(
  //   'DEVICE_PREVIOUS_SETTINGS_SAVED',
  //   JSON.stringify(DEVICE_PREVIOUS_SETTINGS_SAVED),
  // );

  await StorageService.setItem(
    '@DEVICE_PREVIOUS_SETTINGS',
    DEVICE_PREVIOUS_SETTINGS_SAVED,
  );
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const hasFlowRateSetting = (deviceSettingsData: any) => {
  return (
    typeof deviceSettingsData?.FlowRate !== 'undefined' &&
    deviceSettingsData?.FlowRate
  );
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const hasSensorRangeSetting = (deviceSettingsData: any) => {
  return (
    typeof deviceSettingsData?.SensorRange !== 'undefined' &&
    deviceSettingsData?.SensorRange
  );
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const hasLineFlushSetting = (deviceSettingsData: any) => {
  return (
    typeof deviceSettingsData?.LineFlush !== 'undefined' &&
    deviceSettingsData?.LineFlush
  );
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const getSavedSettingsGen1 = async (connectedDevice: any) => {
  var deviceSettingsData = {};
  var result = '';

  var DEVICE_PREVIOUS_SETTINGS_RAW = await StorageService.getItem(
    '@DEVICE_PREVIOUS_SETTINGS',
  );
  if (DEVICE_PREVIOUS_SETTINGS_RAW) {
    var DEVICE_PREVIOUS_SETTINGS = JSON.parse(DEVICE_PREVIOUS_SETTINGS_RAW);
    if (!isObjectEmpty(DEVICE_PREVIOUS_SETTINGS)) {
      // consoleLog(
      //   'DEVICE_PREVIOUS_SETTINGS',
      //   JSON.stringify(DEVICE_PREVIOUS_SETTINGS),
      // );

      const deviceGen = getBleDeviceGeneration(connectedDevice?.name);
      const deviceVersion = getBleDeviceVersion(
        connectedDevice?.name,
        deviceGen,
      );

      var DEVICE_SETTINGS_WITH_VERSION =
        DEVICE_PREVIOUS_SETTINGS?.[deviceGen]?.[deviceVersion] ?? {};
      // consoleLog(
      //   'DEVICE_SETTINGS_WITH_VERSION',
      //   JSON.stringify(DEVICE_SETTINGS_WITH_VERSION),
      // );

      if (DEVICE_SETTINGS_WITH_VERSION) {
        // d0aba888-fb10-4dc9-9b17-bdd8f490c943 Activation Mode
        if (
          DEVICE_SETTINGS_WITH_VERSION &&
          DEVICE_SETTINGS_WITH_VERSION?.['d0aba888-fb10-4dc9-9b17-bdd8f490c943']
        ) {
          var settingsArr = [];
          var characteristic =
            DEVICE_SETTINGS_WITH_VERSION?.[
              'd0aba888-fb10-4dc9-9b17-bdd8f490c943'
            ];

          if (characteristic && characteristic?.value) {
            var characteristicMainText =
              characteristic?.valueMapped?.[characteristic?.value];

            result += `${characteristic?.name}:`;
            result += ` ${characteristicMainText}`;

            settingsArr.push({
              name: characteristic?.name,
              serviceUUID: characteristic?.serviceUUID,
              characteristicUUID: characteristic?.uuid,
              oldValue: null,
              newValue: characteristic?.value,
            });

            var characteristic2UUID =
              characteristic?.UUIDMapped?.[characteristic?.value];
            if (DEVICE_SETTINGS_WITH_VERSION?.[characteristic2UUID]) {
              var characteristic2 =
                DEVICE_SETTINGS_WITH_VERSION?.[characteristic2UUID];
              var characteristic2Text = characteristic2?.value;

              result += ` ${characteristic2Text}`;
              result += ` /${characteristic2?.postfix}\n`;
              // consoleLog('result1===>', result);

              settingsArr.push({
                name: characteristic2?.name,
                serviceUUID: characteristic2?.serviceUUID,
                characteristicUUID: characteristic2?.uuid,
                oldValue: null,
                newValue: characteristic2?.value,
              });
            }
          }
          if (settingsArr.length > 0) {
            deviceSettingsData = {
              ...deviceSettingsData,
              ...{ActivationMode: settingsArr},
            };
          }
        }

        // d0aba888-fb10-4dc9-9b17-bdd8f490c946 Line Flush
        if (
          DEVICE_SETTINGS_WITH_VERSION &&
          DEVICE_SETTINGS_WITH_VERSION?.['d0aba888-fb10-4dc9-9b17-bdd8f490c946']
        ) {
          var settingsArr = [];
          var characteristic =
            DEVICE_SETTINGS_WITH_VERSION?.[
              'd0aba888-fb10-4dc9-9b17-bdd8f490c946'
            ];

          if (characteristic && characteristic?.value) {
            var characteristicMainText =
              characteristic?.valueMapped?.[characteristic?.value];
            result += `${characteristic?.name}:`;
            result += ` ${characteristicMainText}`;

            settingsArr.push({
              name: characteristic?.name,
              serviceUUID: characteristic?.serviceUUID,
              characteristicUUID: characteristic?.uuid,
              oldValue: null,
              newValue: characteristic?.value,
            });

            var characteristic2UUIDArr =
              characteristic?.UUIDMapped?.[characteristic?.value];

            if (
              characteristic2UUIDArr &&
              Array.isArray(characteristic2UUIDArr) &&
              characteristic2UUIDArr.length
            ) {
              var uuid1 = characteristic2UUIDArr[0];
              var uuid2 = characteristic2UUIDArr[1];
              if (uuid1 && DEVICE_SETTINGS_WITH_VERSION?.[uuid1]) {
                var characteristic2 = DEVICE_SETTINGS_WITH_VERSION?.[uuid1];
                var characteristic2Text = characteristic2?.value;

                result += ` ${characteristic2Text}`;
                result += ` /${characteristic2?.postfix}`;

                settingsArr.push({
                  name: characteristic2?.name,
                  serviceUUID: characteristic2?.serviceUUID,
                  characteristicUUID: characteristic2?.uuid,
                  oldValue: null,
                  newValue: characteristic2?.value,
                });
              }

              if (uuid2 && DEVICE_SETTINGS_WITH_VERSION?.[uuid2]) {
                var characteristic3 = DEVICE_SETTINGS_WITH_VERSION?.[uuid2];
                var characteristic3Text = characteristic3?.value;

                result += ` ${characteristic3Text}`;
                result += ` /${characteristic3?.postfix}\n`;

                settingsArr.push({
                  name: characteristic3?.serviceUUID,
                  serviceUUID: characteristic3?.serviceUUID,
                  characteristicUUID: characteristic3?.uuid,
                  oldValue: null,
                  newValue: characteristic3?.value,
                });
              }
            }
            // consoleLog('result2===>', result);
          }

          if (settingsArr.length > 0) {
            deviceSettingsData = {
              ...deviceSettingsData,
              ...{LineFlush: settingsArr},
            };
          }
        }

        // d0aba888-fb10-4dc9-9b17-bdd8f490c949 Flow Rate
        if (
          DEVICE_SETTINGS_WITH_VERSION &&
          DEVICE_SETTINGS_WITH_VERSION?.['d0aba888-fb10-4dc9-9b17-bdd8f490c949']
        ) {
          var settingsArr = [];
          var characteristic =
            DEVICE_SETTINGS_WITH_VERSION?.[
              'd0aba888-fb10-4dc9-9b17-bdd8f490c949'
            ];

          if (characteristic && characteristic?.value) {
            result += `${characteristic?.name}:`;
            result += ` ${characteristic?.value / 10}`;
            result += `${characteristic?.postfix}\n`;
            // consoleLog('result3===>', result);

            settingsArr.push({
              serviceUUID: characteristic?.serviceUUID,
              characteristicUUID: characteristic?.uuid,
              oldValue: null,
              newValue: characteristic?.value,
            });
          }
          if (settingsArr.length > 0) {
            deviceSettingsData = {
              ...deviceSettingsData,
              ...{FlowRate: settingsArr},
            };
          }
        }

        // d0aba888-fb10-4dc9-9b17-bdd8f490c942 Sensor Range
        if (
          DEVICE_SETTINGS_WITH_VERSION &&
          DEVICE_SETTINGS_WITH_VERSION?.['d0aba888-fb10-4dc9-9b17-bdd8f490c942']
        ) {
          var settingsArr = [];
          var characteristic =
            DEVICE_SETTINGS_WITH_VERSION?.[
              'd0aba888-fb10-4dc9-9b17-bdd8f490c942'
            ];

          if (characteristic && characteristic?.value) {
            result += `${characteristic?.name}:`;
            result += ` ${characteristic?.value}`;
            // consoleLog('result4===>', result);
            settingsArr.push({
              serviceUUID: characteristic?.serviceUUID,
              characteristicUUID: characteristic?.uuid,
              oldValue: null,
              newValue: characteristic?.value,
            });
          }
          if (settingsArr.length > 0) {
            deviceSettingsData = {
              ...deviceSettingsData,
              ...{SensorRange: settingsArr},
            };
          }
        }
      }
    }
  }
  return {text: result, data: deviceSettingsData};
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const shortBursts = async (__deviceSettingsData: any) => {
  if (BLEService.deviceGeneration == 'gen1') {
    shortBurstsGen1(__deviceSettingsData);
  } else if (BLEService.deviceGeneration == 'gen2') {
    shortBurstsGen2(__deviceSettingsData);
  }
};

/**
 *
 * @param {*} __deviceSettingsData
 * @returns result
 */
const shortBurstsGen1 = async (__deviceSettingsData: any) => {
  const __hasLineFlushSetting = hasLineFlushSetting(__deviceSettingsData);

  if (__hasLineFlushSetting) {
    const __LineFlush = __deviceSettingsData?.LineFlush;

    const hasFlushInterval = findObject(
      BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_CHARACTERISTIC_UUID,
      __LineFlush,
      {
        searchKey: 'characteristicUUID',
      },
    );

    if (!isObjectEmpty(hasFlushInterval)) {
      consoleLog('hasFlushInterval if==>', hasFlushInterval);
      return false;
    } else {
      consoleLog('hasFlushInterval else');
    }
  }

  consoleLog('hasFlushInterval ready to change');

  const serviceUUID = BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_SERVICE_UUID;
  const characteristicUUID =
    BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_CHARACTERISTIC_UUID;

  const flushInterval = await BLEService.readCharacteristicForDevice(
    serviceUUID,
    characteristicUUID,
  );

  const flushIntervalText = base64ToText(flushInterval?.value);

  const flushIntervalResponse =
    await BLEService.writeCharacteristicWithResponseForDevice(
      serviceUUID,
      characteristicUUID,
      flushIntervalText,
    );

  return flushIntervalResponse;
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
const shortBurstsGen2 = async (__deviceSettingsData: any) => {
  // For Line flush
  const mappingDeviceDataIntegersGen2Response =
    BLEService.characteristicMonitorDeviceDataIntegersMapped;

  if (!isObjectEmpty(mappingDeviceDataIntegersGen2Response)) {
    if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[31]) {
      const flushInterval =
        mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[31]?.value?.currentValue?.toString();

      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.FLUSH_INTERVAL_TEMP_Z1,
          flushInterval,
        ),
      );
    }
  }
};

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export const formatCharateristicValue = (
  characteristicStaticProperties: any,
  value: string,
) => {
  var result = value;

  consoleLog(
    'formatCharateristicValue characteristicStaticProperties==>',
    characteristicStaticProperties,
  );
  if (
    characteristicStaticProperties?.valueType &&
    characteristicStaticProperties?.valueFormat &&
    characteristicStaticProperties?.dateFormat
  ) {
    if (characteristicStaticProperties?.dataFormat == 'Unix timestamp') {
      const unixTimestamp = parseInt(value) ?? 0;
      if (unixTimestamp == 0) {
        return 'N/A';
      }
      return moment
        .unix(parseInt(value) ?? 0)
        .format(characteristicStaticProperties?.dateFormat);
    }
    const dateFormat = characteristicStaticProperties?.dateFormat;
    const __dateFormat = dateFormat.replace(/[^A-Za-z]/g, '');

    if (__dateFormat?.length != value?.length) {
      return 'N/A';
    }

    var dateSeperator = '/';
    if (dateFormat.includes('-')) {
      dateSeperator = '-';
    } else if (dateFormat.includes('/')) {
      dateSeperator = '/';
    }

    if (
      characteristicStaticProperties?.valueType == 'Date' &&
      characteristicStaticProperties?.valueFormat == 'YYMMDD'
    ) {
      var formattedDate = addSeparatorInString(value, 2, dateSeperator);
      result = `20${formattedDate}`;
      // consoleLog('formattedDate', formattedDate);
    } else if (
      characteristicStaticProperties?.valueType == 'DateTime' &&
      characteristicStaticProperties?.valueFormat == 'YYMMDDHHmm'
    ) {
      var datePart = value.substring(0, 6);
      var timePart = value.substring(6);
      var formattedDate = addSeparatorInString(datePart, 2, dateSeperator);
      var formattedTime = addSeparatorInString(timePart, 2, ':');
      result = `20${formattedDate} ${formattedTime}`;
      consoleLog('formattedDate', {formattedDate, formattedTime});
    }
  }
  return result;
};

export const hasDateSetting = (__characteristicMain: any) => {
  var data = {};
  if (__characteristicMain?.dateSettingMappped) {
    var __dateSettingMappped = __characteristicMain?.dateSettingMappped;
    // consoleLog(
    //   'hasDateSetting __dateSettingMappped==>',
    //   __dateSettingMappped,
    // );
    const dateCharacteristic =
      getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
        __dateSettingMappped?.serviceUUID,
        __dateSettingMappped?.characteristicUUID,
        BLE_GATT_SERVICES,
      );
    // consoleLog('hasDateSetting dateCharacteristic==>', dateCharacteristic);

    if (!isObjectEmpty(dateCharacteristic) && dateCharacteristic?.valueFormat) {
      const dateFormat = dateCharacteristic?.valueFormat;
      data = {
        serviceUUID: __dateSettingMappped?.serviceUUID,
        characteristicUUID: __dateSettingMappped?.characteristicUUID,
        oldValue: null,
        newValue: base64EncodeDecode(
          parseDateTimeInFormat(new Date(), dateFormat),
        ),
      };
    }
  }
  // consoleLog('data', data);
  return data;
};

export const hasPhoneSetting = (__characteristicMain: any, __user: any) => {
  var data = {};

  if (__characteristicMain?.phoneSettingMappped) {
    var __phoneSettingMappped = __characteristicMain?.phoneSettingMappped;
    const dateCharacteristic =
      getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
        __phoneSettingMappped?.serviceUUID,
        __phoneSettingMappped?.characteristicUUID,
        BLE_GATT_SERVICES,
      );
    // consoleLog('hasDateSetting dateCharacteristic==>', dateCharacteristic);

    if (!isObjectEmpty(dateCharacteristic)) {
      data = {
        serviceUUID: __phoneSettingMappped?.serviceUUID,
        characteristicUUID: __phoneSettingMappped?.characteristicUUID,
        oldValue: null,
        newValue: base64EncodeDecode(__user?.contact ?? '0123456789'),
      };
    }
  }
  // consoleLog('data', data);
  return data;
};

export const intiGen2SecurityKey = async () => {
  const SERVER_KEY = BLE_CONSTANTS?.GEN2?.SERVER_KEY;
  consoleLog('intiGen2SecurityKey SERVER_KEY==>', toHexString(SERVER_KEY));
  const SITE_ID_SERVICE_UUID = BLE_CONSTANTS?.GEN2?.SITE_ID_SERVICE_UUID;
  const SITE_ID_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.SITE_ID_CHARACTERISTIC_UUID;

  // SiteID Key
  const SITE_ID_HEX_FAKE = '2AAD580558ED451D813532D71DEA7F23';
  const siteIDResponse = await BLEService.readCharacteristicForDevice(
    SITE_ID_SERVICE_UUID,
    SITE_ID_CHARACTERISTIC_UUID,
  );

  // intiGen2SecurityKey SiteIDResult==> Kq1YBVjtRR2BNTLXHep/Iw==
  // consoleLog('intiGen2SecurityKey SiteIDResult==>', siteIDResponse?.value);
  var siteIdHex: string;

  if (siteIDResponse?.value) {
    siteIdHex = base64ToHex(siteIDResponse?.value);
  } else {
    siteIdHex = SITE_ID_HEX_FAKE;
  }

  // var siteIdUint8ArrayMock = [
  //   0x2a, 0xad, 0x58, 0x05, 0x58, 0xed, 0x45, 0x1d, 0x81, 0x35, 0x32, 0xd7,
  //   0x1d, 0xea, 0x7f, 0x23,
  // ];
  // var siteIdUint8Array = new Uint8Array(siteIdUint8ArrayMock);

  // console.log('intiGen2SecurityKey siteIdHex==>', siteIdHex);
  var siteIdUint8Array = fromHexStringUint8Array(siteIdHex);
  console.log(
    'intiGen2SecurityKey siteIdUint8Array==>',
    toHexString(siteIdUint8Array),
  );

  // Master Key
  const MASTER_KEY_SERVICE_UUID = BLE_CONSTANTS?.GEN2?.MASTER_KEY_SERVICE_UUID;
  const MASTER_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.MASTER_KEY_CHARACTERISTIC_UUID;
  const masetrKeyResponse = await BLEService.readCharacteristicForDevice(
    MASTER_KEY_SERVICE_UUID,
    MASTER_KEY_CHARACTERISTIC_UUID,
  );
  // consoleLog(
  //   'intiGen2SecurityKey readCharacteristicForDevice==>',
  //   readCharacteristicForDevice?.value,
  // );

  const masterKeyHex = base64ToHex(masetrKeyResponse?.value);
  // consoleLog('intiGen2SecurityKey masterKeyHex==>', masterKeyHex);
  var masterKeyUint8Array = fromHexStringUint8Array(masterKeyHex);

  // var masterKeyHexMock = [
  //   0x20, 0xe1, 0x70, 0x12, 0x70, 0x54, 0x86, 0xff, 0xeb, 0x13, 0x53, 0x3e,
  //   0xe7, 0x2c, 0xee, 0xe0, 0x55, 0x48, 0x60, 0x61, 0x95, 0x48, 0x92, 0x6e,
  //   0x0d, 0x5f, 0xda, 0x6f, 0x8a, 0xa3, 0xd0, 0xd2,
  // ];
  // var masterKeyUint8Array = new Uint8Array(masterKeyHexMock);

  console.log(
    'intiGen2SecurityKey masterKeyUint8Array==>',
    toHexString(masterKeyUint8Array),
  );

  // Timestamp
  var timestamp = getTimestampInSeconds();
  // consoleLog('intiGen2SecurityKey timestamp==>', timestamp);

  var timestampHex = decimalToHex(timestamp);
  // consoleLog('intiGen2SecurityKey timestampHex==>', timestampHex);

  var timestampUint8Array = fromHexStringUint8Array(timestampHex);

  // var timestampHexMock = [0x66, 0x1e, 0xa6, 0xdf];
  // var timestampUint8Array = new Uint8Array(timestampHexMock);

  console.log(
    'intiGen2SecurityKey timestampUint8Array==>',
    toHexString(timestampUint8Array),
  );

  // const tmp_session = [
  //   0x17, 0xa0, 0x8f, 0x02, 0x8f, 0x50, 0xfc, 0x1d, 0x34, 0x02, 0xac, 0x3e,
  //   0x98, 0x2c, 0x35, 0xe0, 0x0a, 0x29, 0x17, 0x60, 0x6b, 0x48, 0xcd, 0x6a,
  //   0xba, 0x47, 0x00, 0x48, 0x65, 0xa1, 0x9f, 0x40,
  // ];

  // const tmpSHA = [
  //   0x0a, 0x14, 0x4d, 0xe0, 0x20, 0xec, 0xcc, 0x04, 0x46, 0xd5, 0x94, 0x7e,
  //   0xbc, 0xf4, 0xa7, 0x40, 0x31, 0x17, 0x84, 0x2e, 0xa1, 0x26, 0x7f, 0x29,
  //   0xe6, 0x53, 0xf7, 0x02, 0x41, 0x7e, 0x4e, 0xb6,
  // ];
  // console.log('intiGen2SecurityKey tmp_session==>', tmp_session);
  // console.log('intiGen2SecurityKey tmpSHA==>', tmpSHA);

  // var sessionUintArrayTmpBytes = Array.from(tmp_session);
  // var sessionUintArrayTmpBytesSHA = await sha256Bytes(
  //   sessionUintArrayTmpBytes,
  // );
  // var sessionUintArraySHA = fromHexStringUint8Array(
  //   sessionUintArrayTmpBytesSHA,
  // );
  // console.log('intiGen2SecurityKey sha256Bytes==>', sessionUintArraySHA);

  const sessionKeyNew = await generateSessionKey(
    timestampUint8Array,
    SERVER_KEY,
    masterKeyUint8Array,
    siteIdUint8Array,
    true,
  );
  console.log('intiGen2SecurityKey sessionKeyNew==>', sessionKeyNew);

  // const __sessionKeyDecArr1 = [
  //   102, 35, 88, 156, 88, 156, 35, 102, 9, 154, 173, 239, 88, 95, 49, 202,
  //   169, 255, 122, 187, 101, 87, 198, 146, 116, 140, 68, 2, 54, 228, 130, 31,
  //   228, 163, 246, 198, 1,
  // ];

  // const __sessionKeyDecArr = [
  //   166, 223, 30, 102, 10, 20, 77, 224, 32, 236, 204, 4, 70, 213, 148, 126,
  //   188, 244, 167, 64, 49, 23, 132, 46, 161, 38, 127, 41, 230, 83, 247, 2, 65,
  //   126, 78, 182, 1,
  // ];

  // const __sessionKeyDecArrUint8Array = new Uint8Array(sessionKeyNew);
  // consoleLog('intiGen2SecurityKey __sessionKeyDecArr==>', __sessionKeyDecArr);
  // consoleLog(
  //   'intiGen2SecurityKey __sessionKeyDecArrUint8Array==>',
  //   __sessionKeyDecArrUint8Array,
  // );

  const SESSION_KEY_SERVICE_UUID =
    BLE_CONSTANTS?.GEN2?.SESSION_KEY_SERVICE_UUID;
  const SESSION_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.SESSION_KEY_CHARACTERISTIC_UUID;

  await BLEService.writeCharacteristicWithResponseForDevice2(
    SESSION_KEY_SERVICE_UUID,
    SESSION_KEY_CHARACTERISTIC_UUID,
    sessionKeyNew,
  );

  // Authorization Key
  const AUTHORIZATION_KEY_SERVICE_UUID =
    BLE_CONSTANTS?.GEN2?.AUTHORIZATION_KEY_SERVICE_UUID;
  const AUTHORIZATION_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.AUTHORIZATION_KEY_CHARACTERISTIC_UUID;
  const authorizationResponse = await BLEService.readCharacteristicForDevice(
    AUTHORIZATION_KEY_SERVICE_UUID,
    AUTHORIZATION_KEY_CHARACTERISTIC_UUID,
  );
  consoleLog(
    'intiGen2SecurityKey authorizationResponse==>',
    base64ToHex(authorizationResponse?.value),
  );
};

const generateSessionKey = async (
  timestampUint8Array: any,
  SERVER_KEY: any,
  masterKeyUint8Array: any,
  siteIdUint8Array: any,
  isProvision: boolean,
) => {
  //session_time is an unixtime from the App, which could also be extracted from session key
  var sessionTime = timestampUint8Array;
  // consoleLog('generateSessionKey sessionTime==>', sessionTime);
  // sessionTime[0] = timestampUint8Array[0];
  // sessionTime[1] = timestampUint8Array[1];
  // sessionTime[2] = timestampUint8Array[2];
  // sessionTime[3] = timestampUint8Array[3];

  var __sessionUintArray = new Uint8Array(37);

  // HOW TO GENERATE SESSION KEY
  var sessionUintArrayTmp = new Uint8Array(32); // temporary session key
  const MASTER_KEY_LEN = 32;

  // copy master_key to temporary session key
  for (let i = 0; i < 32; i++) {
    sessionUintArrayTmp[i] = masterKeyUint8Array[i];
  }

  consoleLog(
    'generateSessionKey sessionUintArrayTmp==>',
    toHexString(sessionUintArrayTmp),
  );

  // formulas to generate temporary session key before SHA256

  for (let i = 0; i < MASTER_KEY_LEN; i++) {
    if (i % 2 > 0) {
      sessionUintArrayTmp[i] &=
        (siteIdUint8Array[15 - Math.floor(i / 2)] & (sessionTime[i % 3] << 1)) |
        SERVER_KEY[i];
    } else {
      sessionUintArrayTmp[i] ^=
        siteIdUint8Array[15 - Math.floor(i / 2)] |
        (sessionTime[i % 3] >> 1) |
        SERVER_KEY[i];
    }
  }

  // console.log(
  //   'generateSessionKey sessionUintArrayTmp after formulas==>',
  //   toHexString(sessionUintArrayTmp),
  // );

  sessionUintArrayTmp[6] ^= sessionTime[2] >> 5;
  sessionUintArrayTmp[30] ^= sessionTime[0] << 3;
  sessionUintArrayTmp[26] &= sessionTime[1] >> 8;
  sessionUintArrayTmp[17] |= sessionTime[2] >> 2;
  sessionUintArrayTmp[15] &= sessionTime[3] << 4;
  sessionUintArrayTmp[20] |= sessionTime[0] >> 5;

  // perform SHA256 on the temporary session key
  console.log(
    'generateSessionKey sessionUintArrayTmp after formulas==>',
    toHexString(sessionUintArrayTmp),
  );

  var sessionUintArrayTmpBytes = Array.from(sessionUintArrayTmp);
  // console.log(
  //   'generateSessionKey sessionUintArrayTmpBytes==>',
  //   sessionUintArrayTmpBytes,
  // );

  var sessionUintArrayTmpBytesSHA = await sha256Bytes(sessionUintArrayTmpBytes);
  // console.log(
  //   'generateSessionKey sessionUintArrayTmpBytesSHA==>',
  //   sessionUintArrayTmpBytesSHA,
  // );

  var sessionUintArraySHA = fromHexStringUint8Array(
    sessionUintArrayTmpBytesSHA,
  );
  consoleLog(
    'generateSessionKey sessionUintArraySHA==>',
    toHexString(sessionUintArraySHA),
  );

  // build session key
  // add unix time
  __sessionUintArray[0] = sessionTime[2];
  __sessionUintArray[1] = sessionTime[3];
  __sessionUintArray[2] = sessionTime[1];
  __sessionUintArray[3] = sessionTime[0];

  // add SHA session key
  for (let i = 0; i < 32; i++) {
    __sessionUintArray[i + 4] = sessionUintArraySHA[i];
  }
  __sessionUintArray[36] = isProvision ? 1 : 0;
  // console.log('generateSessionKey __sessionUintArray==>', __sessionUintArray);
  return __sessionUintArray;
};

export const mapValueGen2 = (
  WRITE_DATA_MAPPING: any,
  value: any,
  padding: number = 8,
) => {
  // consoleLog('mapValueGen2 WRITE_DATA_MAPPING==>', WRITE_DATA_MAPPING);
  // consoleLog('mapValueGen2 value==>', value);
  // consoleLog('mapValueGen2 decimalToHex==>', decimalToHex(value, 16, 8));
  const hex = decimalToHex(value, 16, padding);
  var hexReplaced = WRITE_DATA_MAPPING.replace(/ACTUAL_VALUE/gi, hex);
  hexReplaced = hexReplaced.replace(/\|/gi, '');
  consoleLog('mapValueGen2 hexReplaced==>', hexReplaced); // 720a01321500000001CF

  return hexReplaced;
};

export const mapValueGenTextToHex = (
  WRITE_DATA_MAPPING: any,
  value: any,
  padding: number = 8,
) => {
  // consoleLog('mapValueGen2 WRITE_DATA_MAPPING==>', WRITE_DATA_MAPPING);
  // consoleLog('mapValueGen2 value==>', value);
  // consoleLog('mapValueGen2 decimalToHex==>', decimalToHex(value, 16, 8));
  const hex = asciiToHex(value, padding);
  var hexReplaced = WRITE_DATA_MAPPING.replace(/ACTUAL_VALUE/gi, hex);
  hexReplaced = hexReplaced.replace(/\|/gi, '');
  consoleLog('mapValueGenTextToHex hexReplaced==>', hexReplaced);

  return hexReplaced;
};
