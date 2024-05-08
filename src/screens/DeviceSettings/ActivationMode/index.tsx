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
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

const Index = ({navigation, route}: any) => {
  const {referrer, settings, settingsData} = route?.params;
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();

  const [modeSelection, setModeSelection] = useState<any>('');
  const [metered, setMetered] = useState<any>('');
  const [onDemand, setOnDemand] = useState<any>('');
  const [activationModeSec, setActivationModeSec] = useState('');
  const [activationModeSecOld, setActivationModeSecOld] = useState('');

  useEffect(() => {
    // consoleLog('ActivationMode==>', {
    //   referrer,
    //   settings,
    //   settingsData,
    // });
    // consoleLog('useEffect data==>', {modeSelection, onDemand, metered});
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    let __modeSelection = settingsData?.modeSelection?.value ?? '';
    let __onDemand = settingsData?.onDemand?.value ?? '';
    let __metered = settingsData?.metered?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'modeSelection',
      deviceSettingsData?.ActivationMode,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj)) {
      __modeSelection = resultObj?.newValue;
    }

    if (__modeSelection == '0') {
      const resultObj2 = findObject(
        'onDemand',
        deviceSettingsData?.ActivationMode,
        {
          searchKey: 'name',
        },
      );

      if (!isObjectEmpty(resultObj)) {
        __onDemand = resultObj2?.newValue;
      }

      setActivationModeSecOld(__onDemand);
      setActivationModeSec(__onDemand);
    } else if (__modeSelection == '1') {
      const resultObj2 = findObject(
        'metered',
        deviceSettingsData?.ActivationMode,
        {
          searchKey: 'name',
        },
      );
      // consoleLog('mapMeteredOnDemandValue resultobj==>', {resultObj, type});

      if (!isObjectEmpty(resultObj)) {
        __metered = resultObj2?.newValue;
      }

      setActivationModeSecOld(__metered);
      setActivationModeSec(__metered);
    }

    setModeSelection(__modeSelection);
    setOnDemand(__onDemand);
    setMetered(__metered);
  };

  const handleModeSelection = async (val: string) => {
    // consoleLog('handleModeSelection val==>', {val, onDemand, metered});
    setModeSelection(val);

    if (val == '0') {
      setActivationModeSec(onDemand);
    } else if (val == '1') {
      setActivationModeSec(metered);
    }
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
    //   old: settingsData?.modeSelection?.value,
    //   modeSelection,
    //   activationModeSecOld,
    //   activationModeSec,
    // });
    // return false;

    if (
      settingsData?.modeSelection?.value != modeSelection ||
      activationModeSecOld != activationModeSec
    ) {
      params.push({
        name: 'modeSelection',
        serviceUUID: BLE_CONSTANTS.GEN1.MODE_SELECTION_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.MODE_SELECTION_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: modeSelection,
      });

      params.push({
        name: 'modeSelectionDate',
        serviceUUID: BLE_CONSTANTS.GEN1.MODE_SELECTION_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.MODE_SELECTION_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
      });
      params.push({
        name: 'modeSelectionPhone',
        serviceUUID: BLE_CONSTANTS.GEN1.MODE_SELECTION_PHONE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.MODE_SELECTION_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.contact ?? '0123456789',
      });
    }

    if (
      settingsData?.modeSelection?.value != modeSelection ||
      activationModeSecOld != activationModeSec
    ) {
      if (modeSelection == '0') {
        params.push({
          name: 'onDemand',
          serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_CHARACTERISTIC_UUID,
          oldValue: settingsData?.modeSelection?.value,
          newValue: activationModeSec,
        });

        params.push({
          name: 'onDemandDate',
          serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_DATE_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_DATE_CHARACTERISTIC_UUID,
          oldValue: null,
          newValue: parseDateTimeInFormat(new Date(), dateFormat),
        });
        params.push({
          name: 'onDemandPhone',
          serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_PHONE_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_PHONE_CHARACTERISTIC_UUID,
          oldValue: null,
          newValue: user?.contact ?? '0123456789',
        });
      } else if (modeSelection == '1') {
        params.push({
          name: 'metered',
          serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.METERED_RUNTIME_CHARACTERISTIC_UUID,
          oldValue: settingsData?.modeSelection?.value,
          newValue: activationModeSec,
        });

        params.push({
          name: 'meteredDate',
          serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_DATE_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.METERED_RUNTIME_DATE_CHARACTERISTIC_UUID,
          oldValue: null,
          newValue: parseDateTimeInFormat(new Date(), dateFormat),
        });
        params.push({
          name: 'meteredPhone',
          serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_PHONE_SERVICE_UUID,
          characteristicUUID:
            BLE_CONSTANTS.GEN1.METERED_RUNTIME_PHONE_CHARACTERISTIC_UUID,
          oldValue: null,
          newValue: user?.contact ?? '0123456789',
        });
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
  };

  const onDonePressGen2 = () => {
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**validation checking for email */
  const checkValidation = () => {
    const min = 3;
    const max = modeSelection == '1' ? 120 : 1200;
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
                  selected={modeSelection}
                  options={[
                    {name: 'On Demand', value: '0'},
                    {name: 'Metered', value: '1'},
                  ]}
                  onSelect={(response: any) => {
                    handleModeSelection(response?.value);
                  }}
                />
              </Wrap>
            </Wrap>

            <Wrap autoMargin={true} style={[styles.row, {marginTop: 40}]}>
              <Typography
                size={12}
                text={`${
                  modeSelection == '0'
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
