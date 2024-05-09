import React, {useEffect, useState} from 'react';
import Theme from 'src/theme';
import {useSelector} from 'react-redux';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {
  isObjectEmpty,
  chunk,
  findObject,
  findIndexObject,
} from 'src/utils/Helpers/array';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import DeviceInfoList from 'src/components/@ProjectComponent/DeviceInfoList';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import {TABS} from 'src/utils/StaticData/StaticData';
import {getDeviceInfoNormal, getDeviceInfoAdvance} from './helperGen1';
import {getDeviceInfoNormalGen2} from './helperGen2';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {BLE_GEN2_GATT_SERVICES} from 'src/utils/StaticData/BLE_GEN2_GATT_SERVICES';
import {hexToDecimal, addSeparatorInString} from 'src/utils/Helpers/encryption';
import moment from 'moment';

const Index = ({navigation, route}: any) => {
  const {referrer} = route?.params || {referrer: undefined};
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewAdvanceDetails, setViewAdvanceDetails] = useState<boolean>(false);
  const connectedDevice = BLEService.getDevice();
  const [deviceDetails, setDeviceDetails] = useState<any>();

  /** Function comments */
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

  /** Function comments */
  const initializeGen1 = () => {
    if (!viewAdvanceDetails) {
      initializeNormal();
    } else {
      initializeAdvance();
    }
  };

  /** Function comments */
  const initializeGen2 = async () => {
    if (!viewAdvanceDetails) {
      initializeNormalGen2();
    } else {
      // initializeAdvanceGen2();
    }
  };

  /** Function comments */
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

  /** Function comments */
  const initializeAdvance = async () => {
    try {
      setLoading(true);
      var deviceInfoAdvance = await getDeviceInfoAdvance();
      var userData = await getUserData();
      // consoleLog('initializeAdvance deviceInfoAdvance==>', deviceInfoAdvance);

      const resultObj = findObject(
        'Phone of last factory reset',
        deviceInfoAdvance,
        {
          searchKey: 'name',
        },
      );
      consoleLog('initializeAdvance resultObj==>', resultObj);

      if (!isObjectEmpty(resultObj) && resultObj?.value == 'MANUAL') {
        const resultObj2 = findObject(
          'Operating hours since install',
          deviceInfoAdvance,
          {
            searchKey: 'name',
          },
        );
        consoleLog('initializeAdvance resultObj2==>', resultObj2);

        const resultObj3 = deviceInfoAdvance.findIndex((item: any) => {
          return item?.name == 'D/T of last factory reset';
        });

        consoleLog('initializeAdvance resultObj3==>', resultObj3);
        if (resultObj3 >= 0) {
          const formattedDate = moment(Date.now())
            .subtract(resultObj2?.value, 's')
            .format('YYYY/MM/DD');
          // console.log('formattedDate', formattedDate);

          deviceInfoAdvance[resultObj3] = {
            ...resultObj,
            value: formattedDate,
          };

          consoleLog(
            'initializeAdvance deviceInfoAdvance[resultObj3]==>',
            deviceInfoAdvance[resultObj3],
          );
        }
      }

      setDeviceDetails([...deviceInfoAdvance, ...userData]);
    } catch (error) {
      //
    } finally {
    }
    setLoading(false);
  };

  /** Function comments */
  const initializeNormalGen2 = async () => {
    setLoading(true);
    const deviceStaticData = BLEService.connectedDeviceStaticData;
    consoleLog(
      'initializeNormalGen2 called',
      BLEService.characteristicMonitorDeviceDataIntegers,
    );

    const __mappingDeviceDataIntegersGen2 =
      BLEService.characteristicMonitorDeviceDataIntegersMapped;

    consoleLog(
      'initializeGen2 __mappingDeviceDataIntegersGen2==>',
      __mappingDeviceDataIntegersGen2,
    );

    var normalDataGen2: any = [];
    if (
      __mappingDeviceDataIntegersGen2?.chunks &&
      Array.isArray(__mappingDeviceDataIntegersGen2?.chunks)
    ) {
      __mappingDeviceDataIntegersGen2?.chunks.forEach((element, index) => {
        if (element?.uuidData && Array.isArray(element?.uuidData)) {
          element?.uuidData.forEach((element2, index2) => {
            if (element2) {
              normalDataGen2.push({
                name: element2?.name?.name,
                value: element2?.value?.currentValue ?? 'N/A',
                uuid: `${index}-${index2}`,
              });
            }
          });
        }
      });
    }

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

    setDeviceDetails([...sloanModel, ...normalDataGen2, ...batteryStatus]);
    setLoading(false);
  };

  /** Function comments */
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
