import moment from 'moment';
import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog, timestampInSec} from 'src/utils/Helpers/HelperFunction';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode, hexToDecimal} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceModelData, getTotalFlushVolumeFlusher,
} from 'src/utils/Helpers/project';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {BLE_GATT_SERVICES_FLUSHER} from 'src/utils/StaticData/BLE_GATT_SERVICES_FLUSHER';
import I18n from 'src/locales/Transaltions';

const connectedDevice = BLEService.getDevice();

/** getDeviceInfoNormalFlusher method for normal info */
export const getDeviceInfoNormalFlusher = async (
  ignoreDisplayInList: boolean = false,
) => {
  const data = await getBDInformationDataFlusher(ignoreDisplayInList);
  return [...data];
};

/** getDeviceInfoAdvanceFlusher method for advance */
export const getDeviceInfoAdvanceFlusher = async (
  ignoreDisplayInList: boolean = false,
) => {
  var statisticsInformationArr = await getStatisticsInformationDataFlusher(
    ignoreDisplayInList,
  );
  var settingLogs = await getSettingLogsDataFlusher(ignoreDisplayInList);
  // consoleLog('getDeviceInfoAdvanceFlusher settingLogs==>', settingLogs);

  const resultObj = findObject('Date of last factory reset', settingLogs, {
    searchKey: 'name',
  });
  consoleLog('getDeviceInfoAdvanceFlusher resultObj==>', resultObj);

  if (!isObjectEmpty(resultObj) && resultObj?.value == 'MANUAL') {
    // Hours Of Operation -> f89f13e7-83f8-4b7c-9e8b-364576d88312
    const resultObj2 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88312',
      statisticsInformationArr,
      {
        searchKey: 'uuid',
      },
    );
    consoleLog('getDeviceInfoAdvanceFlusher resultObj2==>', resultObj2);

    // Date of last factory reset -> f89f13e7-83f8-4b7c-9e8b-364576d88321
    const resultObj3 = settingLogs.findIndex((item: any) => {
      return item?.uuid == 'f89f13e7-83f8-4b7c-9e8b-364576d88321';
    });

    consoleLog('getDeviceInfoAdvanceFlusher resultObj3==>', resultObj3);
    if (!isObjectEmpty(resultObj2) && resultObj3 >= 0) {
      const formattedDate = moment(Date.now())
        .subtract(resultObj2?.value, 's')
        .format('YYYY/MM/DD');
      // console.log('formattedDate', formattedDate);

      settingLogs[resultObj3] = {
        ...resultObj,
        value: formattedDate,
      };

      consoleLog(
        'getDeviceInfoAdvanceFlusher settingLogs[resultObj3]==>',
        settingLogs[resultObj3],
      );
    }
  }

  return [...statisticsInformationArr, ...settingLogs];
};

/** getBDInformationDataFlusher method for normal info */
const getBDInformationDataFlusher = (ignoreDisplayInList: boolean = false) => {
  return new Promise<any>(async resolve => {
    const serviceUUID = 'f89f13e7-83f8-4b7c-9e8b-364576d88300';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES_FLUSHER,
    );

    var data = [];

    /**
     * For the date of installation, logic is this:
      For “Date of Installation”, this one is calculated from the Today date and the “Hours of Operation (Operating hours since install)”.
      For example:
      if current unix timestamp in the App is 1714752879, which means (Date and time (GMT): Friday, May 3, 2024 4:14:39 PM)
      “Hours of Operation” = 100 hours, which means 100*60*60 = 360000 seconds.
      Then the timestamp of “Installation” is = 1714752879 - 360000 = 1714392879
      which means the “Date of Installation” is Monday, April 29, 2024  (GMT)
     */
    // var characteristicStaticHoursOfOperation: any =
    //   await BLEService.readCharacteristicForDevice(
    //     'f89f13e7-83f8-4b7c-9e8b-364576d88310',
    //     'f89f13e7-83f8-4b7c-9e8b-364576d88312',
    //   );

    // if (!isObjectEmpty(characteristicStaticHoursOfOperation)) {
    //   const decodeValue = hexToDecimal(
    //     base64EncodeDecode(
    //       characteristicStaticHoursOfOperation?.value,
    //       'decode',
    //     ),
    //   );
    //   consoleLog(
    //     'characteristicStaticHoursOfOperation decodeValue==>',
    //     characteristicStaticHoursOfOperation,
    //   );

    //   if (decodeValue >= 0) {
    //     const decodeValueInSeconds = parseInt(decodeValue);
    //     const currentTimestamp = timestampInSec();
    //     const dateOfInstallTimestamp = currentTimestamp - decodeValueInSeconds;
    //     // consoleLog('decodeValueInSeconds==>', decodeValueInSeconds);
    //     // consoleLog('dateOfInstallTimestamp==>', dateOfInstallTimestamp);
    //     data.push({
    //       name: 'Date of Installation',
    //       nameLocale: `${I18n.t(
    //         'device_details.FLUSHER.LABEL_DATE_OF_INSTALLATION',
    //       )}`,
    //       prefix: null,
    //       postfix: null,
    //       uuid: null,
    //       position: 4,
    //       value: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
    //     });
    //   }
    // }

    /**
     * Line (Sentinel) Flush Count -> Number Of flushes since day 1
     */
    // var characteristic = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88310',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88313',
    // );

    // var decodeValue = 'N/A';
    // if (!isObjectEmpty(characteristic) && characteristic?.value) {
    //   decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
    // }

    // data.push({
    //   name: 'Number Of flushes since day 1',
    //   nameLocale: `${I18n.t('device_details.FLUSHER.LABEL_NUMBER_OF_FLUSHES')}`,
    //   prefix: null,
    //   postfix: null,
    //   uuid: null,
    //   position: 5,
    //   value: decodeValue,
    // });

    /**
     * ACCUMULATED WATER USAGE -> Total water usage
     */
    // const totalWaterUsage = BLEService.totalWaterUsase; // In gallon
    // const __totalWaterUsage = `${
    //   totalWaterUsage
    //     ? (totalWaterUsage * 3.78541).toFixed(0)
    //     : 0
    // }`;
    // data.push({
    //   name: 'Accumulated water usage',
    //   nameLocale: `${I18n.t(
    //     'device_details.FLUSHER.LABEL_ACCUMULATED_WATER_USAGE',
    //   )}`,
    //   uuid: null,
    //   position: 6,
    //   value: `${totalWaterUsage} Gal (${__totalWaterUsage} L)`,
    // });

    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        if (
          typeof value?.uuid != 'undefined' &&
          (value?.displayInList !== false || ignoreDisplayInList) &&
          (value?.generation == 'all' ||
            value?.generation == BLEService.deviceGeneration)
        ) {
          var characteristic = await BLEService.readCharacteristicForDevice(
            serviceUUID,
            value?.uuid,
          );

          // consoleLog('getBDInformationDataFlusher characteristic==>', {
          //   value: characteristic?.value,
          //   uuid: characteristic?.uuid,
          // });
          var decodeValue = 'N/A';
          if (!isObjectEmpty(characteristic) && characteristic?.value) {
            decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
          }

          data.push({
            name: value?.name,
            nameLocale: `${I18n.t(
              'device_details.FLUSHER.' + value?.nameLocaleKey,
            )}`,
            uuid: value?.uuid,
            position: value?.position,
            value: formatCharateristicValue(value, decodeValue),
          });
        }
      }
    }
    resolve(data);
  });
};

/** getStatisticsInformationDataFlusher method for advance */
const getStatisticsInformationDataFlusher = (
  ignoreDisplayInList: boolean = false,
) => {
  var deviceVersion = '01';
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    deviceVersion = BLEService.deviceVersion;
  }

  return new Promise<any>(async resolve => {
    const serviceUUID = 'f89f13e7-83f8-4b7c-9e8b-364576d88310';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES_FLUSHER,
    );

    var data = [];

    /** BLE Device Serial Number  */
    // const charResponse: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88302',
    // );

    // if (!isObjectEmpty(charResponse)) {
    //   const decodeValue = base64EncodeDecode(charResponse?.value, 'decode');
    //   consoleLog('charResponse decodeValue==>', charResponse);

    //   data.push({
    //     name: 'BLE Serial Number',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_BLE_DEVICE_SERIAL_NUMBER',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 2,
    //     value: decodeValue ?? 'N/A',
    //   });
    // }

    /** BLE Device Hardware Version  */
    // const charResponse2: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88307',
    // );

    // if (!isObjectEmpty(charResponse2)) {
    //   const decodeValue = base64EncodeDecode(charResponse2?.value, 'decode');
    //   consoleLog('charResponse2 decodeValue==>', charResponse2);

    //   data.push({
    //     name: 'BLE Hardware Version',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_BLE_DEVICE_HARDWARE_VERSION',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 3,
    //     value: decodeValue ?? 'N/A',
    //   });
    // }

    /** BLE Device Firmware Version  */
    // const charResponse3: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88308',
    // );

    // if (!isObjectEmpty(charResponse3)) {
    //   const decodeValue = base64EncodeDecode(charResponse3?.value, 'decode');
    //   consoleLog('charResponse3 decodeValue==>', charResponse3);

    //   data.push({
    //     name: 'BLE Firmware Version',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_BLE_DEVICE_FIREWARE_VERSION',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 4,
    //     value: decodeValue ?? 'N/A',
    //   });
    // }

    /** BLE Device Manufacturing Date  */
    // const charResponse4: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88304',
    // );

    // if (!isObjectEmpty(charResponse4)) {
    //   const decodeValue = base64EncodeDecode(charResponse4?.value, 'decode');
    //   consoleLog('charResponse4 decodeValue==>', charResponse4);

    //   data.push({
    //     name: 'BLE Device Manufacturing Date',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_BLE_DEVICE_MANUFACTURING_DATE',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 5,
    //     // value: decodeValue ?? 'N/A',
    //     value: formatCharateristicValue(
    //       {valueFormat: 'YYMMDD', valueType: 'Date', dateFormat: 'YY/MM/DD'},
    //       decodeValue,
    //     ),
    //   });
    // }

    /** Flusher Manufacturing Date  */
    // const charResponse5: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88303',
    // );

    // if (!isObjectEmpty(charResponse5)) {
    //   const decodeValue = base64EncodeDecode(charResponse5?.value, 'decode');
    //   consoleLog('charResponse5 decodeValue==>', charResponse5);

    //   data.push({
    //     name: 'Flusher Manufacturing Date',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_FLUSHER_MANUFACTURING_DATE',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 6,
    //     // value: decodeValue ?? 'N/A',
    //     value: formatCharateristicValue(
    //       {valueFormat: 'YYMMDD', valueType: 'Date', dateFormat: 'YY/MM/DD'},
    //       decodeValue,
    //     ),
    //   });
    // }

    /** Flusher Serial Number  */
    // const charResponse6: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88301',
    // );

    // if (!isObjectEmpty(charResponse6)) {
    //   const decodeValue = base64EncodeDecode(charResponse6?.value, 'decode');
    //   consoleLog('charResponse6 decodeValue==>', charResponse6);

    //   data.push({
    //     name: 'Flusher Serial Number',
    //     nameLocale: `${I18n.t(
    //       'device_details.FLUSHER.LABEL_FLUSHER_SERIAL_NUMBER',
    //     )}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 7,
    //     value: decodeValue ?? 'N/A',
    //   });
    // }

    /**
     * ACCUMULATED WATER USAGE -> Total water usage
     */
    const totalWaterUsage = BLEService.totalWaterUsase; // In gallon
    const __totalWaterUsage = `${
      totalWaterUsage
        ? (totalWaterUsage * BLE_CONSTANTS.COMMON.GMP_FORMULA).toFixed(0)
        : 0
    }`;
    data.push({
      name: 'Accumulated water usage',
      nameLocale: `${I18n.t(
        'device_details.FLUSHER.LABEL_ACCUMULATED_WATER_USAGE',
      )}`,
      uuid: null,
      position: 4,
      value: `${totalWaterUsage} Gal (${__totalWaterUsage} L)`,
    });

    let flushVolumeInGal = getTotalFlushVolumeFlusher();
    let galToLiter = flushVolumeInGal / BLE_CONSTANTS.COMMON.GAL_TO_LITER;
    /** Flush Volume  */
    data.push({
      name: 'Flush Volume',
      nameLocale: `${I18n.t('device_details.FLUSHER.LABEL_FLUSHER_VOLUME')}`,
      prefix: null,
      postfix: null,
      uuid: null,
      position: 5,
      value: `${flushVolumeInGal} gal (${galToLiter.toFixed(2)} L)`,
    });
    // const charResponse6: any = await BLEService.readCharacteristicForDevice(
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88340',
    //   'f89f13e7-83f8-4b7c-9e8b-364576d88345',
    // );
    //
    // if (!isObjectEmpty(charResponse6)) {
    //   const decodeValue = base64EncodeDecode(charResponse6?.value, 'decode');
    //   consoleLog('charResponse6 decodeValue==>', charResponse6);
    //
    //   var formattedValue = 0;
    //   if (decodeValue) {
    //     formattedValue =
    //       parseInt(decodeValue);// / BLE_CONSTANTS.COMMON.GMP_FORMULA;
    //   }
    //
    //   data.push({
    //     name: 'Flush Volume',
    //     nameLocale: `${I18n.t('device_details.FLUSHER.LABEL_FLUSHER_VOLUME')}`,
    //     prefix: null,
    //     postfix: null,
    //     uuid: null,
    //     position: 5,
    //     value: formattedValue ?? 'N/A',
    //   });
    // }

    /**
     * Engineering Data 1
     */
    const charResponse66: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88370',
      'f89f13e7-83f8-4b7c-9e8b-364576d88371',
    );

    if (!isObjectEmpty(charResponse66)) {
      const decodeValue = base64EncodeDecode(charResponse66?.value, 'decode');
      data.push({
        name: 'Engineering Data 1',
        nameLocale: `${I18n.t(
          'device_details.FLUSHER.LABEL_ENGINEERING_DATA_1',
        )}`,
        uuid: null,
        position: 8,
        value: decodeValue ?? 'N/A',
      });
    }

    /**
     * Engineering Data 2
     */
    const charResponse666: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88370',
      'f89f13e7-83f8-4b7c-9e8b-364576d88372',
    );

    if (!isObjectEmpty(charResponse666)) {
      const decodeValue = base64EncodeDecode(charResponse666?.value, 'decode');
      data.push({
        name: 'Engineering Data 2',
        nameLocale: `${I18n.t(
          'device_details.FLUSHER.LABEL_ENGINEERING_DATA_2',
        )}`,
        uuid: null,
        position: 9,
        value: decodeValue ?? 'N/A',
      });
    }

    /**
     * For the date of installation, logic is this:
      For “Date of Installation”, this one is calculated from the Today date and the “Hours of Operation (Operating hours since install)”.
      For example:
      if current unix timestamp in the App is 1714752879, which means (Date and time (GMT): Friday, May 3, 2024 4:14:39 PM)
      “Hours of Operation” = 100 hours, which means 100*60*60 = 360000 seconds.
      Then the timestamp of “Installation” is = 1714752879 - 360000 = 1714392879
      which means the “Date of Installation” is Monday, April 29, 2024  (GMT)
     */
    var characteristicStaticHoursOfOperation: any =
      await BLEService.readCharacteristicForDevice(
        'f89f13e7-83f8-4b7c-9e8b-364576d88310',
        'f89f13e7-83f8-4b7c-9e8b-364576d88312',
      );

    if (!isObjectEmpty(characteristicStaticHoursOfOperation)) {
      const decodeValue = hexToDecimal(
        base64EncodeDecode(
          characteristicStaticHoursOfOperation?.value,
          'decode',
        ),
      );
      consoleLog(
        'characteristicStaticHoursOfOperation decodeValue==>',
        characteristicStaticHoursOfOperation,
      );

      if (decodeValue >= 0) {
        const decodeValueInSeconds = parseInt(decodeValue);
        const currentTimestamp = timestampInSec();
        const dateOfInstallTimestamp = currentTimestamp - decodeValueInSeconds;
        // consoleLog('decodeValueInSeconds==>', decodeValueInSeconds);
        // consoleLog('dateOfInstallTimestamp==>', dateOfInstallTimestamp);
        data.push({
          name: 'Date of Installation',
          nameLocale: `${I18n.t(
            'device_details.FLUSHER.LABEL_DATE_OF_INSTALLATION',
          )}`,
          prefix: null,
          postfix: null,
          uuid: null,
          position: 1,
          value: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
        });
      }
    }

    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        if (
          typeof value?.uuid != 'undefined' &&
          (value?.displayInList !== false || ignoreDisplayInList) &&
          (value?.generation == 'all' || value?.generation == deviceVersion)
        ) {
          var characteristic = await BLEService.readCharacteristicForDevice(
            serviceUUID,
            value?.uuid,
          );

          if (typeof characteristic != 'undefined') {
            data.push({
              name: value?.name,
              nameLocale: `${I18n.t(
                'device_details.FLUSHER.' + value?.nameLocaleKey,
              )}`,
              prefix: value?.prefix,
              postfix: value?.postfix,
              uuid: value?.uuid,
              position: value?.position,
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

/** getSettingLogsDataFlusher method for advance */
const getSettingLogsDataFlusher = (ignoreDisplayInList: boolean = false) => {
  return new Promise<any>(async resolve => {
    const serviceUUID = 'f89f13e7-83f8-4b7c-9e8b-364576d88320';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES_FLUSHER,
    );

    var data = [];
    // consoleLog('getSettingLogsDataFlusher allServices==>', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // consoleLog(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        try {
          if (
            typeof value?.uuid != 'undefined' &&
            (value?.displayInList !== false || ignoreDisplayInList) &&
            (value?.generation == 'all' ||
              value?.generation == BLEService.deviceGeneration)
          ) {
            var characteristic = await BLEService.readCharacteristicForDevice(
              serviceUUID,
              value?.uuid,
            );
            // consoleLog('getSettingLogsDataFlusher characteristic==>', characteristic);

            var decodeValue = 'N/A';
            if (!isObjectEmpty(characteristic) && characteristic?.value) {
              decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
            }
            data.push({
              name: value?.name,
              nameLocale: `${I18n.t(
                'device_details.FLUSHER.' + value?.nameLocaleKey,
              )}`,
              uuid: value?.uuid,
              position: value?.position,
              value: formatCharateristicValue(value, decodeValue),
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

/**
 * project level function for BLE devices
 * @param serviceUUID
 * @param characteristicUUID
 */
const getCustomCharacteristic = async (
  serviceUUID: string,
  characteristicUUID: string,
) => {
  var result = {};
  const characteristicStaticADManufacturingDate =
    getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
      serviceUUID,
      characteristicUUID,
    );
  characteristicStaticADManufacturingDate.serviceUUID = serviceUUID;

  var characteristic: any = await BLEService.readCharacteristicForDevice(
    characteristicStaticADManufacturingDate.serviceUUID,
    characteristicStaticADManufacturingDate.uuid,
  );

  if (typeof characteristic != 'undefined') {
    const decodeValue = base64EncodeDecode(characteristic?.value, 'decode');

    result = {
      name: characteristicStaticADManufacturingDate?.name,
      prefix: null,
      postfix: null,
      uuid: characteristicStaticADManufacturingDate?.uuid,
      value: formatCharateristicValue(
        characteristicStaticADManufacturingDate,
        decodeValue,
      ),
    };
  }

  return result;
};
