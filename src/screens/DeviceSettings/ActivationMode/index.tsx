import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Keyboard} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  parseDateTimeInFormat,
  showSimpleAlert,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import {getActivationModeType, getActivationModeValue} from './helper';
import {BLEService} from 'src/services/BLEService/BLEService';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {
  getDeviceCharacteristic,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceService,
  hasDateSetting,
  hasPhoneSetting,
} from 'src/utils/Helpers/project';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import {isObjectEmpty} from 'src/utils/Helpers/array';

const Index = ({navigation, route}: any) => {
  const {
    referrer,
    setting,
    deviceStaticDataMain,
    characteristicMain,
    deviceStaticDataRight,
    characteristicRight,
    deviceStaticDataRight2,
    characteristicRight2,
    onSettingChange,
  } = route?.params;

  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();

  const activationModeTypeOld = getActivationModeType(
    characteristicMain,
    deviceStaticDataMain,
  );
  const [activationModeType, setActivationModeType] = useState(
    activationModeTypeOld,
  );

  var activationModeSecOld = getActivationModeValue(characteristicRight);
  const [activationModeSec, setActivationModeSec] =
    useState(activationModeSecOld);

  useEffect(() => {
    // consoleLog('ActivationMode==>', {
    //   // referrer,
    //   setting,
    //   deviceStaticDataMain,
    //   // characteristicMain,
    //   // deviceStaticDataRight,
    //   // characteristicRight,
    //   // deviceStaticDataRight2,
    //   // characteristicRight2,
    // });
  }, []);

  const __setActivationModeType = async (val: string) => {
    setActivationModeType(val);
    if (typeof deviceStaticDataMain?.UUIDMapped?.[val] != 'undefined') {
      const __characteristicRight =
        await BLEService.readCharacteristicForDevice(
          characteristicMain?.serviceUUID,
          deviceStaticDataMain?.UUIDMapped[val],
        );
      // consoleLog(
      //   '__setActivationModeType __characteristicRight==>',
      //   JSON.stringify(__characteristicRight),
      // );
      const __activationModeSec = getActivationModeValue(__characteristicRight);
      setActivationModeSec(__activationModeSec);
      // activationModeSecOld = __activationModeSec;
    }
  };

  const onDonePress = async () => {
    Keyboard.dismiss();
    var params = [];
    const checkValid = checkValidation();
    if (checkValid) {
      if (
        activationModeTypeOld != activationModeType ||
        activationModeSecOld != activationModeSec
      ) {
        params.push({
          serviceUUID: characteristicMain?.serviceUUID,
          characteristicUUID: characteristicMain?.uuid,
          oldValue: base64EncodeDecode(activationModeTypeOld),
          newValue: base64EncodeDecode(activationModeType),
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
        typeof deviceStaticDataMain?.UUIDMapped[activationModeType] !=
        'undefined'
      ) {
        if (
          activationModeSecOld != activationModeSec ||
          activationModeTypeOld != activationModeType
        ) {
          const __characteristicRight =
            await BLEService.readCharacteristicForDevice(
              characteristicMain?.serviceUUID,
              deviceStaticDataMain?.UUIDMapped[activationModeType],
            );

          // consoleLog(
          //   'onDonePress __characteristicRight==>',
          //   JSON.stringify(__characteristicRight),
          // );

          params.push({
            serviceUUID: characteristicMain?.serviceUUID,
            characteristicUUID: __characteristicRight?.uuid,
            oldValue: base64EncodeDecode(activationModeSecOld),
            newValue: base64EncodeDecode(activationModeSec),
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

          // consoleLog('activationModeSec params=======>', {
          //   serviceUUID: characteristicMain?.serviceUUID,
          //   characteristicUUID: __characteristicRight?.uuid,
          //   oldValue: activationModeSecOld,
          //   newValue: activationModeSec,
          // });
        }
      }

      if (params.length) {
        dispatch(
          deviceSettingsSuccessAction({
            data: {ActivationMode: params},
          }),
        );
      }
      // deviceSettingsData
      setTimeout(() => {
        NavigationService.goBack();
      }, 100);
    }
  };

  /**validation checking for email */
  const checkValidation = () => {
    const min = 3;
    const max = activationModeType == '1' ? 120 : 1200;
    if (activationModeSec.trim() === '') {
      showSimpleAlert('Please enter timeout in seconds');
      return false;
    } else if (Number(activationModeSec) < min) {
      showSimpleAlert('Timeout seconds can`t be less than ' + min);
      return false;
    } else if (Number(activationModeSec) > max) {
      showSimpleAlert('Timeout seconds can`t be greater than ' + max);
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
                text={`Activation Mode`}
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
                  selected={activationModeType}
                  options={[
                    {name: 'On Demand', value: '0'},
                    {name: 'Metered', value: '1'},
                  ]}
                  onSelect={(val: string) => {
                    __setActivationModeType(val);
                  }}
                />
              </Wrap>
            </Wrap>

            <Wrap autoMargin={true} style={[styles.row, {marginTop: 40}]}>
              <Typography
                size={12}
                text={`${
                  activationModeType == '0'
                    ? `Set on demand timeout between\n3 and 1200 seconds`
                    : `Set meter timeout between\n3 and 120 seconds`
                }`}
                style={{textAlign: 'center', marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Input
                onRef={input => {
                  // @ts-ignore
                  activationModeSecTextInputRef = input;
                }}
                onChangeText={text => setActivationModeSec(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder=""
                value={activationModeSec}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
                maxLength={4}
              />
              <Typography
                size={12}
                text={`Seconds`}
                style={{textAlign: 'center', marginTop: 5}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />
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
