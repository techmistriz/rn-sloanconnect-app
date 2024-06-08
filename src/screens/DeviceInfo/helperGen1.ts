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
          prefix: null,
          postfix: null,
          uuid: 'DateofInstallation',
          value: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
        });
      }
    }

    // consoleLog('allServices', allServices);
    if (typeof allServices != 'undefined' && Object.entries(allServices)) {
      for (const [key, value] of Object.entries(allServices)) {
        // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

        // *******Custom************
        if (data?.length == 2) {

          const characteristicStaticBDManufacturingDate =
            await getCustomCharacteristic(
              'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
              'd0aba888-fb10-4dc9-9b17-bdd8f490c904',
            );

          if (!isObjectEmpty(characteristicStaticBDManufacturingDate)) {
            data.push(characteristicStaticBDManufacturingDate);
          }
          
          const characteristicStaticADManufacturingDate =
            await getCustomCharacteristic(
              'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
              'd0aba888-fb10-4dc9-9b17-bdd8f490c903',
            );

          if (!isObjectEmpty(characteristicStaticADManufacturingDate)) {
            data.push(characteristicStaticADManufacturingDate);
          }
          const characteristicStaticBDSerialNumber =
            await getCustomCharacteristic(
              'd0aba888-fb10-4dc9-9b17-bdd8f490c900',
              'd0aba888-fb10-4dc9-9b17-bdd8f490c902',
            );

          if (!isObjectEmpty(characteristicStaticBDSerialNumber)) {
            data.push(characteristicStaticBDSerialNumber);
          }
        }

        if (data?.length == 7) {
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
            position: 7,
            value: `${__totalWaterUsage} (${totalWaterUsage} L)`,
            uuid: null,
          });
        }

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
