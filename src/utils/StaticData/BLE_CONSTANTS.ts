const COMMON = {};
const GEN1 = {
  WATER_DISPENCE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c960',
  WATER_DISPENCE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c965',

  BATTERY_LEVEL_SERVICE_UUID: '0000180f-0000-1000-8000-00805f9b34fb',
  BATTERY_LEVEL_CHARACTERISTIC_UUID: '00002a19-0000-1000-8000-00805f9b34fb',

  ACTIVATION_DURATION_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c910',
  ACTIVATION_DURATION_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c914',

  // Mode Selection
  MODE_SELECTION_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  MODE_SELECTION_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c943',

  MODE_SELECTION_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  MODE_SELECTION_DATE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c923',

  MODE_SELECTION_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  MODE_SELECTION_PHONE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c92B',

  METERED_RUNTIME_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  METERED_RUNTIME_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c944',

  METERED_RUNTIME_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  METERED_RUNTIME_DATE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c924',

  METERED_RUNTIME_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  METERED_RUNTIME_PHONE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c92C',

  ON_DEMAND_RUNTIME_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  ON_DEMAND_RUNTIME_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c945',

  ON_DEMAND_RUNTIME_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  ON_DEMAND_RUNTIME_DATE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c92D',

  ON_DEMAND_RUNTIME_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  ON_DEMAND_RUNTIME_PHONE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c92B',

  // Flush
  FLUSH_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  FLUSH_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c946',

  FLUSH_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_DATE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c926',

  FLUSH_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_PHONE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c92E',

  FLUSH_TIME_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  FLUSH_TIME_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c947',

  FLUSH_TIME_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_TIME_DATE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c927',

  FLUSH_TIME_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_TIME_PHONE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c92F',

  FLUSH_INTERVAL_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  FLUSH_INTERVAL_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c948',

  FLUSH_INTERVAL_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_INTERVAL_DATE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c928',

  FLUSH_INTERVAL_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLUSH_INTERVAL_PHONE_CHARACTERISTIC_UUID:
    'd0aba888-fb10-4dc9-9b17-bdd8f490c930',

  // Flow Rate
  FLOW_RATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  FLOW_RATE_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c949',

  FLOW_RATE_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLOW_RATE_DATE_CHARACTERISTIC_UUID: '',

  FLOW_RATE_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  FLOW_RATE_PHONE_CHARACTERISTIC_UUID: '',

  // Sensor
  SENSOR_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c940',
  SENSOR_CHARACTERISTIC_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c942',

  SENSOR_DATE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  SENSOR_DATE_CHARACTERISTIC_UUID: '',

  SENSOR_PHONE_SERVICE_UUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
  SENSOR_PHONE_CHARACTERISTIC_UUID: '',
};

const GEN2 = {
  SERVER_KEY: [
    0x37, 0x80, 0x80, 0xaf, 0x90, 0x30, 0x4a, 0x15, 0x5a, 0xe2, 0xd7, 0x3e,
    0x7d, 0xdb, 0x88, 0x7b, 0x55, 0x1d, 0x60, 0x64, 0x74, 0xff, 0x09, 0x22,
    0x95, 0xc3, 0x40, 0x80, 0xec, 0xb1, 0x64, 0x6c,
  ],
  SITE_ID_SERVICE_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C0',
  SITE_ID_CHARACTERISTIC_UUID: '438AF044-AF98-45F1-8B9F-5382B17559CA',
  MASTER_KEY_SERVICE_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C0',
  MASTER_KEY_CHARACTERISTIC_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C2',
  SESSION_KEY_SERVICE_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C0',
  SESSION_KEY_CHARACTERISTIC_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C5',
  AUTHORIZATION_KEY_SERVICE_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C0',
  AUTHORIZATION_KEY_CHARACTERISTIC_UUID: '438AF044-AF98-45F1-8B9F-5382B17559C6',

  DEVICE_DATA_INTEGER_SERVICE_UUID: '8de47721-5496-4233-ae45-e4b306fe1180',
  DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID:
    '8de47721-5496-4233-ae45-e4b306fe1181',
};

const GEN3 = {};

const GEN4 = {};

/**constants used in app for BLE */
const BLE_CONSTANTS = {
  COMMON: COMMON,
  GEN1: GEN1,
  GEN2: GEN2,
  GEN3: GEN3,
  GEN4: GEN4,
};

export default BLE_CONSTANTS;
