import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  Text,
  BackHandler,
  Alert,
} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  cleanCharacteristic,
  getBatteryLevel,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceModelData,
  getDeviceService,
  getSavedSettingsGen1,
  getTotalWaterUsase,
  hasFlowRateSetting,
  hasSensorRangeSetting,
  mapValue,
  saveSettings,
  updatePreviousSettings,
} from 'src/utils/Helpers/project';
import {
  addSpaceIntoString,
  base64EncodeDecode,
  base64EncodeFromByteArray,
  base64ToHex,
  base64ToText,
  decimalToHex,
  fromHexString,
  getTimestampInSeconds,
  hexEncodeDecode,
  hexToDecimal,
  mapUint8Array,
} from 'src/utils/Helpers/encryption';

import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';

import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import EmptyComponent from 'src/components/EmptyState';
import Loader from 'src/components/Loader';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import {
  connectedDeviceRequestAction,
  connectedDeviceSuccessAction,
  connectedDeviceFailureAction,
  deviceSettingsResetDataAction,
} from 'src/redux/actions';
import DeviceSettingList from 'src/components/@ProjectComponent/DeviceSettingList';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import AlertBox from 'src/components/AlertBox';
import {SETTINGS, TABS} from 'src/utils/StaticData/StaticData';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import Swiper from 'react-native-swiper';
import ActivationModeList from 'src/components/@ProjectComponent/DeviceSettingsList/ActivationModeList';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import FlowRateList from 'src/components/@ProjectComponent/DeviceSettingsList/FlowRateList';
import SensorRangeList from 'src/components/@ProjectComponent/DeviceSettingsList/SensorRangeList';
import LineFlushList from 'src/components/@ProjectComponent/DeviceSettingsList/LineFlushList';
import NotesList from 'src/components/@ProjectComponent/DeviceSettingsList/NotesList';
import LoaderOverlay from 'src/components/LoaderOverlay';
import LoaderOverlay2 from 'src/components/LoaderOverlay2';
import {CollapsableContainer} from 'src/components/CollapsableContainer';
import StorageService from 'src/services/StorageService/StorageService';
import {sha256, sha256Bytes} from 'react-native-sha256';
import {constants} from 'src/common';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  // const {referrer} = route?.params || {referrer: undefined};
  // const {device, status} = useSelector(
  //   (state: any) => state?.ConnectedDeviceReducer,
  // );
  // const [expanded, setExpanded] = useState(false);
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const [disconnectModal, setDisconnectModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [applying, setApplying] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [applyingLoadingText, setApplyingLoadingText] =
    useState<string>('Applying...');
  const [loadPreviosSettingsModal, setLoadPreviosSettingsModal] =
    useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<any>();
  const connectedDevice = BLEService.getDevice();
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const [totalWaterUsage, setTotalWaterUsage] = useState<number>(0);
  const [savedSettingsGen1, setSavedSettingsGen1] = useState<any>(0);

  /** component hooks method */
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        setDisconnectModal(true);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /** component hooks method */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      // consoleLog('DeviceDashboard focused');
      initlizeApp();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /** component hooks method */
  useEffect(() => {
    // initlizeAppGen2();
  }, []);

  const initlizeAppGen2 = async () => {
    const server_key = [
      0x37, 0x80, 0x80, 0xaf, 0x90, 0x30, 0x4a, 0x15, 0x5a, 0xe2, 0xd7, 0x3e,
      0x7d, 0xdb, 0x88, 0x7b, 0x55, 0x1d, 0x60, 0x64, 0x74, 0xff, 0x09, 0x22,
      0x95, 0xc3, 0x40, 0x80, 0xec, 0xb1, 0x64, 0x6c,
    ];
    const SiteIDServiceUUID = '438AF044-AF98-45F1-8B9F-5382B17559C0';
    const SiteIDCharUUID = '438AF044-AF98-45F1-8B9F-5382B17559CA';

    consoleLog('initlizeAppGen2 server_key==>', server_key);

    // const __siteIDTmp = '2AAD580558ED451D813532D71DEA7F24';
    // const siteIDResultWriteResponse =
    //   await BLEService.writeCharacteristicWithoutResponseForDevice(
    //     SiteIDServiceUUID,
    //     SiteIDCharUUID,
    //     __siteIDTmp,
    //   );

    //   // MkFBRDU4MDU1OEVENDUxRDgxMzUzMkQ3MURFQTdGMjQ=
    // consoleLog(
    //   'initlizeAppGen2 siteIDResultWriteResponse==>',
    //   JSON.stringify(siteIDResultWriteResponse),
    // );

    // SiteID Key
    const siteIDResult = await BLEService.readCharacteristicForDevice(
      SiteIDServiceUUID,
      SiteIDCharUUID,
    );

    // initlizeAppGen2 SiteIDResult==> Kq1YBVjtRR2BNTLXHep/Iw==
    consoleLog('initlizeAppGen2 SiteIDResult==>', siteIDResult?.value);
    var __siteID: any = '2AAD580558ED451D813532D71DEA7F23';

    if (siteIDResult?.value) {
      __siteID = base64ToHex(siteIDResult?.value);
    }

    console.log('initlizeAppGen2 __siteID==>', __siteID);
    var formattedSiteId = addSpaceIntoString(__siteID, 2);
    // console.log('initlizeAppGen2 formattedSiteId==>', formattedSiteId);
    // var decodedSiteId = hexEncodeDecode(formattedSiteId, 'decodeSpecial');

    // console.log('initlizeAppGen2 decodedSiteId==>', decodedSiteId);
    // var mappedSiteId = mapUint8Array(decodedSiteId, 16);
    var mappedSiteId = formattedSiteId.split(' ');
    // console.log('initlizeAppGen2 mappedSiteId==>', mappedSiteId);

    // Master Key
    const masterKeyServoiceUUID = '438AF044-AF98-45F1-8B9F-5382B17559C0';
    const masterKeyCharUUID = '438AF044-AF98-45F1-8B9F-5382B17559C2';
    const readCharacteristicForDevice =
      await BLEService.readCharacteristicForDevice(
        masterKeyServoiceUUID,
        masterKeyCharUUID,
      );
    // consoleLog(
    //   'initlizeAppGen2 readCharacteristicForDevice==>',
    //   readCharacteristicForDevice?.value,
    // );

    const __masterKey = base64ToHex(readCharacteristicForDevice?.value);
    consoleLog('initlizeAppGen2 __masterKey==>', __masterKey);

    var formattedMasterKey = addSpaceIntoString(__masterKey, 2);
    // consoleLog('initlizeAppGen2 formattedMasterKey==>', formattedMasterKey);

    // var decodedMasterKey = hexEncodeDecode(formattedMasterKey, 'decodeSpecial');
    // consoleLog('initlizeAppGen2 decodedMasterKey==>', decodedMasterKey);

    // var mappedMasterKey = mapUint8Array(decodedMasterKey, 32);
    var mappedMasterKey = formattedMasterKey.split(' ');
    // console.log('initlizeAppGen2 mappedMasterKey==>', mappedMasterKey);

    // Timestamp
    var __timestamp = getTimestampInSeconds();
    consoleLog('initlizeAppGen2 __timestamp==>', __timestamp);

    var hexTimestamp = decimalToHex(__timestamp);
    // consoleLog('initlizeAppGen2 hexTimestamp==>', hexTimestamp);

    var formattedTimestamp = addSpaceIntoString(hexTimestamp.toString(), 2);
    // consoleLog('initlizeAppGen2 formattedTimestamp==>', formattedTimestamp);

    var mappedTimestamp = formattedTimestamp.split(' ');
    // console.log('initlizeAppGen2 mappedTimestamp==>', mappedTimestamp);

    // const sessionKey = await generateSessionKey(
    //   mappedTimestamp,
    //   server_key,
    //   mappedMasterKey,
    //   mappedSiteId,
    // );
    // console.log('initlizeAppGen2 sessionKey==>', sessionKey);

    const __sessionKeyHexArrWrong = [
      0x37, 0x80, 0x80, 0xaf, 0x90, 0x30, 0x4a, 0x15, 0x5a, 0xe2, 0xd7, 0x3e,
      0x7d, 0xdb, 0x88, 0x7b, 0x55, 0x1d, 0x60, 0x64, 0x74, 0xff, 0x09, 0x22,
      0x95, 0xc3, 0x40, 0x80, 0xec, 0xb1, 0x64, 0x6c, 0x80, 0xec, 0xb1, 0x64,
      0x01,
    ];

    const __sessionKeyHexArr = [
      0xa6, 0xdf, 0x1e, 0x66, 0x0a, 0x14, 0x4d, 0xe0, 0x20, 0xec, 0xcc, 0x04,
      0x46, 0xd5, 0x94, 0x7e, 0xbc, 0xf4, 0xa7, 0x40, 0x31, 0x17, 0x84, 0x2e,
      0xa1, 0x26, 0x7f, 0x29, 0xe6, 0x53, 0xf7, 0x02, 0x41, 0x7e, 0x4e, 0xb6,
      0x01,
    ];

    // const __sessionKeyDecimalArr = [
    //   55, 128, 128, 175, 144, 48, 74, 21, 90, 226, 215, 62, 125, 219, 136, 123,
    //   85, 29, 96, 100, 116, 255, 9, 34, 149, 195, 64, 128, 236, 177, 100, 108,
    //   128, 236, 177, 100, 1,
    // ];

    const __sessionKeyHexText =
      'a6df1e660a144de020eccc0446d5947ebcf4a7403117842ea1267f29e653f702417e4eb601';

    const __sessionKeyDecText =
      '55 128 128 175 144 48 74 21 90 226 215 62 125 219 136 123 85 29 96 100 116 255 9 34 149 195 64 128 236 177 100 108 128 236 177 100 1';

    const __sessionKeyHexArrUint8Array = new Uint8Array(__sessionKeyHexArr);

    consoleLog('initlizeAppGen2 __sessionKeyHexArr==>', __sessionKeyHexArr);
    consoleLog(
      'initlizeAppGen2 __sessionKeyHexArrUint8Array==>',
      __sessionKeyHexArrUint8Array,
    );
    // consoleLog(
    //   'initlizeAppGen2 __sessionKeyDecimalArr==>',
    //   __sessionKeyDecimalArr,
    // );
    consoleLog('initlizeAppGen2 __sessionKeyHexText==>', __sessionKeyHexText);
    // consoleLog('initlizeAppGen2 __sessionKeyDecText==>', __sessionKeyDecText);
    consoleLog(
      'initlizeAppGen2 base64EncodeFromByteArray==>',
      base64EncodeFromByteArray(__sessionKeyHexArrUint8Array),
    );

    const sessionKeyServoiceUUID = '438AF044-AF98-45F1-8B9F-5382B17559C0';
    const sessionKeyCharUUID = '438AF044-AF98-45F1-8B9F-5382B17559C5';

    const sessionKeyResponse =
      await BLEService.writeCharacteristicWithResponseForDevice2(
        sessionKeyServoiceUUID,
        sessionKeyCharUUID,
        __sessionKeyHexArrUint8Array,
      );

    consoleLog(
      'initlizeAppGen2 sessionKeyResponse==>',
      JSON.stringify(sessionKeyResponse?.value),
    );

    setTimeout(async () => {
      // Authorization Key
      const authorizationServiceUUID = '438AF044-AF98-45F1-8B9F-5382B17559C0';
      const authorizationCharUUID = '438AF044-AF98-45F1-8B9F-5382B17559C6';
      const authorizationResponse =
        await BLEService.readCharacteristicForDevice(
          authorizationServiceUUID,
          authorizationCharUUID,
        );
      consoleLog(
        'initlizeAppGen2 authorizationResponse==>',
        authorizationResponse?.value,
      );
    }, 3000);
  };

  function toHexString(byteArray: any) {
    return Array.from(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  }

  const generateSessionKey = async (
    unixTimestamp: any,
    server_key: any,
    master_key: any,
    site_id: any,
  ) => {
    var session_time = [];
    var session_key = [];

    session_time[0] = unixTimestamp[0];
    session_time[1] = unixTimestamp[1];
    session_time[2] = unixTimestamp[2];
    session_time[3] = unixTimestamp[3];

    // HOW TO GENERATE SESSION KEY
    const MASTER_KEY_LEN = 32;
    const tmp_session_hex = []; // temporary session key

    // copy master_key to temporary session key
    for (let i = 0; i < 32; i++) {
      tmp_session_hex[i] = master_key[i];
    }

    const tmp_session = fromHexString(tmp_session_hex.join(''));
    consoleLog('generateSessionKey tmp_session_hex==>', tmp_session_hex);
    consoleLog('generateSessionKey tmp_session==>', tmp_session);

    const session_time_uint = fromHexString(session_time.join(''));
    consoleLog('generateSessionKey session_time_uint==>', session_time_uint);

    // formulas to generate temporary session key before SHA256
    for (let i = 0; i < MASTER_KEY_LEN; i++) {
      if (i % 2 > 0) {
        tmp_session[i] &=
          (site_id[15 - i / 2] & (session_time_uint[i % 3] << 1)) |
          server_key[i];
      } else {
        tmp_session[i] ^=
          site_id[15 - i / 2] | (session_time_uint[i % 3] >> 1) | server_key[i];
      }
    }

    tmp_session[6] ^= session_time_uint[2] >> 5;
    tmp_session[30] ^= session_time_uint[0] << 3;
    tmp_session[26] &= session_time_uint[1] >> 8;
    tmp_session[17] |= session_time_uint[2] >> 2;
    tmp_session[15] &= session_time_uint[3] << 4;
    tmp_session[20] |= session_time_uint[0] >> 5;

    // perform SHA256 on the temporary session key
    // const tmpSHA = SHA256(tmp_session);
    console.log('generateSessionKey tmp_session2==>', tmp_session);
    const bytes = Array.from(tmp_session);
    console.log('generateSessionKey bytes==>', bytes);

    const tmpSHA = await sha256Bytes(bytes);
    // sha256Bytes(bytes).then(hash => {
    //   console.log('generateSessionKey hash==>', bytes);
    // });
    console.log('generateSessionKey tmpSHA==>', tmpSHA);

    var formattedtmpSHA = addSpaceIntoString(tmpSHA.toString(), 2);
    consoleLog('generateSessionKey formattedtmpSHA==>', formattedtmpSHA);

    // var decodedtmpSHA = hexEncodeDecode(formattedtmpSHA, 'decodeSpecial');
    // consoleLog('generateSessionKey decodedtmpSHA==>', decodedtmpSHA);

    // var mappedtmpSHA = mapUint8Array(decodedtmpSHA, 32);
    var mappedtmpSHA = formattedtmpSHA.split(' ');
    console.log('generateSessionKey mappedtmpSHA==>', mappedtmpSHA);

    // build session key
    // add unix time
    session_key[0] = session_time[2];
    session_key[1] = session_time[3];
    session_key[2] = session_time[1];
    session_key[3] = session_time[0];

    // add SHA session key
    for (let i = 0; i < 32; i++) {
      session_key[i + 4] = mappedtmpSHA[i];
    }
    session_key.push(0x01);
    console.log('generateSessionKey session_key==>', session_key);
    return session_key.join('');
  };

  const initlizeApp = async () => {
    const deviceStaticData = getDeviceModelData(
      connectedDevice,
      BLE_DEVICE_MODELS,
    );
    setDeviceData(deviceStaticData);
    __getBatteryLevel();
    __getTotalWaterUsase();
    __getSavedSettingsGen1();

    // Experimental areas
    // await BLEService.discoverAllServicesAndCharacteristicsForDevice();

    // BLEService.disconnectDeviceById('00:0B:57:6E:87:31');
    // consoleLog('initialize AllServicesChar==>', JSON.stringify(AllServicesChar));
    // MA== (0) default
    // MQ== (1)
    const serviceuuid = 'd0aba888-fb10-4dc9-9b17-bdd8f490c940';
    const charuuid = 'd0aba888-fb10-4dc9-9b17-bdd8f490c949';

    // Battery
    // const serviceuuid = '0000180f-0000-1000-8000-00805f9b34fb';
    // const charuuid = '00002a19-0000-1000-8000-00805f9b34fb';

    // const AllServicesChar =
    //   await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    // consoleLog('initialize AllServicesChar==>', JSON.stringify(AllServicesChar));

    // const AllServices = await BLEService.getServicesForDevice();
    // consoleLog('initialize AllServices2==>', JSON.stringify(AllServices));

    // const getCharacteristicsForDevice =
    //   await BLEService.getCharacteristicsForDevice(serviceuuid);
    // consoleLog(
    //   'initialize getCharacteristicsForDevice==>',
    //   JSON.stringify(getCharacteristicsForDevice),
    // );

    // const readCharacteristicForDevice =
    //   await BLEService.readCharacteristicForDevice(serviceuuid, charuuid);
    // consoleLog(
    //   'initialize readCharacteristicForDevice2==>',
    //   JSON.stringify(readCharacteristicForDevice),
    // );

    // const writeCharacteristicWithResponseForDevice =
    //   await BLEService.writeCharacteristicWithResponseForDevice(
    //     serviceuuid,
    //     charuuid,
    //     '0',
    //   );
    // consoleLog(
    //   'initialize writeCharacteristicWithResponseForDevice==>',
    //   JSON.stringify(writeCharacteristicWithResponseForDevice),
    // );

    const serviceuui1 = 'd0aba888-fb10-4dc9-9b17-bdd8f490c940';
    const charuuid1 = 'd0aba888-fb10-4dc9-9b17-bdd8f490c943';
    const descptr1 = '00002901-0000-1000-8000-00805f9b34fb';

    // const getDescriptorsForDevice = await BLEService.getDescriptorsForDevice(
    //   serviceuui1,
    //   charuuid1,
    // );
    // consoleLog(
    //   'initialize getDescriptorsForDevice==>',
    //   JSON.stringify(getDescriptorsForDevice),
    // );
    // const readDescriptorForDevice = await BLEService.readDescriptorForDevice(
    //   serviceuui1,
    //   charuuid1,
    //   descptr1,
    // );
    // consoleLog(
    //   'initialize readDescriptorForDevice==>',
    //   JSON.stringify(readDescriptorForDevice),
    // );
  };

  const __getBatteryLevel = async () => {
    const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a19-0000-1000-8000-00805f9b34fb';

    const __batteryLevel = await getBatteryLevel(
      serviceUUID,
      characteristicUUID,
    );

    if (__batteryLevel > 0 && __batteryLevel < 101) {
      setBatteryLevel(__batteryLevel);
    }
  };

  const __getTotalWaterUsase = async () => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c940';
    const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c949';

    const totalWaterUsase = await getTotalWaterUsase(
      serviceUUID,
      characteristicUUID,
    );
    // consoleLog('TotalWaterUsase==>', JSON.stringify(TotalWaterUsase));
    if (totalWaterUsase) {
      setTotalWaterUsage(totalWaterUsase);
    }
  };

  const __getSavedSettingsGen1 = async () => {
    const __savedSettingsGen1 = await getSavedSettingsGen1(connectedDevice);
    // consoleLog('__savedSettingsGen1', JSON.stringify(__savedSettingsGen1));
    if (__savedSettingsGen1) {
      setSavedSettingsGen1(__savedSettingsGen1);
    }
  };

  const applyLoadPreviosSettings = () => {
    if (!isObjectEmpty(savedSettingsGen1?.data)) {
      onApplySettingPress(savedSettingsGen1, false, true);
    } else {
      showToastMessage('No previously saved settings found.');
    }
  };

  const onApplySettingPress = async (
    __deviceSettingsData: any,
    shouldUpdatePreviosSettings: boolean = true,
    shouldShowToast: boolean = false,
  ) => {
    var timeout = 2000;
    setApplying(true);
    const __hasSensorRangeSetting = hasSensorRangeSetting(__deviceSettingsData);

    if (__hasSensorRangeSetting) {
      setApplyingLoadingText(
        'Adaptive sensing in progress. Water may be dispensed. Please wait.',
      );
      timeout = 10000;
    }
    const status = await saveSettings(__deviceSettingsData);
    // consoleLog('status', status);

    if (shouldUpdatePreviosSettings) {
      const status2 = await updatePreviousSettings(
        connectedDevice,
        __deviceSettingsData,
        BLE_GATT_SERVICES,
      );
    }

    setTimeout(() => {
      // consoleLog('status2', status2);
      setApplying(false);
      // consoleLog('status3');
      setApplied(true);
      // consoleLog('status4');
    }, timeout);

    setTimeout(() => {
      dispatch(deviceSettingsResetDataAction());
      // consoleLog('status5');
    }, timeout + 2000);
    setTimeout(() => {
      setApplied(false);
      initlizeApp();
      // consoleLog('status6');
      if (shouldShowToast) {
        showToastMessage(
          'Success',
          'success',
          'Previous settings applied successfully.',
        );
      }
    }, timeout + 3000);
    // consoleLog('status7');
  };

  const dispenseWater = () => {
    // BLEService.dispenseWater(
    //   'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
    //   'd0aba888-fb10-4dc9-9b17-bdd8f490c965',
    // );

    initlizeAppGen2();
  };

  return (
    <AppContainer
      scroll={true}
      scrollViewStyle={{}}
      backgroundType="solid"
      haslogOutButton={false}
      hasBackButton={false}
      loading={loading}
      // scrollViewContentContainerStyle={{
      //   borderWidth: 1,
      //   borderColor: 'green',
      //   marginBottom: 120,
      // }}
      headerContainerStyle={{
        backgroundColor: Theme.colors.primaryColor,
        // flex:1,
        // borderWidth: 1,
        // borderColor: 'green',
      }}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            {deviceData &&
              deviceData?.models &&
              Array.isArray(deviceData?.models) &&
              deviceData?.models.length && (
                <Wrap autoMargin={false} style={styles.rowContainer}>
                  <Row autoMargin={false} style={styles.row}>
                    {/* <Wrap autoMargin={false} style={styles.leftStyle}>
                      <VectorIcon
                        iconPack="MaterialCommunityIcons"
                        name={'chevron-left'}
                        size={25}
                        color={Theme.colors.midGray}
                      />
                    </Wrap> */}
                    <Wrap autoMargin={false} style={styles.centerStyle}>
                      {/* <Image
                        // @ts-ignore
                        source={getImgSource(Images.imgHolder)}
                        style={{width: 150, height: 150}}
                        resizeMode="contain"
                      /> */}
                      <Swiper
                        style={styles.wrapper}
                        containerStyle={{height: 220}}
                        showsButtons={true}
                        // onIndexChanged={index => {
                        //   setSwiperIndex(index);
                        // }}
                        autoplay={true}
                        autoplayTimeout={5}
                        // index={swiperIndex}
                        nextButton={
                          <Wrap autoMargin={false} style={styles.rightStyle}>
                            <VectorIcon
                              iconPack="MaterialCommunityIcons"
                              name={'chevron-right'}
                              size={25}
                              color={Theme.colors.midGray}
                            />
                          </Wrap>
                        }
                        prevButton={
                          <Wrap autoMargin={false} style={styles.rightStyle}>
                            <VectorIcon
                              iconPack="MaterialCommunityIcons"
                              name={'chevron-left'}
                              size={25}
                              color={Theme.colors.midGray}
                            />
                          </Wrap>
                        }
                        dotStyle={{height: 5, width: 5}}
                        activeDotStyle={{height: 5, width: 5}}
                        activeDotColor={Theme.colors.black}>
                        {deviceData &&
                          deviceData?.models?.map(
                            (item: any, index: number) => {
                              return (
                                <Wrap
                                  key={index.toString()}
                                  autoMargin={false}
                                  style={styles.slide1}>
                                  <Image
                                    // @ts-ignore
                                    // source={getImgSource(Images.imgHolder)}
                                    source={getImgSource(
                                      item?.image ?? Images.imgHolder,
                                    )}
                                    style={{width: 150, height: 150}}
                                    resizeMode="contain"
                                  />
                                  <Typography
                                    size={12}
                                    text={item?.displayName}
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    color={Theme.colors.black}
                                    ff={Theme.fonts.ThemeFontMedium}
                                  />
                                </Wrap>
                              );
                            },
                          )}
                      </Swiper>
                    </Wrap>
                    {/* <Wrap autoMargin={false} style={styles.rightStyle}>
                      <VectorIcon
                        iconPack="MaterialCommunityIcons"
                        name={'chevron-right'}
                        size={25}
                        color={Theme.colors.midGray}
                        onPress={() => {
                          setSwiperIndex(swiperIndex + 1);
                        }}
                      />
                    </Wrap> */}
                  </Row>
                </Wrap>
              )}

            <Wrap autoMargin={false} style={styles.rowContainer}>
              <Row autoMargin={true} style={styles.row}>
                <Wrap
                  autoMargin={false}
                  style={[
                    styles.leftStyle,
                    {
                      flex: 1,
                      // borderWidth: 1,
                      // borderColor: 'red',
                      justifyContent: 'center',
                    },
                  ]}>
                  <Row
                    autoMargin={false}
                    style={{
                      // borderWidth: 1,
                      // borderColor: 'green',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {batteryLevel > 0 && batteryLevel < 25 ? (
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'battery-half'}
                        size={20}
                        color={Theme.colors.red}
                      />
                    ) : batteryLevel > 25 && batteryLevel < 50 ? (
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'battery-half'}
                        size={20}
                        color={Theme.colors.yellow}
                      />
                    ) : batteryLevel > 50 && batteryLevel < 75 ? (
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'battery-half'}
                        size={20}
                        color={Theme.colors.orange}
                      />
                    ) : batteryLevel > 75 && batteryLevel <= 100 ? (
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'battery-full'}
                        size={20}
                        color={Theme.colors.primaryColor}
                      />
                    ) : (
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'battery-dead'}
                        size={20}
                        color={Theme.colors.black}
                      />
                    )}

                    <Typography
                      size={22}
                      text={`${batteryLevel ?? 0}%`}
                      style={{
                        textAlign: 'left',
                        marginLeft: 5,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Row>
                  <Typography
                    size={10}
                    text={'BATTERY POWER'}
                    style={{
                      textAlign: 'center',
                    }}
                    color={Theme.colors.midGray}
                    ff={Theme.fonts.ThemeFontMedium}
                  />
                </Wrap>

                <Wrap
                  autoMargin={false}
                  style={[
                    styles.leftStyle,
                    {
                      flex: 1,
                      borderLeftWidth: 1,
                      borderColor: Theme.colors.lightGray,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Row
                    autoMargin={false}
                    style={{
                      // borderWidth: 1,
                      // borderColor: 'green',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <VectorIcon
                      iconPack="Ionicons"
                      name={'water'}
                      size={20}
                      color={Theme.colors.primaryColor}
                    />
                    <Typography
                      size={22}
                      text={`${totalWaterUsage} Gal`}
                      style={{
                        textAlign: 'left',
                        marginLeft: 5,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Row>
                  <Typography
                    size={10}
                    text={'TOTAL WATER USAGE'}
                    style={{
                      textAlign: 'center',
                    }}
                    color={Theme.colors.midGray}
                    ff={Theme.fonts.ThemeFontMedium}
                  />
                </Wrap>
              </Row>
            </Wrap>

            <Wrap autoMargin={false} style={styles.rowContainer}>
              <Row
                autoMargin={false}
                style={[
                  styles.row,
                  {
                    marginTop: 30,
                  },
                ]}>
                <Wrap autoMargin={false} style={{flex: 1}}>
                  <Button
                    type={'link'}
                    title="DISPENSE WATER"
                    onPress={() => {
                      dispenseWater();
                    }}
                    leftItem={
                      <VectorIcon
                        iconPack="Ionicons"
                        name={'water'}
                        size={16}
                        color={Theme.colors.primaryColor}
                        style={{marginRight: 5}}
                      />
                    }
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                  />
                </Wrap>
              </Row>
            </Wrap>

            <Wrap autoMargin={false} style={styles.rowContainer}>
              <Row autoMargin={true} style={[styles.row, {marginBottom: 20}]}>
                <Wrap
                  autoMargin={false}
                  style={[
                    styles.leftStyle,
                    {
                      flex: 1,
                      // borderWidth: 1,
                      // borderColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <Typography
                    size={10}
                    text={'FAUCET SETTINGS'}
                    style={{
                      textAlign: 'left',
                    }}
                    color={Theme.colors.midGray}
                    ff={Theme.fonts.ThemeFontMedium}
                  />
                </Wrap>

                <Wrap
                  autoMargin={false}
                  style={[
                    styles.leftStyle,
                    {
                      flex: 1,
                      justifyContent: 'center',
                      // alignItems: 'center',
                    },
                  ]}>
                  <Wrap autoMargin={false}>
                    <Button
                      type={'link'}
                      title="LOAD PREVIOUS SETTINGS"
                      onPress={() => {
                        setLoadPreviosSettingsModal(true);
                      }}
                      style={{height: 30}}
                      textStyle={{
                        fontSize: 10,
                        fontFamily: Theme.fonts.ThemeFontMedium,
                      }}
                    />
                  </Wrap>
                </Wrap>
              </Row>
              <Divider color={Theme.colors.lightGray} />
            </Wrap>

            <CollapsableContainer expanded={!isObjectEmpty(deviceSettingsData)}>
              <Wrap autoMargin={false} style={styles.rowContainer}>
                <Row
                  autoMargin={false}
                  style={[
                    styles.row,
                    {
                      marginTop: 10,
                    },
                  ]}>
                  <Wrap autoMargin={false} style={{flex: 1}}>
                    {applied ? (
                      <Button
                        type={'success'}
                        title="CHANGES APPLIED"
                        onPress={() => {}}
                        textStyle={{
                          fontSize: 12,
                          fontFamily: Theme.fonts.ThemeFontMedium,
                        }}
                      />
                    ) : (
                      <Button
                        type={'warning'}
                        title="APPLY SETTINGS TO FAUCET"
                        onPress={() => {
                          onApplySettingPress(deviceSettingsData);
                        }}
                        textStyle={{
                          fontSize: 12,
                          fontFamily: Theme.fonts.ThemeFontMedium,
                        }}
                      />
                    )}
                  </Wrap>
                </Row>
              </Wrap>
            </CollapsableContainer>

            <Wrap autoMargin={false}>
              <ActivationModeList
                setting={{
                  id: 1,
                  title: 'Activation Mode',
                  route: 'ActivationMode',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c943',
                  name: 'ActivationMode',
                }}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <LineFlushList
                setting={{
                  id: 2,
                  title: 'Line Flush',
                  route: 'LineFlush',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c946',
                  name: 'LineFlush',
                }}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <FlowRateList
                setting={{
                  id: 3,
                  title: 'Confirm Flow Rate',
                  // subTitle: 'Galons Per Minute',
                  route: 'FlowRate',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c949',
                  name: 'FlowRate',
                }}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <SensorRangeList
                setting={{
                  id: 4,
                  title: 'Sensor Range',
                  subTitle: 'Units',
                  route: 'SensorRange',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c942',
                  name: 'SensorRange',
                }}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              {/* <NotesList
                setting={{
                  id: 4,
                  title: 'Notes',
                  subTitle: 'DEVICE NOTES',
                  route: 'Notes',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c94A',
                  name: 'Notes',
                }}
                navigation={navigation}
              /> */}
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>

      <AlertBox
        visible={loadPreviosSettingsModal}
        title="Load Previous Settings"
        // message={`Activation Mode On Demand / 30 sec\nLine Flush: OFF\nFlowRate: 0.5 gpm\nSensor Range: 3`}
        message={
          savedSettingsGen1?.text
            ? savedSettingsGen1?.text
            : 'No Previous saved settings found'
        }
        okayText={'CONFIRM'}
        onCancelPress={() => {
          setLoadPreviosSettingsModal(false);
        }}
        onOkayPress={() => {
          setLoadPreviosSettingsModal(false);
          applyLoadPreviosSettings();
        }}
      />
      <AlertBox
        visible={disconnectModal}
        title="Disconnect"
        message={'Are you sure you want to disconnect?'}
        onCancelPress={() => {
          setDisconnectModal(false);
        }}
        onOkayPress={() => {
          setDisconnectModal(false);
          NavigationService.resetAllAction('DeviceDisconnectStack');
        }}
      />
      <LoaderOverlay2 loading={applying} loadingText={applyingLoadingText} />
    </AppContainer>
  );
};

export default Index;
