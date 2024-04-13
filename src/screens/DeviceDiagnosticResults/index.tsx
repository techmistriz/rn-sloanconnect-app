import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, FlatList} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  cleanCharacteristic,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceModelData,
  getDeviceService,
  mapValue,
} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getImgSource,
  getTimezone,
  parseDateHumanFormat,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {
  Container,
  Row,
  Col,
  Card,
  Wrap,
  TochableWrap,
  RippleWrap,
} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import EmptyComponent from 'src/components/EmptyState';
import Loader from 'src/components/Loader';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import {
  connectedDeviceRequestAction,
  connectedDeviceSuccessAction,
  connectedDeviceFailureAction,
} from 'src/redux/actions';
import DeviceInfoList from 'src/components/@ProjectComponent/DeviceInfoList';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import {TABS} from 'src/utils/StaticData/StaticData';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import DiagnosticResultsList from 'src/components/@ProjectComponent/DiagnosticResultsList';
import GlobalStyle from 'src/utils/GlobalStyles';
import InfoBox from 'src/components/InfoBox';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';

const Index = ({navigation, route}: any) => {
  const {referrer} = route?.params || {referrer: undefined};
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  // const {device, status} = useSelector(
  //   (state: any) => state?.ConnectedDeviceReducer,
  // );

  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<boolean>(true);
  const [deviceSensorDetails, setDeviceSensorDetails] = useState<any>();
  const [deviceValveDetails, setDeviceValveDetails] = useState<any>();
  const [deviceTurbineDetails, setDeviceTurbineDetails] = useState<any>();
  const [deviceDispenseDetails, setDeviceDispenseDetails] = useState<any>();
  const [deviceBatteryDetails, setDeviceBatteryDetails] = useState<any>();
  const [deviceDTLastDiagnosticDetails, setDeviceDTLastDiagnosticDetails] =
    useState<any>();
  const [diagnosticResults, setDiagnosticResults] = useState<any>([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);

    var RESULTS = [];
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
    const characteristicUUIDSensor = 'd0aba888-fb10-4dc9-9b17-bdd8f490c962';
    const characteristicUUIDValve = 'd0aba888-fb10-4dc9-9b17-bdd8f490c963';
    const characteristicUUIDTurbine = 'd0aba888-fb10-4dc9-9b17-bdd8f490c964';
    const characteristicUUIDDispense = 'd0aba888-fb10-4dc9-9b17-bdd8f490c965';
    const characteristicUUIDBattery = 'd0aba888-fb10-4dc9-9b17-bdd8f490c966';
    const characteristicUUIDDTLastDiagnostic =
      'd0aba888-fb10-4dc9-9b17-bdd8f490c967';

    //  Sensor result
    const __characteristicSensor = await BLEService.readCharacteristicForDevice(
      serviceUUID,
      characteristicUUIDSensor,
    );

    // consoleLog(
    //   'initialize __characteristicSensor==>',
    //   JSON.stringify(__characteristicSensor),
    // );

    if (__characteristicSensor) {
      const __characteristicSensor__ = cleanCharacteristic(
        __characteristicSensor,
      );
      // setDeviceSensorDetails(__characteristicSensor__);
      RESULTS.push({
        ...__characteristicSensor__,
        name: 'Sensor',
        value: base64EncodeDecode(__characteristicSensor__?.value, 'decode'),
      });
    }

    //  Valve result
    const __characteristicValve = await BLEService.readCharacteristicForDevice(
      serviceUUID,
      characteristicUUIDValve,
    );

    // consoleLog(
    //   'initialize __characteristicValve==>',
    //   JSON.stringify(__characteristicValve),
    // );

    if (__characteristicValve) {
      const __characteristicValve__ = cleanCharacteristic(
        __characteristicValve,
      );
      // setDeviceValveDetails(__characteristicValve__);
      RESULTS.push({
        ...__characteristicValve__,
        name: 'Valve',
        value: base64EncodeDecode(__characteristicValve__?.value, 'decode'),
      });
    }

    //  Turbine result
    const __characteristicTurbine =
      await BLEService.readCharacteristicForDevice(
        serviceUUID,
        characteristicUUIDTurbine,
      );

    // consoleLog(
    //   'initialize __characteristicTurbine==>',
    //   JSON.stringify(__characteristicTurbine),
    // );

    if (__characteristicTurbine) {
      const __characteristicTurbine__ = cleanCharacteristic(
        __characteristicTurbine,
      );
      // setDeviceTurbineDetails(__characteristicTurbine__);
      RESULTS.push({
        ...__characteristicTurbine__,
        name: 'Turbine',
        value: base64EncodeDecode(__characteristicTurbine__?.value, 'decode'),
      });
    }

    //  Dispense result
    const __characteristicDispense =
      await BLEService.readCharacteristicForDevice(
        serviceUUID,
        characteristicUUIDDispense,
      );

    // consoleLog(
    //   'initialize __characteristicDispense==>',
    //   JSON.stringify(__characteristicDispense),
    // );

    if (__characteristicDispense) {
      const __characteristicDispense__ = cleanCharacteristic(
        __characteristicDispense,
      );
      // setDeviceDispenseDetails(__characteristicDispense__);
      RESULTS.push({
        ...__characteristicDispense__,
        name: 'Water Dispense',
        value: base64EncodeDecode(__characteristicDispense__?.value, 'decode'),
      });
    }

    //  Battery result
    const __characteristicBattery =
      await BLEService.readCharacteristicForDevice(
        serviceUUID,
        characteristicUUIDBattery,
      );

    // consoleLog(
    //   'initialize __characteristicBattery==>',
    //   JSON.stringify(__characteristicBattery),
    // );

    if (__characteristicBattery) {
      const __characteristicBattery__ = cleanCharacteristic(
        __characteristicBattery,
      );

      // consoleLog(
      //   'initialize __characteristicBattery__==>',
      //   JSON.stringify(__characteristicBattery__),
      // );

      // setDeviceBatteryDetails(__characteristicBattery__);
      RESULTS.push({
        ...__characteristicBattery__,
        name: 'Battery Level at Diagnostic',
        value: base64EncodeDecode(__characteristicBattery__?.value, 'decode'),
        forceText: true,
        prefix: null,
        postfix: ' %',
      });
    }

    //  DTLastDiagnostic result
    const __characteristicDTLastDiagnostic =
      await BLEService.readCharacteristicForDevice(
        serviceUUID,
        characteristicUUIDDTLastDiagnostic,
      );

    // consoleLog(
    //   'initialize __characteristicDTLastDiagnostic==>',
    //   JSON.stringify(__characteristicDTLastDiagnostic),
    // );

    if (__characteristicDTLastDiagnostic) {
      const __characteristicDTLastDiagnostic__ = cleanCharacteristic(
        __characteristicDTLastDiagnostic,
      );
      // setDeviceDTLastDiagnosticDetails(__characteristicDTLastDiagnostic__);
      RESULTS.push({
        ...__characteristicDTLastDiagnostic__,
        name: 'D/T of last diagnostic',
        value: base64EncodeDecode(
          __characteristicDTLastDiagnostic__?.value,
          'decode',
        ),
      });
    }
    setDiagnosticResults(RESULTS);
    setLoading(false);
  };

  return (
    <AppContainer
      scroll={true}
      scrollViewStyle={{}}
      backgroundType="solid"
      hasBackButton={true}
      loading={loading}
      headerContainerStyle={{
        backgroundColor: Theme.colors.primaryColor,
      }}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.container}>
              <Row
                autoMargin={false}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 30,
                  // borderWidth: 1,
                }}>
                <Col autoMargin={false}>
                  <Wrap autoMargin={false}>
                    <Typography
                      size={18}
                      text={'Diagnostic Results'}
                      style={{
                        textAlign: 'center',
                        // marginBottom: 30,
                      }}
                      color={Theme.colors.primaryColor}
                      ff={Theme.fonts.ThemeFontMedium}
                    />
                  </Wrap>
                </Col>
              </Row>
            </Wrap>

            <Wrap autoMargin={false} style={styles.container}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{flex: 1}}>
                  <Wrap
                    autoMargin={false}
                    style={{
                      backgroundColor: Theme.colors.lightGray,
                    }}>
                    <Typography
                      size={10}
                      text={`DIAGNOSTIC RESULTS ${parseDateHumanFormat(
                        new Date(),
                        'ddd, DD MMMM YYYY HH:MM:SS',
                      )} ${getTimezone()}`}
                      style={{
                        textAlign: 'left',
                        paddingVertical: 10,
                        paddingLeft: 20,
                      }}
                      color={Theme.colors.midGray}
                      ff={Theme.fonts.ThemeFontMedium}
                    />
                  </Wrap>
                </Col>
              </Row>
            </Wrap>

            <Wrap autoMargin={false} style={styles.container}>
              {diagnosticResults.map((item: any, index: number) => {
                return (
                  <DiagnosticResultsList
                    key={index.toString()}
                    item={item}
                    borderBottom={
                      index >= 0 ? (
                        <Divider color={Theme.colors.lightGray} />
                      ) : null
                    }
                  />
                );
              })}
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[styles.container, styles.screenMargin]}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{width: '50%'}}>
                  <Button
                    type={'link'}
                    title={`PREVIEW\nREPORT`}
                    onPress={() => {}}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                      color: Theme.colors.midGray,
                    }}
                    style={{
                      borderColor: Theme.colors.midGray,
                    }}
                    leftItem={
                      <VectorIcon
                        iconPack="Feather"
                        name={'book'}
                        size={25}
                        color={Theme.colors.midGray}
                        style={{marginRight: 10}}
                      />
                    }
                  />
                </Col>
              </Row>
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[styles.container, styles.screenMargin]}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{flex: 1, paddingRight: 20}}>
                  <Button
                    type={'link'}
                    title={'SEND REPORT'}
                    onPress={() => {}}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                    style={{
                      borderColor: Theme.colors.primaryColor,
                    }}
                  />
                </Col>
                <Col autoMargin={false} style={{flex: 1}}>
                  <Button
                    type={'link'}
                    title={'TROUBLESHOOT'}
                    onPress={() => {
                      NavigationService.navigate(
                        'DeviceDiagnosticTroubleshoot',
                      );
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                    style={{
                      borderColor: Theme.colors.primaryColor,
                    }}
                  />
                </Col>
              </Row>
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[styles.container, styles.screenMargin]}>
              <Button
                title={'DONE'}
                onPress={() => {
                  NavigationService.pop(2);
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontMedium,
                  color: Theme.colors.white,
                }}
                style={{
                  borderColor: Theme.colors.primaryColor,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
      <InfoBox
        visible={infoModal}
        title="Hint"
        message={`If water was dispensed continously\nbefore running diagnostic, the\nsolenoid is probably faulty.`}
        onOkayPress={() => {
          setInfoModal(false);
        }}
      />
    </AppContainer>
  );
};

export default Index;
