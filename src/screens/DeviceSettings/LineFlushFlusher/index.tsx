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
import {LineFlushRangeProps} from './types';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mapValueGen2} from 'src/utils/Helpers/project';
import Toggle from 'src/components/Toggle';
import I18n from 'src/locales/Transaltions';

const defaultLineFlushRangeConfig = {min: 1, max: 7, step: 1};

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {referrer, settings, settingsData} = route?.params;

  const [flush, setFlush] = useState<any>('1');
  const [flushTime, setFlushTime] = useState('');
  const [flushVolume, setFlushVolume] = useState('');
  const [flushTimeConfig, setFlushTimeConfig] = useState<LineFlushRangeProps>(
    settings?.lineFlushRangeConfig ?? defaultLineFlushRangeConfig,
  );
  const [sliderOneValue, setSliderOneValue] = React.useState([1]);

  /**Function comment */
  const sliderOneValuesChange = (values: any) => {
    if (Array.isArray(values) && values?.length > 0) {
      setFlushTime(values?.[0]?.toString());
    }
  };

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'flushTime useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'flushTime useEffect BLEService.onDeviceDisconnected device==>',
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

  /**Function comment */
  const initlizeApp = async () => {
    let __flushTime = settingsData?.flushTime?.value ?? '';
    let __flushVolume = settingsData?.flushVolume?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'flushTime',
      deviceSettingsData?.LineFlushFlusher,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj)) {
      __flushTime = resultObj?.newValue;
    }

    // Handle unsaved value which were changed
    const resultObj2 = findObject(
      'flushVolume',
      deviceSettingsData?.LineFlushFlusher,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj2)) {
      __flushVolume = resultObj2?.newValue;
    }
    // setFlushTimeOld(__flushTime);
    setFlushTime(__flushTime?.toString());
    setFlushVolume(__flushVolume);
    setSliderOneValue([parseInt(__flushTime)]);
  };

  const onDonePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      if (BLEService.deviceGeneration == 'flusher') {
        onDonePressFlusher();
      }
    }
  };

  /**Function comment */
  const onDonePressFlusher = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.flushTime?.value != flushTime) {
      params.push({
        name: 'flushTime',
        serviceUUID: BLE_CONSTANTS.FLUSHER.FLUSH_TIME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.FLUSH_TIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushTime?.value,
        newValue: flushTime,
        convertToType: 'hex',
      });

      params.push({
        name: 'flushTimeDate',
        serviceUUID: BLE_CONSTANTS.FLUSHER.FLUSH_TIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.FLUSH_TIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        convertToType: 'hex',
      });

      params.push({
        name: 'flushVolume',
        serviceUUID: BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.flushVolume?.value,
        newValue: flushVolume,
        convertToType: 'hex',
      });

      params.push({
        name: 'flushVolumeDate',
        serviceUUID: BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.FLUSH_VOLUME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        convertToType: 'hex',
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {LineFlushFlusher: params},
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
    if (flushTime.trim() === '') {
      showSimpleAlert('Please select flush time');
      return false;
    } else if (Number(flushTime) < 1) {
      showSimpleAlert('Flush time seconds can`t be less than 1');
      return false;
    } else if (Number(flushTime) > 7) {
      showSimpleAlert('Flush time seconds can`t be greater than 7');
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

            <Wrap autoMargin={true} style={[styles.row]}>
              <Typography
                size={12}
                text={I18n.t('settings.LINE_FLUSH_FLUSHER')}
                style={{textAlign: 'center', marginTop: 40, marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Input
                onRef={input => {
                  // @ts-ignore
                  flushTimeTextInputRef = input;
                }}
                onChangeText={text => setFlushTime(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder=""
                value={flushTime}
                editable={false}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
              />

              <Typography
                size={12}
                text={I18n.t('settings.DAYS')}
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
                min={flushTimeConfig?.min ?? 1}
                max={flushTimeConfig?.max ?? 5}
                step={flushTimeConfig?.step ?? 1}
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
                    text={`1`}
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
                    text={`2`}
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
                    text={`3`}
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
                    text={`4`}
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
                    text={`5`}
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
                    text={`6`}
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
                    text={`7`}
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
                    text={I18n.t('settings.CLOSER')}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
                <Wrap autoMargin={false}>
                  <Typography
                    size={12}
                    text={I18n.t('settings.FARTHER')}
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
