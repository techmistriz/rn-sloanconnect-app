import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {
  base64EncodeDecode,
  base64ToHex,
  base64ToText,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';

/** Function comments */
export const readingDiagnostic = async () => {
  let RESULTS = [];

  //  Sensor result
  const __characteristicSensor = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_SENSOR_RESULT_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_SENSOR_RESULT_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicSensor==>',
  //   JSON.stringify(__characteristicSensor),
  // );

  if (__characteristicSensor) {
    const __characteristicSensor__ = cleanCharacteristic(
      __characteristicSensor,
    );
    // setDeviceSensorDetails(__characteristicSensor__);
    RESULTS.push({
      // ...__characteristicSensor__,
      name: 'Sensor',
      value: base64EncodeDecode(__characteristicSensor__?.value, 'decode'),
    });
  }

  //  Valve result
  const __characteristicValve = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_VALVE_RESULT_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_VALVE_RESULT_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicValve==>',
  //   JSON.stringify(__characteristicValve),
  // );

  if (__characteristicValve) {
    const __characteristicValve__ = cleanCharacteristic(__characteristicValve);
    // setDeviceValveDetails(__characteristicValve__);
    RESULTS.push({
      // ...__characteristicValve__,
      name: 'Valve',
      value: base64EncodeDecode(__characteristicValve__?.value, 'decode'),
    });
  }

  //  Turbine result
  const __characteristicTurbine = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_TURBINE_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_TURBINE_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicTurbine==>',
  //   JSON.stringify(__characteristicTurbine),
  // );

  if (__characteristicTurbine) {
    const __characteristicTurbine__ = cleanCharacteristic(
      __characteristicTurbine,
    );
    // setDeviceTurbineDetails(__characteristicTurbine__);
    RESULTS.push({
      // ...__characteristicTurbine__,
      name: 'Turbine',
      value: base64EncodeDecode(__characteristicTurbine__?.value, 'decode'),
    });
  }

  //  Dispense result
  const __characteristicDispense = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_WATER_DISPENSE_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_WATER_DISPENSE_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicDispense==>',
  //   JSON.stringify(cleanCharacteristic(__characteristicDispense)),
  // );

  if (__characteristicDispense) {
    const __characteristicDispense__ = cleanCharacteristic(
      __characteristicDispense,
    );
    // setDeviceDispenseDetails(__characteristicDispense__);
    RESULTS.push({
      // ...__characteristicDispense__,
      name: 'Water Dispense',
      value: base64EncodeDecode(__characteristicDispense__?.value, 'decode'),
    });
  }

  //  Battery result
  const __characteristicBattery = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
    BLE_CONSTANTS.GEN1
      .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'initialize __characteristicBattery==>',
  //   JSON.stringify(__characteristicBattery),
  // );

  if (__characteristicBattery) {
    // const __characteristicBattery__ = cleanCharacteristic(
    //   __characteristicBattery,
    // );

    // consoleLog(
    //   'initialize __characteristicBattery__==>',
    //   JSON.stringify(__characteristicBattery__),
    // );

    // setDeviceBatteryDetails(__characteristicBattery__);

    const __base64ToHex = base64ToHex(__characteristicBattery?.value);
    const hexEncodeValue = hexToDecimal(__base64ToHex);

    RESULTS.push({
      // ...__characteristicBattery__,
      name: 'Battery Level at Diagnostic',
      value: Number(hexEncodeValue),
      forceText: true,
      prefix: null,
      postfix: ' %',
    });
  }

  //  DTLastDiagnostic result
  try {
    const __characteristicDTLastDiagnostic =
      await BLEService.readCharacteristicForDevice(
        BLE_CONSTANTS.GEN1.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
        BLE_CONSTANTS.GEN1
          .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      );
    if (__characteristicDTLastDiagnostic) {
      consoleLog(
        'initialize __characteristicDTLastDiagnostic==>',
        cleanCharacteristic(__characteristicDTLastDiagnostic),
      );

      RESULTS.push({
        name: 'D/T of last diagnostic',
        // value: base64ToHex(
        //   __characteristicDTLastDiagnostic?.value,
        // ),
        value: base64EncodeDecode(
          __characteristicDTLastDiagnostic?.value,
          'decode',
        ),
      });
    }
  } catch (error) {
    // await BLEService.writeCharacteristicWithResponseForDevice(
    //   BLE_CONSTANTS.GEN1.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
    //   BLE_CONSTANTS.GEN1
    //     .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
    //   'AA',
    // );

    RESULTS.push({
      name: 'D/T of last diagnostic',
      value: null,
    });
  }

  // consoleLog(
  //   'initialize __characteristicDTLastDiagnostic==>',
  //   JSON.stringify(__characteristicDTLastDiagnostic),
  // );

  return RESULTS;
};
