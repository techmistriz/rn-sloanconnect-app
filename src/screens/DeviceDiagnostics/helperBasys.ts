import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {
  base64ToHex, hexToDecimal, hexToString,
} from 'src/utils/Helpers/encryption';
import I18n from 'src/locales/Transaltions';

/** Function comments */
export const readingDiagnosticBasys = async () => {
  let RESULTS = [];

  //  Sensor result
  const __characteristicSensor = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.DIAGNOSTIC_SENSOR_RESULT_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.DIAGNOSTIC_SENSOR_RESULT_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'initialize __characteristicSensor==>',
    JSON.stringify(cleanCharacteristic(__characteristicSensor)),
  );

  if (__characteristicSensor) {
    RESULTS.push({
      name: 'Sensor',
      nameLocale: I18n.t('diagnostic_page.SENSOR_TITLE'),
      value: hexToString(base64ToHex(__characteristicSensor?.value)),
      showInList: true,
    });
  }

  //  Turbine/Solenoid result
  const __characteristicTurbine = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.DIAGNOSTIC_TURBINE_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.DIAGNOSTIC_TURBINE_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'initialize __characteristicTurbine==>',
    JSON.stringify(cleanCharacteristic(__characteristicTurbine)),
  );

  if (__characteristicTurbine) {
    const __characteristicTurbine__ = cleanCharacteristic(
      __characteristicTurbine,
    );
    RESULTS.push({
      name: 'Solenoid',
      nameLocale: I18n.t('diagnostic_page.SOLENOID_TITLE'),
      value: hexToString(base64ToHex(__characteristicTurbine__?.value)),
      showInList: true,
    });
  }

  //  Battery result
  const __characteristicBattery = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
    BLE_CONSTANTS.BASYS
      .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicBattery==>',
  //   JSON.stringify(cleanCharacteristic(__characteristicBattery)),
  // );

  if (__characteristicBattery) {
    // setDeviceBatteryDetails(__characteristicBattery__);
    const __base64ToHex = base64ToHex(__characteristicBattery?.value);
    const hexEncodeValue = hexToDecimal(__base64ToHex);

    RESULTS.push({
      // ...__characteristicBattery__,
      name: 'Battery Level at Diagnostic',
      nameLocale: I18n.t('diagnostic_page.BATTERY_LEVEL_AT_DIAGNOSTIC_TITLE'),
      value:
        Number(hexEncodeValue) > 100
          ? Number(hexEncodeValue)
          : Number(hexEncodeValue),
      forceText: true,
      prefix: null,
      postfix: ' %',
      showInList: true,
    });
  }

  //  DTLastDiagnostic result
  try {
    const __characteristicDTLastDiagnostic =
      await BLEService.readCharacteristicForDevice(
        BLE_CONSTANTS.BASYS.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
        BLE_CONSTANTS.BASYS
          .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      );
    if (__characteristicDTLastDiagnostic) {
      // consoleLog(
      //   'initialize __characteristicDTLastDiagnostic==>',
      //   cleanCharacteristic(__characteristicDTLastDiagnostic),
      // );

      const __base64ToHex = base64ToHex(
        __characteristicDTLastDiagnostic?.value,
      );
      const hexEncodeValue = hexToDecimal(__base64ToHex);

      RESULTS.push({
        name: 'D/T of last diagnostic',
        value: hexEncodeValue,
        showInList: false,
      });
    }
  } catch (error) {
    // await BLEService.writeCharacteristicWithResponseForDevice(
    //   BLE_CONSTANTS.BASYS.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
    //   BLE_CONSTANTS.BASYS
    //     .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
    //   'AA',
    // );

    RESULTS.push({
      name: 'D/T of last diagnostic',
      value: null,
      showInList: false,
    });
  }

  // consoleLog(
  //   'initialize __characteristicDTLastDiagnostic==>',
  //   JSON.stringify(__characteristicDTLastDiagnostic),
  // );

  return RESULTS;
};
