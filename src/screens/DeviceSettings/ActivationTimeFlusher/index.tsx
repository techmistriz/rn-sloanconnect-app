import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Theme from 'src/theme';
import {useDispatch, useSelector} from 'react-redux';
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
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {constants} from 'src/common';
import {BLEService} from 'src/services/BLEService/BLEService';
import {ActivationTimeFlusherProps} from './types';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mapValueGen2} from 'src/utils/Helpers/project';
import Toggle from 'src/components/Toggle';

const defaultLineFlushRangeConfig = {min: 8, max: 28, step: 4};

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {referrer, settings, settingsData} = route?.params;

  const [flush, setFlush] = useState<any>('1');
  const [sensorRange, setSensorRange] = useState('');
  const [sensorRangeConfig, setSensorRangeConfig] =
    useState<ActivationTimeFlusherProps>(
      settings?.lineFlushRangeConfig ?? defaultLineFlushRangeConfig,
    );
  const [sliderOneValue, setSliderOneValue] = React.useState([1]);

  const sliderOneValuesChange = (values: any) => {
    if (Array.isArray(values) && values?.length > 0) {
      setSensorRange(values?.[0]?.toString());
    }
  };

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'sensorRange useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'sensorRange useEffect BLEService.onDeviceDisconnected device==>',
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
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    let __sensorRange = settingsData?.sensorRange?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'sensorRange',
      deviceSettingsData?.SensorRange,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj)) {
      __sensorRange = resultObj?.newValue;
    }
    // setSensorRangeOld(__sensorRange);
    setSensorRange(__sensorRange);
    setSliderOneValue([parseInt(__sensorRange)]);
  };

  const onDonePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      if (BLEService.deviceGeneration == 'gen1') {
        onDonePressGen1();
      } else if (BLEService.deviceGeneration == 'gen2') {
        // Code need to be implemented
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
    if (settingsData?.sensorRange?.value != sensorRange) {
      params.push({
        name: 'sensorRange',
        serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_CHARACTERISTIC_UUID,
        oldValue: settingsData?.sensorRange?.value,
        newValue: sensorRange,
      });

      params.push({
        name: 'sensorRangeDate',
        serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_DATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });

      // params.push({
      //   name: 'sensorRangePhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_PHONE_SERVICE_UUID,
      //   characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {SensorRange: params},
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
    if (sensorRange.trim() === '') {
      showSimpleAlert('Please select sensor range');
      return false;
    } else if (Number(sensorRange) < 1) {
      showSimpleAlert('Sensor range seconds can`t be less than 1');
      return false;
    } else if (Number(sensorRange) > 5) {
      showSimpleAlert('Sensor range seconds can`t be greater than 5');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer scroll={false} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={true} style={[styles.row]}>
              <Typography
                size={12}
                text={`Activation time set to`}
                style={{textAlign: 'center', marginTop: 40, marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Input
                onRef={input => {
                  // @ts-ignore
                  sensorRangeTextInputRef = input;
                }}
                onChangeText={text => setSensorRange(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder=""
                value={sensorRange}
                editable={false}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
              />

              <Typography
                size={12}
                text={`Seconds`}
                style={{textAlign: 'center', marginTop: 10, marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />
            </Wrap>

            <Wrap
              autoMargin={false}
              style={[styles.row, {alignItems: 'center', marginTop: 80}]}>
              <MultiSlider
                values={sliderOneValue}
                snapped={true}
                min={sensorRangeConfig?.min ?? 8}
                max={sensorRangeConfig?.max ?? 28}
                step={sensorRangeConfig?.step ?? 4}
                // enableLabel={true}
                enabledTwo={false}
                allowOverlap={true}
                sliderLength={constants.screenWidth - 120}
                // onValuesChangeStart={sliderOneValuesChangeStart}
                onValuesChange={sliderOneValuesChange}
                // onValuesChangeFinish={sliderOneValuesChangeFinish}
                trackStyle={{backgroundColor: Theme.colors.primaryColor2}}
                selectedStyle={{backgroundColor: Theme.colors.primaryColor2}}
                markerStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: Theme.colors.white,
                }}
              />

              <Row autoMargin={false} style={{marginTop: -10, width: '100%'}}>
                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`8`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>

                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`12`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>

                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`16`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>

                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`20`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>

                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`24`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>

                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`I`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`28`}
                    style={{textAlign: 'center', marginTop: 0}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
              </Row>

              <Row autoMargin={false} style={{marginTop: 10, width: '100%'}}>
                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`Closer`}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={`Farther`}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
              </Row>
            </Wrap>
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