import React, {useEffect, useState} from 'react';
import {Keyboard, FlatList, DeviceEventEmitter} from 'react-native';
import Theme from 'src/theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  parseDateTimeInFormat,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Toggle from 'src/components/Toggle';
import {BLEService} from 'src/services/BLEService/BLEService';
import {getCalculatedValue, getFlowRateRangeGen1} from './helper';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mapValueGen2} from 'src/utils/Helpers/project';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {referrer, settings, settingsData} = route?.params;

  const FLOW_RATES = getFlowRateRangeGen1();
  const [flowRateTypeDivider, setFlowRateTypeDivider] = useState(10);
  const [flowRateType, setFlowRateType] = useState('1');
  const [flowRate, setFlowRate] = useState('');
  const [flowRateOld, setFlowRateOld] = useState('');
  const [other, setOther] = useState('');

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'flowRate useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'flowRate useEffect BLEService.onDeviceDisconnected device==>',
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

  useEffect(() => {
    // consoleLog('SensorRange==>', {
    //   referrer,
    //   settings,
    //   settingsData,
    // });
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    let __flowRate = settingsData?.flowRate?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject('flowRate', deviceSettingsData?.FlowRate, {
      searchKey: 'name',
    });

    if (!isObjectEmpty(resultObj)) {
      __flowRate = resultObj?.newValue;
    }
    setFlowRate(__flowRate);
  };

  useEffect(() => {
    checkForOtherInitialValue();
    DeviceEventEmitter.addListener('FlowRateInputEvent', eventData => {
      // consoleLog("FlowRateInputEvent eventData==>", eventData);
      flowRateInputEventCallback(eventData);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('FlowRateInputEvent');
    };
  }, []);

  const checkForOtherInitialValue = () => {
    const isPrefixedValue = findObject(flowRateOld, FLOW_RATES, {
      searchKey: 'name',
    });
    if (isObjectEmpty(isPrefixedValue)) {
      setOther(flowRateOld);
    }
  };

  const flowRateInputEventCallback = (eventData: any) => {
    if (eventData?.flowRateInput) {
      const val: string | number = (eventData?.flowRateInput * 10)?.toString();
      // consoleLog("flowRateInputEventCallback val==>", val);
      setOther(val);
      setFlowRate(val);
    }
  };

  const __setFlowRate = (val: string) => {
    if (parseInt(val) == 0) {
      if (flowRateType == '1') {
        NavigationService.navigate('FlowRateInput', {
          title: I18n.t('settings.CONFIRM_FLOW_RATE_MESSAGE_1'),
          subTitle: 'LPM',
          minValue: 1.3,
          maxValue: 9.9,
          flowRateType: flowRateType,
        });
      } else {
        NavigationService.navigate('FlowRateInput', {
          title: I18n.t('settings.CONFIRM_FLOW_RATE_MESSAGE_2'),
          subTitle: 'GPM',
          minValue: 0.3,
          maxValue: 2.6,
          flowRateType: flowRateType,
        });
      }
    } else {
      setOther('');
      setFlowRate(val);
    }
  };

  const onDonePress = () => {
    Keyboard.dismiss();
    if (BLEService.deviceGeneration == 'gen1') {
      onDonePressGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      onDonePressGen2();
    } else if (BLEService.deviceGeneration == 'flusher') {
      // This setting is no longer using for flusher
    } else if (BLEService.deviceGeneration == 'basys') {
      onDonePressBasys();
    }
  };

  const onDonePressGen1 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.flowRate?.value != flowRate) {
      params.push({
        name: 'flowRate',
        serviceUUID: BLE_CONSTANTS.GEN1.FLOW_RATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.FLOW_RATE_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flowRate?.value,
        newValue: flowRate,
      });

      // params.push({
      //   name: 'flowRateRangeDate',
      //   serviceUUID: BLE_CONSTANTS.GEN1.FLOW_RATE_DATE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN1.FLOW_RATE_DATE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: parseDateTimeInFormat(new Date(), dateFormat),
      //   allowedInPreviousSettings: false,
      // });

      // params.push({
      //   name: 'flowRateRangePhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.FLOW_RATE_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN1.FLOW_RATE_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {FlowRate: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  const onDonePressGen2 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.flowRate?.value != flowRate) {
      params.push({
        name: 'flowRate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flowRate?.value,
        newValue: flowRate,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.FLOW_RATE_AD,
          flowRate,
        ),
      });

      params.push({
        name: 'flowRateDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_LAST_FLOW_RATE_CHANGE,
          timestampInSec(),
        ),
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {FlowRate: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  const onDonePressBasys = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.flowRate?.value != flowRate) {
      params.push({
        name: 'flowRate',
        serviceUUID: BLE_CONSTANTS.BASYS.FLOW_RATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.BASYS.FLOW_RATE_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flowRate?.value,
        newValue: flowRate,
      });

      // params.push({
      //   name: 'flowRateRangeDate',
      //   serviceUUID: BLE_CONSTANTS.BASYS.FLOW_RATE_DATE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.BASYS.FLOW_RATE_DATE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: parseDateTimeInFormat(new Date(), dateFormat),
      //   allowedInPreviousSettings: false,
      // });

      // params.push({
      //   name: 'flowRateRangePhone',
      //   serviceUUID: BLE_CONSTANTS.BASYS.FLOW_RATE_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.BASYS.FLOW_RATE_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {FlowRate: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**Child flatlist render method */
  const renderItem = ({item}: any) => {
    return (
      <Wrap
        autoMargin={false}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          // borderWidth: 1,
        }}>
        <Button
          type={'link'}
          title={getCalculatedValue(
            item?.value,
            flowRateTypeDivider,
            flowRateType,
            other,
          )}
          onPress={() => {
            __setFlowRate(item?.value);
          }}
          textStyle={{
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontLight,
            color:
              flowRate == item?.value
                ? Theme.colors.primaryColor
                : Theme.colors.primaryColor3,
          }}
          style={{
            borderColor: Theme.colors.primaryColor3,
            backgroundColor:
              flowRate == item?.value || (parseInt(item?.value) == 0 && other)
                ? Theme.colors.white
                : Theme.colors.primaryColor2,
            height: 60,
            width: 60,
            borderRadius: 60 / 2,
          }}
        />
      </Wrap>
    );
  };

  return (
    <AppContainer scroll={false} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.row}>
              <Typography
                size={18}
                text={I18n.t('settings.CONFIRM_FLOW_RATE_TITLE')}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.row}>
              <Wrap
                autoMargin={false}
                style={[styles.col, {width: 200, alignSelf: 'center'}]}>
                <Toggle
                  selected={flowRateType}
                  options={[
                    {id: '0', name: 'GPM', value: '0'},
                    {id: '1', name: 'LPM', value: '1'},
                  ]}
                  onSelect={(resonse: any) => {
                    setFlowRateType(resonse?.value);
                  }}
                />
              </Wrap>
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[
                styles.row,
                {
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={FLOW_RATES}
                renderItem={renderItem}
                keyExtractor={(item, index) => index?.toString()}
                onEndReachedThreshold={0.01}
              />
            </Wrap>
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <Button
                type={'link'}
                title={I18n.t('button_labels.DONE_BUTTON_LABEL')}
                onPress={() => {
                  onDonePress();
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontMedium,
                  color: Theme.colors.white,
                }}
                style={{
                  borderColor: Theme.colors.white,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
