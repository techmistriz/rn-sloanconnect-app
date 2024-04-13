import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Theme from 'src/theme';
import {
  consoleLog,
  showSimpleAlert,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import {BLEService} from 'src/services/BLEService/BLEService';
import {getFlushTypeType, getFlushTypeValue} from './helper';
import {useDispatch, useSelector} from 'react-redux';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {hasDateSetting, hasPhoneSetting} from 'src/utils/Helpers/project';

const Index = ({navigation, route}: any) => {
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();
  const {
    referrer,
    setting,
    deviceStaticDataMain,
    characteristicMain,
    deviceStaticDataRight,
    characteristicRight,
    deviceStaticDataRight2,
    characteristicRight2,
  } = route?.params;

  const lineFlushTypeOld = getFlushTypeType(
    characteristicMain,
    deviceStaticDataMain,
  );
  const lineFlushTimeOld = getFlushTypeValue(characteristicRight);
  const lineFlushIntervalOld = getFlushTypeValue(characteristicRight2);

  const [lineFlushType, setFlushTypeType] = useState(lineFlushTypeOld);
  const [lineFlushTime, setFlushSecTime] = useState(lineFlushTimeOld);
  const [lineFlushInterval, setFlushInterval] = useState(lineFlushIntervalOld);

  useEffect(() => {
    // consoleLog('LineFlush==>', {
    //   referrer,
    //   setting,
    //   deviceStaticDataMain,
    //   characteristicMain,
    //   deviceStaticDataRight,
    //   characteristicRight,
    //   deviceStaticDataRight2,
    //   characteristicRight2,
    // });
  }, []);

  const onDonePress = async () => {
    Keyboard.dismiss();
    var params = [];
    const checkValid = checkValidation();
    if (checkValid) {
      // consoleLog('LineFlush onDonePress==>', {
      //   lineFlushTypeOld,
      //   lineFlushType,
      //   lineFlushTimeOld,
      //   lineFlushTime,
      //   lineFlushIntervalOld,
      //   lineFlushInterval,
      // });
      if (
        lineFlushTypeOld != lineFlushType ||
        lineFlushTimeOld != lineFlushTime ||
        lineFlushIntervalOld != lineFlushInterval
      ) {
        params.push({
          serviceUUID: characteristicMain?.serviceUUID,
          characteristicUUID: characteristicMain?.uuid,
          oldValue: base64EncodeDecode(lineFlushTypeOld),
          newValue: base64EncodeDecode(lineFlushType),
        });

        const dateSettingResponse = hasDateSetting(deviceStaticDataMain);
        if (!isObjectEmpty(dateSettingResponse)) {
          params.push({
            ...dateSettingResponse,
            allowedInPreviousSetting: false,
          });
        }

        const phoneSettingResponse = hasPhoneSetting(
          deviceStaticDataMain,
          user,
        );
        if (!isObjectEmpty(phoneSettingResponse)) {
          params.push({
            ...phoneSettingResponse,
            allowedInPreviousSetting: false,
          });
        }
      }

      if (
        lineFlushType == '1' &&
        typeof deviceStaticDataMain?.UUIDMapped != 'undefined' &&
        typeof deviceStaticDataMain?.UUIDMapped[lineFlushType] != 'undefined' &&
        lineFlushTimeOld != lineFlushTime
      ) {
        params.push({
          serviceUUID: characteristicMain?.serviceUUID,
          characteristicUUID: characteristicRight?.uuid,
          oldValue: base64EncodeDecode(lineFlushTimeOld),
          newValue: base64EncodeDecode(lineFlushTime),
        });

        const dateSettingResponse = hasDateSetting(deviceStaticDataRight);
        if (!isObjectEmpty(dateSettingResponse)) {
          params.push({
            ...dateSettingResponse,
            allowedInPreviousSetting: false,
          });
        }

        const phoneSettingResponse = hasPhoneSetting(
          deviceStaticDataRight,
          user,
        );
        if (!isObjectEmpty(phoneSettingResponse)) {
          params.push({
            ...phoneSettingResponse,
            allowedInPreviousSetting: false,
          });
        }
      }

      if (
        lineFlushType == '1' &&
        typeof deviceStaticDataMain?.UUIDMapped != 'undefined' &&
        typeof deviceStaticDataMain?.UUIDMapped[lineFlushType] != 'undefined' &&
        lineFlushIntervalOld != lineFlushInterval
      ) {
        params.push({
          serviceUUID: characteristicMain?.serviceUUID,
          characteristicUUID: characteristicRight2?.uuid,
          oldValue: base64EncodeDecode(lineFlushIntervalOld),
          newValue: base64EncodeDecode(lineFlushInterval),
        });

        const dateSettingResponse = hasDateSetting(deviceStaticDataRight2);
        if (!isObjectEmpty(dateSettingResponse)) {
          params.push({
            ...dateSettingResponse,
            allowedInPreviousSetting: false,
          });
        }

        const phoneSettingResponse = hasPhoneSetting(
          deviceStaticDataRight2,
          user,
        );
        if (!isObjectEmpty(phoneSettingResponse)) {
          params.push({
            ...phoneSettingResponse,
            allowedInPreviousSetting: false,
          });
        }
      }

      if (params.length) {
        dispatch(
          deviceSettingsSuccessAction({
            data: {LineFlush: params},
          }),
        );
      }
      NavigationService.goBack();
    }
  };

  /**validation checking for email */
  const checkValidation = () => {
    if (lineFlushType == '0') {
      return true;
    }
    if (lineFlushTime.trim() === '') {
      showSimpleAlert('Please enter timeout in seconds');
      return false;
    } else if (Number(lineFlushTime) < 3) {
      showSimpleAlert('Timeout seconds can`t be less than 3');
      return false;
    } else if (Number(lineFlushTime) > 1200) {
      showSimpleAlert('Timeout seconds can`t be greater than 1200');
      return false;
    } else if (lineFlushInterval.trim() === '') {
      showSimpleAlert('Please enter timeout in hours');
      return false;
    } else if (Number(lineFlushInterval) < 0) {
      showSimpleAlert('Interval hours can`t be less than 0');
      return false;
    } else if (Number(lineFlushInterval) > 72) {
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
                  selected={lineFlushType}
                  options={[
                    {value: '0', name: 'OFF'},
                    {value: '1', name: 'ON'},
                  ]}
                  onSelect={(val: any) => {
                    setFlushTypeType(val);
                  }}
                />
              </Wrap>
            </Wrap>

            {lineFlushType == '1' && (
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
                      onChangeText={text => setFlushSecTime(text)}
                      onSubmitEditing={() => {
                        // @ts-ignore
                        lineFlushIntervalTextInputRef.focus();
                      }}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      keyboardType="numeric"
                      placeholder=""
                      value={lineFlushTime}
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
                      value={lineFlushInterval}
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
