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
  addSeparatorInString,
  base64EncodeDecode,
  base64EncodeFromByteArray,
  base64ToHex,
  base64ToText,
  decimalToHex,
  fromHexStringUint8Array,
  getTimestampInSeconds,
  hexEncodeDecode,
  hexToDecimal,
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
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

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
    const SERVER_KEY = BLE_CONSTANTS?.GEN2?.SERVER_KEY;
    const SITE_ID_SERVICE_UUID = BLE_CONSTANTS?.GEN2?.SITE_ID_SERVICE_UUID;
    const SITE_ID_CHARACTERISTIC_UUID =
      BLE_CONSTANTS?.GEN2?.SITE_ID_CHARACTERISTIC_UUID;

    const SITE_ID_HEX_FAKE = '2AAD580558ED451D813532D71DEA7F23';

    consoleLog('initlizeAppGen2 SERVER_KEY==>', SERVER_KEY);

    // SiteID Key
    const siteIDResponse = await BLEService.readCharacteristicForDevice(
      SITE_ID_SERVICE_UUID,
      SITE_ID_CHARACTERISTIC_UUID,
    );

    // initlizeAppGen2 SiteIDResult==> Kq1YBVjtRR2BNTLXHep/Iw==
    // consoleLog('initlizeAppGen2 SiteIDResult==>', siteIDResponse?.value);
    var siteIdHex: string;

    if (siteIDResponse?.value) {
      siteIdHex = base64ToHex(siteIDResponse?.value);
    } else {
      siteIdHex = SITE_ID_HEX_FAKE;
    }

    // console.log('initlizeAppGen2 siteIdHex==>', siteIdHex);
    var siteIdUint8Array = fromHexStringUint8Array(siteIdHex);
    console.log('initlizeAppGen2 siteIdUint8Array==>', siteIdUint8Array);

    // Master Key
    const MASTER_KEY_SERVICE_UUID =
      BLE_CONSTANTS?.GEN2?.MASTER_KEY_SERVICE_UUID;
    const MASTER_KEY_CHARACTERISTIC_UUID =
      BLE_CONSTANTS?.GEN2?.MASTER_KEY_CHARACTERISTIC_UUID;
    const masetrKeyResponse = await BLEService.readCharacteristicForDevice(
      MASTER_KEY_SERVICE_UUID,
      MASTER_KEY_CHARACTERISTIC_UUID,
    );
    // consoleLog(
    //   'initlizeAppGen2 readCharacteristicForDevice==>',
    //   readCharacteristicForDevice?.value,
    // );

    const masterKeyHex = base64ToHex(masetrKeyResponse?.value);
    // consoleLog('initlizeAppGen2 masterKeyHex==>', masterKeyHex);
    var masterKeyUint8Array = fromHexStringUint8Array(masterKeyHex);
    console.log('initlizeAppGen2 masterKeyUint8Array==>', masterKeyUint8Array);

    // Timestamp
    var timestamp = getTimestampInSeconds();
    // consoleLog('initlizeAppGen2 timestamp==>', timestamp);

    var timestampHex = decimalToHex(timestamp);
    // consoleLog('initlizeAppGen2 timestampHex==>', timestampHex);

    var timestampUint8Array = fromHexStringUint8Array(timestampHex);
    console.log('initlizeAppGen2 timestampUint8Array==>', timestampUint8Array);

    const sessionKeyNew = await generateSessionKey(
      timestampUint8Array,
      SERVER_KEY,
      masterKeyUint8Array,
      siteIdUint8Array,
      true,
    );
    // console.log('initlizeAppGen2 sessionKeyNew==>', sessionKeyNew);

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

    const __sessionKeyDecArrUint8Array = new Uint8Array(sessionKeyNew);

    // consoleLog('initlizeAppGen2 __sessionKeyDecArr==>', __sessionKeyDecArr);
    // consoleLog(
    //   'initlizeAppGen2 __sessionKeyDecArrUint8Array==>',
    //   __sessionKeyDecArrUint8Array,
    // );

    const SESSION_KEY_SERVICE_UUID =
      BLE_CONSTANTS?.GEN2?.SESSION_KEY_SERVICE_UUID;
    const SESSION_KEY_CHARACTERISTIC_UUID =
      BLE_CONSTANTS?.GEN2?.SESSION_KEY_CHARACTERISTIC_UUID;

    await BLEService.writeCharacteristicWithResponseForDevice2(
      SESSION_KEY_SERVICE_UUID,
      SESSION_KEY_CHARACTERISTIC_UUID,
      __sessionKeyDecArrUint8Array,
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
      'initlizeAppGen2 authorizationResponse==>',
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
    var sessionTime = new Uint8Array(timestampUint8Array);
    // sessionTime[0] = timestampUint8Array[3];
    // sessionTime[1] = timestampUint8Array[2];
    // sessionTime[2] = timestampUint8Array[0];
    // sessionTime[3] = timestampUint8Array[1];

    var sessionUintArray = new Uint8Array(37);

    // HOW TO GENERATE SESSION KEY
    var sessionUintArrayTmp = new Uint8Array(32); // temporary session key
    const MASTER_KEY_LEN = 32;

    // copy master_key to temporary session key
    for (let i = 0; i < 32; i++) {
      sessionUintArrayTmp[i] = masterKeyUint8Array[i];
    }

    consoleLog(
      'generateSessionKey sessionUintArrayTmp==>',
      sessionUintArrayTmp,
    );

    // formulas to generate temporary session key before SHA256
    for (let i = 0; i < MASTER_KEY_LEN; i++) {
      if (i % 2 > 0) {
        sessionUintArrayTmp[i] &=
          (siteIdUint8Array[15 - i / 2] & (sessionTime[i % 3] << 1)) |
          SERVER_KEY[i];
      } else {
        sessionUintArrayTmp[i] ^=
          siteIdUint8Array[15 - i / 2] |
          (sessionTime[i % 3] >> 1) |
          SERVER_KEY[i];
      }
    }

    sessionUintArrayTmp[6] ^= sessionTime[2] >> 5;
    sessionUintArrayTmp[30] ^= sessionTime[0] << 3;
    sessionUintArrayTmp[26] &= sessionTime[1] >> 8;
    sessionUintArrayTmp[17] |= sessionTime[2] >> 2;
    sessionUintArrayTmp[15] &= sessionTime[3] << 4;
    sessionUintArrayTmp[20] |= sessionTime[0] >> 5;

    // perform SHA256 on the temporary session key
    console.log(
      'generateSessionKey formulas before SHA256 sessionUintArrayTmp==>',
      sessionUintArrayTmp,
    );
    var sessionUintArrayTmpBytes = Array.from(sessionUintArrayTmp);
    // console.log(
    //   'generateSessionKey sessionUintArrayTmpBytes==>',
    //   sessionUintArrayTmpBytes,
    // );

    var sessionUintArrayTmpBytesSHA = await sha256Bytes(
      sessionUintArrayTmpBytes,
    );
    // console.log(
    //   'generateSessionKey sessionUintArrayTmpBytesSHA==>',
    //   sessionUintArrayTmpBytesSHA,
    // );

    var sessionUintArraySHA = fromHexStringUint8Array(
      sessionUintArrayTmpBytesSHA,
    );
    consoleLog(
      'generateSessionKey sessionUintArraySHA==>',
      sessionUintArraySHA,
    );

    // build session key
    // add unix time
    consoleLog('generateSessionKey sessionTime==>', sessionTime);
    sessionUintArray[0] = sessionTime[2];
    sessionUintArray[1] = sessionTime[3];
    sessionUintArray[2] = sessionTime[1];
    sessionUintArray[3] = sessionTime[0];

    // add SHA session key
    for (let i = 0; i < 32; i++) {
      sessionUintArray[i + 4] = sessionUintArraySHA[i];
    }
    sessionUintArray[36] = isProvision ? 1 : 0;

    console.log('generateSessionKey session_key==>', sessionUintArray);
    return sessionUintArray;
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
