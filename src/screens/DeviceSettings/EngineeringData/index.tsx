import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import {
  mapValueGen2,
  mapValueGenTextToHex,
  saveSettings,
} from 'src/utils/Helpers/project';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {cleanString, cleanString2} from 'src/utils/Helpers/encryption';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const [__loading, __setLoading] = useState(false);
  const {referrer, settings, settingsData} = route?.params;
  const [note, setNote] = useState('');

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
    consoleLog('note==>', {
      referrer,
      settings,
      settingsData,
      deviceSettingsData,
    });
    initlizeApp();
  }, []);

  /**function comment */
  const initlizeApp = async () => {
    let __note = settingsData?.engineeringData?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'engineeringData',
      deviceSettingsData?.EngineeringData,
      {
        searchKey: 'name',
      },
    );

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
      } else if (BLEService.deviceGeneration == 'gen2') {
      } else if (BLEService.deviceGeneration == 'flusher') {
        onDonePressFlusher();
      } else if (BLEService.deviceGeneration == 'basys') {
      }
    }
  };

  /**function comment */
  const onDonePressFlusher = async () => {
    var settingsArr: any = [];
    if (settingsData?.engineeringData?.value != note) {
      settingsArr.push({
        name: 'engineeringData',
        serviceUUID: BLE_CONSTANTS.FLUSHER.ENGINEERING_DATA_2_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.FLUSHER.ENGINEERING_DATA_2_CHARACTERISTIC_UUID,
        oldValue: settingsData?.engineeringData?.value,
        newValue: note,
        convertToType: 'hex',
        byteSize: note.length * 2,
      });
    }

    if (settingsArr && settingsArr.length) {
      if (referrer == 'DeviceInfo') {
        __setLoading(true);
        await saveSettings({EngineeringData: settingsArr});
        __setLoading(false);
      } else {
        dispatch(
          deviceSettingsSuccessAction({
            data: {EngineeringData: settingsArr},
          }),
        );
      }
    }

    setTimeout(() => {
      if (referrer == 'DeviceInfo') {
        DeviceEventEmitter.emit('EngineeringDataSettingsChangedEvent', true);
      }
      NavigationService.goBack();
    }, 100);
  };

  /**function comment */
  const checkValidation = () => {
    if (note.trim() === '' || note.length > 20) {
      showSimpleAlert('Please enter engineering data 2 up to 20 characters.');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer
      scroll={true}
      scrollViewStyle={{}}
      backgroundType="gradient"
      loading={__loading}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            {/*<Wrap autoMargin={false} style={styles.row}>*/}
            {/*  <Typography*/}
            {/*    size={18}*/}
            {/*    text={`Notes`}*/}
            {/*    style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}*/}
            {/*    color={Theme.colors.white}*/}
            {/*    ff={Theme.fonts.ThemeFontMedium}*/}
            {/*  />*/}
            {/*</Wrap>*/}

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
                placeholder="Engineering Data 2"
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
                text={`Max 20 characters`}
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
                title="Update Data"
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
