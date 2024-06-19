import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {base64EncodeDecode, base64ToText} from 'src/utils/Helpers/encryption';

/** Function comments */
export const readingDiagnostic = async () => {
  let RESULTS = [];
  const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
  const characteristicUUIDSensor = 'd0aba888-fb10-4dc9-9b17-bdd8f490c962';
  const characteristicUUIDValve = 'd0aba888-fb10-4dc9-9b17-bdd8f490c963';
  const characteristicUUIDTurbine = 'd0aba888-fb10-4dc9-9b17-bdd8f490c964';
  const characteristicUUIDDispense = 'd0aba888-fb10-4dc9-9b17-bdd8f490c965';
  const characteristicUUIDBattery = 'd0aba888-fb10-4dc9-9b17-bdd8f490c966';
  const characteristicUUIDDTLastDiagnostic =
    'd0aba888-fb10-4dc9-9b17-bdd8f490c967';

  //  Sensor result
  const __characteristicSensor = await BLEService.readCharacteristicForDevice(
    serviceUUID,
    characteristicUUIDSensor,
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
    serviceUUID,
    characteristicUUIDValve,
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
    serviceUUID,
    characteristicUUIDTurbine,
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
    serviceUUID,
    characteristicUUIDDispense,
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
    serviceUUID,
    characteristicUUIDBattery,
  );

  // consoleLog(
  //   'initialize __characteristicBattery==>',
  //   JSON.stringify(__characteristicBattery),
  // );

  if (__characteristicBattery) {
    const __characteristicBattery__ = cleanCharacteristic(
      __characteristicBattery,
    );

    // consoleLog(
    //   'initialize __characteristicBattery__==>',
    //   JSON.stringify(__characteristicBattery__),
    // );

    // setDeviceBatteryDetails(__characteristicBattery__);
    RESULTS.push({
      // ...__characteristicBattery__,
      name: 'Battery Level at Diagnostic',
      value: base64EncodeDecode(__characteristicBattery__?.value, 'decode'),
      forceText: true,
      prefix: null,
      postfix: ' %',
    });
  }

  //  DTLastDiagnostic result
  const __characteristicDTLastDiagnostic =
    await BLEService.readCharacteristicForDevice(
      serviceUUID,
      characteristicUUIDDTLastDiagnostic,
    );

  // consoleLog(
  //   'initialize __characteristicDTLastDiagnostic==>',
  //   JSON.stringify(__characteristicDTLastDiagnostic),
  // );

  if (__characteristicDTLastDiagnostic) {
    const __characteristicDTLastDiagnostic__ = cleanCharacteristic(
      __characteristicDTLastDiagnostic,
    );
    // setDeviceDTLastDiagnosticDetails(__characteristicDTLastDiagnostic__);
    RESULTS.push({
      // ...__characteristicDTLastDiagnostic__,
      name: 'D/T of last diagnostic',
      value: base64EncodeDecode(
        __characteristicDTLastDiagnostic__?.value,
        'decode',
      ),
    });
  }

  return RESULTS;
};
