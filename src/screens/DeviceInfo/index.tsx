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
  base64EncodeDecode,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';
import {getDeviceInfoNormal, getDeviceInfoAdvance} from './helperGen1';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

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
    // consoleLog('deviceGen', deviceGen);
    if (BLEService.deviceGeneration == 'gen1') {
      initializeGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      initializeGen2();
    } else if (BLEService.deviceGeneration == 'gen3') {
      // code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // code need to be implemented
    }
  }, [viewAdvanceDetails]);

  const initializeGen1 = () => {
    if (!viewAdvanceDetails) {
      initializeNormal();
    } else {
      initializeAdvance();
    }
  };

  const initializeGen2 = () => {
    if (!viewAdvanceDetails) {
      initializeNormal();
    } else {
      initializeAdvance();
    }
  };

  const initializeNormal = async () => {
    setLoading(true);
    const deviceStaticData = BLEService.connectedDeviceStaticData;
    consoleLog('initializeNormal deviceStaticData==>', deviceStaticData);
    // setDeviceData(deviceStaticData);
    const deviceInfoNormal = await getDeviceInfoNormal();
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
        value: `${BLEService.batteryLevel}%`,
        uuid: '0000000',
      },
    ];

    setDeviceDetails([...sloanModel, ...deviceInfoNormal, ...batteryStatus]);
    setLoading(false);
  };

  const initializeAdvance = async () => {
    try {
      setLoading(true);
      var deviceInfoAdvance = await getDeviceInfoAdvance();
      var userData = await getUserData();
      // consoleLog('StatisticsInformationArr', StatisticsInformationArr);
      setDeviceDetails([...deviceInfoAdvance, ...userData]);
    } catch (error) {
      //
    } finally {
    }
    setLoading(false);
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

  return (
    <>
      <AppContainer
        scroll={true}
        scrollViewStyle={{}}
        backgroundType="solid"
        haslogOutButton={false}
        hasBackButton={true}
        loading={loading}
        headerContainerStyle={{
          backgroundColor: Theme.colors.primaryColor,
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
