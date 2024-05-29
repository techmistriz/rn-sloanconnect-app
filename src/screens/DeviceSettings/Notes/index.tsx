import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Theme from 'src/theme';
import {useDispatch, useSelector} from 'react-redux';
import {consoleLog, showSimpleAlert} from 'src/utils/Helpers/HelperFunction';
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
import {cleanString} from 'src/utils/Helpers/encryption';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state?.AuthReducer);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const {referrer, settings, settingsData} = route?.params;

  const [note, setNote] = useState('');
  const [noteOld, setNoteOld] = useState('');

  useEffect(() => {
    // consoleLog('note==>', {
    //   referrer,
    //   settings,
    //   settingsData,
    // });
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    let __note = settingsData?.note?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject('note', deviceSettingsData?.Note, {
      searchKey: 'name',
    });

    if (!isObjectEmpty(resultObj)) {
      __note = resultObj?.newValue;
    }

    setNote(cleanString(__note));
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

  const onDonePressGen2 = async () => {
    var params = [];
    if (settingsData?.note?.value != note) {
      params.push({
        name: 'note',
        serviceUUID: BLE_CONSTANTS.GEN2.DEVICE_DATA_STRING_SERVICE_UUID,
        characteristicUUID:
          BLE_CONSTANTS.GEN2.DEVICE_DATA_STRING_CHARACTERISTIC_UUID,
        oldValue: settingsData?.sensorRange?.value,
        newValue: note,
        modfiedNewValue: mapValueGenTextToHex(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.NOTE,
          note,
          120,
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

  /**validation checking for email */
  const checkValidation = () => {
    if (note.trim() === '') {
      showSimpleAlert('Please enter note');
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
                blurOnSubmit={false}
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
