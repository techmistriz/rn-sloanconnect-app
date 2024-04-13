import {Alert, Linking, Platform, Share, ToastAndroid} from 'react-native';
import {constants} from '../../common';
import moment from 'moment';
import {
  showMessage,
  hideMessage,
  MessageType,
} from 'react-native-flash-message';
import {useCallback} from 'react';
import base64 from 'react-native-base64';
import {sha256, sha256Bytes} from 'react-native-sha256';

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 *************************Common****************************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @param {*} message
 * Show simple alert
 */
export const useDebounce = (
  inputFunction: (...args: any[]) => void,
  delay: number,
) => {
  let isInitialCall = true;
  let timeout: any;

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timeout) clearTimeout(timeout);

      if (isInitialCall) {
        inputFunction.apply(this, args);
        isInitialCall = false;
      } else timeout = setTimeout(() => inputFunction.apply(this, args), delay);
    },
    [inputFunction, delay],
  );

  return debouncedFunction;
};

/**
 *
 * @returns random number
 */
export function getRandomNumber() {
  return Math.floor(Math.random() * 1000000);
}

/**
 *
 * @returns random string
 */
export const phoneCall = (phone: string) => () => {
  if (phone == '' || phone == null) {
    Alert.alert('INFO', 'Hospital phone number is missing.');
    return false;
  }

  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }

  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Dial support not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

/**
 *
 * @returns random string
 */
export const openUrl = (url: string) => {
  if (!url) {
    Alert.alert('INFO', 'Url is missing.');
    return false;
  }
  return Linking.openURL(url);

  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Browser support not available');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => console.log(err));
};

/**
 *
 * @returns random string
 */

export const onShare = async (_message: string = 'OUTER BOUT MY DAY app') => {
  try {
    const result = await Share.share({
      message: _message,
    });

    consoleLog('onShare result==>', result);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    consoleLog('onShare error:', error);
  }
};

/**
 *
 * @returns random string
 */
export const getMapDirection =
  (lat: number = 0, long: number = 0, user: any = null) =>
  () => {
    if (lat == 0 || long == 0) {
      Alert.alert('INFO', 'Map address missing.');
      return false;
    }

    if (user == '' || user == null) {
      Alert.alert('INFO', 'User google address not found.');
      return false;
    }

    if (
      typeof user?.latitude == 'undefined' ||
      user?.latitude == null ||
      user?.latitude == '' ||
      typeof user?.longitude == 'undefined' ||
      user?.longitude == null ||
      user?.longitude == ''
    ) {
      Alert.alert('INFO', 'Your coordinates missing.');
      return false;
    }

    var my_lat = user?.latitude ? user?.latitude : 0;
    var my_long = user?.longitude ? user?.longitude : 0;

    let map_url =
      'https://www.google.co.in/maps/dir/' +
      my_lat +
      ',' +
      my_long +
      '/' +
      lat +
      ',' +
      long +
      '/@' +
      lat +
      ',' +
      long +
      ',12z/data=!4m2!4m1!3e0?hl=en';

    Linking.canOpenURL(map_url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Map not supported');
        } else {
          return Linking.openURL(map_url);
        }
      })
      .catch(err => console.log(err));
  };

/**
 * @param {*} src
 * @returns string | any
 */
export function getImgSource<ImageSourcePropType>(src: string) {
  let imgSource;

  if (typeof src === 'number') {
    // static/local image
    return src;
  }

  if (typeof src === 'string') {
    // network image
    imgSource = {uri: src};
  }
  // consoleLog('imgSource', imgSource);
  return imgSource;
}

/**
 * @returns string | any
 */
export function assetsBaseUrl() {
  return constants.ASSETS_URL_SERVER;
}

/**
 *
 * @returns random string
 */
export const getResponsiveFontSize = (
  size: number | undefined,
  appFontSize: number,
) => {
  let userSize = appFontSize;
  if (size && size > 14) {
    userSize = appFontSize + (size - 14);
  }
  if (size && size < 14) {
    userSize = appFontSize - (14 - size);
  }
  return userSize;
};

export const consoleLog = (
  param1: any,
  param2: any = '',
  type: string = 'log',
) => {
  if (!__DEV__) {
    return;
  }
  if (type == 'warn') {
    return console.warn(param1, param2);
  }

  console.log(param1, param2);
};

/**
 *
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @returns distance from lat-long
 */
export function getDistanceFromLatLonInKm(
  lat1: any,
  lon1: any,
  lat2: any,
  lon2: any,
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

/**
 *
 * @param {*} deg
 * @returns radion from degree
 */
export function deg2rad(deg: any) {
  return deg * (Math.PI / 180);
}
/**
 *
 * @param {*} deg
 * @returns radion from degree
 */
export function encodeAsQueryString(obj: any) {
  return Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

export const urlParser = (url: string) => {
  return url
    .slice(url.indexOf('?') + 1)
    .split('&')
    .reduce((a, c) => {
      let [key, value] = c.split('=');
      a[key] = value;
      return a;
    }, {});
};

export const timestampInSec = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 *************************String****************************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @returns random string
 */
export const getFileName = (string: string) => {
  // file:///storage/emulated/0/Android/data/com.enquiryapp/files/Pictures/efbd823f-0fad-4139-b449-dda0f5c578ae.jpg
  var filename = string.substring(string.lastIndexOf('/') + 1);
  return filename;
};

/**
 *
 * @param {*} filename
 * return extention of Any kind of file
 */
export const getFileExtension = async (filename: any) => {
  const response = filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  return response;
};

/**
 *
 * @returns random string
 */
export function getRandomString() {
  return Math.floor(Math.random() * 1000000).toString();
}

/**
 *
 * @param {*} str
 * function which convert First character into Capital letter of String
 */
export function convetCapital(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 *
 * @param {*} str
 * function which convert First character into Capital letter of String
 */
export function shortName(str: string) {
  var avatarName = '';
  const userName = str || '';
  const name = userName.toUpperCase().split(' ');
  if (name.length === 1) {
    avatarName = `${name[0].charAt(0)}`;
  } else if (name.length > 1) {
    avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
  } else {
    avatarName = 'N/A';
  }
  return avatarName;
}

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 *************************Alert****************************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const showToastMessage = (
  message: string,
  type: MessageType = 'danger',
  description?: string,
) => {
  // ToastAndroid.show(message, ToastAndroid.SHORT);
  showMessage({
    message: message,
    type: type,
    description: description,
  });
};

/**
 *
 * @param {*} message
 * Show simple alert
 */
export function showSimpleAlert(message: string) {
  Alert.alert(constants.APP_NAME, message, [{text: 'OK', onPress: () => {}}], {
    cancelable: false,
  });
}

/**
 *
 * @param {*} message
 * Show simple alert
 */
export const showAlert = (
  title: string = '',
  message?: string,
  button: any = null,
) => {
  if (title && button) {
    Alert.alert(title, message, [{text: 'OK'}]);
  } else if (title) {
    Alert.alert(title, message);
  } else {
    Alert.alert(message || '');
  }
};

/**
 *
 * @param {*} message
 * Show simple alert
 */
export function showConfirmAlert(message: string) {
  return new Promise((resolve, reject) => {
    Alert.alert(constants.APP_NAME, message, [
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
          resolve(false);
        },
        style: 'cancel',
      },
      {
        text: 'Yes, Please',
        onPress: () => {
          console.log('OK Pressed');
          resolve(true);
        },
      },
    ]);
  });
}

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 *************************Validation************************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 * @param string
 * check email is valid or not
 */
export function validationAlert(errors: any) {
  if (!errors) return;
  const keys = Object.keys(errors);
  const latestErrorIndex = keys.findIndex(key => !!errors[key]);
  if (latestErrorIndex === -1) return;
  // notifications.alert({message: errors[keys[latestErrorIndex]]});
}

/**
 * @param string
 * check email is valid or not
 */
export function isValidEmail(string: string): boolean {
  string = string.replace(/\s/g, '');
  // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const reg =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reg.test(string) === true) {
    return true;
  }
  return false;
}

/**
 * @param string
 * check email is valid or not
 */
export function isValidPassword(string: string) {
  string = string.replace(/\s/g, '');
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  const mediumRegex = new RegExp(
    "r'(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!% *?&]{6,18})';",
  );

  const strongRegex = new RegExp(
    '^(?=.*[0-9].*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$',
  );

  if (strongRegex.test(string) === true) {
    return true;
  }
  return false;
}

/**
 *
 * @param {*} phone
 * @returns The phone is valid or not
 * @returns If phone is valid then true else false.
 */
export const validatePhone = (phone: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return phone && phone.length >= 8;
};

/**
 *
 * @param {*} password
 * @param {*} confirmPassword
 * @returns password are equals or not
 * If both passwords are then true else false
 */
export const bothPasswordEqual = (
  password: string,
  confirmPassword: string,
) => {
  return password === confirmPassword;
};

/**
 *
 * @param {*} mobile
 * @returns the number is valid or not
 *If number is valid @returns true else false
 */
export const validateNumber = (mobile: string) => {
  const regex = /^[0]?[789]\d{9}$/;
  return regex.test(mobile);
};

/**
 *
 * @param {*} password
 * @returns the @param password contains a number or not.
 * @returns if true if @param password contains a number else false.
 */
export const containsNumber = (password: string) => {
  const regex = /\d/;
  return regex.test(password);
};
/**
 *
 * @param {*} password
 * @returns password contains a char or not
 * If contains a char then @returns true else false
 */
export const containsUpperLowerChar = (password: string) => {
  const regex = /(?=.*[a-zA-Z])/;
  return regex.test(password);
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const containsSpecialChar = (password: string) => {
  const regex = /^(?=.*[!@#\$%\^\&*\)\(+=._-])/;
  return regex.test(password);
};

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 **********************Date Time Functions******************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseDateTimeInFormat = (
  date: any,
  format = 'YYYY-MM-DD HH:mm',
) => {
  var m = '';
  if (date instanceof Date) {
    m = moment(date).format(format);
  }
  return m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseDateHumanFormat = (
  date: any,
  format = constants.BASE_DATE_TO_FORMAT,
) => {
  // consoleLog("parseDateHumanFormat date==>", date);
  var m = '';
  if (!date) return '';
  if (date instanceof Date) {
    m = moment(date).format(format);
  } else {
    m = moment(date).format(format);
  }
  return m == 'Invalid date' ? 'N/A' : m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const getTimezone = () => {
  return 'EST';
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseTimeHumanFormat = (time: any) => {
  var m = '';

  if (!time) return '';
  if (time instanceof Date) {
    m = moment('2000-01-01 ' + time).format('hh:mm A');
  } else {
    m = moment('2000-01-01 ' + time).format('hh:mm A');
  }
  return m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseDateTimeHumanFormat = (date: any) => {
  var m = '';
  if (!date) return '';
  if (date instanceof Date) {
    m = moment(date).format('DD/MM/YYYY hh:mm A');
  } else {
    m = moment(date).format('DD/MM/YYYY hh:mm A');
  }
  return m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseDateSqlFormat = (date: any) => {
  var m = '';
  if (date instanceof Date) {
    m = moment(date).format('YYYY-MM-DD');
  }
  return m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const parseDateTimeSqlFormat = (date: any) => {
  var m = '';
  if (date instanceof Date) {
    m = moment(date).format('YYYY-MM-DD hh:mm:ss');
  }
  return m;
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const __timeSince = (date: any) => {
  return moment(date).fromNow();
};

/**
 *
 * @param {*} password
 * @returns password contains a special char or not
 * @returns true if contains a special char else false
 */
export const timeSince = (__date: any) => {
  var date = moment(__date);
  //here we were subtracting our date from current time which will be in milliseconds
  const dateDifferenceInTime =
    new Date().getTime() - new Date(date.toDate()).getTime();

  // conerting milli seconds to days
  // (1000 milliseconds * (60 seconds * 60 minutes) * 24 hours)
  const dateDifferenceInDays = dateDifferenceInTime / (1000 * 60 * 60 * 24);

  //After returning in particular formats as of our convinent
  if (dateDifferenceInDays < 1) {
    return moment(date.toDate()).format('LT'); // 10:04 am
  } else if (dateDifferenceInDays < 2) {
    return 'Yesterday'; // just YesterDay
  } else if (dateDifferenceInDays <= 7) {
    return moment(date.toDate()).format('dddd'); //like monday , tuesday , wednesday ....
  } else {
    return moment(date.toDate()).format(constants.BASE_DATE_TO_FORMAT3); // if it was more than a week before it will returns as like 05/23/2022
  }
};

/**
 * Age Calculate Function to help calculate age of user.
 */
export function calculate_age(dob1: any) {
  var today = new Date();
  var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
}

/**
 *
 * @param {*} birth_month
 * @param {*} birth_day
 * @param {*} birth_year
 * @returns User age based on birthdate
 */
export function get_age(birth_month: any, birth_day: any, birth_year: any) {
  let today_date = new Date();
  let today_year = today_date.getFullYear();
  let today_month = today_date.getMonth();
  let today_day = today_date.getDate();
  let age = today_year - birth_year;

  if (today_month < birth_month - 1) {
    age--;
  }
  if (birth_month - 1 == today_month && today_day < birth_day) {
    age--;
  }
  return age;
}

/**
 *
 * @param {*} time
 * @returns formatted time
 */
export function formatTimeString(time: any) {
  let msecs: any = time % 1000;
  if (msecs < 10) msecs = `00${msecs}`;
  else if (msecs < 100) msecs = `0${msecs}`;
  let seconds = Math.floor(time / 1000);
  let minutes = Math.floor(time / 60000);
  seconds = seconds - minutes * 60;
  let formatted;
  formatted = `${minutes < 10 ? 0 : ''}${minutes}:${
    seconds < 10 ? 0 : ''
  }${seconds}`;
  return formatted;
}

/**
 *
 * @param {*} time
 * @returns formatted time
 */
export function secondsToHmsFormatted(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
}

/**
 *
 * @param {*} time
 * @returns formatted time
 */
export const secondsToHms = (d: number) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + ':' : '';
  var mDisplay = m < 9 ? '0' + m + ':' : m + ':';
  var sDisplay = s < 9 ? '0' + s + '' : s + '';
  return hDisplay + mDisplay + sDisplay;
};

export const mmss = function (secs: number) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  minutes = minutes % 60;
  return pad(minutes) + ':' + pad(secs);
};

export const mmssss = function (milisecs: number) {
  var secs = Math.floor(milisecs / 1000);
  var minutes = Math.floor(secs / 60);
  var seconds = secs % 60;
  var miliseconds = Math.floor((milisecs % 1000) / 10);
  return pad(minutes) + ':' + pad(seconds) + ':' + pad(miliseconds);
};

const pad = function (num: number) {
  return ('0' + num).slice(-2);
};

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 *************************Image Functions*******************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @param {*} remoteImage
 * function which convert image into BASE64
 */
export const imageConvertTobase64 = async (remoteImage: string) => {
  // const fs = RNFetchBlob.fs;
  let imagePath = null;
  // return new Promise((resolve) => {
  //    RNFetchBlob.config({
  //       fileCache: true
  //    }).fetch("GET", remoteImage)
  //       .then(resp => {
  //          imagePath = resp.path();
  //          return resp.readFile("base64");
  //       }).then(base64Data => {
  //          resolve(base64Data)
  //       }).catch((error) => {
  //          console.log("Error Base64-->", error)
  //       });
  // })
};
