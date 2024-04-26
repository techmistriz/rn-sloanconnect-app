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

export const getFlowRateRangeGen1 = (
  deviceStaticDataMain: DeviceStaticData,
) => {
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
  var result: number = 0;
  const GMPFormula = 3.78541;
  const valueInNumber = Number(value);
  result = valueInNumber / __flowRateTypeDivider;

  if (flowRateType == '0') {
    result = result / GMPFormula;
  }
  return result?.toFixed(1);
};
