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

  const sensorRangeSecOld = getSensorRangeSec(characteristicMain);
  const [sensorRangeSec, setSensorRangeSec] = useState(sensorRangeSecOld);

  const [sensorRange, setSensorRange] = useState<SensorRangeProps>(
    getSensorRange(deviceStaticDataMain),
  );
  const [sliderOneValue, setSliderOneValue] = React.useState(
    getSensorRangeRangeArr(characteristicMain),
  );

  // const sliderOneValuesChangeStart = () => setSliderOneChanging(true);
  const sliderOneValuesChange = (values: any) => {
    setSliderOneValue(values);
    if (Array.isArray(values) && values.length > 0) {
      setSensorRangeSec(values[0]?.toString());
    }
  };
  // const sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

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
        sensorRangeSec: sensorRangeSec,
      };

      // consoleLog("sensorRangeSec", sensorRangeSec);
      // const writeCharacteristicWithResponseForDevice1 =
      //   await BLEService.writeCharacteristicWithResponseForDevice(
      //     characteristicMain?.serviceUUID,
      //     characteristicMain?.uuid,
      //     sensorRangeSec,
      //   );
      params.push({
        serviceUUID: characteristicMain?.serviceUUID,
        characteristicUUID: characteristicMain?.uuid,
        oldValue: base64EncodeDecode(sensorRangeSecOld),
        newValue: base64EncodeDecode(sensorRangeSec),
      });
      // consoleLog(
      //   'onDonePress writeCharacteristicWithResponseForDevice1==>',
      //   JSON.stringify(writeCharacteristicWithResponseForDevice1),
      // );

      // showToastMessage('Success', 'success', 'Settings changed successfully.');
      dispatch(
        deviceSettingsSuccessAction({
          data: {SensorRange: params},
        }),
      );
      NavigationService.goBack();
    }
  };

  /**validation checking for email */
  const checkValidation = () => {
    if (sensorRangeSec.trim() === '') {
      showSimpleAlert('Please select sensor range');
      return false;
    } else if (Number(sensorRangeSec) < 1) {
      showSimpleAlert('Sensor range seconds can`t be less than 1');
      return false;
    } else if (Number(sensorRangeSec) > 5) {
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
                text={`Sensor Range`}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
            </Wrap>

            <Wrap autoMargin={true} style={[styles.row]}>
              <Typography
                size={12}
                text={`Note: Sensor range changes may\nrequire 10 seconds to update.`}
                style={{textAlign: 'center', marginBottom: 40}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Input
                onRef={input => {
                  // @ts-ignore
                  sensorRangeSecTextInputRef = input;
                }}
                onChangeText={text => setSensorRangeSec(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder=""
                value={sensorRangeSec}
                editable={false}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
              />
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[styles.row, {alignItems: 'center'}]}>
              <MultiSlider
                values={sliderOneValue}
                snapped={true}
                min={sensorRange.min}
                max={sensorRange.max}
                step={sensorRange.step}
                // enableLabel={true}
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
