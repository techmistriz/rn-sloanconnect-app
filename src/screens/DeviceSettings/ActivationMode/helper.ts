import {base64EncodeDecode, consoleLog} from 'src/utils/Helpers/HelperFunction';

export const getActivationModeType = (
  characteristic: any,
  deviceStaticData: any,
) => {
  var result = '0';
  var decodedValue = base64EncodeDecode(characteristic?.value, 'decode');
  if (
    decodedValue &&
    typeof deviceStaticData?.valueMapped != 'undefined' &&
    typeof deviceStaticData?.valueMapped?.[decodedValue] != 'undefined'
  ) {
    // result = deviceStaticData?.valueMapped[decodedValue];
    result = decodedValue;
  }
  return result;
};

export const getActivationModeValue = (characteristic: any) => {
  return base64EncodeDecode(characteristic?.value, 'decode');
};
