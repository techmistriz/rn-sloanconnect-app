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

/** getDeviceInfoNormal method for normal info */
export const getDeviceInfoNormalBasys = async () => {
  const data = await getBDInformationDataBasys();
  return [...data];
};

/** getDeviceInfoAdvance method for advance */
export const getDeviceInfoAdvanceBasys = async () => {
  var BDInformationArr = [];

  /** BLE Device Manufacturing Date  */
  const charResponse1: any = await BLEService.readCharacteristicForDevice(
    'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
    'd0aba888-fb10-4dc9-9b17-bdd8f490c904',
  );

  if (!isObjectEmpty(charResponse1)) {
    const decodeValue = base64EncodeDecode(charResponse1?.value, 'decode');
    consoleLog('charResponse1 decodeValue==>', charResponse1);

    BDInformationArr.push({
      name: 'BLE Device Manufacturing Date',
      nameLocale: `${I18n.t('device_details.CONTROL_BOX_MANUF_DATE_LABEL')}`,
      prefix: null,
      postfix: null,
      uuid: null,
      position: 3,
      // value: decodeValue ?? 'N/A',
      value: formatCharateristicValue(
        {valueFormat: 'YYMMDD', valueType: 'Date', dateFormat: 'YYYY/MM/DD'},
        decodeValue,
      ),
    });
  }

  /** Sensor Manufacturing Date  */
  const charResponse2: any = await BLEService.readCharacteristicForDevice(
    'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
    'd0aba888-fb10-4dc9-9b17-bdd8f490c903',
  );

  if (!isObjectEmpty(charResponse2)) {
    const decodeValue = base64EncodeDecode(charResponse2?.value, 'decode');
    consoleLog('charResponse2 decodeValue==>', charResponse2);

    BDInformationArr.push({
      name: 'Sensor Manufacturing Date',
      nameLocale: `${I18n.t('device_details.SENSOR_MANUF_DATE_LABEL')}`,
      prefix: null,
      postfix: null,
      uuid: null,
      position: 4,
      // value: decodeValue ?? 'N/A',
      value: formatCharateristicValue(
        {valueFormat: 'YYMMDD', valueType: 'Date', dateFormat: 'YYYY/MM/DD'},
        decodeValue,
      ),
    });
  }

  /**Sensor Serial Number  */
  const charResponse3: any = await BLEService.readCharacteristicForDevice(
    'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
    'd0aba888-fb10-4dc9-9b17-bdd8f490c901',
  );

  if (!isObjectEmpty(charResponse3)) {
    const decodeValue = base64EncodeDecode(charResponse3?.value, 'decode');
    consoleLog('charResponse3 decodeValue==>', charResponse3);

    BDInformationArr.push({
      name: 'Sensor Serial Number',
      nameLocale: `${I18n.t('device_details.SENSOR_SERIAL_NUMBER_LABEL')}`,
      prefix: null,
      postfix: null,
      uuid: null,
      position: 5,
      value: decodeValue ?? 'N/A',
    });
  }

  const statisticsInformationArr = await getStatisticsInformationDataBasys();
  const settingLogArr = await getSettingLogsDataBasys();
  // consoleLog('getDeviceInfoAdvance settingLogs==>', settingLogs);
  return [...BDInformationArr, ...statisticsInformationArr, ...settingLogArr];
};

/** BDInformationData method for normal info */
const getBDInformationDataBasys = () => {
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

          // consoleLog('getBDInformationDataGen1 characteristic==>', {
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
const getStatisticsInformationDataBasys = () => {
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

        // data.push({
        //   name: 'HOURS DF OPERATION',
        //   nameLocale: `${I18n.t('device_details.HOURS_OF_OPERATION_LABEL')}`,
        //   prefix: null,
        //   postfix: null,
        //   uuid: null,
        //   position: 2,
        //   value: decodeValue,
        // });
      }
    }

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
      position: 8,
      value: `${__totalWaterUsage} (${totalWaterUsage} L)`,
    });

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
        }
      }
    }

    resolve(data);
  });
};

/** BDInformationData method for advance */
const getSettingLogsDataBasys = () => {
  return new Promise<any>(async resolve => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c920';
    const allServices = getDeviceCharacteristicsByServiceUUID(
      serviceUUID,
      BLE_GATT_SERVICES,
    );

    var data = [];
    // consoleLog('getSettingLogsDataBasys allServices==>', allServices);
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

            // consoleLog('getSettingLogsDataBasys characteristic==>', characteristic);

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
