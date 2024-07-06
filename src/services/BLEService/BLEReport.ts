import {isObjectEmpty, findObject} from 'src/utils/Helpers/array';
import DeviceInfo from 'react-native-device-info';
import {constants} from 'src/common';
import {
  consoleLog,
  getTimezone,
  getTimezoneAbbreviation,
} from 'src/utils/Helpers/HelperFunction';
import {BLEService} from 'src/services';
import {getDeviceInfoNormal} from 'src/screens/DeviceInfo/helperGen1';

//
const __reportMappingStats = {
  report_created_at: '',
  user_info: {
    user_email: '',
    first_name: '',
    last_name: '',
    user_id: '',
    user_phone: '',
    user_title: '',
  },
  mobile_device_info: {
    os: 'ios/android',
    model: 'SAM SG990',
    bluetooth_ver: '',
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
    },
    next: {
      mode_selection: '',
      on_demand_time_out: '',
      metered_run_time: '',
      flush_enable: '',
      flush_duration: '',
      flush_interval: '',
      flow_rate: '',
      sensor_range: '',
      bd_note: '',
    },
  },
  diagnostic_report: {
    prev: {
      sensor: '',
      valve: '',
      turbine: '',
      battery: '',
      date_of_diagnostic: '2024-01-01 22:22:00',
    },
    current: {
      sensor: '',
      valve: '',
      turbine: '',
      battery: '',
      date_of_diagnostic: '2024-01-01 22:22:00',
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
      user_email: '',
      first_name: '',
      last_name: '',
      user_id: '',
      user_phone: '',
      user_title: '',
    };

    __USER_INFO.user_email = user?.email ?? 'N/A';
    __USER_INFO.first_name = user?.first_name ?? 'N/A';
    __USER_INFO.last_name = user?.last_name ?? 'N/A';
    __USER_INFO.user_id = user?.id;
    __USER_INFO.user_phone = user?.user_metadata?.phone_number ?? 'N/A';
    __USER_INFO.user_title = user?.user_metadata?.title ?? 'N/A';
    this.reportMappingStats.user_info = __USER_INFO;
  }

  mapDeviceInfo() {
    let __MOBILE_DEVICE_INFO = {
      os: DeviceInfo.getBaseOsSync(),
      model: DeviceInfo.getModel(),
      bluetooth_ver: '',
      // app_version: DeviceInfo.getVersion(),
      app_version: constants.APP_VERSION,
      app_release_date: constants.RELEASE_DATE,
      app_install_date: DeviceInfo.getFirstInstallTimeSync(),
      phone_battery: DeviceInfo.getBatteryLevelSync(),
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
    if (BLEService.deviceGeneration == 'gen1') {
      await this.mapFaucetDeviceDetailsGen1();
    } else {
      // await this.mapFaucetDeviceDetailsGen2();
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
    const deviceInfoNormal = await getDeviceInfoNormal();
    console.log('deviceInfoNormal==>', deviceInfoNormal);

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
    let __FAUCET_SETTINGS = hasSettingsChanged
      ? __FAUCET_SETTINGS_ALL?.next
      : __FAUCET_SETTINGS_ALL?.prev;

    switch (settingName) {
      case 'ActivationMode':
        __FAUCET_SETTINGS.mode_selection =
          response?.modeSelection?.value ?? null;
        __FAUCET_SETTINGS.on_demand_time_out =
          response?.onDemand?.value ?? null;
        __FAUCET_SETTINGS.metered_run_time = response?.metered?.value ?? null;
        break;

      case 'LineFlush':
        __FAUCET_SETTINGS.flush_enable = response?.flush?.value ?? null;
        __FAUCET_SETTINGS.flush_duration = response?.flushTime?.value ?? null;
        __FAUCET_SETTINGS.flush_interval =
          response?.flushInterval?.value ?? null;
        break;

      case 'SensorRange':
        __FAUCET_SETTINGS.sensor_range = response?.sensorRange?.value ?? null;
        break;

      case 'FlowRate':
        __FAUCET_SETTINGS.flow_rate = response?.flowRate?.value ?? null;
        break;

      case 'Note':
        __FAUCET_SETTINGS.bd_note = response?.note?.value ?? null;
        break;

      default:
        break;
    }

    if (type == 'prev') {
      __FAUCET_SETTINGS_ALL.prev = __FAUCET_SETTINGS;
    } else {
      __FAUCET_SETTINGS_ALL.next = __FAUCET_SETTINGS;
    }
    this.reportMappingStats.faucet_settings = __FAUCET_SETTINGS_ALL;

    // consoleLog(
    //   'this.reportMappingStats.faucet_settings==>',
    //   this.reportMappingStats.faucet_settings,
    // );
  }

  mapDiagnosticReport() {
    let __DIAGNOSTIC_REPORT = {
      prev: {
        sensor: '',
        valve: '',
        turbine: '',
        battery: '',
        date_of_diagnostic: '2024-01-01 22:22:00',
      },
      current: {
        sensor: '',
        valve: '',
        turbine: '',
        battery: '',
        date_of_diagnostic: '2024-01-01 22:22:00',
      },
    };

    this.reportMappingStats.diagnostic_report = __DIAGNOSTIC_REPORT;
  }

  mapAdvanceDeviceDetails() {
    let __ADVANCED_DEVICE_DETAILS = {
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
    };

    this.reportMappingStats.advanced_device_details = __ADVANCED_DEVICE_DETAILS;
  }
}

export const BLEReport = new BLEReportInstance();
