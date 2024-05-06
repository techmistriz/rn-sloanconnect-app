import base64 from 'react-native-base64';
import {isObjectEmpty} from './array';
import {consoleLog} from './HelperFunction';

/**
 *
 * @param {*} str
 * function which convert First character into Capital letter of String
 */
export function base64EncodeFromByteArray(byteArray: Uint8Array) {
  return base64.encodeFromByteArray(byteArray);
}

/**
 *
 * @param {*} str
 * function which convert First character into Capital letter of String
 */
export function base64EncodeDecode(
  str: string | null,
  type: 'encode' | 'decode' = 'encode',
) {
  if (!str) return '';
  return type == 'encode' ? base64.encode(str) : base64.decode(str);
}

/**
 * Function to convert a base 64 encoded string to hex
 *
 * @param {string} encodedString Base 64 encoded string
 * @return {number} Decode (in decimal) string
 */
export const base64ToHex = (encodedString: string | any) => {
  if (!encodedString) return encodedString;
  var result = hexEncodeDecode(base64EncodeDecode(encodedString, 'decode'));
  return result;
};

/**
 * Function to convert a base 64 encoded string to hex
 *
 * @param {string} encodedString Base 64 encoded string
 * @return {number} Decode (in decimal) string
 */
export function __base64ToHex(encodedString: string | any) {
  if (!encodedString) return encodedString;
  var raw = base64ToText(encodedString);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toUpperCase();
}

/**
 * Function to convert a base 64 encoded string to decimal
 *
 * @param {string} encodedString Base 64 encoded string
 * @return {number} Decode (in decimal) string
 */
export const base64ToDecimal = (encodedString: any) => {
  // Convert base 64 encoded string to text
  var text = base64ToText(encodedString);
  // consoleLog('base64ToDecimal text==>', text);
  return hexToDecimal(text);
  // var decimalArray = [];

  // Run a loop on all characters of the text and convert each character to decimal
  // for (var i = 0; i < text.length; i++) {
  //   decimalArray.push(text.charAt(i).charCodeAt(0));
  // }

  // Join all decimals to get the final decimal for the entire string
  // return parseInt(decimalArray.join(''));
};

/**
 * Function to convert a base 64 encoded string to text
 *
 * @param {string} encodedString Base 64 encoded string
 * @return {number} Decode (in decimal) string
 */
export const base64ToText = (encodedString: string | any) => {
  if (!encodedString) return '';
  return base64.decode(encodedString);
};

/**
 * Function to convert a hex string to decimal
 *
 * @param {string} str Base 64 encoded string
 * @param {string} type Base 64 encoded string
 * @return {any} Decode (in decimal) string
 */
export function hexEncodeDecode(
  str: string | null,
  type: 'encode' | 'decode' | 'decodeSpecial' = 'encode',
  base = 16,
) {
  if (!str) return '';
  return type == 'encode'
    ? str
        .split('')
        .map(c => c.charCodeAt(0).toString(base).padStart(2, '0'))
        .join('')
    : type == 'decodeSpecial'
    ? str
        .split(' ')
        .filter(p => !!p)
        .map(c => parseInt(c, base))
        .join(' ')
    : str
        .split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, base)))
        .join('');
}

/**
 * Function to convert a hex string to decimal
 *
 * @param {string} encodedString Base 64 encoded string
 * @return {number} Decode (in decimal) string
 */
export const hexToDecimal = (hex: any, base: number = 16) => {
  if (!hex) return hex;
  return parseInt(hex, base);
};

/**
 * Function to convert a hex string to decimal
 *
 * @param {string} encodedString decimal string
 * @param {string} base
 * @return {any} Decode (in decimal) string
 */
export const decimalToHex = (encodedString: any, base: number = 16) => {
  if (!encodedString) return encodedString;
  return encodedString.toString(base);
};

/**
 * Function to get unixTimestamp in microseconds
 *
 * @return {number} unixTimestamp
 */
export function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Function to get unixTimestamp in seconds
 *
 * @return {number} unixTimestamp
 */
export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Function to add space at every n chars
 * @param {string} str
 * @param {number} n
 * @param {string} separator
 * @return {string}
 */
export function addSeparatorInString(str: string, n: number, separator = ' ') {
  if (!str) return str;
  var a = [],
    start = 0;
  while (start < str.length) {
    a.push(str.slice(start, start + n));
    start += n;
  }
  return a.join(separator);
}

/**
 * Function to add space at every n chars
 * @param {string} str
 * @param {number} length
 * @return {string}
 */
// export function mapUint8Array(str: string, length: number) {
//   const result = new Uint8Array(length);
//   if (typeof str != 'undefined' && str) {
//     var array1 = str.split(' ');
//     if (
//       typeof array1 != 'undefined' &&
//       Array.isArray(array1) &&
//       array1.length >= length
//     ) {
//       for (let i = 0; i < length; i++) {
//         result[i] = parseInt(array1[i]);
//       }
//     }
//   }

//   return result;
// }

/**
 * Function to convert hex to string
 * @param {any} hexString
 * @return {string}
 */

export const fromHexStringUint8Array = (hexString: any, base = 16) => {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, base)),
  );
};

export function toHexString(byteArray: any) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join(' ');
}
