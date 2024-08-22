import {
  isObjectEmpty,
  findObject,
  findValueObject,
} from 'src/utils/Helpers/array';
import DeviceInfo from 'react-native-device-info';
import {constants} from 'src/common';
import {
  consoleLog,
  getTimezone,
  getTimezoneAbbreviation,
  parseDateHumanFormatFromUnix,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import {BLEService} from 'src/services';
import {
  getDeviceInfoAdvance,
  getDeviceInfoNormal,
} from 'src/screens/DeviceInfo/helperGen1';
import {readingDiagnostic} from 'src/screens/DeviceDiagnostics/helperGen1';
import {readingDiagnosticGen2} from 'src/screens/DeviceDiagnostics/helperGen2';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {formatCharateristicValue} from 'src/utils/Helpers/project';
import moment from 'moment';
import {cleanString, cleanString2} from 'src/utils/Helpers/encryption';
import {getDeviceInfoAdvanceFlusher, getDeviceInfoNormalFlusher} from 'src/screens/DeviceInfo/helperFlusher';
import {getDeviceInfoAdvanceBasys, getDeviceInfoNormalBasys} from 'src/screens/DeviceInfo/helperBasys';
import {readingDiagnosticFlusher} from 'src/screens/DeviceDiagnostics/helperFlusher';
import {readingDiagnosticBasys} from 'src/screens/DeviceDiagnostics/helperBasys';

const __reportMappingStats = {
  report_created_at: '',
  device_generation: '',
  is_report_manual: 'yes',
  user_info: {
    id: '',
    user_email: '',
    first_name: '',
    last_name: '',
    user_id: '',
    user_phone: '',
    user_title: '',
  },
  mobile_device_info: {
    os: '',
    model: '',
    bluetooth_rssi: '',
    app_version: '',
    app_release_date: '',
    app_install_date: '',
    phone_battery: '',
  },
  user_app_preferences: {
    language: 'EN',
    timezone: '',
    metric_imperial: '',
    gallon_liter: '',
  },
  faucet_device_details: {
    faucet_sensor_details: {
      faucet_model: '',
      sensor_serial_number: '',
      sensor_manufacturing_date: '',
      sensor_hardware_ver: '',
      sensor_firmware_ver: '',
    },
    control_box_details: {
      control_box_model: '',
      control_box_serial_number: '',
      control_box_manuf_date: '',
      control_box_hardware_ver: '',
      control_box_firmware_ver: '',
    },
  },
  faucet_settings: {
    prev: {
      mode_selection: '',
      on_demand_time_out: '',
      metered_run_time: '',
      flush_enable: '',
      flush_duration: '',
      flush_interval: '',
      flow_rate: '',
      sensor_range: '',
      bd_note: '',
      activation_time: '',
      flush_time: '',
      flush_volume: '',
    },
    current: {
      mode_selection: '',
      on_demand_time_out: '',
      metered_run_time: '',
      flush_enable: '',
      flush_duration: '',
      flush_interval: '',
      flow_rate: '',
      sensor_range: '',
      bd_note: '',
      activation_time: '',
      flush_time: '',
      flush_volume: '',
    },
  },
  diagnostic_report: {
    prev: {
      sensor: '',
      valve: '',
      turbine: '',
      solenoid: '',
      battery: '',
      date_of_diagnostic: '',
    },
    current: {
      sensor: '',
      valve: '',
      turbine: '',
      solenoid: '',
      battery: '',
      date_of_diagnostic: '',
    },
  },
  advanced_device_details: {
    battery_status: '',
    date_of_installation: '',
    hours_of_operation: '',
    activations_since_day_1: '',
    accumulated_activation_time: '',
    accumulated_water_usage: '',
    activations_since_last_change: '',
    line_flushes_since_day1: '',
    accumulated_flush_time: '',
    number_of_ble_connections: '',
    date_of_last_factory: '',
    date_of_last_mode_change: '',
    date_of_last_metered_run_time_change: '',
    date_of_last_ondemand_timeout_change: '',
    date_of_last_flush_enable_change: '',
    date_of_last_flush_time_change: '',
    date_of_last_flush_interval_change: '',
    date_of_last_flow_rate_change: '',
    date_of_last_range_change: '',
    date_of_last_bd_note_change: '',
  },
};

class BLEReportInstance {
  reportMappingStats: any;

  constructor() {
    this.reportMappingStats = __reportMappingStats;
  }

  mapUserInfo(user: any) {
    if (!user || isObjectEmpty(user)) {
      return false;
    }
    let __USER_INFO = {
      id: '',
      user_email: '',
      first_name: '',
      last_name: '',
      user_id: '',
      user_phone: '',
      user_title: '',
    };

    __USER_INFO.user_email = user?.email ?? null;
    __USER_INFO.first_name = user?.first_name ?? null;
    __USER_INFO.last_name = user?.last_name ?? null;
    __USER_INFO.user_id = user?.organizations?.[0]?.id ?? null;
    __USER_INFO.id = user?.organizations?.[0]?.id ?? null;
    __USER_INFO.user_phone = user?.user_metadata?.phone_number ?? null;
    __USER_INFO.user_title = user?.user_metadata?.title ?? null;
    this.reportMappingStats.user_info = __USER_INFO;
  }

  mapDeviceInfo() {
    var installTime = DeviceInfo.getFirstInstallTimeSync();

    if (installTime <= 0) {
      installTime = timestampInSec();
    }

    let __MOBILE_DEVICE_INFO = {
      os: constants.isIOS ? 'ios' : 'android',
      model: DeviceInfo.getModel(),
      bluetooth_ver: '',
      // app_version: DeviceInfo.getVersion(),
      bluetooth_rssi: BLEService?.deviceRaw?.rssi,
      app_version: constants.APP_VERSION,
      app_release_date: constants.RELEASE_DATE,
      app_install_date: parseDateHumanFormatFromUnix(installTime / 1000),
      phone_battery: parseInt(
        (DeviceInfo.getBatteryLevelSync() * 100).toString(),
      ),
    };

    this.reportMappingStats.mobile_device_info = __MOBILE_DEVICE_INFO;
  }

  mapUserPreference() {
    let __USER_APP_PREFERENCES = {
      language: 'EN',
      // timezone: getTimezone(), // Asia/Kolkata (Use whatever suits you)
      timezone: getTimezoneAbbreviation(), // IST (Use whatever suits you)
      metric_imperial: '',
      gallon_liter: '',
    };

    this.reportMappingStats.user_app_preferences = __USER_APP_PREFERENCES;
  }

  async mapFaucetDeviceDetails() {
    consoleLog('mapFaucetDeviceDetails called');
    if (BLEService.deviceGeneration == 'gen1') {
      await this.mapFaucetDeviceDetailsGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      await this.mapFaucetDeviceDetailsGen2();
    } else if (BLEService.deviceGeneration == 'flusher') {
      await this.mapFaucetDeviceDetailsFlusher();
    } else if (BLEService.deviceGeneration == 'basys') {
      await this.mapFaucetDeviceDetailsBasys();
    }
  }

  async mapFaucetDeviceDetailsGen1() {
    const deviceInfoNormal = await getDeviceInfoNormal();
    // console.log('deviceInfoNormal==>', deviceInfoNormal);

    // Sensor Serial Number
    const resultObj1 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c901',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj1==>', resultObj1);

    // Sensor Manufacturing Date
    const resultObj2 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c903',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj2==>', resultObj2);

    // Sensor Hardware Version
    const resultObj3 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c905',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj3==>', resultObj3);

    // Sensor Firmware Version
    const resultObj4 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c906',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj4==>', resultObj4);

    // Control box....
    // Control Box Model
    const resultObj5 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c90A',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj5==>', resultObj5);

    // Control Box Serial Number
    const resultObj6 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c902',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj6==>', resultObj6);

    // Control Box Manufacturing Date
    const resultObj7 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c904',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj7==>', resultObj7);

    // Control Box Hardware Version
    const resultObj8 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c907',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj8==>', resultObj8);

    // Control Box Firmware Version
    const resultObj9 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c908',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj9==>', resultObj9);

    const deviceStaticData = BLEService.connectedDeviceStaticData;
    let __FAUCET_DEVICE_DETAILS = {
      faucet_sensor_details: {
        faucet_model: deviceStaticData?.fullNameAllModel,
        sensor_serial_number: resultObj1?.value ?? null,
        sensor_manufacturing_date: resultObj2?.value ?? null,
        sensor_hardware_ver: resultObj3?.value ?? null,
        sensor_firmware_ver: resultObj4?.value ?? null,
      },
      control_box_details: {
        control_box_model: resultObj5?.value ?? null,
        control_box_serial_number: resultObj6?.value ?? null,
        control_box_manuf_date: resultObj7?.value ?? null,
        control_box_hardware_ver: resultObj8?.value ?? null,
        control_box_firmware_ver: resultObj9?.value ?? null,
      },
    };

    this.reportMappingStats.faucet_device_details = __FAUCET_DEVICE_DETAILS;

    consoleLog(
      'this.reportMappingStats.faucet_device_details==>',
      this.reportMappingStats.faucet_device_details,
    );
  }

  async mapFaucetDeviceDetailsGen2() {
    const __mappingDeviceDataStringGen2 =
      BLEService.characteristicMonitorDeviceDataStringMapped;
    // consoleLog(
    //   'mapFaucetDeviceDetailsGen2 __mappingDeviceDataStringGen2==>',
    //   JSON.stringify(__mappingDeviceDataStringGen2),
    // );
    const __mappingDeviceDataCollectionGen2 =
      BLEService.characteristicMonitorDataCollectionMapped;
    const controlBoxModel =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[1];

    const deviceStaticData = BLEService.connectedDeviceStaticData;
    // formatCharateristicValue(element2?.value, element2?.value?.currentValue);

    let __FAUCET_DEVICE_DETAILS = {
      faucet_sensor_details: {
        faucet_model: deviceStaticData?.fullNameAllModel,
        sensor_serial_number: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[0]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[0]?.value
            ?.currentValue ?? null,
        ),
        sensor_manufacturing_date: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[2]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[2]?.value
            ?.currentValue ?? null,
        ),
        sensor_hardware_ver: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[4]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[4]?.value
            ?.currentValue ?? null,
        ),
        sensor_firmware_ver: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[5]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[5]?.value
            ?.currentValue ?? null,
        ),
      },
      control_box_details: {
        control_box_model:
          BLE_CONSTANTS?.COMMON?.BDSKU_LIST?.[
            controlBoxModel?.value?.currentValue
          ] ?? controlBoxModel?.value?.currentValue,
        control_box_serial_number: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[1]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[1]?.value
            ?.currentValue ?? null,
        ),
        control_box_manuf_date: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[3]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[3]?.value
            ?.currentValue ?? null,
        ),
        control_box_hardware_ver: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[6]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[6]?.value
            ?.currentValue ?? null,
        ),
        control_box_firmware_ver: formatCharateristicValue(
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[7]?.value ??
            null,
          __mappingDeviceDataStringGen2?.chunks?.[0]?.uuidData?.[7]?.value
            ?.currentValue ?? null,
        ),
      },
    };

    this.reportMappingStats.faucet_device_details = __FAUCET_DEVICE_DETAILS;
    // consoleLog(
    //   'mapFaucetDeviceDetailsGen2 this.reportMappingStats.faucet_device_details==>',
    //   this.reportMappingStats.faucet_device_details,
    // );
  }

  async mapFaucetDeviceDetailsFlusher() {
    const deviceInfoNormal = await getDeviceInfoNormalFlusher();
    // console.log('deviceInfoNormal==>', deviceInfoNormal);

    // Sensor Serial Number
    const resultObj1 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88301',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj1==>', resultObj1);

    // Sensor Manufacturing Date
    const resultObj2 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88303',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj2==>', resultObj2);

    // Sensor Hardware Version
    const resultObj3 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88305',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj3==>', resultObj3);

    // Sensor Firmware Version
    const resultObj4 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88306',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj4==>', resultObj4);

    // Control box....
    // Control Box Model
    const resultObj5 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d8830A',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj5==>', resultObj5);

    // Control Box Serial Number
    const resultObj6 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88302',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj6==>', resultObj6);

    // Control Box Manufacturing Date
    const resultObj7 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88304',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj7==>', resultObj7);

    // Control Box Hardware Version
    const resultObj8 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88307',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj8==>', resultObj8);

    // Control Box Firmware Version
    const resultObj9 = findObject(
      'f89f13e7-83f8-4b7c-9e8b-364576d88308',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj9==>', resultObj9);

    const deviceStaticData = BLEService.connectedDeviceStaticData;
    let __FAUCET_DEVICE_DETAILS = {
      faucet_sensor_details: {
        faucet_model: deviceStaticData?.fullNameAllModel,
        sensor_serial_number: resultObj1?.value ?? null,
        sensor_manufacturing_date: resultObj2?.value ?? null,
        sensor_hardware_ver: resultObj3?.value ?? null,
        sensor_firmware_ver: resultObj4?.value ?? null,
      },
      control_box_details: {
        control_box_model: resultObj5?.value ?? null,
        control_box_serial_number: resultObj6?.value ?? null,
        control_box_manuf_date: resultObj7?.value ?? null,
        control_box_hardware_ver: resultObj8?.value ?? null,
        control_box_firmware_ver: resultObj9?.value ?? null,
      },
    };

    this.reportMappingStats.faucet_device_details = __FAUCET_DEVICE_DETAILS;

    consoleLog(
      'this.reportMappingStats.faucet_device_details==>',
      this.reportMappingStats.faucet_device_details,
    );
  }

  async mapFaucetDeviceDetailsBasys() {
    const deviceInfoNormal = await getDeviceInfoNormalBasys();
    // console.log('deviceInfoNormal==>', deviceInfoNormal);

    // Sensor Serial Number
    const resultObj1 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c901',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj1==>', resultObj1);

    // Sensor Manufacturing Date
    const resultObj2 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c903',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj2==>', resultObj2);

    // Sensor Hardware Version
    const resultObj3 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c905',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj3==>', resultObj3);

    // Sensor Firmware Version
    const resultObj4 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c906',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj4==>', resultObj4);

    // Control box....
    // Control Box Model
    const resultObj5 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c90A',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj5==>', resultObj5);

    // Control Box Serial Number
    const resultObj6 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c902',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj6==>', resultObj6);

    // Control Box Manufacturing Date
    const resultObj7 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c904',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj7==>', resultObj7);

    // Control Box Hardware Version
    const resultObj8 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c907',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj8==>', resultObj8);

    // Control Box Firmware Version
    const resultObj9 = findObject(
      'd0aba888-fb10-4dc9-9b17-bdd8f490c908',
      deviceInfoNormal,
      {
        searchKey: 'uuid',
      },
    );
    // consoleLog('mapFaucetDeviceDetailsGen1 resultObj9==>', resultObj9);

    const deviceStaticData = BLEService.connectedDeviceStaticData;
    let __FAUCET_DEVICE_DETAILS = {
      faucet_sensor_details: {
        faucet_model: deviceStaticData?.fullNameAllModel,
        sensor_serial_number: resultObj1?.value ?? null,
        sensor_manufacturing_date: resultObj2?.value ?? null,
        sensor_hardware_ver: resultObj3?.value ?? null,
        sensor_firmware_ver: resultObj4?.value ?? null,
      },
      control_box_details: {
        control_box_model: resultObj5?.value ?? null,
        control_box_serial_number: resultObj6?.value ?? null,
        control_box_manuf_date: resultObj7?.value ?? null,
        control_box_hardware_ver: resultObj8?.value ?? null,
        control_box_firmware_ver: resultObj9?.value ?? null,
      },
    };

    this.reportMappingStats.faucet_device_details = __FAUCET_DEVICE_DETAILS;

    consoleLog(
      'this.reportMappingStats.faucet_device_details==>',
      this.reportMappingStats.faucet_device_details,
    );
  }

  mapFaucetSettings(
    settingName: string,
    response: any,
    hasSettingsChanged: boolean = false,
  ) {
    if (!settingName || isObjectEmpty(response)) {
      return false;
    }

    let __FAUCET_SETTINGS_ALL = this.reportMappingStats.faucet_settings;

    let __FAUCET_SETTINGS_PREV = __FAUCET_SETTINGS_ALL?.prev;
    let __FAUCET_SETTINGS_CURRENT = __FAUCET_SETTINGS_ALL?.current;

    let __FAUCET_SETTINGS = hasSettingsChanged
      ? __FAUCET_SETTINGS_ALL?.current
      : __FAUCET_SETTINGS_ALL?.prev;

    switch (settingName) {
      case 'ActivationMode':
        __FAUCET_SETTINGS.mode_selection =
          response?.modeSelection?.value ?? null;
        __FAUCET_SETTINGS.on_demand_time_out =
          response?.onDemand?.value ?? null;
        __FAUCET_SETTINGS.metered_run_time = response?.metered?.value ?? null;
        break;

      /** Using in flusher device */
      case 'ActivationTimeFlusher':
        __FAUCET_SETTINGS.activation_time =
          response?.activationTime?.value ?? null;
        break;

      case 'LineFlush':
        __FAUCET_SETTINGS.flush_enable = response?.flush?.value ?? null;
        __FAUCET_SETTINGS.flush_duration = response?.flushTime?.value ?? null;
        __FAUCET_SETTINGS.flush_interval =
          response?.flushInterval?.value ?? null;
        break;

      /** Using in flusher device */
      case 'LineFlushFlusher':
        __FAUCET_SETTINGS.flush_time = response?.flushTime?.value ?? null;
        __FAUCET_SETTINGS.flush_volume = response?.flushVolume?.value ?? null;
        break;

      case 'SensorRange':
        __FAUCET_SETTINGS.sensor_range = response?.sensorRange?.value ?? null;
        break;

      case 'FlowRate':
        __FAUCET_SETTINGS.flow_rate = response?.flowRate?.value ?? null;
        break;

      case 'Note':
        __FAUCET_SETTINGS.bd_note = cleanString2(
          cleanString(response?.note?.value ?? ''),
        );
        break;

      default:
        break;
    }

    if (hasSettingsChanged) {
      __FAUCET_SETTINGS_ALL.current = __FAUCET_SETTINGS;
      __FAUCET_SETTINGS_ALL.prev = __FAUCET_SETTINGS_CURRENT;
    } else {
      __FAUCET_SETTINGS_ALL.current = __FAUCET_SETTINGS;
      // __FAUCET_SETTINGS_ALL.prev = __FAUCET_SETTINGS;
    }
    this.reportMappingStats.faucet_settings = __FAUCET_SETTINGS_ALL;

    // consoleLog(
    //   'this.reportMappingStats.faucet_settings==>',
    //   this.reportMappingStats.faucet_settings,
    // );
  }

  async mapDiagnosticReport() {
    consoleLog('mapFaucetDeviceDetails called');
    if (BLEService.deviceGeneration == 'gen1') {
      await this.mapDiagnosticReportGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      await this.mapDiagnosticReportGen2();
    } else if (BLEService.deviceGeneration == 'flusher') {
      await this.mapDiagnosticReportFlusher();
    } else if (BLEService.deviceGeneration == 'basys') {
      await this.mapDiagnosticReportBasys();
    }
  }

  async mapDiagnosticReportGen1(hasSettingsChanged: boolean = false) {
    const RESULTS = await readingDiagnostic();
    consoleLog('initlizeAppGen1 readingDiagnostic RESULTS==>', RESULTS);

    let __DIAGNOSTIC_REPORT_ALL = this.reportMappingStats.diagnostic_report;

    let __DIAGNOSTIC_REPORT_PREV = __DIAGNOSTIC_REPORT_ALL?.prev;
    let __DIAGNOSTIC_REPORT_CURRENT = __DIAGNOSTIC_REPORT_ALL?.current;

    let __DIAGNOSTIC_REPORT = hasSettingsChanged
      ? __DIAGNOSTIC_REPORT_ALL?.current
      : __DIAGNOSTIC_REPORT_ALL?.prev;

    __DIAGNOSTIC_REPORT.sensor = findValueObject('Sensor', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.valve = findValueObject('Valve', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.turbine = findValueObject('Turbine', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    // __DIAGNOSTIC_REPORT.water_dispence = findValueObject(
    //   'Water Dispense',
    //   RESULTS,
    //   {
    //     searchKey: 'name',
    //     valueKey: 'value',
    //   },
    // );
    __DIAGNOSTIC_REPORT.battery = findValueObject(
      'Battery Level at Diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );
    __DIAGNOSTIC_REPORT.date_of_diagnostic = findValueObject(
      'D/T of last diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );

    if (hasSettingsChanged) {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT_CURRENT;
    } else {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      // __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT;
    }

    this.reportMappingStats.diagnostic_report = __DIAGNOSTIC_REPORT_ALL;
  }

  async mapDiagnosticReportGen2(hasSettingsChanged: boolean = false) {
    const RESULTS = await readingDiagnosticGen2(
      BLEService.characteristicMonitorDiagnosticMapped,
    );
    consoleLog(
      'mapDiagnosticReportGen2 readingDiagnosticGen2 RESULTS==>',
      RESULTS,
    );

    let __DIAGNOSTIC_REPORT_ALL = this.reportMappingStats.diagnostic_report;

    let __DIAGNOSTIC_REPORT_PREV = __DIAGNOSTIC_REPORT_ALL?.prev;
    let __DIAGNOSTIC_REPORT_CURRENT = __DIAGNOSTIC_REPORT_ALL?.current;

    let __DIAGNOSTIC_REPORT = hasSettingsChanged
      ? __DIAGNOSTIC_REPORT_ALL?.current
      : __DIAGNOSTIC_REPORT_ALL?.prev;

    __DIAGNOSTIC_REPORT.sensor = findValueObject('Sensor', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.valve = findValueObject('Valve', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.turbine = findValueObject('Turbine', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    // __DIAGNOSTIC_REPORT.water_dispence = findValueObject(
    //   'Water Dispense',
    //   RESULTS,
    //   {
    //     searchKey: 'name',
    //     valueKey: 'value',
    //   },
    // );
    __DIAGNOSTIC_REPORT.battery = findValueObject(
      'Battery Level at Diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );
    __DIAGNOSTIC_REPORT.date_of_diagnostic = findValueObject(
      'D/T of last diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );

    if (hasSettingsChanged) {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT_CURRENT;
    } else {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      // __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT;
    }

    this.reportMappingStats.diagnostic_report = __DIAGNOSTIC_REPORT_ALL;
  }

  async mapDiagnosticReportFlusher(hasSettingsChanged: boolean = false) {
    const RESULTS = await readingDiagnosticFlusher();
    consoleLog(
      'mapDiagnosticReportFlusher readingDiagnosticFlusher RESULTS==>',
      RESULTS,
    );

    let __DIAGNOSTIC_REPORT_ALL = this.reportMappingStats.diagnostic_report;

    let __DIAGNOSTIC_REPORT_PREV = __DIAGNOSTIC_REPORT_ALL?.prev;
    let __DIAGNOSTIC_REPORT_CURRENT = __DIAGNOSTIC_REPORT_ALL?.current;

    let __DIAGNOSTIC_REPORT = hasSettingsChanged
      ? __DIAGNOSTIC_REPORT_ALL?.current
      : __DIAGNOSTIC_REPORT_ALL?.prev;

    __DIAGNOSTIC_REPORT.sensor = findValueObject('Sensor', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.solenoid = findValueObject('Solenoid', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.battery = findValueObject(
      'Battery Level at Diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );
    __DIAGNOSTIC_REPORT.date_of_diagnostic = findValueObject(
      'D/T of last diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );

    if (hasSettingsChanged) {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT_CURRENT;
    } else {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      // __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT;
    }

    this.reportMappingStats.diagnostic_report = __DIAGNOSTIC_REPORT_ALL;
  }

  async mapDiagnosticReportBasys(hasSettingsChanged: boolean = false) {
    const RESULTS = await readingDiagnosticBasys();
    consoleLog(
      'mapDiagnosticReportBasys readingDiagnosticBasys RESULTS==>',
      RESULTS,
    );

    let __DIAGNOSTIC_REPORT_ALL = this.reportMappingStats.diagnostic_report;

    let __DIAGNOSTIC_REPORT_PREV = __DIAGNOSTIC_REPORT_ALL?.prev;
    let __DIAGNOSTIC_REPORT_CURRENT = __DIAGNOSTIC_REPORT_ALL?.current;

    let __DIAGNOSTIC_REPORT = hasSettingsChanged
      ? __DIAGNOSTIC_REPORT_ALL?.current
      : __DIAGNOSTIC_REPORT_ALL?.prev;

    __DIAGNOSTIC_REPORT.sensor = findValueObject('Sensor', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });

    __DIAGNOSTIC_REPORT.solenoid = findValueObject('Solenoid', RESULTS, {
      searchKey: 'name',
      valueKey: 'value',
    });
    
    __DIAGNOSTIC_REPORT.battery = findValueObject(
      'Battery Level at Diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );
    __DIAGNOSTIC_REPORT.date_of_diagnostic = findValueObject(
      'D/T of last diagnostic',
      RESULTS,
      {
        searchKey: 'name',
        valueKey: 'value',
      },
    );

    if (hasSettingsChanged) {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT_CURRENT;
    } else {
      __DIAGNOSTIC_REPORT_ALL.current = __DIAGNOSTIC_REPORT;
      // __DIAGNOSTIC_REPORT_ALL.prev = __DIAGNOSTIC_REPORT;
    }

    this.reportMappingStats.diagnostic_report = __DIAGNOSTIC_REPORT_ALL;
  }

  async mapAdvanceDeviceDetails() {
    consoleLog('mapFaucetDeviceDetails called');
    if (BLEService.deviceGeneration == 'gen1') {
      await this.mapAdvanceDeviceDetailsGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      await this.mapAdvanceDeviceDetailsGen2();
    } else if (BLEService.deviceGeneration == 'flusher') {
      await this.mapAdvanceDeviceDetailsFlusher();
    } else if (BLEService.deviceGeneration == 'basys') {
      await this.mapAdvanceDeviceDetailsBasys();
    }
  }

  async mapAdvanceDeviceDetailsGen1() {
    consoleLog('mapAdvanceDeviceDetails called');

    try {
      var deviceInfoAdvance = await getDeviceInfoAdvance();

      // consoleLog('deviceInfoAdvance==>', deviceInfoAdvance);

      let __ADVANCED_DEVICE_DETAILS = {
        battery_status: BLEService.batteryLevel,
        date_of_installation: findValueObject(
          'Date of Installation',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        hours_of_operation: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c911',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        activations_since_day_1: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c912',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_activation_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c914',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_water_usage: findValueObject(
          'Accumulated water usage',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        activations_since_last_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c913',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        line_flushes_since_day1: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c916',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_flush_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c915',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        number_of_ble_connections: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c91A',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_factory: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c921',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_mode_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c923',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_metered_run_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c924',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_ondemand_timeout_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c925',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_enable_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c926',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c927',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_interval_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c928',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flow_rate_change: '',
        date_of_last_range_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c922',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_bd_note_change: '',
      };

      this.reportMappingStats.advanced_device_details =
        __ADVANCED_DEVICE_DETAILS;

      consoleLog('this.reportMappingStats==>', this.reportMappingStats);
    } catch (error) {
      consoleLog('deviceInfoAdvance error==>', error);
    }
  }

  async mapAdvanceDeviceDetailsGen2() {
    const __mappingDeviceDataIntegersGen2 =
      BLEService.characteristicMonitorDeviceDataIntegersMapped;

    // consoleLog(
    //   '__mappingDeviceDataIntegersGen2Data __mappingDeviceDataIntegersGen2==>',
    //   JSON.stringify(__mappingDeviceDataIntegersGen2),
    // );

    const __mappingDeviceDataCollectionGen2 =
      BLEService.characteristicMonitorDataCollectionMapped;

    /**
     * Hours of Operation -> Operating hours since install
     */
    const operatingHoursSinceInstall =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[2];

    /**
     * ACTIVATION SINCE DAY 1 -> Activations since install
     */
    const activationsSinceInstall =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[3];

    const __operatingHoursSinceInstall = operatingHoursSinceInstall
      ? parseInt(operatingHoursSinceInstall?.value?.currentValue)
      : 0;

    const __operatingHoursSinceInstallInSecs =
      __operatingHoursSinceInstall * 60 * 60;
    const currentTimestamp = timestampInSec();
    const dateOfInstallTimestamp =
      currentTimestamp - __operatingHoursSinceInstallInSecs;

    /**
     * Accumulated activation time usage -> Duration of all activations
     */
    const durationOfAllActivations =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[5];

    /**
     * ACCUMULATED WATER USAGE -> Total water usage
     */
    const totalWaterUsage = BLEService.totalWaterUsase;
    const __totalWaterUsage = `${
      totalWaterUsage
        ? (totalWaterUsage / BLE_CONSTANTS.COMMON.GMP_FORMULA).toFixed(2)
        : 0
    } Gal`;

    /**
     * Activations since last change
     */
    const activationsSinceLastChange =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[4];

    /**
     * Line flushes since day 1 -> Number of Line flushes
     */
    const numberOfAllLineFlushes =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[7];

    /**
     * Accumulated flush time -> Duration of all line flushes
     */
    const durationOfAllLineFlushes =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[6];

    /**
     * Number of BLE connections
     */
    const numberOfBLEConnections =
      __mappingDeviceDataCollectionGen2?.chunks?.[0]?.uuidData?.[9];

    let __ADVANCED_DEVICE_DETAILS = {
      battery_status: BLEService.batteryLevel,
      date_of_installation: moment.unix(dateOfInstallTimestamp).format('MMM Y'),
      hours_of_operation: operatingHoursSinceInstall?.value?.currentValue,
      activations_since_day_1: formatCharateristicValue(
        activationsSinceInstall?.value,
        activationsSinceInstall?.value?.currentValue,
      ),
      accumulated_activation_time: `${durationOfAllActivations?.value?.currentValue} sec`,
      accumulated_water_usage: `${__totalWaterUsage} (${totalWaterUsage} L)`,
      activations_since_last_change:
        activationsSinceLastChange?.value?.currentValue,
      line_flushes_since_day1: `${numberOfAllLineFlushes?.value?.currentValue}`,
      accumulated_flush_time: `${durationOfAllLineFlushes?.value?.currentValue} sec`,
      number_of_ble_connections: `${numberOfBLEConnections?.value?.currentValue}`,
      date_of_last_factory:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[0]?.value
          ?.currentValue ?? null,
      date_of_last_mode_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[2]?.value
          ?.currentValue ?? null,
      date_of_last_metered_run_time_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[3]?.value
          ?.currentValue ?? null,
      date_of_last_ondemand_timeout_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[4]?.value
          ?.currentValue ?? null,
      date_of_last_flush_enable_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[5]?.value
          ?.currentValue ?? null,
      date_of_last_flush_time_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[8]?.value
          ?.currentValue ?? null,
      date_of_last_flush_interval_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[9]?.value
          ?.currentValue ?? null,
      date_of_last_flow_rate_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[14]?.value
          ?.currentValue ?? null,
      date_of_last_range_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[1]?.value
          ?.currentValue ?? null,
      date_of_last_bd_note_change:
        __mappingDeviceDataIntegersGen2?.chunks?.[0]?.uuidData?.[10]?.value
          ?.currentValue ?? null,
    };

    this.reportMappingStats.advanced_device_details = __ADVANCED_DEVICE_DETAILS;
    // consoleLog(
    //   'this.reportMappingStats?.advanced_device_details==>',
    //   this.reportMappingStats,
    // );
  }

  async mapAdvanceDeviceDetailsFlusher() {
    consoleLog('mapAdvanceDeviceDetails called');

    try {
      var deviceInfoAdvance = await getDeviceInfoAdvanceFlusher();

      // consoleLog('deviceInfoAdvance==>', deviceInfoAdvance);

      let __ADVANCED_DEVICE_DETAILS = {
        battery_status: BLEService.batteryLevel,
        date_of_installation: findValueObject(
          'Date of Installation',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        hours_of_operation: findValueObject(
          'f89f13e7-83f8-4b7c-9e8b-364576d88312',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        activations_since_day_1: findValueObject(
          'f89f13e7-83f8-4b7c-9e8b-364576d88314',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_activation_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c914',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_water_usage: findValueObject(
          'Accumulated water usage',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        activations_since_last_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c913',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        line_flushes_since_day1: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c916',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_flush_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c915',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        number_of_ble_connections: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c91A',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_factory: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c921',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_mode_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c923',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_metered_run_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c924',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_ondemand_timeout_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c925',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_enable_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c926',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c927',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_interval_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c928',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flow_rate_change: '',
        date_of_last_range_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c922',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_bd_note_change: '',
      };

      this.reportMappingStats.advanced_device_details =
        __ADVANCED_DEVICE_DETAILS;

      consoleLog('this.reportMappingStats==>', this.reportMappingStats);
    } catch (error) {
      consoleLog('deviceInfoAdvance error==>', error);
    }
  }

  async mapAdvanceDeviceDetailsBasys() {
    consoleLog('mapAdvanceDeviceDetails called');
    try {
      var deviceInfoAdvance = await getDeviceInfoAdvanceBasys();
      // consoleLog('deviceInfoAdvance==>', deviceInfoAdvance);

      let __ADVANCED_DEVICE_DETAILS = {
        battery_status: BLEService.batteryLevel,
        date_of_installation: findValueObject(
          'Date of Installation',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        hours_of_operation: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c911',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        activations_since_day_1: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c912',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_activation_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c914',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_water_usage: findValueObject(
          'Accumulated water usage',
          deviceInfoAdvance,
          {
            searchKey: 'name',
            valueKey: 'value',
          },
        ),
        activations_since_last_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c913',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        line_flushes_since_day1: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c916',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        accumulated_flush_time: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c915',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        number_of_ble_connections: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c91A',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_factory: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c921',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_mode_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c923',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_metered_run_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c924',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_ondemand_timeout_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c925',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_enable_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c926',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_time_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c927',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flush_interval_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c928',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_flow_rate_change: '',
        date_of_last_range_change: findValueObject(
          'd0aba888-fb10-4dc9-9b17-bdd8f490c922',
          deviceInfoAdvance,
          {
            searchKey: 'uuid',
            valueKey: 'value',
          },
        ),
        date_of_last_bd_note_change: '',
      };

      this.reportMappingStats.advanced_device_details =
        __ADVANCED_DEVICE_DETAILS;

      consoleLog('this.reportMappingStats==>', this.reportMappingStats);
    } catch (error) {
      consoleLog('deviceInfoAdvance error==>', error);
    }
  }

  async prepareReport(
    user: any,
    shouldMapDiagnostic: boolean = false,
    isReportManual: string = 'yes',
  ) {
    const currentTimestamp = timestampInSec();
    this.reportMappingStats.is_report_manual = isReportManual;
    this.reportMappingStats.device_generation = BLEService.deviceGeneration;

    this.reportMappingStats.report_created_at = moment
      .unix(currentTimestamp)
      .format('YYYY-MM-DD HH:mm');
    this.mapUserInfo(user);
    this.mapDeviceInfo();
    this.mapUserPreference();
    await this.mapFaucetDeviceDetails();
    // this.mapFaucetSettings(); this is called from dashboard for gen1 and gen2 both for filling values
    shouldMapDiagnostic && (await this.mapDiagnosticReport());
    await this.mapAdvanceDeviceDetails();
    return this.reportMappingStats;
  }
}

export const BLEReport = new BLEReportInstance();
