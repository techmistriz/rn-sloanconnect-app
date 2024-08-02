import moment from 'moment';
import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog, timestampInSec} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode, hexToDecimal} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import I18n from 'src/locales/Transaltions';

const connectedDevice = BLEService.getDevice();

/** getDeviceInfoNormalFlusher method for normal info */
export const getDeviceInfoNormalFlusher = async () => {
  const data = await getBDInformationDataFlusher();
  return [...data];
};

/** getDeviceInfoAdvanceFlusher method for advance */
export const getDeviceInfoAdvanceFlusher = async () => {
  const statisticsInformationArr = await getStatisticsInformationDataFlusher();
  const settingLogs = await getSettingLogsDataFlusher();
  // consoleLog('getDeviceInfoAdvanceFlusher settingLogs==>', settingLogs);
  return [...statisticsInformationArr, ...settingLogs];
};

/** BDInformationData method for normal info */
const getBDInformationDataFlusher = () => {
  return new Promise<any>(async resolve => {
    const serviceUUID = 'f89f13e7-83f8-4b7c-9e8b-364576d88300';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
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
          nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
          prefix: null,
          postfix: null,
          uuid: null,
          position: 4,
          value: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
        });
      }
    }

    /**
     * Line (Sentinel) Flush Count -> Number Of flushes since day 1
     */
    var characteristic = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88310',
      'f89f13e7-83f8-4b7c-9e8b-364576d88313',
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
      name: 'Number Of flushes since day 1',
      nameLocale: `${I18n.t('device_details.LINE_FLUSHES_SINCE_DAY_1_LABEL')}`,
      prefix: null,
      postfix: null,
      uuid: null,
      position: 5,
      value: decodeValue,
    });

    /**
     * ACCUMULATED WATER USAGE -> Total water usage
     */
    const totalWaterUsage = BLEService.totalWaterUsase;
    const __totalWaterUsage = `${
      totalWaterUsage
        ? (totalWaterUsage / BLE_CONSTANTS.COMMON.GMP_FORMULA).toFixed(2)
        : 0
    } Gal`;
    data.push({
      name: 'Accumulated water usage',
      nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
      uuid: null,
      position: 6,
      value: `${__totalWaterUsage} (${totalWaterUsage} L)`,
    });

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
            nameLocale: `${I18n.t('device_details.' + value?.nameLocaleKey)}`,
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

/** BDInformationData method for advance */
const getStatisticsInformationDataFlusher = () => {
  var deviceVersion = '01';
  var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
  if (__deviceName) {
    deviceVersion = BLEService.deviceVersion;
  }

  return new Promise<any>(async resolve => {
    const serviceUUID = 'f89f13e7-83f8-4b7c-9e8b-364576d88310';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];

    /** BLE Device Serial Number  */
    const charResponse: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88302',
    );

    if (!isObjectEmpty(charResponse)) {
      const decodeValue = base64EncodeDecode(charResponse?.value, 'decode');
      consoleLog('charResponse decodeValue==>', charResponse);

      data.push({
        name: 'BLE Serial Number',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 2,
        value: decodeValue ?? 'N/A',
      });
    }

    /** BLE Device Hardware Version  */
    const charResponse2: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88307',
    );

    if (!isObjectEmpty(charResponse2)) {
      const decodeValue = base64EncodeDecode(charResponse2?.value, 'decode');
      consoleLog('charResponse2 decodeValue==>', charResponse2);

      data.push({
        name: 'BLE Hardware Version',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 3,
        value: decodeValue ?? 'N/A',
      });
    }

    /** BLE Device Firmware Version  */
    const charResponse3: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88308',
    );

    if (!isObjectEmpty(charResponse3)) {
      const decodeValue = base64EncodeDecode(charResponse3?.value, 'decode');
      consoleLog('charResponse3 decodeValue==>', charResponse3);

      data.push({
        name: 'BLE Firmware Version',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 4,
        value: decodeValue ?? 'N/A',
      });
    }

    /** BLE Device Manufacturing Date  */
    const charResponse4: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88304',
    );

    if (!isObjectEmpty(charResponse4)) {
      const decodeValue = base64EncodeDecode(charResponse4?.value, 'decode');
      consoleLog('charResponse4 decodeValue==>', charResponse4);

      data.push({
        name: 'BLE Device Manufacturing Date',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 5,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Flusher Manufacturing Date  */
    const charResponse5: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88303',
    );

    if (!isObjectEmpty(charResponse5)) {
      const decodeValue = base64EncodeDecode(charResponse5?.value, 'decode');
      consoleLog('charResponse5 decodeValue==>', charResponse5);

      data.push({
        name: 'Flusher Manufacturing Date',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 6,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Flusher Serial Number  */
    const charResponse6: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88300',
      'f89f13e7-83f8-4b7c-9e8b-364576d88301',
    );

    if (!isObjectEmpty(charResponse6)) {
      const decodeValue = base64EncodeDecode(charResponse6?.value, 'decode');
      consoleLog('charResponse6 decodeValue==>', charResponse6);

      data.push({
        name: 'Flusher Serial Number',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 7,
        value: decodeValue ?? 'N/A',
      });
    }

    /**
     * Flush Volume
     */
    data.push({
      name: 'Flush Volume',
      // nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
      uuid: null,
      position: 8,
      value: `${0} gal (${0} L)`,
    });

    /**
     * Engineering Data 1
     */
    data.push({
      name: 'Engineering Data 1',
      // nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
      uuid: null,
      position: 11,
      value: `N/A`,
    });

    /**
     * Engineering Data 2
     */
    data.push({
      name: 'Engineering Data 2',
      // nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
      uuid: null,
      position: 12,
      value: `N/A`,
    });

    /**
     * Low Battery Activations
     */
    data.push({
      name: 'Low Battery Activations',
      // nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
      uuid: null,
      position: 13,
      value: `N/A`,
    });

    /** Date of last factory reset  */
    const charResponse7: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88321',
    );

    if (!isObjectEmpty(charResponse7)) {
      const decodeValue = base64EncodeDecode(charResponse7?.value, 'decode');
      consoleLog('charResponse7 decodeValue==>', charResponse7);

      data.push({
        name: 'Date of last factory reset',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 14,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Date of last Dianogstic  */
    const charResponse8: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88325',
    );

    if (!isObjectEmpty(charResponse8)) {
      const decodeValue = base64EncodeDecode(charResponse8?.value, 'decode');
      consoleLog('charResponse8 decodeValue==>', charResponse8);

      data.push({
        name: 'Date of last Dianogstic',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 14,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Phone of last Dianogstic  */
    const charResponse9: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88325',
    );

    if (!isObjectEmpty(charResponse9)) {
      const decodeValue = base64EncodeDecode(charResponse9?.value, 'decode');
      consoleLog('charResponse9 decodeValue==>', charResponse9);

      data.push({
        name: 'Phone of last Dianogstic',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 15,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Date of last range change  */
    const charResponse10: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88322',
    );

    if (!isObjectEmpty(charResponse10)) {
      const decodeValue = base64EncodeDecode(charResponse10?.value, 'decode');
      consoleLog('charResponse10 decodeValue==>', charResponse10);

      data.push({
        name: 'Date of last range change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 16,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Phone of last range change  */
    const charResponse11: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88332',
    );

    if (!isObjectEmpty(charResponse11)) {
      const decodeValue = base64EncodeDecode(charResponse11?.value, 'decode');
      consoleLog('charResponse11 decodeValue==>', charResponse11);

      data.push({
        name: 'Phone of last range change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 17,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Date of last Activation time change  */
    const charResponse12: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88327',
    );

    if (!isObjectEmpty(charResponse12)) {
      const decodeValue = base64EncodeDecode(charResponse12?.value, 'decode');
      consoleLog('charResponse12 decodeValue==>', charResponse12);

      data.push({
        name: 'Date of last Activation time change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 16,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Phone of last Activation time change  */
    const charResponse13: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88337',
    );

    if (!isObjectEmpty(charResponse13)) {
      const decodeValue = base64EncodeDecode(charResponse13?.value, 'decode');
      consoleLog('charResponse13 decodeValue==>', charResponse13);

      data.push({
        name: 'Phone of last Activation time change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 17,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Date of last Flush Interval Change => D/T of last Line (Sentinel) Flush change  */
    const charResponse14: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88323',
    );

    if (!isObjectEmpty(charResponse14)) {
      const decodeValue = base64EncodeDecode(charResponse14?.value, 'decode');
      consoleLog('charResponse14 decodeValue==>', charResponse14);

      data.push({
        name: 'Date of last Flush Interval Change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 18,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Phone of last Flush Interval Change => Phone of last Line (Sentinel) Flush change  */
    const charResponse15: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88333',
    );

    if (!isObjectEmpty(charResponse15)) {
      const decodeValue = base64EncodeDecode(charResponse15?.value, 'decode');
      consoleLog('charResponse15 decodeValue==>', charResponse15);

      data.push({
        name: 'Phone of last Flush Interval Change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 19,
        value: decodeValue ?? 'N/A',
      });
    }

    /** Phone of last Flush Interval Change => Phone of last Line (Sentinel) Flush change  */
    const charResponse16: any = await BLEService.readCharacteristicForDevice(
      'f89f13e7-83f8-4b7c-9e8b-364576d88320',
      'f89f13e7-83f8-4b7c-9e8b-364576d88333',
    );

    if (!isObjectEmpty(charResponse16)) {
      const decodeValue = base64EncodeDecode(charResponse16?.value, 'decode');
      consoleLog('charResponse16 decodeValue==>', charResponse16);

      data.push({
        name: 'Phone of last Flush Interval Change',
        // nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
        prefix: null,
        postfix: null,
        uuid: null,
        position: 19,
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
        'd0aba888-fb10-4dc9-9b17-bdd8f490c910',
        'd0aba888-fb10-4dc9-9b17-bdd8f490c911',
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
          nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
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
              nameLocale: `${I18n.t('device_details.' + value?.nameLocaleKey)}`,
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

/** BDInformationData method for advance */
const getSettingLogsDataFlusher = () => {
  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c920';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];
    // consoleLog('getSettingLogsDataFlusher allServices==>', allServices);
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

            // consoleLog('getSettingLogsDataFlusher characteristic==>', characteristic);

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
              nameLocale: `${I18n.t('device_details.' + value?.nameLocaleKey)}`,
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
