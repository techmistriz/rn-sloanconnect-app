import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {
  __base64ToHex,
  base64EncodeDecode,
  base64ToDecimal,
  base64ToText,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';

/** Function comments */
export const getActivationTimeFlusherSettings = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    activationTime: null,
  };

  var modeSelectionResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.ACTIVATION_TIME_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.ACTIVATION_TIME_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'getActivationTimeFlusherSettings ==>',
    JSON.stringify(modeSelectionResponse),
  );

  if (!isObjectEmpty(modeSelectionResponse) && modeSelectionResponse?.value) {
    modeSelectionResponse.value = base64ToText(modeSelectionResponse?.value);
    results.activationTime = cleanCharacteristic(modeSelectionResponse);
  }

  return results;
};

/** Function comments */
export const getFlushFlusherSettings = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    flushTime: null,
    flushVolume: null,
  };

  var flushTimeResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.FLUSH_TIME_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.FLUSH_TIME_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'getFlushSettings flushTimeResponse==>',
    JSON.stringify(flushTimeResponse),
  );

  if (!isObjectEmpty(flushTimeResponse) && flushTimeResponse?.value) {
    flushTimeResponse.value = base64ToText(flushTimeResponse?.value);
    results.flushTime = cleanCharacteristic(flushTimeResponse);
  }

  const flushIntervalResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_CHARACTERISTIC_UUID,
  );

  // consoleLog(
  //   'getFlushSettings flushIntervalResponse==>',
  //   JSON.stringify(flushIntervalResponse),
  // );

  if (!isObjectEmpty(flushIntervalResponse) && flushIntervalResponse?.value) {
    flushIntervalResponse.value = base64ToText(flushIntervalResponse?.value);
    results.flushVolume = cleanCharacteristic(flushIntervalResponse);
  }

  return results;
};

/** Function comments */
export const getSensorFlusherSettings = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    sensorRange: null,
  };

  var sensorResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.SENSOR_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.SENSOR_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'getSensorSettings sensorResponse==>',
    JSON.stringify(sensorResponse),
  );

  if (!isObjectEmpty(sensorResponse) && sensorResponse?.value) {
    sensorResponse.value = base64ToText(sensorResponse?.value);
    results.sensorRange = cleanCharacteristic(sensorResponse);
  }

  return results;
};

/** Function comments */
export const getNoteFlusherSettings = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    note: null,
  };

  var sensorResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.NOTE_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.NOTE_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'getSensorSettings sensorNoteResponse==>',
    JSON.stringify(sensorResponse),
  );

  if (!isObjectEmpty(sensorResponse) && sensorResponse?.value) {
    sensorResponse.value = base64ToText(sensorResponse?.value);
    results.note = cleanCharacteristic(sensorResponse);
  }

  return results;
};

/** Function comments */
export const getEngineeringData2FlusherSettings = async (
  unsavedDeviceSettingsData: any,
) => {
  const results = {
    note: null,
  };

  var sensorResponse = await BLEService.readCharacteristicForDevice(
    BLE_CONSTANTS.FLUSHER.ENGINEERING_DATA_2_SERVICE_UUID,
    BLE_CONSTANTS.FLUSHER.ENGINEERING_DATA_2_CHARACTERISTIC_UUID,
  );

  consoleLog(
    'getSensorSettings getEngineeringData2FlusherSettings==>',
    JSON.stringify(sensorResponse),
  );

  if (!isObjectEmpty(sensorResponse) && sensorResponse?.value) {
    sensorResponse.value = base64ToText(sensorResponse?.value);
    results.engineeringData = cleanCharacteristic(sensorResponse);
  }

  return results;
};
