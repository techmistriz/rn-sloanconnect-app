import React, {useEffect, useState} from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
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
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import {BLEService} from 'src/services/BLEService/BLEService';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {mapValueGen2, mapValueGenTextToHex} from 'src/utils/Helpers/project';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {cleanString, cleanString2} from 'src/utils/Helpers/encryption';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {referrer, settings, settingsData} = route?.params;

  const [note, setNote] = useState('');
  const [noteOld, setNoteOld] = useState('');

  /** component hooks method for device disconnect checking */
  useEffect(() => {
    const deviceDisconnectionListener = BLEService.onDeviceDisconnected(
      (error, device) => {
        consoleLog(
          'note useEffect BLEService.onDeviceDisconnected error==>',
          error,
        );
        // consoleLog(
        //   'note useEffect BLEService.onDeviceDisconnected device==>',
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
    // consoleLog('note==>', {
    //   referrer,
    //   settings,
    //   settingsData,
    // });
    initlizeApp();
  }, []);

  /**function comment */
  const initlizeApp = async () => {
    let __note = settingsData?.note?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject('note', deviceSettingsData?.Note, {
      searchKey: 'name',
    });

    if (!isObjectEmpty(resultObj)) {
      __note = resultObj?.newValue;
    }

    setNote(cleanString2(cleanString(__note)));
  };

  /**function comment */
  const onDonePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      if (BLEService.deviceGeneration == 'gen1') {
        onDonePressGen1();
      } else if (BLEService.deviceGeneration == 'gen2') {
        onDonePressGen2();
      } else if (BLEService.deviceGeneration == 'flusher') {
        onDonePressFlusher();
      } else if (BLEService.deviceGeneration == 'basys') {
        onDonePressBasys();
      }
    }
  };

  /**function comment */
  const onDonePressGen1 = async () => {
    var params: any = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.note?.value != note) {
      // params.push({
      //   name: 'note',
      //   serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_SERVICE_UUID,
      //   characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_CHARACTERISTIC_UUID,
      //   oldValue: settingsData?.note?.value,
      //   newValue: note,
      // });
      // params.push({
      //   name: 'noteDate',
      //   serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_DATE_SERVICE_UUID,
      //   characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_DATE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: parseDateTimeInFormat(new Date(), dateFormat),
      //   allowedInPreviousSettings: false,
      // });
      // params.push({
      //   name: 'notePhone',
      //   serviceUUID: BLE_CONSTANTS.GEN1.SENSOR_PHONE_SERVICE_UUID,
      //   characteristicUUID: BLE_CONSTANTS.GEN1.SENSOR_PHONE_CHARACTERISTIC_UUID,
      //   oldValue: null,
      //   newValue: user?.user_metadata?.phone_number ?? '0123456789',
      //   allowedInPreviousSettings: false,
      // });
    }

    if (params && params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {Note: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**function comment */
  const onDonePressGen2 = async () => {
    var params = [];
    const dateFormat = 'YYMMDDHHmm';

    if (settingsData?.note?.value != note) {
      params.push({
        name: 'note',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_STRING_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_STRING_CHARACTERISTIC_UUID,
        oldValue: settingsData?.sensorRange?.value,
        newValue: cleanString2(cleanString2(note)),
        modfiedNewValue: mapValueGenTextToHex(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.NOTE,
          cleanString2(cleanString2(note)),
          120,
        ),
      });

      params.push({
        name: 'noteDate',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
        modfiedNewValue: mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_BD_NOTE_CHANGE,
          timestampInSec(),
        ),
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {Note: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**function comment */
  const onDonePressFlusher = async () => {
    var params: any = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.note?.value != note) {
      params.push({
        name: 'note',
        serviceUUID: BLE_CONSTANTS.FLUSHER.NOTE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.FLUSHER.NOTE_CHARACTERISTIC_UUID,
        oldValue: settingsData?.note?.value,
        newValue: note,
      });
      params.push({
        name: 'noteDate',
        serviceUUID: BLE_CONSTANTS.FLUSHER.NOTE_DATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.FLUSHER.NOTE_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      params.push({
        name: 'notePhone',
        serviceUUID: BLE_CONSTANTS.FLUSHER.NOTE_PHONE_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.NOTE_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.user_metadata?.phone_number ?? '0123456789',
        allowedInPreviousSettings: false,
      });
    }

    if (params && params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {Note: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**function comment */
  const onDonePressBasys = async () => {
    var params: any = [];
    const dateFormat = 'YYMMDDHHmm';
    if (settingsData?.note?.value != note) {
      params.push({
        name: 'note',
        serviceUUID: BLE_CONSTANTS.BASYS.NOTE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.BASYS.NOTE_CHARACTERISTIC_UUID,
        oldValue: settingsData?.note?.value,
        newValue: note,
      });
      params.push({
        name: 'noteDate',
        serviceUUID: BLE_CONSTANTS.BASYS.NOTE_DATE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.BASYS.NOTE_DATE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: parseDateTimeInFormat(new Date(), dateFormat),
        allowedInPreviousSettings: false,
      });
      params.push({
        name: 'notePhone',
        serviceUUID: BLE_CONSTANTS.BASYS.NOTE_PHONE_SERVICE_UUID,
        characteristicUUID: BLE_CONSTANTS.BASYS.NOTE_PHONE_CHARACTERISTIC_UUID,
        oldValue: null,
        newValue: user?.user_metadata?.phone_number ?? '0123456789',
        allowedInPreviousSettings: false,
      });
    }

    if (params && params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {Note: params},
        }),
      );
    }
    // deviceSettingsData
    setTimeout(() => {
      NavigationService.goBack();
    }, 100);
  };

  /**function comment */
  const checkValidation = () => {
    if (note.trim() === '') {
      showSimpleAlert('Please enter note');
      return false;
    } else {
      return true;
    }
  };

  // const DismissKeyboardHOC = Comp => {
  //   return ({children, ...props}) => (
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  //       <Comp style={{flex: 1}} {...props}>
  //         {children}
  //       </Comp>
  //     </TouchableWithoutFeedback>
  //   );
  // };
  // const DismissKeyboardView = DismissKeyboardHOC(View);

  // const DismissKeyboard = ({children}: any) => (
  //   <TouchableWithoutFeedback
  //     onPress={() => Keyboard.dismiss()}
  //     accessible={false}>
  //     {children}
  //   </TouchableWithoutFeedback>
  // );

  return (
    <AppContainer scroll={true} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.row}>
              <Typography
                size={18}
                text={`Notes`}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
            </Wrap>

            <Wrap autoMargin={true} style={[styles.row]}>
              <Input
                onRef={input => {
                  // @ts-ignore
                  notesTextInputRef = input;
                }}
                onChangeText={text => setNote(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={true}
                keyboardType="default"
                placeholder="Please add full description here"
                placeholderTextColor={Theme.colors.black}
                value={note}
                // editable={false}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
                multiline={true}
                numberOfLines={10}
              />
              <Typography
                size={12}
                text={`Max 120 characters`}
                style={{textAlign: 'right', marginBottom: 40}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />
            </Wrap>
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <Button
                type={'link'}
                title="ADD NOTE"
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
