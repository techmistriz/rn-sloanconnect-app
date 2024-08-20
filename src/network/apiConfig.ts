import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {constants} from 'src/common';

/**
 * Error code found in app
 */
const errorCodes = {
  TIMEOUT: 111,
  NOTFOUNDCODE: 404,
  SERVERERRORCODE: 500,
  TOKENEXPIRECODE: 401,
  BLOCK_USER_CODE_BY_ADMIN: 403,
  LOWER_APP_VERSION_CODE: 304,
};

/**
 * api header related data
 */
const apiHeaderData = {
  device_type: constants.isIOS ? 'iOS' : 'Android',
  app_system_version: DeviceInfo.getSystemVersion(),
  app_install_time: DeviceInfo.getFirstInstallTimeSync(),
  app_version: DeviceInfo.getVersion(),
  app_build_number: DeviceInfo.getBuildNumber(),
  language: 'en',
  device_id: DeviceInfo.getUniqueId(),
  default_auth_token:
    '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#SLOAN',
  device_token:
    'cdM92ZwXwUedvpfsPyUErR:APA91bGnnBtY8yAzviXw0TdJESND8la-Ajhdhurj7K5_EYKI7MnROU1OltjHU21_L-lgb5fIvaoQjna0Wotx4ubN71SAFy6fztGRwVuDqLMOR1UNz-YuNcEt_1HS0fgtSF5fN9brCRhp',
};

/**
 * all url used in app
 */

const apiUrl = {
  localServerURL: `${constants.BASE_URL_LOCAL}api/v1/`,
  localServerAssetsURL:
    'http://192.168.206.25/kays/webs/example-web/uploads/',
  localSocketEndPoint: '',
  liveServerURL: `${constants.BASE_URL_LIVE}api/v1/`,
  liveSocketEndPoint: '',
  refresh_token: '',
  privacyPolicyUrl: 'https://example.com/privacy',
  termsAndConditionUrl: 'https://example.com/terms',
  cancelSubscribtionUrlForIos: 'https://example.com/cancel-ios-IAP',
  cancelSubscribtionUrlForAndroid: 'https://example.com/cancel-android-IAP',
  switchPlanUrlForIos: 'https://example.com/switch-paln-ios',
  serverURL: constants.API_URL,
  serverAssetsURL: constants.ASSETS_URL,
};

/**
 * api related configuration set
 */
const apiConfigs = {
  ...errorCodes,
  ...apiUrl,
  ...apiHeaderData,
};

export default apiConfigs;
