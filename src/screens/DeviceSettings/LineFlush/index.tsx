import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Theme from 'src/theme';
import {
  consoleLog,
  parseDateTimeInFormat,
  showSimpleAlert,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import {BLEService} from 'src/services/BLEService/BLEService';
import {useDispatch, useSelector} from 'react-redux';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mapValueGen2} from 'src/utils/Helpers/project';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const {referrer, settings, settingsData} = route?.params;

  const [flush, setFlush] = useState<any>('');
  const [flushTime, setFlushTime] = useState<any>('');
  const [flushInterval, setFlushInterval] = useState<any>('');

    /** component hooks method for device disconnect checking */
    useEffect(() => {
      const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
        (error, device) => {
          consoleLog(
            'LineFlush useEffect BLEService.onDeviceDisconnected error==>',
            error,
          );
          // consoleLog(
          //   'LineFlush useEffect BLEService.onDeviceDisconnected device==>',
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
    
  /** component hooks method */
  useEffect(() => {
    // consoleLog('DeviceSettingsList deviceSettingsData', deviceSettingsData);
    initlizeApp();
  }, []);

  /**
   * initlizeApp
   * @returns value
   */
  const initlizeApp = async () => {
    let __flush = settingsData?.flush?.value ?? '';
    let __flushTime = settingsData?.flushTime?.value ?? '';
    let __flushInterval = settingsData?.flushInterval?.value ?? '';

    consoleLog('initlizeApp==>', {
      __flush,
      __flushTime,
      __flushInterval,
    });
    // Handle unsaved value which were changed
    const resultObj = findObject('flush', deviceSettingsData?.LineFlush, {
      searchKey: 'name',
    });
    // consoleLog('mapModeSelectionValue resultObj==>', resultObj);

    if (!isObjectEmpty(resultObj)) {
      __flush = resultObj?.newValue;
    }

    const resultObj2 = findObject('flushTime', deviceSettingsData?.LineFlush, {
      searchKey: 'name',
    });
    if (!isObjectEmpty(resultObj)) {
      __flushTime = resultObj2?.newValue;
    }
    const resultObj3 = findObject(
      'flushInterval',
      deviceSettingsData?.LineFlush,
      {
        searchKey: 'name',
      },
    );
    if (!isObjectEmpty(resultObj3)) {
      __flushInterval = resultObj3?.newValue;
    }

    setFlush(__flush);
    setFlushTime(__flushTime);
    setFlushInterval(__flushInterval);
  };

  const onDonePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      if (BLEService.deviceGeneration == 'gen1') {
        onDonePressGen1();
      } else if (BLEService.deviceGeneration == 'gen2') {
        onDonePressGen2();
      } else if (BLEService.deviceGeneration == 'gen3') {
        // Code need to be implemented
      } else if (BLEService.deviceGeneration == 'gen4') {
        // Code need to be implemented
      }
    }
  };

  const onDonePressGen1 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';

    // consoleLog('onDonePressGen1', {
    //   old: settingsData?.flush?.value,
    //   flush,
    //   activationModeSecOld,
    //   activationModeSec,
    // });
    // return false;

    if (settingsData?.flush?.value != flush) {
      params.push({
        name: 'flush',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.FLUSH_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flush?.value,
        newValue: flush,
      });

      params.push({
        name: 'flushDate',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_DATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.FLUSH_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      params.push({
        name: 'flushPhone',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_PHONE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.FLUSH_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.user_metadata?.phone_number ?? '0123456789',
        allowedInPreviousSettings: false,
      });
    }

    if (
      settingsData?.flush?.value != flush ||
      settingsData?.flushTime?.value != flushTime
    ) {
      params.push({
        name: 'flushTime',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_TIME_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.FLUSH_TIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushTime?.value,
        newValue: flushTime,
      });

      params.push({
        name: 'flushTimeDate',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_TIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.FLUSH_TIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      params.push({
        name: 'flushTimePhone',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_TIME_PHONE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.FLUSH_TIME_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.user_metadata?.phone_number ?? '0123456789',
        allowedInPreviousSettings: false,
      });
    }

    if (
      settingsData?.flush?.value != flush ||
      settingsData?.flushInterval?.value != flushInterval
    ) {
      params.push({
        name: 'flushInterval',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushInterval?.value,
        newValue: flushInterval,
      });

      params.push({
        name: 'flushIntervalDate',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      params.push({
        name: 'flushIntervalPhone',
        serviceUUID: BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_PHONE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.FLUSH_INTERVAL_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.user_metadata?.phone_number ?? '0123456789',
        allowedInPreviousSettings: false,
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {LineFlush: params},
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

    // consoleLog('onDonePressGen1', {
    //   old: settingsData?.flush?.value,
    //   flush,
    //   activationModeSecOld,
    //   activationModeSec,
    // });
    // return false;

    if (settingsData?.flush?.value != flush) {
      params.push({
        name: 'flush',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flush?.value,
        newValue: flush,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.FLUSH_ENABLE,
          flush,
        ),
      });

      params.push({
        name: 'flushDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_FLUSH_ENABLE_CHANGE,
          timestampInSec(),
        ),
      });
    }

    if (
      settingsData?.flush?.value != flush ||
      settingsData?.flushTime?.value != flushTime
    ) {
      params.push({
        name: 'flushTime',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushTime?.value,
        newValue: flushTime,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.FLUSH_TIME_DURATION_TEMP_Z1,
          flushTime,
        ),
      });

      params.push({
        name: 'flushTimeDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_FLUSH_TIME_CHANGE,
          timestampInSec(),
        ),
      });
    }

    if (
      settingsData?.flush?.value != flush ||
      settingsData?.flushInterval?.value != flushInterval
    ) {
      params.push({
        name: 'flushInterval',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushInterval?.value,
        newValue: flushInterval,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.FLUSH_INTERVAL_TEMP_Z1,
          flushInterval,
        ),
      });

      params.push({
        name: 'flushIntervalDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_FLUSH_INTERVAL_CHANGE,
          timestampInSec(),
        ),
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {LineFlush: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**validation checking for email */
  const checkValidation = () => {
    if (flush == '0') {
      return true;
    }
    if (flushTime.trim() === '') {
      showSimpleAlert('Please enter timeout in seconds');
      return false;
    } else if (Number(flushTime) < 3) {
      showSimpleAlert('Timeout seconds can`t be less than 3');
      return false;
    } else if (Number(flushTime) > 1200) {
      showSimpleAlert('Timeout seconds can`t be greater than 1200');
      return false;
    } else if (flushInterval.trim() === '') {
      showSimpleAlert('Please enter timeout in hours');
      return false;
    } else if (Number(flushInterval) < 0) {
      showSimpleAlert('Interval hours can`t be less than 0');
      return false;
    } else if (Number(flushInterval) > 72) {
      showSimpleAlert('Interval hours can`t be greater than 72');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer scroll={true} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.row}>
              <Typography
                size={18}
                text={`Line Flush`}
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
                  selected={flush}
                  options={[
                    {value: '0', name: 'OFF'},
                    {value: '1', name: 'ON'},
                  ]}
                  onSelect={(response: any) => {
                    setFlush(response?.value);
                  }}
                />
              </Wrap>
            </Wrap>

            {flush == '1' && (
              <Wrap autoMargin={true} style={[styles.row, {marginTop: 40}]}>
                <Typography
                  size={12}
                  text={`Set duration and frequency`}
                  style={{textAlign: 'center', marginBottom: 10}}
                  color={Theme.colors.white}
                  ff={Theme.fonts.ThemeFontLight}
                />

                <Row autoMargin={false}>
                  <Wrap autoMargin={false} style={{flex: 1}}>
                    <Input
                      onRef={input => {
                        // @ts-ignore
                        lineFlushTimeTextInputRef = input;
                      }}
                      onChangeText={text => setFlushTime(text)}
                      onSubmitEditing={() => {
                        // @ts-ignore
                        lineFlushIntervalTextInputRef.focus();
                      }}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      keyboardType="numeric"
                      placeholder=""
                      value={flushTime}
                      inputContainerStyle={styles.inputContainer}
                      inputStyle={styles.textInput}
                    />
                    <Typography
                      size={12}
                      text={`Seconds`}
                      style={{textAlign: 'center', marginTop: 5}}
                      color={Theme.colors.white}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Wrap>
                  <Wrap autoMargin={false} style={{width: 50}}>
                    <Input inputContainerStyle={{opacity: 0}} />
                    <Typography
                      size={12}
                      text={`every`}
                      style={{textAlign: 'center', marginTop: 5}}
                      color={Theme.colors.white}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Wrap>
                  <Wrap autoMargin={false} style={{flex: 1}}>
                    <Input
                      onRef={input => {
                        // @ts-ignore
                        lineFlushIntervalTextInputRef = input;
                      }}
                      onChangeText={text => setFlushInterval(text)}
                      onSubmitEditing={() => {
                        // @ts-ignore
                        Keyboard.dismiss();
                      }}
                      returnKeyType="done"
                      blurOnSubmit={false}
                      keyboardType="numeric"
                      placeholder=""
                      value={flushInterval}
                      inputContainerStyle={styles.inputContainer}
                      inputStyle={styles.textInput}
                    />
                    <Typography
                      size={12}
                      text={`Hours`}
                      style={{textAlign: 'center', marginTop: 5}}
                      color={Theme.colors.white}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Wrap>
                </Row>
              </Wrap>
            )}
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <Button
                type={'link'}
                title="DONE"
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
