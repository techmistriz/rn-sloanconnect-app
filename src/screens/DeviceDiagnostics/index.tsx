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
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {readingDiagnostic} from './helperGen1';
import {findObject} from 'src/utils/Helpers/array';

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

  const finishDiagnostics = (waterDispensed: number) => {
    if (BLEService.deviceGeneration == 'gen1') {
      finishDiagnosticsGen1(waterDispensed);
    } else if (BLEService.deviceGeneration == 'gen2') {
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  const finishDiagnosticsGen1 = async (waterDispensed: number) => {
    setLoading(true);
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
    const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c961';

    const initDiagnosticResponse =
      await BLEService.writeCharacteristicWithResponseForDevice(
        serviceUUID,
        characteristicUUID,
        '0',
      );

    const __initDiagnosticResponse = cleanCharacteristic(
      initDiagnosticResponse,
    );

    // consoleLog(
    //   'finishDiagnosticsGen1 __initDiagnosticResponse==>',
    //   __initDiagnosticResponse,
    // );

    // consoleLog("BLEService.batteryLevel==>", BLEService.batteryLevel);
    // return ;

    // Battery Level at Diagnostic
    // const batteryLevelResponse =
      await BLEService.writeCharacteristicWithoutResponseForDevice(
        'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
        'd0aba888-fb10-4dc9-9b17-bdd8f490c966',
        BLEService.batteryLevel?.toString(),
      );

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
