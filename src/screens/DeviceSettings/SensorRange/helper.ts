import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {SensorRangeProps} from './types';
import {BLEDevice, BLEService, BLECharacteristic} from 'src/utils/GlobalTypes';

export const getSensorRangeSec = (characteristicMain: BLECharacteristic) => {
  // consoleLog(
  //   "getSensorRangeSec  base64EncodeDecode(characteristicMain?.value, 'decode')==>",
  //   base64EncodeDecode(characteristicMain?.value, 'decode'),
  // );
  return base64EncodeDecode(characteristicMain?.value, 'decode');
};

export const getSensorRangeRangeArr = (
  characteristicMain: BLECharacteristic,
) => {
  // consoleLog(
  //   "getSensorRangeSec  base64EncodeDecode(characteristicMain?.value, 'decode')==>",
  //   base64EncodeDecode(characteristicMain?.value, 'decode'),
  // );
  var result: number | string = 0;
  result = base64EncodeDecode(characteristicMain?.value, 'decode');
  return [Number(result)];
};

export const getSensorRange = (deviceStaticDataMain: any) => {
  var result: SensorRangeProps = {min: 1, max: 5, step: 1};
  var rangeStr = deviceStaticDataMain?.range;
  // consoleLog('getSensorRange rangeStr==>', rangeStr);
  if (rangeStr) {
    var rangeArr = rangeStr?.split('-');
    // consoleLog('getSensorRange rangeArr==>', rangeArr);
    if (rangeArr && Array.isArray(rangeArr) && rangeArr.length == 2) {
      result = {min: Number(rangeArr[0]), max: Number(rangeArr[1]), step: 1};
      // consoleLog('getSensorRange result==>', result);
    }
  }
  // consoleLog('getSensorRange result2==>', result);

  return result;
};
