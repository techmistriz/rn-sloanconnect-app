import React, {useEffect, useState} from 'react';
import {Image, BackHandler} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBatteryLevel,
  getDeviceModelData,
  getSavedSettingsGen1,
  getTotalWaterUsase,
  hasLineFlushSetting,
  hasSensorRangeSetting,
  intiGen2SecurityKey,
  saveSettings,
  shortBurstsGen1,
  updatePreviousSettings,
} from 'src/utils/Helpers/project';

import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';

import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import {deviceSettingsResetDataAction} from 'src/redux/actions';
import AlertBox from 'src/components/AlertBox';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import Swiper from 'react-native-swiper';
import ActivationModeList from 'src/components/@ProjectComponent/DeviceSettingsList/ActivationModeList';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import FlowRateList from 'src/components/@ProjectComponent/DeviceSettingsList/FlowRateList';
import SensorRangeList from 'src/components/@ProjectComponent/DeviceSettingsList/SensorRangeList';
import LineFlushList from 'src/components/@ProjectComponent/DeviceSettingsList/LineFlushList';
import LoaderOverlay2 from 'src/components/LoaderOverlay2';
import {CollapsableContainer} from 'src/components/CollapsableContainer';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {base64ToHex} from 'src/utils/Helpers/encryption';
import {
  mappingDeviceDataIntegersGen2,
  mappingRealTimeDataGen2,
} from './helperGen2';
import {BLE_GEN2_GATT_SERVICES} from 'src/utils/StaticData/BLE_GEN2_GATT_SERVICES';
import {
  getActivationModeSettings,
  getFlowSettings,
  getFlushSettings,
  getSensorSettings,
} from './helperGen1';
import StorageService from 'src/services/StorageService/StorageService';

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

  // New method
  const [activationModeSettings, setActivationModeSettings] = useState<any>();
  const [flushSettings, setFlushSettings] = useState<any>();
  const [flowRateSettings, setFlowRateSettings] = useState<any>();
  const [sensorSettings, setSensorSettings] = useState<any>();

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

  /** Function comments */
  const initlizeApp = async () => {
    // await StorageService.removeItem('@DEVICE_PREVIOUS_SETTINGS');

    if (BLEService.connectedDeviceStaticData) {
      setDeviceData(BLEService.connectedDeviceStaticData);
    }

    if (BLEService.deviceGeneration == 'gen1') {
      initlizeAppGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      initlizeAppGen2();
      // settingsMappingGen2();
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  /** Function comments */
  const initlizeAppGen1 = async () => {
    __getBatteryLevel();
    __getTotalWaterUsase();
    __getSavedSettingsGen1();
    getActivationModeSettings(deviceSettingsData)
      .then(response => {
        // consoleLog(
        //   'initlizeAppGen1 getActivationModeSettings response==>',
        //   response,
        // );

        // if (JSON.stringify(activationModeSettings) != JSON.stringify(response)) {
        setActivationModeSettings(response);
        // }
      })
      .catch(error => {
        consoleLog('initlizeAppGen1 getActivationModeSettings error==>', error);
      });

    getFlushSettings(deviceSettingsData)
      .then(response => {
        // consoleLog('initlizeAppGen1 getFlushSettings response==>', response);
        setFlushSettings(response);
      })
      .catch(error => {
        consoleLog('initlizeAppGen1 getFlushSettings error==>', error);
      });
    getSensorSettings(deviceSettingsData)
      .then(response => {
        // consoleLog('initlizeAppGen1 getSensorSettings response==>', response);
        setSensorSettings(response);
      })
      .catch(error => {
        consoleLog('initlizeAppGen1 getSensorSettings error==>', error);
      });
    getFlowSettings(deviceSettingsData)
      .then(response => {
        // consoleLog('initlizeAppGen1 getFlowSettings response==>', response);
        setFlowRateSettings(response);
      })
      .catch(error => {
        consoleLog('initlizeAppGen1 getFlowSettings error==>', error);
      });
  };

  /** Function comments */
  const initlizeAppGen2 = async () => {
    consoleLog('getDeviceDataGen2 called');
    // __mappingDeviceDataIntegersGen2SetupMonitor();
    __mappingRealTimeDataGen2SetupMonitor();
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2SetupMonitor = async () => {
    consoleLog('__mappingDeviceDataIntegersGen2SetupMonitor called');
    var __characteristicMonitorDeviceDataIntegers: string[] = [];

    // Device data integer
    BLEService.setupMonitor(
      BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      characteristic => {
        // consoleLog('__mappingDeviceDataIntegersGen2SetupMonitor characteristic==>', characteristic);
        if (characteristic?.value) {
          var deviceDataIntegerHex = base64ToHex(characteristic?.value);
          // consoleLog(
          //   '__mappingDeviceDataIntegersGen2SetupMonitor deviceDataIntegerHex==>',
          //   deviceDataIntegerHex,
          // );
          if (deviceDataIntegerHex == '71ff04') {
            BLEService.characteristicMonitorDeviceDataIntegers =
              __characteristicMonitorDeviceDataIntegers;
            BLEService.finishMonitor();
            __mappingDeviceDataIntegersGen2();
          } else {
            __characteristicMonitorDeviceDataIntegers.push(
              deviceDataIntegerHex,
            );
          }
        }
      },
      error => {
        consoleLog('setupMonitor error==>', error);
      },
    );
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2 = async () => {
    const mappingDeviceDataIntegersGen2Response =
      await mappingDeviceDataIntegersGen2(
        BLE_GEN2_GATT_SERVICES,
        BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        BLEService.characteristicMonitorDeviceDataIntegers,
      );

    // consoleLog(
    //   '__mappingDeviceDataIntegersGen2 mappingDeviceDataIntegersGen2Response==>',
    //   JSON.stringify(mappingDeviceDataIntegersGen2Response),
    // );

    BLEService.characteristicMonitorDeviceDataIntegersMapped =
      mappingDeviceDataIntegersGen2Response;
    __mappingDeviceDataIntegersGen2Data();
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2Data = () => {
    const mappingDeviceDataIntegersGen2Response =
      BLEService.characteristicMonitorDeviceDataIntegersMapped;

    if (!isObjectEmpty(mappingDeviceDataIntegersGen2Response)) {
      // For Activation mode
      var __activationModeSettings = {
        modeSelection: {},
        metered: {},
        onDemand: {},
      };

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[21]) {
        __activationModeSettings.modeSelection = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[21]?.value?.currentValue?.toString(),
        };
      }

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[22]) {
        __activationModeSettings.metered = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[22]?.value?.currentValue?.toString(),
        };
      }

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[23]) {
        __activationModeSettings.onDemand = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[23]?.value?.currentValue?.toString(),
        };
      }
      // consoleLog(
      //   'settingsMappingGen2 __activationModeSettings==>',
      //   __activationModeSettings,
      // );
      if (__activationModeSettings) {
        setActivationModeSettings(__activationModeSettings);
      }

      // For Line flush
      var __flushSettings = {
        flush: {},
        flushTime: {},
        flushInterval: {},
      };

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[24]) {
        __flushSettings.flush = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[24]?.value?.currentValue?.toString(),
        };
      }

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[28]) {
        __flushSettings.flushTime = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[28]?.value?.currentValue?.toString(),
        };
      }

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[31]) {
        __flushSettings.flushInterval = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[31]?.value?.currentValue?.toString(),
        };
      }
      // consoleLog('settingsMappingGen2 __flushSettings==>', __flushSettings);
      if (__flushSettings) {
        setFlushSettings(__flushSettings);
      }

      // For flowRateSettings
      var __flowRateSettings = {
        flowRate: {},
      };

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[19]) {
        __flowRateSettings.flowRate = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[19]?.value?.currentValue?.toString(),
        };
      }

      // consoleLog(
      //   'settingsMappingGen2 __flowRateSettings==>',
      //   __flowRateSettings,
      // );
      if (__flowRateSettings) {
        setFlowRateSettings(__flowRateSettings);
      }

      // For sensorSettings
      var __sensorSettings = {
        sensorRange: {},
      };

      if (mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[20]) {
        __sensorSettings.sensorRange = {
          value:
            mappingDeviceDataIntegersGen2Response?.chunks?.[0]?.uuidData?.[20]?.value?.currentValue?.toString(),
        };
      }

      // consoleLog('settingsMappingGen2 __sensorSettings==>', __sensorSettings);
      if (__sensorSettings) {
        setSensorSettings(__sensorSettings);
      }
    }
  };

  /** Function comments */
  const __mappingRealTimeDataGen2SetupMonitor = async () => {
    consoleLog('__mappingRealTimeDataGen2SetupMonitor called');
    var __characteristicMonitorRealTimeData: string[] = [];

    // Device data integer
    BLEService.setupMonitor(
      BLE_CONSTANTS?.GEN2?.REAL_TIME_DATA_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.REAL_TIME_DATA_CHARACTERISTIC_UUID,
      characteristic => {
        // consoleLog(
        //   '__mappingRealTimeDataGen2SetupMonitor characteristic==>',
        //   characteristic,
        // );
        if (characteristic?.value) {
          var deviceDataIntegerHex = base64ToHex(characteristic?.value);
          consoleLog(
            '__mappingRealTimeDataGen2SetupMonitor deviceDataIntegerHex==>',
            deviceDataIntegerHex,
          );

          __characteristicMonitorRealTimeData.push(deviceDataIntegerHex);
          BLEService.characteristicMonitorRealTimeData =
            __characteristicMonitorRealTimeData;
          BLEService.finishMonitor();
          __mappingRealTimeDataGen2();
        }
      },
      error => {
        consoleLog('__mappingRealTimeDataGen2SetupMonitor error==>', error);
      },
    );
  };

  /** Function comments */
  const __mappingRealTimeDataGen2 = async () => {
    const mappingRealTimeDataGen2Response = await mappingRealTimeDataGen2(
      BLE_GEN2_GATT_SERVICES,
      BLE_CONSTANTS?.GEN2?.REAL_TIME_DATA_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.REAL_TIME_DATA_CHARACTERISTIC_UUID,
      BLEService.characteristicMonitorRealTimeData,
    );

    // consoleLog(
    //   '__mappingRealTimeDataGen2 mappingRealTimeDataGen2Response==>',
    //   JSON.stringify(mappingRealTimeDataGen2Response),
    // );

    BLEService.characteristicMonitorRealTimeDataMapped =
      mappingRealTimeDataGen2Response;
    __mappingRealTimeDataGen2Data();
  };

  /** Function comments */
  const __mappingRealTimeDataGen2Data = () => {
    consoleLog('__mappingRealTimeDataGen2Data called');
    const characteristicMonitorRealTimeDataMappedResponse =
      BLEService.characteristicMonitorRealTimeDataMapped;

    if (!isObjectEmpty(characteristicMonitorRealTimeDataMappedResponse)) {
      // For Battery level
      if (
        characteristicMonitorRealTimeDataMappedResponse?.chunks?.[0]
          ?.uuidData?.[3]
      ) {
        var batteryLevel = 0;
        var __batteryLevel =
          characteristicMonitorRealTimeDataMappedResponse?.chunks?.[0]
            ?.uuidData?.[3]?.value?.currentValue;

        if (__batteryLevel > 0 && __batteryLevel < 101) {
          batteryLevel = __batteryLevel;
        }

        BLEService.batteryLevel = batteryLevel;
        setBatteryLevel(batteryLevel);
      }
    }
  };

  /** Function comments */
  const __getBatteryLevel = async () => {
    setBatteryLevel(BLEService.batteryLevel);
  };

  /** Function comments */
  const __getTotalWaterUsase = async () => {
    if (BLEService.totalWaterUsase) {
      setTotalWaterUsage(BLEService.totalWaterUsase);
    }
  };

  /** Function comments */
  const __getSavedSettingsGen1 = async () => {
    const __savedSettingsGen1 = await getSavedSettingsGen1(connectedDevice);
    // consoleLog(
    //   '__getSavedSettingsGen1 __savedSettingsGen1==>',
    //   JSON.stringify(__savedSettingsGen1),
    // );
    if (__savedSettingsGen1) {
      setSavedSettingsGen1(__savedSettingsGen1);
    }
  };

  /** Function comments */
  const applyLoadPreviosSettings = () => {
    if (!isObjectEmpty(savedSettingsGen1?.data)) {
      onApplySettingPress(savedSettingsGen1, false, true);
    } else {
      showToastMessage('No previously saved settings found.');
    }
  };

  /** Function comments */
  const onApplySettingPress = async (
    __deviceSettingsData: any,
    shouldUpdatePreviosSettings: boolean = true,
    shouldShowToast: boolean = false,
  ) => {
    var __LineFlush: any = {};
    const __deviceSettingsDataTmp = {...__deviceSettingsData};
    // consoleLog("__deviceSettingsDataTmp", __deviceSettingsDataTmp);
    // return;

    var timeout = 2000;
    setApplying(true);
    const __hasSensorRangeSetting = hasSensorRangeSetting(__deviceSettingsData);

    if (__hasSensorRangeSetting) {
      setApplyingLoadingText(
        'Adaptive sensing in progress. Water may be dispensed. Please wait.',
      );
      timeout = 10000;
    }

    const __hasLineFlushSetting = hasLineFlushSetting(__deviceSettingsData);

    if (__hasLineFlushSetting && __hasSensorRangeSetting) {
      __LineFlush.LineFlush = __deviceSettingsDataTmp?.LineFlush;
      delete __deviceSettingsDataTmp?.LineFlush;
      // consoleLog('__deviceSettingsDataTmp', __deviceSettingsDataTmp);
      // consoleLog('__LineFlush', __LineFlush);
    }

    // return false;

    const status = await saveSettings(__deviceSettingsDataTmp);
    // consoleLog('status', status);

    if (shouldUpdatePreviosSettings) {
      const status2 = await updatePreviousSettings(
        connectedDevice,
        __deviceSettingsData,
        BLE_GATT_SERVICES,
      );
    }

    setTimeout(async () => {
      // consoleLog('status2', status2);
      setApplying(false);
      // consoleLog('status3');
      setApplied(true);
      // consoleLog('status4');

      if (!isObjectEmpty(__LineFlush)) {
        const status1 = await saveSettings(__LineFlush);
        // consoleLog('status1', status1);
      }

      const shortBurstsGen1Status = await shortBurstsGen1(__deviceSettingsData);
      // consoleLog('shortBurstsGen1Status', shortBurstsGen1Status);
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

  /** Function comments */
  const dispenseWater = () => {
    BLEService.dispenseWater();
    // intiGen2SecurityKey();
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
                      // onPress={() => {
                      //   getDeviceDataGen2();
                      // }}
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
                settings={{
                  title: 'Activation Mode',
                  route: 'ActivationMode',
                  name: 'ActivationMode',
                }}
                settingsData={activationModeSettings}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <LineFlushList
                settings={{
                  title: 'Line Flush',
                  route: 'LineFlush',
                  name: 'LineFlush',
                  serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c946',
                }}
                settingsData={flushSettings}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <FlowRateList
                settings={{
                  title: 'Confirm Flow Rate',
                  route: 'FlowRate',
                  name: 'FlowRate',
                  // serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  // characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c949',
                }}
                settingsData={flowRateSettings}
                navigation={navigation}
                borderBottom={<Divider color={Theme.colors.lightGray} />}
                applied={applied}
              />

              <SensorRangeList
                settings={{
                  title: 'Sensor Range',
                  name: 'SensorRange',
                  route: 'SensorRange',
                  sensorRangeConfig: {min: 1, max: 5, step: 1},
                  // serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
                  // characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c942',
                }}
                settingsData={sensorSettings}
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
            : 'No previous saved settings found'
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
