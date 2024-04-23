import {
  base64ToHex,
  decimalToHex,
  fromHexStringUint8Array,
  getTimestampInSeconds,
  hexEncodeDecode,
} from 'src/utils/Helpers/encryption';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {BLEService} from 'src/services';
import {sha256Bytes} from 'react-native-sha256';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

export const intiGen2SecurityKey = async () => {
  const SERVER_KEY = BLE_CONSTANTS?.GEN2?.SERVER_KEY;
  consoleLog('intiGen2SecurityKey SERVER_KEY==>', toHexString(SERVER_KEY));
  const SITE_ID_SERVICE_UUID = BLE_CONSTANTS?.GEN2?.SITE_ID_SERVICE_UUID;
  const SITE_ID_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.SITE_ID_CHARACTERISTIC_UUID;

  // SiteID Key
  const SITE_ID_HEX_FAKE = '2AAD580558ED451D813532D71DEA7F23';
  const siteIDResponse = await BLEService.readCharacteristicForDevice(
    SITE_ID_SERVICE_UUID,
    SITE_ID_CHARACTERISTIC_UUID,
  );

  // intiGen2SecurityKey SiteIDResult==> Kq1YBVjtRR2BNTLXHep/Iw==
  // consoleLog('intiGen2SecurityKey SiteIDResult==>', siteIDResponse?.value);
  var siteIdHex: string;

  if (siteIDResponse?.value) {
    siteIdHex = base64ToHex(siteIDResponse?.value);
  } else {
    siteIdHex = SITE_ID_HEX_FAKE;
  }

  // var siteIdUint8ArrayMock = [
  //   0x2a, 0xad, 0x58, 0x05, 0x58, 0xed, 0x45, 0x1d, 0x81, 0x35, 0x32, 0xd7,
  //   0x1d, 0xea, 0x7f, 0x23,
  // ];
  // var siteIdUint8Array = new Uint8Array(siteIdUint8ArrayMock);

  // console.log('intiGen2SecurityKey siteIdHex==>', siteIdHex);
  var siteIdUint8Array = fromHexStringUint8Array(siteIdHex);
  console.log(
    'intiGen2SecurityKey siteIdUint8Array==>',
    toHexString(siteIdUint8Array),
  );

  // Master Key
  const MASTER_KEY_SERVICE_UUID = BLE_CONSTANTS?.GEN2?.MASTER_KEY_SERVICE_UUID;
  const MASTER_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.MASTER_KEY_CHARACTERISTIC_UUID;
  const masetrKeyResponse = await BLEService.readCharacteristicForDevice(
    MASTER_KEY_SERVICE_UUID,
    MASTER_KEY_CHARACTERISTIC_UUID,
  );
  // consoleLog(
  //   'intiGen2SecurityKey readCharacteristicForDevice==>',
  //   readCharacteristicForDevice?.value,
  // );

  const masterKeyHex = base64ToHex(masetrKeyResponse?.value);
  // consoleLog('intiGen2SecurityKey masterKeyHex==>', masterKeyHex);
  var masterKeyUint8Array = fromHexStringUint8Array(masterKeyHex);

  // var masterKeyHexMock = [
  //   0x20, 0xe1, 0x70, 0x12, 0x70, 0x54, 0x86, 0xff, 0xeb, 0x13, 0x53, 0x3e,
  //   0xe7, 0x2c, 0xee, 0xe0, 0x55, 0x48, 0x60, 0x61, 0x95, 0x48, 0x92, 0x6e,
  //   0x0d, 0x5f, 0xda, 0x6f, 0x8a, 0xa3, 0xd0, 0xd2,
  // ];
  // var masterKeyUint8Array = new Uint8Array(masterKeyHexMock);

  console.log(
    'intiGen2SecurityKey masterKeyUint8Array==>',
    toHexString(masterKeyUint8Array),
  );

  // Timestamp
  var timestamp = getTimestampInSeconds();
  // consoleLog('intiGen2SecurityKey timestamp==>', timestamp);

  var timestampHex = decimalToHex(timestamp);
  // consoleLog('intiGen2SecurityKey timestampHex==>', timestampHex);

  var timestampUint8Array = fromHexStringUint8Array(timestampHex);

  // var timestampHexMock = [0x66, 0x1e, 0xa6, 0xdf];
  // var timestampUint8Array = new Uint8Array(timestampHexMock);

  console.log(
    'intiGen2SecurityKey timestampUint8Array==>',
    toHexString(timestampUint8Array),
  );

  // const tmp_session = [
  //   0x17, 0xa0, 0x8f, 0x02, 0x8f, 0x50, 0xfc, 0x1d, 0x34, 0x02, 0xac, 0x3e,
  //   0x98, 0x2c, 0x35, 0xe0, 0x0a, 0x29, 0x17, 0x60, 0x6b, 0x48, 0xcd, 0x6a,
  //   0xba, 0x47, 0x00, 0x48, 0x65, 0xa1, 0x9f, 0x40,
  // ];

  // const tmpSHA = [
  //   0x0a, 0x14, 0x4d, 0xe0, 0x20, 0xec, 0xcc, 0x04, 0x46, 0xd5, 0x94, 0x7e,
  //   0xbc, 0xf4, 0xa7, 0x40, 0x31, 0x17, 0x84, 0x2e, 0xa1, 0x26, 0x7f, 0x29,
  //   0xe6, 0x53, 0xf7, 0x02, 0x41, 0x7e, 0x4e, 0xb6,
  // ];
  // console.log('intiGen2SecurityKey tmp_session==>', tmp_session);
  // console.log('intiGen2SecurityKey tmpSHA==>', tmpSHA);

  // var sessionUintArrayTmpBytes = Array.from(tmp_session);
  // var sessionUintArrayTmpBytesSHA = await sha256Bytes(
  //   sessionUintArrayTmpBytes,
  // );
  // var sessionUintArraySHA = fromHexStringUint8Array(
  //   sessionUintArrayTmpBytesSHA,
  // );
  // console.log('intiGen2SecurityKey sha256Bytes==>', sessionUintArraySHA);

  const sessionKeyNew = await generateSessionKey(
    timestampUint8Array,
    SERVER_KEY,
    masterKeyUint8Array,
    siteIdUint8Array,
    true,
  );
  console.log('intiGen2SecurityKey sessionKeyNew==>', sessionKeyNew);

  // const __sessionKeyDecArr1 = [
  //   102, 35, 88, 156, 88, 156, 35, 102, 9, 154, 173, 239, 88, 95, 49, 202,
  //   169, 255, 122, 187, 101, 87, 198, 146, 116, 140, 68, 2, 54, 228, 130, 31,
  //   228, 163, 246, 198, 1,
  // ];

  // const __sessionKeyDecArr = [
  //   166, 223, 30, 102, 10, 20, 77, 224, 32, 236, 204, 4, 70, 213, 148, 126,
  //   188, 244, 167, 64, 49, 23, 132, 46, 161, 38, 127, 41, 230, 83, 247, 2, 65,
  //   126, 78, 182, 1,
  // ];

  // const __sessionKeyDecArrUint8Array = new Uint8Array(sessionKeyNew);
  // consoleLog('intiGen2SecurityKey __sessionKeyDecArr==>', __sessionKeyDecArr);
  // consoleLog(
  //   'intiGen2SecurityKey __sessionKeyDecArrUint8Array==>',
  //   __sessionKeyDecArrUint8Array,
  // );

  const SESSION_KEY_SERVICE_UUID =
    BLE_CONSTANTS?.GEN2?.SESSION_KEY_SERVICE_UUID;
  const SESSION_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.SESSION_KEY_CHARACTERISTIC_UUID;

  await BLEService.writeCharacteristicWithResponseForDevice2(
    SESSION_KEY_SERVICE_UUID,
    SESSION_KEY_CHARACTERISTIC_UUID,
    sessionKeyNew,
  );

  // Authorization Key
  const AUTHORIZATION_KEY_SERVICE_UUID =
    BLE_CONSTANTS?.GEN2?.AUTHORIZATION_KEY_SERVICE_UUID;
  const AUTHORIZATION_KEY_CHARACTERISTIC_UUID =
    BLE_CONSTANTS?.GEN2?.AUTHORIZATION_KEY_CHARACTERISTIC_UUID;
  const authorizationResponse = await BLEService.readCharacteristicForDevice(
    AUTHORIZATION_KEY_SERVICE_UUID,
    AUTHORIZATION_KEY_CHARACTERISTIC_UUID,
  );
  consoleLog(
    'intiGen2SecurityKey authorizationResponse==>',
    base64ToHex(authorizationResponse?.value),
  );
};

const generateSessionKey = async (
  timestampUint8Array: any,
  SERVER_KEY: any,
  masterKeyUint8Array: any,
  siteIdUint8Array: any,
  isProvision: boolean,
) => {
  //session_time is an unixtime from the App, which could also be extracted from session key
  var sessionTime = timestampUint8Array;
  // consoleLog('generateSessionKey sessionTime==>', sessionTime);
  // sessionTime[0] = timestampUint8Array[0];
  // sessionTime[1] = timestampUint8Array[1];
  // sessionTime[2] = timestampUint8Array[2];
  // sessionTime[3] = timestampUint8Array[3];

  var __sessionUintArray = new Uint8Array(37);

  // HOW TO GENERATE SESSION KEY
  var sessionUintArrayTmp = new Uint8Array(32); // temporary session key
  const MASTER_KEY_LEN = 32;

  // copy master_key to temporary session key
  for (let i = 0; i < 32; i++) {
    sessionUintArrayTmp[i] = masterKeyUint8Array[i];
  }

  consoleLog(
    'generateSessionKey sessionUintArrayTmp==>',
    toHexString(sessionUintArrayTmp),
  );

  // formulas to generate temporary session key before SHA256

  for (let i = 0; i < MASTER_KEY_LEN; i++) {
    if (i % 2 > 0) {
      sessionUintArrayTmp[i] &=
        (siteIdUint8Array[15 - Math.floor(i / 2)] & (sessionTime[i % 3] << 1)) |
        SERVER_KEY[i];
    } else {
      sessionUintArrayTmp[i] ^=
        siteIdUint8Array[15 - Math.floor(i / 2)] |
        (sessionTime[i % 3] >> 1) |
        SERVER_KEY[i];
    }
  }

  // console.log(
  //   'generateSessionKey sessionUintArrayTmp after formulas==>',
  //   toHexString(sessionUintArrayTmp),
  // );

  sessionUintArrayTmp[6] ^= sessionTime[2] >> 5;
  sessionUintArrayTmp[30] ^= sessionTime[0] << 3;
  sessionUintArrayTmp[26] &= sessionTime[1] >> 8;
  sessionUintArrayTmp[17] |= sessionTime[2] >> 2;
  sessionUintArrayTmp[15] &= sessionTime[3] << 4;
  sessionUintArrayTmp[20] |= sessionTime[0] >> 5;

  // perform SHA256 on the temporary session key
  console.log(
    'generateSessionKey sessionUintArrayTmp after formulas==>',
    toHexString(sessionUintArrayTmp),
  );

  var sessionUintArrayTmpBytes = Array.from(sessionUintArrayTmp);
  // console.log(
  //   'generateSessionKey sessionUintArrayTmpBytes==>',
  //   sessionUintArrayTmpBytes,
  // );

  var sessionUintArrayTmpBytesSHA = await sha256Bytes(sessionUintArrayTmpBytes);
  // console.log(
  //   'generateSessionKey sessionUintArrayTmpBytesSHA==>',
  //   sessionUintArrayTmpBytesSHA,
  // );

  var sessionUintArraySHA = fromHexStringUint8Array(
    sessionUintArrayTmpBytesSHA,
  );
  consoleLog(
    'generateSessionKey sessionUintArraySHA==>',
    toHexString(sessionUintArraySHA),
  );

  // build session key
  // add unix time
  __sessionUintArray[0] = sessionTime[2];
  __sessionUintArray[1] = sessionTime[3];
  __sessionUintArray[2] = sessionTime[1];
  __sessionUintArray[3] = sessionTime[0];

  // add SHA session key
  for (let i = 0; i < 32; i++) {
    __sessionUintArray[i + 4] = sessionUintArraySHA[i];
  }
  __sessionUintArray[36] = isProvision ? 1 : 0;
  // console.log('generateSessionKey __sessionUintArray==>', __sessionUintArray);
  return __sessionUintArray;
};

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join(' ');
}
