import React, {useEffect, useState} from 'react';
import Theme from 'src/theme';
import {useSelector} from 'react-redux';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty, chunk} from 'src/utils/Helpers/array';
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
      // consoleLog('StatisticsInformationArr', StatisticsInformationArr);
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

  /** Function comments */
  const mappingDeviceDataIntegersGen2 = async (
    __BLE_GATT_SERVICES: any,
    __DEVICE_DATA_INTEGER_SERVICE_UUID: string,
    __DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID: string,
    __allPack: string[],
  ) => {
    var result: any = [];
    consoleLog(
      'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES==>',
      __BLE_GATT_SERVICES,
    );
    consoleLog('mappingDeviceDataIntegersGen2 __allPack==>', __allPack);

    const __BLE_GATT_SERVICES_TMP =
      __BLE_GATT_SERVICES?.[__DEVICE_DATA_INTEGER_SERVICE_UUID];
    consoleLog(
      'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES_TMP==>',
      __BLE_GATT_SERVICES_TMP,
    );
    if (isObjectEmpty(__BLE_GATT_SERVICES_TMP)) {
      return result;
    }

    const __BLE_GATT_SERVICES_TMP2 =
      __BLE_GATT_SERVICES_TMP?.characteristics?.[
        __DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID
      ];
    consoleLog(
      'mappingDeviceDataIntegersGen2 __BLE_GATT_SERVICES_TMP2==>',
      __BLE_GATT_SERVICES_TMP2,
    );
    if (isObjectEmpty(__BLE_GATT_SERVICES_TMP2)) {
      return result;
    }

    // 0x72 LEN # of IDs 32
    // 1 byte 1 byte 1 byte 1 byte
    // ­Byte Position 0: Start Flag, Ox72 signals the start of Integers write payload.
    // Byte Position 1: Integer value for the byte length of the package (includes all header bytes and End Flag).
    // Byte Position 2: Integer value indicating how many Setting IDs to follow in Package.
    // Byte Position 3: Integer value 32 indicates the Setting Value Size 32 = 32-bit size.

    __allPack.forEach((element, index) => {
      if (element != '71ff04') {
        consoleLog('mappingDeviceDataIntegersGen2 index==>', index);
        consoleLog('mappingDeviceDataIntegersGen2 element==>', element);
        const __element = addSeparatorInString(element, 2, ' ');
        consoleLog('mappingDeviceDataIntegersGen2 __element==>', __element);
        const __elementArr = __element.split(' ');

        if (Array.isArray(__elementArr) && __elementArr?.[0] == '72') {
          consoleLog(
            'mappingDeviceDataIntegersGen2 __elementArr==>',
            __elementArr,
          );
          const lengthHex = __elementArr[2];
          const lengthDec = hexToDecimal(lengthHex);

          consoleLog(
            'mappingDeviceDataIntegersGen2 hexToDecimal==>',
            lengthDec,
          );

          const __elementArrTmp = [...__elementArr];
          __elementArrTmp.splice(0, 4);
          consoleLog(
            'mappingDeviceDataIntegersGen2 __elementArrTmp==>',
            __elementArrTmp,
          );

          const __elementArrTmpChunk = chunk(__elementArrTmp, 5);
          __elementArrTmpChunk.splice(-1);
          consoleLog(
            'mappingDeviceDataIntegersGen2 __elementArrTmpChunk==>',
            __elementArrTmpChunk,
          );

          const __uuidData = __BLE_GATT_SERVICES_TMP2?.chunks[index]?.uuidData;
          consoleLog('mappingDeviceDataIntegersGen2 __uuidData==>', __uuidData);

          if (isObjectEmpty(__uuidData)) {
            return false;
          }

          consoleLog(
            'mappingDeviceDataIntegersGen2 __elementArrTmpChunk.length==>',
            __elementArrTmpChunk.length,
          );
          consoleLog(
            'mappingDeviceDataIntegersGen2 __uuidData.length==>',
            __uuidData.length,
          );

          if (__elementArrTmpChunk.length < __uuidData.length) {
            return false;
          }

          __elementArrTmpChunk.forEach((characteristic, __index) => {
            consoleLog(
              'mappingDeviceDataIntegersGen2 characteristic==>',
              characteristic,
            );
            const __characteristic = [...characteristic];
            __characteristic.splice(0, 1);
            consoleLog(
              'mappingDeviceDataIntegersGen2 __characteristic==>',
              __characteristic,
            );
            const __characteristicHex = __characteristic.join('');
            consoleLog(
              'mappingDeviceDataIntegersGen2 __characteristicHex==>',
              __characteristicHex,
            );
            const __characteristicDec = hexToDecimal(__characteristicHex);
            consoleLog(
              'mappingDeviceDataIntegersGen2 __characteristicDec==>',
              __characteristicDec,
            );

            if (__uuidData?.[__index]?.value) {
              __uuidData[__index].value.currentValue = __characteristicDec;
            }
          });

          __BLE_GATT_SERVICES_TMP2.chunks[index].uuidData = __uuidData;
        }
      }
    });

    result = __BLE_GATT_SERVICES_TMP2;
    consoleLog('mappingDeviceDataIntegersGen2 result==>', result);
    return result;
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
