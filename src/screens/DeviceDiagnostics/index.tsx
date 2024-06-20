import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {
  consoleLog,
  getImgSource,
  parseDateHumanFormat,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Row, Col, Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import Header from 'src/components/Header';
import {BLEService} from 'src/services';
import AppContainer from 'src/components/AppContainer';
import {base64EncodeDecode, base64ToHex} from 'src/utils/Helpers/encryption';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {readingDiagnostic} from './helperGen1';
import {findObject} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mappingDiagnosticGen2, readingDiagnosticGen2} from './helperGen2';
import {BLE_GEN2_GATT_SERVICES} from 'src/utils/StaticData/BLE_GEN2_GATT_SERVICES';

const Index = ({navigation, route}: any) => {
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>([]);

  useEffect(() => {
    initlizeApp();
  }, []);

  /** Function comments */
  const initlizeApp = async () => {
    if (BLEService.deviceGeneration == 'gen1') {
      initlizeAppGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      initlizeAppGen2();
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  const initlizeAppGen1 = async () => {
    setLoading(true);
    const RESULTS = await readingDiagnostic();
    consoleLog('initlizeAppGen1 readingDiagnostic RESULTS==>', RESULTS);
    setDiagnosticResults(RESULTS);

    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
    const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c961';

    const initDiagnosticResponse =
      await BLEService.writeCharacteristicWithResponseForDevice(
        serviceUUID,
        characteristicUUID,
        '1',
      );

    // consoleLog(
    //   'initialize __initDiagnosticResponse==>',
    //   cleanCharacteristic(initDiagnosticResponse),
    // );
    setLoading(false);
  };

  const initlizeAppGen2 = () => {
    __mappingDiagnosticGen2SetupMonitor();
  };

  const finishDiagnostics = (waterDispensed: number) => {
    if (BLEService.deviceGeneration == 'gen1') {
      if (waterDispensed) {
        setLoading(true);
        setTimeout(() => {
          finishDiagnosticsGen1(waterDispensed);
        }, 1000);
      } else {
        NavigationService.navigate('DeviceHelpStack');
      }
    } else if (BLEService.deviceGeneration == 'gen2') {
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  const finishDiagnosticsGen1 = async (waterDispensed: number) => {
    // consoleLog("BLEService.batteryLevel==>", BLEService.batteryLevel);
    // return ;

    // Battery Level at Diagnostic
    // const batteryLevelResponse =
    await BLEService.writeCharacteristicWithResponseForDevice(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
      'd0aba888-fb10-4dc9-9b17-bdd8f490c966',
      '80',
    );

    // await BLEService.writeCharacteristicWithResponseForDevice2(
    //   'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
    //   'd0aba888-fb10-4dc9-9b17-bdd8f490c966',
    //   new Uint8Array([BLEService.batteryLevel]),
    // );

    // consoleLog(
    //   'finishDiagnosticsGen1 batteryLevelResponse==>',
    //   cleanCharacteristic(batteryLevelResponse),
    // );
    // setLoading(false);
    // return;

    // D/T of last diagnostic
    await BLEService.writeCharacteristicWithoutResponseForDevice(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
      'd0aba888-fb10-4dc9-9b17-bdd8f490c967',
      parseDateHumanFormat(new Date(), 'ddd, DD MMMM YYYY HH:MM:SS'),
    );

    setTimeout(async () => {
      const RESULTS = await readingDiagnostic();
      consoleLog('finishDiagnosticsGen1 readingDiagnostic RESULTS==>', RESULTS);
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });

      const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
      const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c961';

      const initDiagnosticResponse =
        await BLEService.writeCharacteristicWithResponseForDevice(
          serviceUUID,
          characteristicUUID,
          '0',
        );

      // const __initDiagnosticResponse = cleanCharacteristic(
      //   initDiagnosticResponse,
      // );

      // consoleLog(
      //   'finishDiagnosticsGen1 __initDiagnosticResponse==>',
      //   __initDiagnosticResponse,
      // );

      // consoleLog("sensorResult==>", sensorResult);
      setLoading(false);
      NavigationService.navigate('DeviceDiagnosticResults', {
        previousDiagnosticResults: diagnosticResults,
        diagnosticResults: RESULTS,
        waterDispensed: waterDispensed,
        sensorResult: sensorResult,
        dateResult: dateResult,
      });
    }, 2000);
  };

  /** Function comments */
  const __mappingDiagnosticGen2SetupMonitor = async () => {
    consoleLog('__mappingDiagnosticGen2SetupMonitor called');
    var __characteristicMonitorDiagnostic: string[] = [];

    const characteristic = await BLEService.readCharacteristicForDevice(
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_CHARACTERISTIC_UUID,
    );
    consoleLog(
      '__mappingDiagnosticGen2SetupMonitor characteristic==>',
      characteristic,
    );
    if (characteristic?.value) {
      var deviceDataIntegerHex = base64ToHex(characteristic?.value);
      consoleLog(
        '__mappingDiagnosticGen2SetupMonitor deviceDataIntegerHex==>',
        deviceDataIntegerHex,
      );

      __characteristicMonitorDiagnostic.push(deviceDataIntegerHex);
      BLEService.characteristicMonitorDiagnostic =
        __characteristicMonitorDiagnostic;
      __mappingDiagnosticGen2();
    }
  };

  /** Function comments */
  const __mappingDiagnosticGen2 = async () => {
    const mappingDiagnosticGen2Response = await mappingDiagnosticGen2(
      BLE_GEN2_GATT_SERVICES,
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_CHARACTERISTIC_UUID,
      BLEService.characteristicMonitorDiagnostic,
    );

    consoleLog(
      '__mappingDiagnosticGen2 mappingDiagnosticGen2Response==>',
      JSON.stringify(mappingDiagnosticGen2Response),
    );

    BLEService.characteristicMonitorDiagnosticMapped =
      mappingDiagnosticGen2Response;
    const RESULTS = await readingDiagnosticGen2(
      BLEService.characteristicMonitorDiagnosticMapped,
    );
    consoleLog(
      '__mappingDiagnosticGen2 readingDiagnosticGen2 RESULTS==>',
      RESULTS,
    );
    // setDiagnosticResults(RESULTS);
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="solid"
      loading={loading}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        <Image
          // @ts-ignore
          source={getImgSource(Images?.activateFaucet)}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0.7,
          }}
          resizeMode="cover"
          // blurRadius={1}
        />
        <Header hasBackButton headerBackgroundType="transparent" />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false}>
              <Typography
                size={22}
                text={`Diagnostics`}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <Typography
                size={14}
                text={`Place your hand in front of the \nfaucet for at least 3 seconds.`}
                style={{textAlign: 'center', marginTop: 15, lineHeight: 20}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Typography
                size={14}
                text={`Did you see water dispense?`}
                style={{textAlign: 'center', marginTop: 20, lineHeight: 20}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />
            </Wrap>
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={styles.container}>
              <Row autoMargin={false} style={styles.row}>
                <Col autoMargin={false} style={[styles.col, {paddingRight: 5}]}>
                  <Button
                    type={'secondary'}
                    title="NO"
                    onPress={() => {
                      finishDiagnostics(0);
                    }}
                    textStyle={{
                      fontSize: 10,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                  />
                </Col>
                <Col autoMargin={false} style={[styles.col, {paddingLeft: 5}]}>
                  <Button
                    type={'secondary'}
                    title="YES"
                    onPress={() => {
                      finishDiagnostics(1);
                    }}
                    textStyle={{
                      fontSize: 10,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                  />
                </Col>
              </Row>
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
