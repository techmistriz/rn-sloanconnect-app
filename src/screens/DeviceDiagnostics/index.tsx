import React, {useEffect, useState} from 'react';
import {BackHandler, Image} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {
  consoleLog,
  getImgSource,
  parseDateHumanFormat,
  parseDateTimeInFormat,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Row, Col, Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import Header from 'src/components/Header';
import {BLEService} from 'src/services';
import AppContainer from 'src/components/AppContainer';
import {readingDiagnostic} from './helperGen1';
import {findObject} from 'src/utils/Helpers/array';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {mappingDiagnosticGen2, readingDiagnosticGen2} from './helperGen2';
import {BLE_GEN2_GATT_SERVICES} from 'src/utils/StaticData/BLE_GEN2_GATT_SERVICES';
import {
  decimalToHex,
  fromHexStringUint8Array,
  base64ToHex,
  hexToByteSafe, asciiToHex,
} from 'src/utils/Helpers/encryption';
import {mapValueGen2} from 'src/utils/Helpers/project';
import {mappingDeviceDataIntegersGen2} from '../DeviceDashboard/helperGen2';
import LoaderOverlay from 'src/components/LoaderOverlay';
import I18n from 'src/locales/Transaltions';
import {readingDiagnosticFlusher} from './helperFlusher';
import {FlushometerStepResultProps} from './types';
import {readingDiagnosticBasys} from './helperBasys';

const flushometerSteps = [
  {
    id: 1,
    title: I18n.t('diagnostic_page.FLUSHOMETERSTEP_1_TTILE'),
    subtitle: I18n.t('diagnostic_page.FLUSHOMETERSTEP_1_SUBTTILE'),
    image: Images?.flusherDiagnosticBg1,
  },
  {
    id: 2,
    title: I18n.t('diagnostic_page.FLUSHOMETERSTEP_2_TTILE'),
    subtitle: I18n.t('diagnostic_page.FLUSHOMETERSTEP_2_SUBTTILE'),
    image: Images?.flusherDiagnosticBg2,
  },
  {
    id: 3,
    title: '',
    subtitle: I18n.t('diagnostic_page.FLUSHOMETERSTEP_3_SUBTTILE'),
    image: Images?.flusherDiagnosticBg3,
  },
];

const Index = ({navigation, route}: any) => {
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>([]);
  const {referrer, previousScreen} = route?.params || {
    referrer: undefined,
    previousScreen: undefined,
  };

  const [flushometerStepResult, setflushometerStepResult] =
    useState<FlushometerStepResultProps>({
      step1: 'No',
      step2: 'No',
      step3: 'No',
    });
  const [flushometerStepIndex, setflushometerStepIndex] = useState(0);

  /** component hooks method for hardwareBackPress */
  useEffect(() => {
    // consoleLog('previousScreen==>', previousScreen);
    // const navigationState = NavigationService?.getState();
    // const currentRouteNested =
    //   NavigationService?.getCurrentRouteNested(navigationState);
    // consoleLog('NavigationService navigationState==>', JSON.stringify(navigationState));
    // consoleLog(
    //   'NavigationService currentRouteNested==> ',
    //   JSON.stringify(currentRouteNested),
    // );

    const backAction = () => {
      if (navigation.isFocused()) {
        if (previousScreen != 'DeviceDashboard') {
          NavigationService.replace('BottomTabNavigator');
        } else {
          NavigationService.goBack();
        }
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /** Function comments */
  useEffect(() => {
    initlizeApp();
  }, []);

  /** Function comments */
  const initlizeApp = async () => {
    // consoleLog('BLEService.batteryLevel==>', BLEService.batteryLevel);

    // // D/T of last diagnostic
    // const diagnosticDateTimestampInHex = fromHexStringUint8Array(
    //   decimalToHex(timestampInSec()),
    // );

    // consoleLog(
    //   'initlizeApp diagnosticDateTimestampInHex==>',
    //   diagnosticDateTimestampInHex,
    // );
    // await BLEService.writeCharacteristicWithResponseForDevice2(
    //   BLE_CONSTANTS.GEN1.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
    //   BLE_CONSTANTS.GEN1
    //     .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
    //   diagnosticDateTimestampInHex,
    // );

    // const batteryLevelInHex = fromHexStringUint8Array(
    //   decimalToHex(BLEService.batteryLevel?.toString()),
    // );

    // consoleLog('initlizeApp batteryLevelInHex==>', batteryLevelInHex);

    // await BLEService.writeCharacteristicWithResponseForDevice2(
    //   BLE_CONSTANTS.GEN1.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
    //   BLE_CONSTANTS.GEN1
    //     .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
    //   batteryLevelInHex,
    // );

    // // D/T of last diagnostic
    // const diagnosticDateTimestampInHex = mapValueGen2(
    //   BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_LAST_DIAGNOSTIC,
    //   timestampInSec(),
    // );

    // await BLEService.writeCharacteristicWithResponseForDevice2(
    //   BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
    //   BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
    //   fromHexStringUint8Array(diagnosticDateTimestampInHex),
    // );

    if (BLEService.deviceGeneration == 'gen1') {
      initlizeAppGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      initlizeAppGen2();
    } else if (BLEService.deviceGeneration == 'flusher') {
      setflushometerStepIndex(0);
      initlizeAppFlusher();
    } else if (BLEService.deviceGeneration == 'basys') {
      initlizeAppBasys();
    }
  };

  /** Function comments */
  const initlizeAppGen1 = async () => {
    setLoading(true);
    const RESULTS = await readingDiagnostic();
    consoleLog('initlizeAppGen1 readingDiagnostic RESULTS==>', RESULTS);
    setDiagnosticResults(RESULTS);

    // const initDiagnosticResponse =
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
    // 76 0f 00 00 00 00 01 00 1f 5d ff 66 8e b3 03 ff
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

    const diagnosticInitMappedValue = mapValueGen2(
      BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DIAGNOSTIC_INIT,
      '1',
    );
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
      BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      fromHexStringUint8Array(diagnosticInitMappedValue),
    );
    setLoading(false);
  };

  /** Function comments */
  const initlizeAppFlusher = async () => {
    setLoading(true);
    const RESULTS = await readingDiagnosticFlusher();
    // consoleLog('initlizeAppFlusher readingDiagnostic RESULTS==>', RESULTS);
    setDiagnosticResults(RESULTS);

    // const initDiagnosticResponse =
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_INIT_SERVICE_UUID,
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
      hexToByteSafe(decimalToHex('1')),
    );

    // consoleLog(
    //   'initialize __initDiagnosticResponse==>',
    //   cleanCharacteristic(initDiagnosticResponse),
    // );
    setLoading(false);
  };

  /** Function comments */
  const initlizeAppBasys = async () => {
    setLoading(true);
    const RESULTS = await readingDiagnosticBasys();
    consoleLog('initlizeAppBasys readingDiagnostic RESULTS==>', RESULTS);
    setDiagnosticResults(RESULTS);

    // const initDiagnosticResponse =
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.BASYS.DIAGNOSTIC_INIT_SERVICE_UUID,
      BLE_CONSTANTS.BASYS.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
      hexToByteSafe(decimalToHex('1')),
    );

    // consoleLog(
    //   'initialize __initDiagnosticResponse==>',
    //   cleanCharacteristic(initDiagnosticResponse),
    // );
    setLoading(false);
  };

  const onNextPress = (
    buttonActionType: string = '',
    __flushometerStepIndex: number,
  ) => {
    // consoleLog('flusher step click', __flushometerStepIndex);
    if (__flushometerStepIndex == 0) {
      setflushometerStepResult({
        ...flushometerStepResult,
        step1: buttonActionType,
      });

      setflushometerStepIndex(__flushometerStepIndex + 1);
    } else if (__flushometerStepIndex == 1) {
      setflushometerStepResult({
        ...flushometerStepResult,
        step2: buttonActionType,
      });
      setflushometerStepIndex(__flushometerStepIndex + 1);
    } else if (__flushometerStepIndex == 2) {
      const __flushometerStepResult = {
        ...flushometerStepResult,
        step3: buttonActionType,
      };
      setflushometerStepResult(__flushometerStepResult);
      finishDiagnosticsFlusher(__flushometerStepResult);
    }
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

        NavigationService.navigate('DeviceDiagnosticTroubleshoot', {
          referrer: 'DeviceDiagnostics',
        });
      }
    } else if (BLEService.deviceGeneration == 'gen2') {
      if (waterDispensed) {
        setLoading(true);
        setTimeout(() => {
          finishDiagnosticsGen2(waterDispensed);
        }, 1000);
      } else {
        NavigationService.navigate('DeviceDiagnosticTroubleshoot', {
          referrer: 'DeviceDiagnostics',
        });
      }
    } else if (BLEService.deviceGeneration == 'flusher') {
      // Not in use, we use onNextPress fun
      // finishDiagnosticsFlusher();
    } else if (BLEService.deviceGeneration == 'basys') {
      // finishDiagnosticsBasys(waterDispensed);
      if (waterDispensed) {
        setLoading(true);
        setTimeout(() => {
          finishDiagnosticsBasys(waterDispensed);
        }, 1000);
      } else {
        await BLEService.writeCharacteristicWithResponseForDevice(
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_SERVICE_UUID,
          BLE_CONSTANTS.GEN1.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
          '0',
        );

        NavigationService.navigate('DeviceDiagnosticTroubleshoot', {
          referrer: 'DeviceDiagnostics',
        });
      }
    }
  };

  /** Function comments */
  const finishDiagnosticsGen1 = async (waterDispensed: number) => {
    // Battery level at diagnostic
    const batteryLevelInHex = fromHexStringUint8Array(
      decimalToHex(BLEService.batteryLevel?.toString()),
    );

    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.GEN1.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS.GEN1
        .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
      batteryLevelInHex,
    );

    // D/T of last diagnostic
    const diagnosticDateTimestampInHex = fromHexStringUint8Array(
      decimalToHex(timestampInSec()),
    );

    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.GEN1.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
      BLE_CONSTANTS.GEN1
        .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      diagnosticDateTimestampInHex,
    );

    setTimeout(async () => {
      const RESULTS = await readingDiagnostic();

      consoleLog('finishDiagnosticsGen1 readingDiagnostic RESULTS==>', RESULTS);
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });
      const dateLastResult = findObject(
        'D/T of last diagnostic',
        diagnosticResults,
        {
          searchKey: 'name',
        },
      );

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
        referrer: 'DeviceDiagnostic',
        previousScreen: previousScreen,
        previousDiagnosticResults: diagnosticResults,
        diagnosticResults: RESULTS,
        waterDispensed: waterDispensed,
        sensorResult: sensorResult,
        dateResult: dateResult,
        dateLastResult: dateLastResult,
      });
    }, 2000);
  };

  /** Function comments */
  const finishDiagnosticsGen2 = async (waterDispensed: number) => {
    const currentTimestamp = timestampInSec();

    // Read raw data
    // await __mappingDeviceDataIntegersGen2SetupMonitor();
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

    setTimeout(async () => {
      const RESULTS = await readingDiagnosticGen2(
        BLEService.characteristicMonitorDiagnosticMapped,
      );
      consoleLog(
        'finishDiagnosticsGen2 finishDiagnosticsGen2 RESULTS==>',
        RESULTS,
      );
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });
      dateResult.value = currentTimestamp;

      const dateLastResult = findObject(
        'D/T of last diagnostic',
        diagnosticResults,
        {
          searchKey: 'name',
        },
      );

      // Finish diagnostic by writing value 0
      const diagnosticInitMappedValue = mapValueGen2(
        BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DIAGNOSTIC_INIT,
        '0',
      );
      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        fromHexStringUint8Array(diagnosticInitMappedValue),
      );

      // D/T of last diagnostic
      const diagnosticDateTimestampMappedValue = mapValueGen2(
        BLE_CONSTANTS.GEN2.WRITE_DATA_MAPPING.DATE_OF_LAST_DIAGNOSTIC,
        currentTimestamp,
      );

      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        fromHexStringUint8Array(diagnosticDateTimestampMappedValue),
      );

      setLoading(false);

      // consoleLog('finishDiagnosticsGen2==>', {dateResult, dateLastResult});
      // return false;

      NavigationService.navigate('DeviceDiagnosticResults', {
        referrer: 'DeviceDiagnostic',
        previousScreen: previousScreen,
        previousDiagnosticResults: diagnosticResults,
        diagnosticResults: RESULTS,
        waterDispensed: waterDispensed,
        sensorResult: sensorResult,
        dateResult: dateResult,
        dateLastResult: dateLastResult,
      });
    }, 2000);
  };

  /** Function comments */
  const finishDiagnosticsFlusher = async (
    __flushometerStepResult: FlushometerStepResultProps,
  ) => {
    setLoading(true);
    // consoleLog('__flushometerStepResult', __flushometerStepResult);
    // Sensor result
    var sensorResult = 0;
    if (
      __flushometerStepResult?.step1 == 'Yes' &&
      __flushometerStepResult?.step2 == 'No'
    ) {
      sensorResult = 1;
    }
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_SENSOR_RESULT_SERVICE_UUID,
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_SENSOR_RESULT_CHARACTERISTIC_UUID,
      hexToByteSafe(asciiToHex('' + sensorResult, 2)),
    );

    // Solenoid Status
    var solenoidStatus = 0;
    if (__flushometerStepResult?.step3 == 'Yes') {
      solenoidStatus = 1;
    }
    // consoleLog('writing DIAGNOSTIC_TURBINE_CHARACTERISTIC_UUID', {
    //   solenoidStatus,
    //   ascii: asciiToHex('' + solenoidStatus, 2),
    //   solenoid: hexToByteSafe(asciiToHex('' + solenoidStatus)),
    // });
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_TURBINE_SERVICE_UUID,
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_TURBINE_CHARACTERISTIC_UUID,
      hexToByteSafe(asciiToHex('' + solenoidStatus, 2)),
    );

    // Battery level at diagnostic
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS.FLUSHER
        .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
      hexToByteSafe(decimalToHex(BLEService.batteryLevel)),
    );

    // D/T of last diagnostic
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
      BLE_CONSTANTS.FLUSHER
        .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      hexToByteSafe(decimalToHex(timestampInSec())),
    );

    setTimeout(async () => {
      const RESULTS = await readingDiagnosticFlusher();

      consoleLog(
        'finishDiagnosticsFlusher readingDiagnostic RESULTS==>',
        RESULTS,
      );
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });
      const dateLastResult = findObject(
        'D/T of last diagnostic',
        diagnosticResults,
        {
          searchKey: 'name',
        },
      );

      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_INIT_SERVICE_UUID,
        BLE_CONSTANTS.FLUSHER.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
        hexToByteSafe(asciiToHex('0')),
      );

      // consoleLog(
      //   'finishDiagnosticsGen1 __initDiagnosticResponse==>',
      //   __initDiagnosticResponse,
      // );

      // consoleLog("sensorResult==>", sensorResult);
      setLoading(false);
      NavigationService.navigate('DeviceDiagnosticResults', {
        referrer: 'DeviceDiagnostic',
        previousScreen: previousScreen,
        previousDiagnosticResults: diagnosticResults,
        diagnosticResults: RESULTS,
        waterDispensed: 1,
        sensorResult: sensorResult,
        dateResult: dateResult,
        dateLastResult: dateLastResult,
      });
    }, 2000);
  };

  /** Function comments */
  const finishDiagnosticsBasys = async (waterDispensed: number) => {
    // Battery level at diagnostic
    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.BASYS.DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_SERVICE_UUID,
      BLE_CONSTANTS.BASYS
        .DIAGNOSTIC_BATTERY_LEVEL_AT_DIAGNOSTIC_CHARACTERISTIC_UUID,
      hexToByteSafe(decimalToHex(BLEService.batteryLevel)),
    );

    // D/T of last diagnostic
    const diagnosticDateTimestampInHex = fromHexStringUint8Array(
      decimalToHex(timestampInSec()),
    );

    await BLEService.writeCharacteristicWithResponseForDevice2(
      BLE_CONSTANTS.BASYS.DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_SERVICE_UUID,
      BLE_CONSTANTS.BASYS
        .DIAGNOSTIC_DATE_OF_LAST_DIAGNOSTICS_CHARACTERISTIC_UUID,
      diagnosticDateTimestampInHex,
    );

    setTimeout(async () => {
      const RESULTS = await readingDiagnosticBasys();

      consoleLog(
        'finishDiagnosticsBasys readingDiagnostic RESULTS==>',
        RESULTS,
      );
      const sensorResult = findObject('Sensor', RESULTS, {searchKey: 'name'});
      const dateResult = findObject('D/T of last diagnostic', RESULTS, {
        searchKey: 'name',
      });
      const dateLastResult = findObject(
        'D/T of last diagnostic',
        diagnosticResults,
        {
          searchKey: 'name',
        },
      );

      await BLEService.writeCharacteristicWithResponseForDevice(
        BLE_CONSTANTS.BASYS.DIAGNOSTIC_INIT_SERVICE_UUID,
        BLE_CONSTANTS.BASYS.DIAGNOSTIC_INIT_CHARACTERISTIC_UUID,
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
        referrer: 'DeviceDiagnostic',
        previousScreen: previousScreen,
        previousDiagnosticResults: diagnosticResults,
        diagnosticResults: RESULTS,
        waterDispensed: waterDispensed,
        sensorResult: sensorResult,
        dateResult: dateResult,
        dateLastResult: dateLastResult,
      });
    }, 2000);
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2SetupMonitor = async () => {
    // consoleLog('__mappingDeviceDataIntegersGen2SetupMonitor called');
    var __characteristicMonitorDeviceDataIntegers: string[] = [];

    // Device data integer
    BLEService.setupMonitor(
      BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_SERVICE_UUID,
      BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
      async characteristic => {
        // consoleLog('__mappingDeviceDataIntegersGen2SetupMonitor characteristic==>', characteristic);
        if (characteristic?.value) {
          var deviceDataIntegerHex = base64ToHex(characteristic?.value);
          // consoleLog(
          //   '__mappingDeviceDataIntegersGen2SetupMonitor deviceDataIntegerHex==>',
          //   deviceDataIntegerHex,
          // );
          if (deviceDataIntegerHex == '71ff04') {
            BLEService.characteristicMonitorDeviceDataIntegers =
              __characteristicMonitorDeviceDataIntegers;
            BLEService.finishMonitor();
            await __mappingDeviceDataIntegersGen2();
          } else {
            __characteristicMonitorDeviceDataIntegers.push(
              deviceDataIntegerHex,
            );
          }
        }
      },
      error => {
        consoleLog('setupMonitor error==>', error);
      },
    );
  };

  /** Function comments */
  const __mappingDeviceDataIntegersGen2 = async () => {
    const mappingDeviceDataIntegersGen2Response =
      await mappingDeviceDataIntegersGen2(
        BLE_GEN2_GATT_SERVICES,
        BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS?.GEN2?.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        BLEService.characteristicMonitorDeviceDataIntegers,
      );

    BLEService.characteristicMonitorDeviceDataIntegersMapped =
      mappingDeviceDataIntegersGen2Response;
  };

  if (
    BLEService.deviceGeneration == 'gen1' ||
    BLEService.deviceGeneration == 'gen2' ||
    BLEService.deviceGeneration == 'basys'
  ) {
    return (
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
                text={I18n.t('diagnostic_page.DIAGNOSING_HEADING')}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <Typography
                size={14}
                text={I18n.t('diagnostic_page.DIAGNOSE_SUB_TEXT')}
                style={{textAlign: 'center', marginTop: 15, lineHeight: 20}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Typography
                size={14}
                text={I18n.t('diagnostic_page.DID_YOU_SEE_WATER')}
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
                    title={I18n.t('button_labels.NO_BUTTON_LABEL')}
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
                    title={I18n.t('button_labels.YES_BUTTON_LABEL')}
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
        <LoaderOverlay loading={loading} />
      </Wrap>
    );
  }

  return (
    <Wrap
      autoMargin={false}
      style={[
        styles.mainContainer,
        {
          backgroundColor: Theme.colors.white,
        },
      ]}>
      <Image
        // @ts-ignore
        source={getImgSource(flushometerSteps?.[flushometerStepIndex]?.image)}
        style={{
          width: '80%',
          height: '80%',
          position: 'absolute',
        }}
        resizeMode="contain"
      />
      <Header hasBackButton headerBackgroundType="solid" />
      <Wrap autoMargin={false} style={styles.sectionContainer}>
        <Wrap autoMargin={false} style={styles.sectionFake}></Wrap>
        <Wrap autoMargin={false} style={styles.section1}>
          <Wrap autoMargin={false}>
            <Typography
              size={16}
              text={flushometerSteps?.[flushometerStepIndex]?.title}
              style={{textAlign: 'center', marginTop: 15}}
              color={Theme.colors.primaryColor}
              ff={Theme.fonts.ThemeFontLight}
            />

            <Typography
              size={25}
              text={flushometerSteps?.[flushometerStepIndex]?.subtitle}
              style={{textAlign: 'center', marginTop: 20}}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>
        </Wrap>
        <Wrap autoMargin={false} style={styles.section2}>
          <Wrap autoMargin={false} style={styles.container}>
            <Row autoMargin={false} style={styles.row}>
              <Col autoMargin={false} style={[styles.col, {paddingRight: 5}]}>
                <Button
                  type={'link'}
                  title={I18n.t('button_labels.NO_BUTTON_LABEL')}
                  onPress={() => {
                    onNextPress('No', flushometerStepIndex);
                  }}
                  textStyle={{
                    fontSize: 14,
                    fontFamily: Theme.fonts.ThemeFontMedium,
                  }}
                />
              </Col>
              <Col autoMargin={false} style={[styles.col, {paddingLeft: 5}]}>
                <Button
                  type={'link'}
                  title={I18n.t('button_labels.YES_BUTTON_LABEL')}
                  onPress={() => {
                    onNextPress('Yes', flushometerStepIndex);
                  }}
                  textStyle={{
                    fontSize: 14,
                    fontFamily: Theme.fonts.ThemeFontMedium,
                  }}
                />
              </Col>
            </Row>
          </Wrap>
        </Wrap>
      </Wrap>
      <LoaderOverlay loading={loading} />
    </Wrap>
  );
};

export default Index;
