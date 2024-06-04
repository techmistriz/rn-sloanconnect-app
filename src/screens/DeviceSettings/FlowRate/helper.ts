import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {
  BLEDevice,
  BLEService,
  BLECharacteristic,
  DeviceStaticData,
} from 'src/utils/GlobalTypes';
import {FlowRateRangeProps} from './types';
import {
  arrayRange,
  createNameValueArray,
  mapAsString,
} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

export const getFlowRateType = (
  characteristicMain: BLECharacteristic,
  deviceStaticDataMain: DeviceStaticData,
) => {
  var result = '0';
  var decodedValue = base64EncodeDecode(characteristicMain?.value, 'decode');

  // consoleLog("decodedValue", decodedValue);
  if (
    decodedValue &&
    typeof deviceStaticDataMain?.valueMapped &&
    typeof deviceStaticDataMain?.valueMapped?.[decodedValue] != 'undefined'
  ) {
    // result = deviceStaticDataMain?.valueMapped[decodedValue];
    result = decodedValue;
  }
  return result;
};

export const getFlowRateValue = (characteristicRight: BLECharacteristic) => {
  return base64EncodeDecode(characteristicRight?.value, 'decode');

  var value = Number(
    base64EncodeDecode(characteristicRight?.value, 'decode') ?? 0,
  );
  value = value / 10;
  // consoleLog('getFlowRateValue', value);
  return value?.toString();
};

export const getFlowRateRangeGen1 = () => {
  return createNameValueArray(['13', '19', '38', '57', '83', '0']);
};

export const getFlowRateRange = (deviceStaticDataMain: DeviceStaticData) => {
  var flowRange: FlowRateRangeProps = {min: 20, max: 80};
  var rangeStr = deviceStaticDataMain?.range;
  // consoleLog('getFlowRateRange rangeStr==>', rangeStr);
  if (rangeStr) {
    var rangeArr = rangeStr?.split('-');
    // consoleLog('getFlowRateRange rangeArr==>', rangeArr);
    if (rangeArr && Array.isArray(rangeArr) && rangeArr.length == 2) {
      flowRange = {min: Number(rangeArr[0]), max: Number(rangeArr[1])};
      // consoleLog('getFlowRateRange flowRange==>', flowRange);
    }
  }

  const flowRangeArr = arrayRange(flowRange.min, flowRange.max, 10);
  if (!flowRangeArr.includes(flowRange.max)) {
    flowRangeArr.push(flowRange.max);
  }
  const flowRangeNameValueStringArr = mapAsString(flowRangeArr);

  const flowRangeNameValueArr = createNameValueArray(
    flowRangeNameValueStringArr,
  );
  // consoleLog(
  //   'getFlowRateRange flowRangeNameValueArr==>',
  //   flowRangeNameValueArr,
  // );
  return flowRangeNameValueArr;
};

export const getCalculatedValue = (
  value: string,
  __flowRateTypeDivider: number = 10,
  flowRateType: string,
  other: string,
) => {
  if (parseInt(value) == 0) {
    if (other) {
      value = other;
    } else {
      return 'Other';
    }
  }

  consoleLog('getCalculatedValue value==>', value);
  var result: number | string = 0;
  const GPMFormula = BLE_CONSTANTS.COMMON.GMP_FORMULA;
  const valueInNumber = Number(value);
  result = valueInNumber / __flowRateTypeDivider;

  if (flowRateType == '0') {
    result = result / GPMFormula;
  }
  result = result?.toFixed(2);
  
  if (flowRateType == '1') {
    return toFixedWithoutZeros(parseFloat(result), 2);
  }
  // result = Math.round(result * 10) / 10;
  // result = Math.round((result + Number.EPSILON) * 100) / 100;
  // result = Math.round( result * 100 + Number.EPSILON ) / 100
  // var p = Math.pow(10, 2);
  // result = Math.round(result * p) / p;
  // return Math.round(3.4 * 10) / 10;
  const resultArr = result.split('.');
  const decimalPartArr = resultArr[1].split('');
  // consoleLog('getCalculatedValue decimalPartArr==>', decimalPartArr);
  let difference = 0;
  if (parseInt(decimalPartArr[1]) > 2 && parseInt(decimalPartArr[1]) < 5) {
    difference = 1;
  } else if (
    parseInt(decimalPartArr[1]) > 0 &&
    parseInt(decimalPartArr[1]) < 5
  ) {
    difference = -1;
  } else if (
    parseInt(decimalPartArr[1]) > 5 &&
    parseInt(decimalPartArr[1]) <= 9
  ) {
    difference = 1;
  }
  // consoleLog('getCalculatedValue difference==>', difference);
  let final = parseFloat(
    `${resultArr[0]}.${parseInt(resultArr[1]) + difference}`,
  );
  // consoleLog('getCalculatedValue final==>', final);
  return toFixedWithoutZeros(final, 2);
};

const toFixedWithoutZeros = (num: number, precision: number) => {
  let result = `${Number.parseFloat(num.toFixed(precision))}`;
  if (result?.split('.')?.length == 1) {
    result = `${result}.0`;
  }
  return result;
};
