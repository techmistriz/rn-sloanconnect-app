import {base64EncodeDecode, consoleLog} from 'src/utils/Helpers/HelperFunction';

export const getFlushTypeType = (
  characteristicMain: any,
  deviceStaticDataMain: any,
) => {
  var result = '0';
  var decodedValue = base64EncodeDecode(characteristicMain?.value, 'decode');

  // consoleLog("decodedValue", decodedValue);
  if (
    decodedValue &&
    typeof deviceStaticDataMain?.valueMapped != 'undefined' &&
    typeof deviceStaticDataMain?.valueMapped?.[decodedValue] != 'undefined'
  ) {
    // result = deviceStaticDataMain?.valueMapped[decodedValue];
    result = decodedValue;
  }
  return result;
};

export const getFlushTypeValue = (characteristicRight: any) => {
  return base64EncodeDecode(characteristicRight?.value, 'decode');
};
