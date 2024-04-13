import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, FlatList} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  cleanCharacteristic,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceModelData,
  getDeviceService,
  mapValue,
  getDeviceCharacteristicsByServiceUUID,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getBatteryLevel,
  formatCharateristicValue,
} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getImgSource,
  getTimezone,
  parseDateHumanFormat,
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
} from 'src/redux/actions';
import DeviceInfoList from 'src/components/@ProjectComponent/DeviceInfoList';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import {SETTINGS, TABS} from 'src/utils/StaticData/StaticData';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  addSeparatorInString,
  addSpaceIntoString,
  base64EncodeDecode,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';

const Index = ({navigation, route}: any) => {
  const {referrer} = route?.params || {referrer: undefined};
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  // const {device, status} = useSelector(
  //   (state: any) => state?.ConnectedDeviceReducer,
  // );

  const [loading, setLoading] = useState<boolean>(false);
  const [viewAdvanceDetails, setViewAdvanceDetails] = useState<boolean>(false);
  const connectedDevice = BLEService.getDevice();
  // const [deviceData, setDeviceData] = useState<any>();
  const [deviceDetails, setDeviceDetails] = useState<any>();

  useEffect(() => {
    // consoleLog('user', user);
    if (viewAdvanceDetails) {
      initializeAdvance();
    } else {
      initialize();
    }
  }, [viewAdvanceDetails]);

  const initialize = async () => {
    setLoading(true);
    const deviceStaticData = getDeviceModelData(
      connectedDevice,
      BLE_DEVICE_MODELS,
    );
    // setDeviceData(deviceStaticData);
    var ADBDInformationARR = await getBDInformationData();
    const battery = await __getBatteryLevel();
    // consoleLog('ADBDInformationARR', ADBDInformationARR);

    var sloanModel: any = [];
    if (deviceStaticData) {
      sloanModel = [
        {
          name: 'SLOAN MODEL',
          value: deviceStaticData?.fullNameAllModel,
          uuid: '111111',
        },
      ];
    }

    const batteryStatus = [
      {
        name: 'Battery Status',
        value: `${battery}%`,
        uuid: '0000000',
      },
    ];

    setDeviceDetails([...sloanModel, ...ADBDInformationARR, ...batteryStatus]);
    setLoading(false);
  };

  const initializeAdvance = async () => {
    try {
      setLoading(true);
      var StatisticsInformationArr = await getStatisticsInformationData();
      var SettingLogs = await getSettingLogsData();
      var UserData = await getUserData();
      // consoleLog('StatisticsInformationArr', StatisticsInformationArr);
      setDeviceDetails([
        ...StatisticsInformationArr,
        ...SettingLogs,
        ...UserData,
      ]);
    } catch (error) {
      //
    } finally {
    }
    setLoading(false);
  };

  const getBDInformationData = () => {
    // var deviceVersion = '01';
    var deviceGen = 'gen1';
    var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
    if (__deviceName) {
      deviceGen = getBleDeviceGeneration(__deviceName);
      // deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
    }

    return new Promise<any>(async resolve => {
      const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c900';
      const allServices = getDeviceCharacteristicsByServiceUUID(
        serviceUUID,
        BLE_GATT_SERVICES,
      );

      var data = [];

      // consoleLog('allServices', allServices);
      if (typeof allServices != 'undefined' && Object.entries(allServices)) {
        for (const [key, value] of Object.entries(allServices)) {
          // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

          if (
            typeof value?.uuid != 'undefined' &&
            value?.displayInList !== false &&
            (value?.generation == 'all' || value?.generation == deviceGen)
          ) {
            var characteristic = await BLEService.readCharacteristicForDevice(
              serviceUUID,
              value?.uuid,
            );

            var decodeValue = 'N/A';
            if (!isObjectEmpty(characteristic)) {
              decodeValue = base64EncodeDecode(characteristic?.value, 'decode');
            }

            data.push({
              name: value?.name,
              uuid: value?.uuid,
              value: formatCharateristicValue(value, decodeValue),
            });
          }
        }
      }
      resolve(data);
    });
  };

  const getStatisticsInformationData = () => {
    var deviceVersion = '01';
    var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
    if (__deviceName) {
      const deviceGen = getBleDeviceGeneration(__deviceName);
      deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
    }

    return new Promise<any>(async resolve => {
      const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c910';
      const allServices = getDeviceCharacteristicsByServiceUUID(
        serviceUUID,
        BLE_GATT_SERVICES,
      );

      var data = [];

      // consoleLog('allServices', allServices);
      if (typeof allServices != 'undefined' && Object.entries(allServices)) {
        for (const [key, value] of Object.entries(allServices)) {
          // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);

          if (
            typeof value?.uuid != 'undefined' &&
            value?.displayInList !== false &&
            (value?.generation == 'all' || value?.generation == deviceVersion)
          ) {
            var characteristic = await BLEService.readCharacteristicForDevice(
              serviceUUID,
              value?.uuid,
            );

            if (typeof characteristic != 'undefined') {
              data.push({
                name: value?.name,
                uuid: value?.uuid,
                value: hexToDecimal(
                  base64EncodeDecode(characteristic?.value, 'decode'),
                ),
              });
            }
            // consoleLog(
            //   'DeviceInfo initialize characteristic==>',
            //   JSON.stringify(characteristic),
            // );
          }
        }
      }

      resolve(data);
    });
  };

  const getSettingLogsData = () => {
    var deviceGen = 'gen1';
    var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
    if (__deviceName) {
      deviceGen = getBleDeviceGeneration(__deviceName);
      // deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
    }

    return new Promise<any>(async resolve => {
      const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c920';
      const allServices = getDeviceCharacteristicsByServiceUUID(
        serviceUUID,
        BLE_GATT_SERVICES,
      );

      var data = [];
      // consoleLog('allServices', allServices);
      if (typeof allServices != 'undefined' && Object.entries(allServices)) {
        for (const [key, value] of Object.entries(allServices)) {
          // consoleLog(`Key: ${key}, Value: ${JSON.stringify(value)}`);

          try {
            if (
              typeof value?.uuid != 'undefined' &&
              value?.displayInList !== false &&
              (value?.generation == 'all' || value?.generation == deviceGen)
            ) {
              var characteristic = await BLEService.readCharacteristicForDevice(
                serviceUUID,
                value?.uuid,
              );

              var decodeValue = 'N/A';
              if (!isObjectEmpty(characteristic)) {
                decodeValue = base64EncodeDecode(
                  characteristic?.value,
                  'decode',
                );
              }

              data.push({
                name: value?.name,
                uuid: value?.uuid,
                // value: formatCharateristicValue(value, decodeValue),
                value: decodeValue,
              });
            }
          } catch (error) {
            consoleLog('getSettingLogsData error==>', error);
          }
        }
      }
      resolve(data);
    });
  };

  const getUserData = () => {
    return new Promise<any>(async resolve => {
      var data = [];
      if (typeof user != 'undefined' && Object.entries(user)) {
        data.push({
          name: 'User Name',
          uuid: '1',
          value: user?.name,
        });
        data.push({
          name: 'User Phone #',
          uuid: '2',
          value: user?.contact ?? 'N/A',
        });
        data.push({
          name: 'User Company',
          uuid: '2',
          value: user?.parent_org_id ?? 'N/A',
        });
        data.push({
          name: 'User Title',
          uuid: '2',
          value: user?.title ?? 'N/A',
        });
        data.push({
          name: 'User Email',
          uuid: '2',
          value: user?.email ?? 'N/A',
        });
      }
      resolve(data);
    });
  };

  const __getBatteryLevel = async () => {
    var batteryLevel = 0;
    const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a19-0000-1000-8000-00805f9b34fb';

    const __batteryLevel = await getBatteryLevel(
      serviceUUID,
      characteristicUUID,
    );

    if (__batteryLevel > 0 && __batteryLevel < 101) {
      batteryLevel = __batteryLevel;
    }

    return batteryLevel;
  };

  return (
    <>
      <AppContainer
        scroll={true}
        scrollViewStyle={{}}
        backgroundType="solid"
        haslogOutButton={false}
        hasBackButton={true}
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
        <Wrap autoMargin={false} style={styles.container}>
          <Wrap autoMargin={false} style={styles.sectionContainer}>
            <Wrap autoMargin={false} style={styles.section1}>
              <Wrap autoMargin={false} style={styles.rowContainer}>
                <Row
                  autoMargin={false}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 30,
                    // borderWidth: 1,
                  }}>
                  <Wrap autoMargin={false}>
                    <Typography
                      size={18}
                      text={
                        viewAdvanceDetails
                          ? 'Advanced Device Details'
                          : 'Device Details'
                      }
                      style={{
                        textAlign: 'center',
                        // marginBottom: 30,
                      }}
                      color={Theme.colors.primaryColor}
                      ff={Theme.fonts.ThemeFontMedium}
                    />
                  </Wrap>
                </Row>
                <Divider color={Theme.colors.lightGray} />
              </Wrap>

              <Wrap autoMargin={false}>
                {deviceDetails &&
                  Array.isArray(deviceDetails) &&
                  deviceDetails.length > 0 && (
                    <>
                      {deviceDetails.map((item, index) => {
                        return (
                          <DeviceInfoList
                            key={index.toString()}
                            item={item}
                            borderBottom={
                              index >= 0 ? (
                                <Divider color={Theme.colors.lightGray} />
                              ) : null
                            }
                          />
                        );
                      })}
                    </>
                  )}
              </Wrap>
            </Wrap>
          </Wrap>
        </Wrap>
      </AppContainer>
      <Wrap
        autoMargin={false}
        style={{
          position: 'absolute',
          bottom: 70,
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Button
          // type={'link'}
          title={viewAdvanceDetails ? 'DONE' : 'VIEW ADVANCE DETAILS'}
          onPress={() => {
            setViewAdvanceDetails(!viewAdvanceDetails);
          }}
          textStyle={{
            fontSize: 12,
            fontFamily: Theme.fonts.ThemeFontMedium,
            color: Theme.colors.white,
          }}
          style={{
            borderColor: Theme.colors.primaryColor,
          }}
        />
      </Wrap>
      <DeviceBottomTab tabs={TABS} />
    </>
  );
};

export default Index;
