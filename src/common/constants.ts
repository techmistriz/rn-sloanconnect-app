import {Platform, Dimensions, StatusBar} from 'react-native';
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const statusBarHeight = isAndroid ? StatusBar?.currentHeight || 0 : 0;
const screenHeightCalc = isAndroid ? height - statusBarHeight : height;
const isLandscape = width > height;
const isPortrait = width < height;
const screenWidth = width;
const screenHeight = height;
const LIMIT = 20;
const activeOpacity = 0.5;
const APP_NAME = 'Sloan Connect App';
const COMPANY_NAME = '© Sloan Valve Company';
const COPYRIGHT_TEXT = 'All rights reserved';
const RELEASE_TEXT = 'Release On: May 13, 2024';
const PREFIX_SHARE_STRING = 'Sloan Connect App, ';
const BASE_DATE_TO_FORMAT = 'MM-DD-YYYY';
const BASE_DATE_TO_FORMAT2 = 'MMM Do YYYY';
const BASE_DATE_TO_FORMAT3 = 'MM-DD-YY';
const BASE_DATE_TIME_TO_FORMAT = 'MM-DD-YYY hh:mm A';
const BASE_DATE_FROM_FORMAT = 'YYYY-MM-DD';
const BASE_DATE_TIME_FROM_FORMAT = 'YYYY-MM-DD HH:mm';

const ANDROID_APP_LINK =
  'https://play.google.com/store/apps/details?id=app.appID&pli=1';
const ANDROID_APP_VERSION = '1.0.5';
const IOS_APP_LINK =
  'https://play.google.com/store/apps/details?id=app.appID&pli=1';
const IOS_APP_VERSION = '1.0.5';
const APP_VERSION = isAndroid ? ANDROID_APP_VERSION : IOS_APP_VERSION;
const BASE_URL_LOCAL = 'http://192.168.42.225/';
const BASE_URL_LIVE = 'https://console.radiobridge.com/api/visualization/';
const BASE_URL = __DEV__ ? BASE_URL_LIVE : BASE_URL_LIVE;
const API_URL = `${BASE_URL}v1/`;
const ASSETS_URL_SERVER = `${BASE_URL}uploads/`;
const UPLOAD_MEDIUM = 'server';
const ASSETS_URL = ASSETS_URL_SERVER;
const TERMS_CONDITIONS_LINK =
  'http://www.sloanconnectapp.com/terms-conditions.html';
const PRIVACY_POLICY_LINK =
  'http://www.sloanconnectapp.com/privacy-policy.html';

/**
 * common constants used in app for different purpose
 */
const common = {
  isLandscape,
  isPortrait,
  IOS_APP_LINK,
  screenWidth,
  screenHeight,
  screenHeightCalc,
  isIOS,
  isAndroid,
  activeOpacity,
  APP_NAME,
  PREFIX_SHARE_STRING,
  BASE_DATE_TO_FORMAT,
  BASE_DATE_FROM_FORMAT,
  ANDROID_APP_LINK,
  ANDROID_APP_VERSION,
  API_URL,
  ASSETS_URL,
  ASSETS_URL_SERVER,
  IOS_APP_VERSION,
  APP_VERSION,
  BASE_URL_LOCAL,
  BASE_URL_LIVE,
  LIMIT,
  TERMS_CONDITIONS_LINK,
  PRIVACY_POLICY_LINK,
  BASE_DATE_TIME_TO_FORMAT,
  BASE_DATE_TIME_FROM_FORMAT,
  BASE_DATE_TO_FORMAT2,
  BASE_DATE_TO_FORMAT3,
  UPLOAD_MEDIUM,
  COMPANY_NAME,
  COPYRIGHT_TEXT,
  RELEASE_TEXT,
};

/**constants used in app */
const constants = {
  ...common,
};

export default constants;
