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
import {cleanCharacteristic, mapValueGen2} from 'src/utils/Helpers/project';
import {readingDiagnostic} from './helperGen1';
import {findObject} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mappingDiagnosticGen2, readingDiagnosticGen2} from './helperGen2';
import {BLE_GEN2_GATT_SERVICES} from 'src/utils/StaticData/BLE_GEN2_GATT_SERVICES';

const Index = ({navigation, route}: any) => {
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>([]);

  /** Function comments */
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

  /** Function comments */
  const initlizeAppGen1 = async () => {
    setLoading(true);
    const RESULTS = await readingDiagnostic();
    consoleLog('initlizeAppGen1 readingDiagnostic RESULTS==>', RESULTS);
    setDiagnosticResults(RESULTS);

    const initDiagnosticResponse =
      await BLEService.writeCharacteristicWithResponseForDevice(
        BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_SERVICE_UUID,
        BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
        '1',
      );

    // consoleLog(
    //   'initialize __initDiagnosticResponse==>',
    //   cleanCharacteristic(initDiagnosticResponse),
    // );
    setLoading(false);
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
    }
  };

  /** Function comments */
  const initlizeAppGen2 = async () => {
    setLoading(true);

    // Read raw data
    await __mappingDiagnosticGen2SetupMonitor();

    // Map data
    const mappingDiagnosticGen2Response = await mappingDiagnosticGen2(
      BLE_GEN2_GATT_SERVICES,
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.DIAGNOSTIC_CHARACTERISTIC_UUID,
      BLEService.characteristicMonitorDiagnostic,
    );

    consoleLog(
      'initlizeAppGen2 mappingDiagnosticGen2Response==>',
      JSON.stringify(mappingDiagnosticGen2Response),
    );

    BLEService.characteristicMonitorDiagnosticMapped =
      mappingDiagnosticGen2Response;

    const RESULTS = await readingDiagnosticGen2(
      BLEService.characteristicMonitorDiagnosticMapped,
    );
    setDiagnosticResults(RESULTS);

    consoleLog(
      'initlizeAppGen1 readingDiagnosticGen2 PREVIOUS RESULTS==>',
      RESULTS,
    );

    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
      BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      mapValueGen2(BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DIAGNOSTIC_INIT, '1'),
    );
    setLoading(false);
  };

  /** Function comments */
  const finishDiagnostics = async (waterDispensed: number) => {
    if (BLEService.deviceGeneration == 'gen1') {
      if (waterDispensed) {
        setLoading(true);
        setTimeout(() => {
          finishDiagnosticsGen1(waterDispensed);
        }, 1000);
      } else {
        await BLEService.writeCharacteristicWithResponseForDevice(
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_SERVICE_UUID,
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
          '0',
        );

        NavigationService.navigate('DeviceHelpStack');
      }
    } else if (BLEService.deviceGeneration == 'gen2') {
      if (waterDispensed) {
        setLoading(true);
        setTimeout(() => {
          finishDiagnosticsGen2(waterDispensed);
        }, 1000);
      } else {
        NavigationService.navigate('DeviceHelpStack');
      }
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  /** Function comments */
  const finishDiagnosticsGen1 = async (waterDispensed: number) => {
    await BLEService.writeCharacteristicWithResponseForDevice(
      BLE_CONSTANTS.GEN1.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS.GEN1
        .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
      BLEService.batteryLevel?.toString(),
    );

    // D/T of last diagnostic
    await BLEService.writeCharacteristicWithoutResponseForDevice(
      BLE_CONSTANTS.GEN1.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
      BLE_CONSTANTS.GEN1
        .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      parseDateHumanFormat(new Date(), 'ddd, DD MMMM YYYY HH:MM:SS'),
    );

    setTimeout(async () => {
      const RESULTS = await readingDiagnostic();
      consoleLog('finishDiagnosticsGen1 readingDiagnostic RESULTS==>', RESULTS);
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });

      const initDiagnosticResponse =
        await BLEService.writeCharacteristicWithResponseForDevice(
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_SERVICE_UUID,
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
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
  const finishDiagnosticsGen2 = async (waterDispensed: number) => {
    setTimeout(async () => {
      const RESULTS = await readingDiagnosticGen2(
        BLEService.characteristicMonitorDiagnosticMapped,
      );
      consoleLog('finishDiagnosticsGen2 readingDiagnostic RESULTS==>', RESULTS);
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });

      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        mapValueGen2(
          BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DIAGNOSTIC_INIT,
          '0',
        ),
      );

      consoleLog('finishDiagnosticsGen2==>', {diagnosticResults, RESULTS});
      setLoading(false);
      // return false; 76 0f 00 00 00 00 00 00 00 00 ff 00 00 00 00 ff

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
