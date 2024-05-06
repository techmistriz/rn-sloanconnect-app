import {Alert, Linking, Platform, Share, ToastAndroid} from 'react-native';
import {constants} from '../../common';
import moment from 'moment';
import {
  addSeparatorInString,
  base64EncodeDecode,
  base64ToDecimal,
  base64ToText,
  hexEncodeDecode,
  hexToDecimal,
} from './encryption';
import {BLEService} from 'src/services';
import {findObject, isObjectEmpty} from './array';
import StorageService from 'src/services/StorageService/StorageService';
import {consoleLog, parseDateTimeInFormat} from './HelperFunction';
import {BLE_GATT_SERVICES} from '../StaticData/BLE_GATT_SERVICES';
import BLE_CONSTANTS from '../StaticData/BLE_CONSTANTS';

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
  if (!str) return '';
  if (str.search(/FAUCET/i) >= 0) {
    return 'gen1';
  } else if (str.search(/SL/i) >= 0) {
    return 'gen2';
  } else if (str.search(/FAUCET/i) >= 0) {
    return 'gen1';
  } else if (str.search(/FAUCET/i) >= 0) {
    return 'gen1';
  } else {
    return '';
  }
}

/**
 *
 * @param {*} param1
 * @param {*} param2
 * @returns result
 */
export function getBleDeviceVersion(
  str: string | null | undefined = '',
  gen = 'gen1',
) {
  if (!str) return '';
  var result = '';
  if (gen == 'gen1') {
    var arr = str.split(' ');

    if (Array.isArray(arr) && arr.length > 1) {
      var __version = arr[1];
      if (__version) {
        result = __version.replace(/[^0-9]/g, '');
      }
    }
  } else if (gen == 'gen2') {
    result = '20';
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
) {
  var deviceStaticData = null;

  // localName have more relevant name indentification
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    const deviceGen = getBleDeviceGeneration(__deviceName);
    // consoleLog('deviceGen', deviceGen);

    if (deviceGen && typeof BLE_DEVICE_MODELS[deviceGen] != 'undefined') {
      const deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
      // consoleLog('deviceVersion', deviceVersion);

      const deviceModel = BLE_DEVICE_MODELS[deviceGen];
      // consoleLog('deviceModel', deviceModel);

      if (deviceModel && typeof deviceModel[deviceVersion] != 'undefined') {
        deviceStaticData = deviceModel[deviceVersion];
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
  __BLE_GATT_SERVICES: any,
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
  // consoleLog('__batteryLevelResponse __batteryLevelResponse==>', JSON.stringify(__batteryLevelResponse));
  //  ZA== => d => 64 => 100
  if (__batteryLevelResponse?.value) {
    const hexEncodeValue = base64ToDecimal(__batteryLevelResponse?.value);
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
 * @param {*} param1
 * @param {*} param2
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
            const promise =
              await BLEService.writeCharacteristicWithResponseForDevice(
                element?.serviceUUID,
                element?.characteristicUUID,
                base64EncodeDecode(element?.newValue, 'decode'),
              );

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

  const deviceGen = getBleDeviceGeneration(connectedDevice?.name);
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
                serviceUUID: element?.serviceUUID,
                characteristicUUID: element?.characteristicUUID,
                ...__deviceStaticDataMain,
                value: base64EncodeDecode(element?.newValue, 'decode'),
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
export const shortBurstsGen1 = async (__deviceSettingsData: any) => {
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
export const formatCharateristicValue = (
  characteristicStaticProperties: any,
  value: string,
) => {
  var result = value;
  if (
    characteristicStaticProperties?.valueType &&
    characteristicStaticProperties?.valueFormat &&
    characteristicStaticProperties?.dateFormat
  ) {
    const dateFormat = characteristicStaticProperties?.dateFormat;
    const __dateFormat = dateFormat.replace(/[^A-Z]/g, '');

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
      // consoleLog('formattedDate', {formattedDate, formattedTime});
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
