import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {base64EncodeDecode, decimalToHex} from 'src/utils/Helpers/encryption';

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

// export const mapValueGen2 = (WRITE_DATA_MAPPING: any, value: any) => {
//   // consoleLog('mapValueGen2 WRITE_DATA_MAPPING==>', WRITE_DATA_MAPPING);
//   // consoleLog('mapValueGen2 value==>', value);
//   // consoleLog('mapValueGen2 decimalToHex==>', decimalToHex(value, 16, 8));
//   const hex = decimalToHex(value, 16, 8);
//   var hexReplaced = WRITE_DATA_MAPPING.replace(/ACTUAL_VALUE/gi, hex);
//   hexReplaced = hexReplaced.replace(/\|/gi, '');
//   consoleLog('mapValueGen2 hexReplaced==>', hexReplaced);

//   return hexReplaced;
// };

// function decimalToHex(d: any, padding: number) {
//   var hex = Number(d).toString(16);
//   padding =
//     typeof padding === 'undefined' || padding === null
//       ? (padding = 2)
//       : padding;

//   while (hex.length < padding) {
//     hex = '0' + hex;
//   }

//   return hex;
// }
