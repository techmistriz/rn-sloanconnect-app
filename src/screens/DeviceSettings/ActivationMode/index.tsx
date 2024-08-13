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
import {Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import {BLEService} from 'src/services/BLEService/BLEService';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mapValueGen2} from 'src/utils/Helpers/project';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const {referrer, settings, settingsData} = route?.params;
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();

  const [modeSelection, setModeSelection] = useState<any>('');
  // const [metered, setMetered] = useState<any>('');
  // const [onDemand, setOnDemand] = useState<any>('');
  const [activationOnDemandSec, setActivationOnDemandSec] = useState('');
  const [activationOnDemandSecOld, setActivationOnDemandSecOld] = useState('');
  const [activationMeteredSec, setActivationMeteredSec] = useState('');
  const [activationMeteredSecOld, setActivationMeteredSecOld] = useState('');

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'ActivationMode useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'ActivationMode useEffect BLEService.onDeviceDisconnected device==>',
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

    setActivationOnDemandSecOld(__onDemand?.toString());
    setActivationOnDemandSec(__onDemand?.toString());

    const resultObj3 = findObject(
      'metered',
      deviceSettingsData?.ActivationMode,
      {
        searchKey: 'name',
      },
    );
    // consoleLog('mapMeteredOnDemandValue resultobj==>', {resultObj, type});

    if (!isObjectEmpty(resultObj)) {
      __metered = resultObj3?.newValue;
    }

    setActivationMeteredSecOld(__metered?.toString());
    setActivationMeteredSec(__metered?.toString());

    setModeSelection(__modeSelection?.toString());
    // setOnDemand(__onDemand);
    // setMetered(__metered);
  };

  const handleModeSelection = async (val: string) => {
    // consoleLog('handleModeSelection val==>', {val, onDemand, metered});
    setModeSelection(val);

    // if (val == '0') {
    //   setActivationOnDemandSec(onDemand);
    // } else if (val == '1') {
    //   setActivationOnDemandSec(metered);
    // }
  };

  const onDonePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      if (BLEService.deviceGeneration == 'gen1') {
        onDonePressGen1();
      } else if (BLEService.deviceGeneration == 'gen2') {
        onDonePressGen2();
      } else if (BLEService.deviceGeneration == 'flusher') {
        // This setting is no longer using for flusher
      } else if (BLEService.deviceGeneration == 'basys') {
        onDonePressBasys();
      }
    }
  };

  const onDonePressGen1 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';

    // consoleLog('onDonePressGen1', {
    //   old: settingsData?.modeSelection?.value,
    //   modeSelection,
    //   activationOnDemandSecOld,
    //   activationOnDemandSec,
    // });
    // return false;

    if (
      settingsData?.modeSelection?.value != modeSelection
      // || activationOnDemandSecOld != activationOnDemandSec
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
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'modeSelectionPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.MODE_SELECTION_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN1.MODE_SELECTION_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (
      // settingsData?.modeSelection?.value != modeSelection ||
      activationOnDemandSecOld != activationOnDemandSec &&
      modeSelection == '0'
    ) {
      params.push({
        name: 'onDemand',
        serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: activationOnDemandSec,
      });

      params.push({
        name: 'onDemandDate',
        serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'onDemandPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN1.ON_DEMAND_RUNTIME_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    } else if (
      activationMeteredSecOld != activationMeteredSec &&
      modeSelection == '1'
    ) {
      params.push({
        name: 'metered',
        serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.METERED_RUNTIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: activationMeteredSec,
      });

      params.push({
        name: 'meteredDate',
        serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN1.METERED_RUNTIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'meteredPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.METERED_RUNTIME_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN1.METERED_RUNTIME_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
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

  const onDonePressGen2 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';

    // const modifiedValue = mapValueGen2(
    //   BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.MODE_SELECTION,
    //   modeSelection,
    // );
    // consoleLog('onDonePressGen2', {
    //   old: settingsData?.modeSelection?.value,
    //   modeSelection,
    //   activationOnDemandSecOld,
    //   activationOnDemandSec,
    //   activationMeteredSecOld,
    //   activationMeteredSec,
    // });
    // return false;

    if (
      settingsData?.modeSelection?.value != modeSelection
      // ||  activationOnDemandSecOld != activationOnDemandSec
    ) {
      params.push({
        name: 'modeSelection',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: modeSelection,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.MODE_SELECTION,
          modeSelection,
        ),
      });

      // consoleLog('onDonePressGen2 params==>', params);
      // return false;

      params.push({
        name: 'modeSelectionDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_LAST_OD_OR_M_CHANGE,
          timestampInSec(),
        ),
      });

      // params.push({
      //   name: 'modeSelectionPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      //   modfiedNewValue: mapValueGen2(
      //     BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_LAST_OD_OR_M_CHANGE,
      //     timestampInSec(),
      //   )
      // });
    }

    if (
      // settingsData?.modeSelection?.value != modeSelection ||
      activationOnDemandSecOld != activationOnDemandSec &&
      modeSelection == '0'
    ) {
      params.push({
        name: 'onDemand',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: activationOnDemandSec,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.MAXIMUM_ON_DEMAND_RUN_TIME,
          activationOnDemandSec,
        ),
      });

      params.push({
        name: 'onDemandDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_OD_RUNTIME_CHANGE,
          timestampInSec(),
        ),
      });

      // params.push({
      //   name: 'onDemandPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    } else if (
      activationMeteredSecOld != activationMeteredSec &&
      modeSelection == '1'
    ) {
      params.push({
        name: 'metered',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: activationMeteredSec,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.METERED_RUN_TIME,
          activationMeteredSec,
        ),
      });

      params.push({
        name: 'meteredDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_METER_RUNTIME_CHANGE,
          timestampInSec(),
        ),
      });

      // params.push({
      //   name: 'meteredPhone',
      //   serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    // consoleLog('onDonePressGen2 params==>', params);
    // return false;

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

  const onDonePressBasys = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';

    // consoleLog('onDonePressBasys', {
    //   old: settingsData?.modeSelection?.value,
    //   modeSelection,
    //   activationOnDemandSecOld,
    //   activationOnDemandSec,
    // });
    // return false;

    if (
      settingsData?.modeSelection?.value != modeSelection
      // || activationOnDemandSecOld != activationOnDemandSec
    ) {
      params.push({
        name: 'modeSelection',
        serviceUUID: BLE_CONSTANTS.BASYS.MODE_SELECTION_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.MODE_SELECTION_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: '' + modeSelection,
        // convertToType: 'hex',
        hexSize: 2,
      });

      params.push({
        name: 'modeSelectionDate',
        serviceUUID: BLE_CONSTANTS.BASYS.MODE_SELECTION_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.MODE_SELECTION_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'modeSelectionPhone',
      //   serviceUUID: BLE_CONSTANTS.BASYS.MODE_SELECTION_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.BASYS.MODE_SELECTION_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (
      // settingsData?.modeSelection?.value != modeSelection ||
      activationOnDemandSecOld != activationOnDemandSec &&
      modeSelection == '0'
    ) {
      params.push({
        name: 'onDemand',
        serviceUUID: BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: activationOnDemandSec,
        convertToType: 'hex',
      });

      params.push({
        name: 'onDemandDate',
        serviceUUID: BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'onDemandPhone',
      //   serviceUUID: BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.BASYS.ON_DEMAND_RUNTIME_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    } else if (
      activationMeteredSecOld != activationMeteredSec &&
      modeSelection == '1'
    ) {
      params.push({
        name: 'metered',
        serviceUUID: BLE_CONSTANTS.BASYS.METERED_RUNTIME_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.METERED_RUNTIME_CHARACTERISTIC_UUID,
        oldValue: settingsData?.modeSelection?.value,
        newValue: activationMeteredSec,
        convertToType: 'hex',
      });

      params.push({
        name: 'meteredDate',
        serviceUUID: BLE_CONSTANTS.BASYS.METERED_RUNTIME_DATE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.BASYS.METERED_RUNTIME_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      // params.push({
      //   name: 'meteredPhone',
      //   serviceUUID: BLE_CONSTANTS.BASYS.METERED_RUNTIME_PHONE_SERVICE_UUID,
      //   characteristicUUID:
      //     BLE_CONSTANTS.BASYS.METERED_RUNTIME_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
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

  /**validation checking for email */
  const checkValidation = () => {
    const min = 3;
    const max = modeSelection == '1' ? 120 : 1200;
    if (modeSelection == '0' && activationOnDemandSec?.trim() === '') {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_EMPTY_TIMEOUT'));
      return false;
    } else if (modeSelection == '0' && Number(activationOnDemandSec) < min) {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_LESS_TIMEOUT') + min);
      return false;
    } else if (modeSelection == '0' && Number(activationOnDemandSec) > max) {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_GREATER_TIMEOUT') + max);
      return false;
    }
    if (modeSelection == '1' && activationMeteredSec?.trim() === '') {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_EMPTY_TIMEOUT'));
      return false;
    } else if (modeSelection == '1' && Number(activationMeteredSec) < min) {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_LESS_TIMEOUT') + min);
      return false;
    } else if (modeSelection == '1' && Number(activationMeteredSec) > max) {
      showSimpleAlert(I18n.t('settings.VALIDATION_MSG_GREATER_TIMEOUT') + max);
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
                text={I18n.t('settings.ACTIVATION_MODE_TITLE')}
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
                    ? I18n.t('settings.ACTIVATION_MODE_MESSAGE_1')
                    : I18n.t('settings.ACTIVATION_MODE_MESSAGE_2')
                }`}
                style={{textAlign: 'center', marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              {modeSelection == '0' ? (
                <Input
                  onRef={input => {
                    // @ts-ignore
                    activationOnDemandSecTextInputRef = input;
                  }}
                  onChangeText={text => setActivationOnDemandSec(text)}
                  onSubmitEditing={() => {
                    // @ts-ignore
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  placeholder=""
                  value={activationOnDemandSec}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  maxLength={4}
                />
              ) : (
                <Input
                  onRef={input => {
                    // @ts-ignore
                    activationMeteredSecTextInputRef = input;
                  }}
                  onChangeText={text => setActivationMeteredSec(text)}
                  onSubmitEditing={() => {
                    // @ts-ignore
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  placeholder=""
                  value={activationMeteredSec}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  maxLength={4}
                />
              )}

              <Typography
                size={12}
                text={I18n.t('settings.SECONDS')}
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
