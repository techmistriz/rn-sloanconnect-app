import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Keyboard} from 'react-native';
import Theme, {Layout} from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  base64EncodeDecode,
  consoleLog,
  getImgSource,
  showSimpleAlert,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import {
  PERMISSIONS_RESULTS,
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
} from 'src/utils/Permissions';
import {_BleManager} from 'src/utils/BleService';
import Loader from 'src/components/Loader';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {constants} from 'src/common';
import {
  getSensorRange,
  getSensorRangeRangeArr,
  getSensorRangeSec,
} from './helper';
import {BLEService} from 'src/services/BLEService/BLEService';
import {SensorRangeProps} from './types';
import {result} from 'lodash';
import {deviceSettingsSuccessAction} from 'src/redux/actions';

const Index = ({navigation, route}: any) => {
  // const {referrer} = route?.params || {referrer: undefined};
  // const {user, loading, token, message, media_storage, type} = useSelector(
  //   (state: any) => state?.AuthReducer,
  // );
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

  const notesOld = getSensorRangeSec(characteristicMain);
  const [notes, setNotes] = useState(notesOld);

  useEffect(() => {
    // consoleLog('SensorRange==>', {
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
      const payload = {
        notes: notes,
      };

      // consoleLog("notes", notes);
      // const writeCharacteristicWithResponseForDevice1 =
      //   await BLEService.writeCharacteristicWithResponseForDevice(
      //     characteristicMain?.serviceUUID,
      //     characteristicMain?.uuid,
      //     notes,
      //   );
      params.push({
        serviceUUID: characteristicMain?.serviceUUID,
        characteristicUUID: characteristicMain?.uuid,
        oldValue: base64EncodeDecode(notesOld),
        newValue: base64EncodeDecode(notes),
      });
      // consoleLog(
      //   'onDonePress writeCharacteristicWithResponseForDevice1==>',
      //   JSON.stringify(writeCharacteristicWithResponseForDevice1),
      // );

      // showToastMessage('Success', 'success', 'Settings changed successfully.');
      // dispatch(
      //   deviceSettingsSuccessAction({
      //     data: {Notes: params},
      //   }),
      // );
      NavigationService.goBack();
    }
  };

  /**validation checking for email */
  const checkValidation = () => {
    if (notes.trim() === '') {
      showSimpleAlert('Please select sensor range');
      return false;
    } else if (Number(notes) < 1) {
      showSimpleAlert('Sensor range seconds can`t be less than 1');
      return false;
    } else if (Number(notes) > 5) {
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
                onChangeText={text => setNotes(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder="Please add full description here"
                placeholderTextColor={Theme.colors.black}
                value={notes}
                editable={false}
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
