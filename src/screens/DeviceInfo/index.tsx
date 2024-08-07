import React, {useEffect, useState} from 'react';
import Theme from 'src/theme';
import {useSelector} from 'react-redux';
import {
  consoleLog,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty, findObject} from 'src/utils/Helpers/array';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import DeviceInfoList from 'src/components/@ProjectComponent/DeviceInfoList';
import {getDeviceInfoNormal, getDeviceInfoAdvance} from './helperGen1';
import moment from 'moment';
import {formatCharateristicValue} from 'src/utils/Helpers/project';
import {constants} from 'src/common';
import apiConfigs from 'src/network/apiConfig';
import _ from 'lodash';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import NavigationService from 'src/services/NavigationService/NavigationService';
import LoaderOverlay from 'src/components/LoaderOverlay';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const {referrer} = route?.params || {referrer: undefined};
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewAdvanceDetails, setViewAdvanceDetails] = useState<boolean>(false);
  const connectedDevice = BLEService.getDevice();
  const [deviceDetails, setDeviceDetails] = useState<any>();

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'DeviceInfo useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'DeviceInfo useEffect BLEService.onDeviceDisconnected device==>',
        //   device,
        // );
        if (error || error == null) {
          showToastMessage('Your device was disconnected', 'danger');
          NavigationService.resetAllAction('DeviceSearching');
        }
      },
    );

    return () => deviceDisconnectionListener?.remove();
  }, []);

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
      initializeAdvanceGen2();
    }
  };

  /** This is for gen1 */
  const initializeNormal = async () => {
    try {
      setLoading(true);
      const deviceStaticData = BLEService.connectedDeviceStaticData;
      consoleLog('initializeNormal deviceStaticData==>', deviceStaticData);
      // setDeviceData(deviceStaticData);
      const deviceInfoNormal = await getDeviceInfoNormal();
      // consoleLog('ADBDInformationARR', ADBDInformationARR);
      const sortedDeviceInfoNormal = _.sortBy(deviceInfoNormal, 'position');

      var sloanModel: any = [];
      if (deviceStaticData) {
        sloanModel = [
          {
            name: I18n.t('device_details.FAUCET_MODEL_LABEL'),
            value: deviceStaticData?.fullNameAllModel,
            uuid: null,
          },
        ];
      }

      const batteryStatus = [
        {
          name: I18n.t('device_details.BATTERY_STATUS_LABEL'),
          value: `${BLEService.batteryLevel}%`,
          uuid: null,
        },
      ];

      setDeviceDetails([
        ...sloanModel,
        ...sortedDeviceInfoNormal,
        ...batteryStatus,
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /** This is for gen1 */
  const initializeAdvance = async () => {
    try {
      setLoading(true);
      var deviceInfoAdvance = await getDeviceInfoAdvance();
      var appInfo = await getAppInfo();
      var userData = await getUserData();
      // consoleLog('initializeAdvance deviceInfoAdvance==>', deviceInfoAdvance);

      const resultObj = findObject(
        'Date of last factory reset',
        deviceInfoAdvance,
        {
          searchKey: 'name',
        },
      );
      consoleLog('initializeAdvance resultObj==>', resultObj);

      const sortedDeviceInfoAdvancel = _.sortBy(deviceInfoAdvance, 'position');

      if (!isObjectEmpty(resultObj) && resultObj?.value == 'MANUAL') {
        // Hours Of Operation -> d0aba888-fb10-4dc9-9b17-bdd8f490c911
        const resultObj2 = findObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c911',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
          },
        );
        consoleLog('initializeAdvance resultObj2==>', resultObj2);

        // Date of last factory reset -> d0aba888-fb10-4dc9-9b17-bdd8f490c921
        const resultObj3 = deviceInfoAdvance.findIndex((item: any) => {
          return item?.uuid == 'd0aba888-fb10-4dc9-9b17-bdd8f490c921';
        });

        consoleLog('initializeAdvance resultObj3==>', resultObj3);
        if (!isObjectEmpty(resultObj2) && resultObj3 >= 0) {
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

      setDeviceDetails([...sortedDeviceInfoAdvancel, ...appInfo, ...userData]);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  /** This is for gen2 */
  const initializeNormalGen2 = async () => {
    setLoading(true);
    consoleLog('initializeNormalGen2 called');
    __mappingDeviceDataStringGen2();
    // var __characteristicMonitorDeviceDataString: string[] = [];

    // // Device data string
    // BLEService.setupMonitor(
    //   BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_SERVICE_UUID,
    //   BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_CHARACTERISTIC_UUID,
    //   characteristic => {
    //     // consoleLog('initializeNormalGen2 characteristic==>', characteristic);
    //     if (characteristic?.value) {
    //       var deviceDataStringHex = base64ToHex(characteristic?.value);
    //       consoleLog(
    //         'initializeNormalGen2 deviceDataStringHex==>',
    //         deviceDataStringHex,
    //       );
    //       if (deviceDataStringHex == '71ff04') {
    //         BLEService.characteristicMonitorDeviceDataString =
    //           __characteristicMonitorDeviceDataString;
    //         BLEService.finishMonitor();
    //         __mappingDeviceDataStringGen2();
    //       } else {
    //         __characteristicMonitorDeviceDataString.push(deviceDataStringHex);
    //       }
    //     }
    //   },
    //   error => {
    //     consoleLog('setupMonitor error==>', error);
    //   },
    // );
  };

  /** This is for gen2 */
  const initializeAdvanceGen2 = async () => {
    setLoading(true);
    consoleLog('initializeAdvanceGen2 called');
    __mappingDeviceDataIntegersGen2();
    // var __characteristicMonitorDeviceDataIntegers: string[] = [];

    // // Device data string
    // BLEService.setupMonitor(
    //   BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_SERVICE_UUID,
    //   BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
    //   characteristic => {
    //     // consoleLog('initializeNormalGen2 characteristic==>', characteristic);
    //     if (characteristic?.value) {
    //       var deviceDataStringHex = base64ToHex(characteristic?.value);
    //       consoleLog(
    //         'initializeNormalGen2 deviceDataStringHex==>',
    //         deviceDataStringHex,
    //       );
    //       if (deviceDataStringHex == '71ff04') {
    //         BLEService.characteristicMonitorDeviceDataIntegers =
    //           __characteristicMonitorDeviceDataIntegers;
    //         BLEService.finishMonitor();
    //         __mappingDeviceDataIntegersGen2();
    //       } else {
    //         __characteristicMonitorDeviceDataIntegers.push(deviceDataStringHex);
    //       }
    //     }
    //   },
    //   error => {
    //     consoleLog('setupMonitor error==>', error);
    //   },
    // );
  };

  /** Function comments */
  const __mappingDeviceDataStringGen2 = async () => {
    // const mappingDeviceDataStringGen2Response =
    //   await mappingDeviceDataStringGen2(
    //     BLE_GEN2_GATT_SERVICES,
    //     BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_SERVICE_UUID,
    //     BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_CHARACTERISTIC_UUID,
    //     BLEService.characteristicMonitorDeviceDataString,
    //   );

    // consoleLog(
    //   '__mappingDeviceDataStringGen2 mappingDeviceDataStringGen2Response==>',
    //   JSON.stringify(mappingDeviceDataStringGen2Response),
    // );

    // BLEService.characteristicMonitorDeviceDataStringMapped =
    //   mappingDeviceDataStringGen2Response;
    __mappingDeviceDataStringGen2Data();
  };

  /** Function comments */
  const __mappingDeviceDataStringGen2Data = async () => {
    consoleLog('__mappingDeviceDataStringGen2Data called');

    try {
      const deviceStaticData = BLEService.connectedDeviceStaticData;
      const __mappingDeviceDataStringGen2 =
        BLEService.characteristicMonitorDeviceDataStringMapped;

      consoleLog(
        '__mappingDeviceDataStringGen2Data __mappingDeviceDataStringGen2==>',
        __mappingDeviceDataStringGen2,
      );

      var allData: any = [];
      if (
        __mappingDeviceDataStringGen2?.chunks &&
        Array.isArray(__mappingDeviceDataStringGen2?.chunks)
      ) {
        __mappingDeviceDataStringGen2?.chunks.forEach(
          (element: any, index: number) => {
            if (element?.uuidData && Array.isArray(element?.uuidData)) {
              element?.uuidData.forEach((element2: any, index2: number) => {
                if (element2 && element2?.displayInList !== false) {
                  allData.push({
                    name: element2?.name?.name,
                    nameLocale: `${I18n.t(
                      'device_details.' + element2?.name?.nameLocaleKey,
                    )}`,
                    position: element2?.position,
                    // value: element2?.value?.currentValue ?? 'N/A',
                    value: formatCharateristicValue(
                      element2?.value,
                      element2?.value?.currentValue,
                    ),
                    uuid: `${index}-${index2}`,
                  });
                }
              });
            }
          },
        );
      }

      const __mappingDeviceDataCollectionGen2 =
        BLEService.characteristicMonitorDataCollectionMapped;
      const controlBoxModel =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[1];

      if (!isObjectEmpty(controlBoxModel)) {
        /**
         * BD SKU -> Control Box Model
         */
        allData.push({
          name: 'Control Box Model',
          nameLocale: `${I18n.t('device_details.CONTROL_BOX_MODEL_LABEL')}`,
          position: 6,
          value: controlBoxModel?.value?.currentValue,
          uuid: null,
        });
      }

      var sortedObjs = _.sortBy(allData, 'position');

      var sloanModel: any = [];
      if (deviceStaticData) {
        sloanModel = [
          {
            name: 'FAUCET MODEL',
            nameLocale: `${I18n.t('device_details.FAUCET_MODEL_LABEL')}`,
            value: deviceStaticData?.fullNameAllModel,
            uuid: null,
            position: 1,
          },
        ];
      }

      const batteryStatus = [
        {
          name: 'Battery Status',
          nameLocale: `${I18n.t('device_details.BATTERY_STATUS_LABEL')}`,
          value: `${BLEService.batteryLevel}%`,
          uuid: null,
          position: 11,
        },
      ];

      setDeviceDetails([...sloanModel, ...sortedObjs, ...batteryStatus]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2 = async () => {
    // const mappingDeviceDataIntegersGen2Response =
    //   await mappingDeviceDataIntegersGen2(
    //     BLE_GEN2_GATT_SERVICES,
    //     BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_SERVICE_UUID,
    //     BLE_CONSTANTS?.GEN2?.DEVICE_DATA_STRING_CHARACTERISTIC_UUID,
    //     BLEService.characteristicMonitorDeviceDataIntegers,
    //   );

    // consoleLog(
    //   '__mappingDeviceDataIntegersGen2 mappingDeviceDataIntegersGen2Response==>',
    //   JSON.stringify(mappingDeviceDataIntegersGen2Response),
    // );

    // BLEService.characteristicMonitorDeviceDataIntegersMapped =
    //   mappingDeviceDataIntegersGen2Response;
    __mappingDeviceDataIntegersGen2Data();
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2Data = async () => {
    consoleLog('__mappingDeviceDataIntegersGen2Data called');
    try {
      const __mappingDeviceDataIntegersGen2 =
        BLEService.characteristicMonitorDeviceDataIntegersMapped;

      consoleLog(
        '__mappingDeviceDataIntegersGen2Data __mappingDeviceDataIntegersGen2==>',
        __mappingDeviceDataIntegersGen2,
      );

      var allData: any = [];

      /**
       * For the date of installation, logic is this:
       * For “Date of Installation”, this one is calculated from the Today date and the “Hours of Operation (Operating hours since install)”.
       * For example:
       * if current unix timestamp in the App is 1714752879, which means (Date and time (GMT): Friday, May 3, 2024 4:14:39 PM)
       * “Hours of Operation” = 100 hours, which means 100*60*60 = 360000 seconds.
       * Then the timestamp of “Installation” is = 1714752879 - 360000 = 1714392879
       * which means the “Date of Installation” is Monday, April 29, 2024  (GMT)
       * ACCUMULATED WATER USAGE -> Total water usage
       */
      const __mappingDeviceDataCollectionGen2 =
        BLEService.characteristicMonitorDataCollectionMapped;
      const operatingHoursSinceInstall =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[2];

      if (!isObjectEmpty(operatingHoursSinceInstall)) {
        /**
         * Hours of Operation -> Operating hours since install
         */
        allData.push({
          name: 'Hours of Operation',
          nameLocale: `${I18n.t('device_details.HOURS_OF_OPERATION_LABEL')}`,
          position: 1,
          value: operatingHoursSinceInstall?.value?.currentValue,
          uuid: null,
        });

        const __operatingHoursSinceInstall = operatingHoursSinceInstall
          ? parseInt(operatingHoursSinceInstall?.value?.currentValue)
          : 0;

        const __operatingHoursSinceInstallInSecs =
          __operatingHoursSinceInstall * 60 * 60;
        const currentTimestamp = timestampInSec();
        const dateOfInstallTimestamp =
          currentTimestamp - __operatingHoursSinceInstallInSecs;
        allData.push({
          name: 'Date of installation',
          nameLocale: `${I18n.t('device_details.DATE_OF_INSTALLATION_LABEL')}`,
          position: 0,
          value: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
          uuid: null,
        });
      }

      /**
       * ACTIVATION SINCE DAY 1 -> Activations since install
       */
      const activationsSinceInstall =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[3];
      if (!isObjectEmpty(activationsSinceInstall)) {
        allData.push({
          name: 'Activations since day 1',
          nameLocale: `${I18n.t(
            'device_details.ACTIVATION_SINCE_DAY_1_LABEL',
          )}`,
          position: 5,
          value: formatCharateristicValue(
            activationsSinceInstall?.value,
            activationsSinceInstall?.value?.currentValue,
          ),
          uuid: null,
        });
      }

      /**
       * Accumulated activation time usage -> Duration of all activations
       */
      const durationOfAllActivations =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[5];

      if (!isObjectEmpty(durationOfAllActivations)) {
        allData.push({
          name: 'Accumulated activation time',
          nameLocale: `${I18n.t(
            'device_details.ACCUMULATED_ACTIVATION_TIME_LABEL',
          )}`,
          position: 6,
          value: `${durationOfAllActivations?.value?.currentValue} sec`,
          uuid: null,
        });
      }

      /**
       * ACCUMULATED WATER USAGE -> Total water usage
       */
      const totalWaterUsage = BLEService.totalWaterUsase;
      const __totalWaterUsage = `${
        totalWaterUsage
          ? (totalWaterUsage / BLE_CONSTANTS.COMMON.GMP_FORMULA).toFixed(2)
          : 0
      } Gal`;
      allData.push({
        name: 'Accumulated water usage',
        nameLocale: `${I18n.t('device_details.ACCUMULATED_WATER_USAGE_LABEL')}`,
        position: 7,
        value: `${__totalWaterUsage} (${totalWaterUsage} L)`,
        uuid: null,
      });

      /**
       * Activations since last change
       */
      const activationsSinceLastChange =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[4];

      if (!isObjectEmpty(activationsSinceLastChange)) {
        allData.push({
          name: 'Activations since last change',
          nameLocale: `${I18n.t(
            'device_details.ACTIVATIONS_SINCE_LAST_CHANGE_LABEL',
          )}`,
          position: 8,
          value: activationsSinceLastChange?.value?.currentValue,
          uuid: null,
        });
      }

      /**
       * Line flushes since day 1 -> Number of Line flushes
       */
      const numberOfAllLineFlushes =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[7];

      if (!isObjectEmpty(numberOfAllLineFlushes)) {
        allData.push({
          name: 'Line flushes since day 1',
          nameLocale: `${I18n.t(
            'device_details.LINE_FLUSHES_SINCE_DAY_1_LABEL',
          )}`,
          position: 9,
          value: `${numberOfAllLineFlushes?.value?.currentValue}`,
          uuid: null,
        });
      }

      /**
       * Accumulated flush time -> Duration of all line flushes
       */
      const durationOfAllLineFlushes =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[6];

      if (!isObjectEmpty(durationOfAllLineFlushes)) {
        allData.push({
          name: 'Accumulated flush time',
          nameLocale: `${I18n.t(
            'device_details.ACCUMULATED_FLUSH_TIME_LABEL',
          )}`,
          position: 10,
          value: `${durationOfAllLineFlushes?.value?.currentValue} sec`,
          uuid: null,
        });
      }

      /**
       * Number of BLE connections
       */
      const numberOfBLEConnections =
        __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[9];

      if (!isObjectEmpty(numberOfBLEConnections)) {
        allData.push({
          name: 'Number Of BLE connections',
          nameLocale: `${I18n.t(
            'device_details.NUMBER_OF_BLE_CONNECTION_LABEL',
          )}`,
          position: 10,
          value: `${numberOfBLEConnections?.value?.currentValue}`,
          uuid: null,
        });
      }

      if (
        __mappingDeviceDataIntegersGen2?.chunks &&
        Array.isArray(__mappingDeviceDataIntegersGen2?.chunks)
      ) {
        __mappingDeviceDataIntegersGen2?.chunks.forEach(
          (element: any, index: number) => {
            if (element?.uuidData && Array.isArray(element?.uuidData)) {
              element?.uuidData.forEach((element2: any, index2: number) => {
                if (element2 && element2?.displayInList !== false) {
                  allData.push({
                    name: element2?.name?.name,
                    nameLocale: `${I18n.t(
                      'device_details.' + element2?.name?.nameLocaleKey,
                    )}`,
                    position: element2?.position,
                    // value: element2?.value?.currentValue ?? 'N/A',
                    value: formatCharateristicValue(
                      element2?.value,
                      element2?.value?.currentValue,
                    ),
                    uuid: `${index}-${index2}`,
                  });
                }
              });
            }
          },
        );
      }
      var sortedObjs = _.sortBy(allData, 'position');

      var appInfo = await getAppInfo();
      var userData = await getUserData();
      setDeviceDetails([...sortedObjs, ...appInfo, ...userData]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /** Function comments */
  const getAppInfo = () => {
    return new Promise<any>(async resolve => {
      var data = [];
      data.push({
        name: 'App version and release date',
        nameLocale: `${I18n.t('device_details.APP_VERSION_LABEL')}`,
        uuid: '6',
        // value: `3.0.1 2022/11/22`,
        value: `${constants.APP_VERSION} ${constants.RELEASE_DATE}`,
      });
      data.push({
        name: 'App Installation Date',
        nameLocale: `${I18n.t('device_details.APP_INSTALLATION_DATE_LABEL')}`,
        uuid: '7',
        value: apiConfigs?.app_install_time
          ? moment(apiConfigs?.app_install_time).format('YYYY/MM/DD HH:MM')
          : 'N/A',
      });
      resolve(data);
    });
  };

  /** Function comments */
  const getUserData = () => {
    return new Promise<any>(async resolve => {
      var data = [];
      if (typeof user != 'undefined' && Object.entries(user)) {
        data.push({
          name: 'User Name',
          nameLocale: `${I18n.t('device_details.USERNAME_LABEL')}`,
          uuid: '1',
          value: `${user?.first_name} ${user?.last_name}`,
        });
        data.push({
          name: 'User Phone #',
          nameLocale: `${I18n.t('device_details.USER_PHONE_LABEL')}`,
          uuid: '2',
          value: user?.user_metadata?.phone_number ?? 'N/A',
        });
        data.push({
          name: 'User Company',
          nameLocale: `${I18n.t('device_details.USER_COMPANY_LABEL')}`,
          uuid: '3',
          value: user?.user_metadata?.company ?? 'N/A',
        });
        data.push({
          name: 'User Title',
          nameLocale: `${I18n.t('device_details.USER_TITLE_LABEL')}`,
          uuid: '4',
          value: user?.user_metadata?.title ?? 'N/A',
        });
        data.push({
          name: 'User Email',
          nameLocale: `${I18n.t('device_details.USER_EMAIL_LABEL')}`,
          uuid: '5',
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
        // loading={loading}
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
                          ? I18n.t(
                              'device_details.ADVANCED_DEVICE_DETAILS_HEADING',
                            )
                          : I18n.t('device_details.DEVICE_DETAILS_HEADING')
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
          bottom: constants.BOTTOM_TAB_HEIGHT + 10,
          width: '100%',
          paddingHorizontal: 20,
          zIndex: 1,
        }}>
        <Button
          title={
            viewAdvanceDetails
              ? I18n.t('device_details.DONE_BTN_LABEL')
              : I18n.t('device_details.VIEW_ADVANCED_DETAILS_BTN_LABEL')
          }
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
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default Index;
