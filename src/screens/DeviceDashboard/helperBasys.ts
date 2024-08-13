import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {__base64ToHex, base64EncodeDecode, base64ToText, hexToDecimal} from 'src/utils/Helpers/encryption';

/** Function comments */
export const getActivationModeSettingsBasys = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    modeSelection: null,
    metered: null,
    onDemand: null,
  };

  var modeSelectionResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.MODE_SELECTION_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.MODE_SELECTION_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getActivationModeSettings modeSelectionResponse==>',
  //   JSON.stringify(modeSelectionResponse),
  // );

  if (!isObjectEmpty(modeSelectionResponse) && modeSelectionResponse?.value) {
    modeSelectionResponse.value = base64ToText(modeSelectionResponse?.value);
    results.modeSelection = cleanCharacteristic(modeSelectionResponse);
  }

  var meteredResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.METERED_RUNTIME_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.METERED_RUNTIME_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getActivationModeSettings meteredResponse==>',
  //   JSON.stringify(meteredResponse),
  // );

  if (!isObjectEmpty(meteredResponse) && meteredResponse?.value) {
    meteredResponse.value = hexToDecimal(__base64ToHex(meteredResponse?.value));
    results.metered = cleanCharacteristic(meteredResponse);
  }

  const onDemandResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getActivationModeSettings onDemandResponse==>',
  //   JSON.stringify(onDemandResponse),
  // );

  if (!isObjectEmpty(onDemandResponse) && onDemandResponse?.value) {
    onDemandResponse.value = hexToDecimal(__base64ToHex(onDemandResponse?.value));
    results.onDemand = cleanCharacteristic(onDemandResponse);
  }

  return results;
};

/** Function comments */
export const getFlushSettingsBasys = async (unsavedDeviceSettingsData: any) => {
  const results = {
    flush: null,
    flushTime: null,
    flushInterval: null,
  };

  var flushResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.FLUSH_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.FLUSH_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getFlushSettings flushResponse==>',
  //   JSON.stringify(flushResponse),
  // );

  if (!isObjectEmpty(flushResponse) && flushResponse?.value) {
    flushResponse.value = base64ToText(flushResponse?.value);
    results.flush = cleanCharacteristic(flushResponse);
  }

  var flushTimeResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.FLUSH_TIME_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.FLUSH_TIME_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getFlushSettings flushTimeResponse==>',
  //   JSON.stringify(flushTimeResponse),
  // );

  if (!isObjectEmpty(flushTimeResponse) && flushTimeResponse?.value) {
    flushTimeResponse.value = hexToDecimal(__base64ToHex(flushTimeResponse?.value));
    results.flushTime = cleanCharacteristic(flushTimeResponse);
  }

  const flushIntervalResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.FLUSH_INTERVAL_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.FLUSH_INTERVAL_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getFlushSettings flushIntervalResponse==>',
  //   JSON.stringify(flushIntervalResponse),
  // );

  if (!isObjectEmpty(flushIntervalResponse) && flushIntervalResponse?.value) {
    flushIntervalResponse.value = hexToDecimal(__base64ToHex(flushIntervalResponse?.value));
    results.flushInterval = cleanCharacteristic(flushIntervalResponse);
  }

  return results;
};

/** Function comments */
export const getFlowSettingsBasys = async (unsavedDeviceSettingsData: any) => {
  const results = {
    flowRate: null,
  };

  var flowRateResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.FLOW_RATE_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.FLOW_RATE_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getFlowSettings flowRateResponse==>',
  //   JSON.stringify(flowRateResponse),
  // );

  if (!isObjectEmpty(flowRateResponse) && flowRateResponse?.value) {
    flowRateResponse.value = hexToDecimal(__base64ToHex(flowRateResponse?.value));
    results.flowRate = cleanCharacteristic(flowRateResponse);
  }

  return results;
};

/** Function comments */
export const getSensorSettingsBasys = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    sensorRange: null,
  };

  var sensorResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.GEN1.SENSOR_SERVICE_UUID,
    BLE_CONSTANTS.GEN1.SENSOR_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getSensorSettings sensorResponse==>',
  //   JSON.stringify(sensorResponse),
  // );

  if (!isObjectEmpty(sensorResponse) && sensorResponse?.value) {
    sensorResponse.value = hexToDecimal(__base64ToHex(sensorResponse?.value));
    results.sensorRange = cleanCharacteristic(sensorResponse);
  }

  return results;
};

/** Function comments */
export const getNoteFlusherSettingsBasys = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    note: null,
  };

  var sensorResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.BASYS.NOTE_SERVICE_UUID,
    BLE_CONSTANTS.BASYS.NOTE_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getNoteFlusherSettingsBasys sensorResponse==>',
  //   JSON.stringify(sensorResponse),
  // );

  if (!isObjectEmpty(sensorResponse) && sensorResponse?.value) {
    sensorResponse.value = base64ToText(sensorResponse?.value);
    results.note = cleanCharacteristic(sensorResponse);
  }

  return results;
};
