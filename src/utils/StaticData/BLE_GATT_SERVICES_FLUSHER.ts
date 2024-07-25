export const BLE_GATT_SERVICES = {
  '00001800-0000-1000-8000-00805f9b34fb': {
    isPrimary: true,
    name: '',
    deviceID: '00:0B:57:6E:87:31',
    uuid: '00001800-0000-1000-8000-00805f9b34fb',
    id: 1,
    characteristics: [],
  },
  '00001801-0000-1000-8000-00805f9b34fb': {
    isPrimary: true,
    name: '',
    deviceID: '00:0B:57:6E:87:31',
    uuid: '00001801-0000-1000-8000-00805f9b34fb',
    id: 4,
    characteristics: [],
  },
  '0000180a-0000-1000-8000-00805f9b34fb': {
    isPrimary: true,
    name: 'Device Information',
    deviceID: '00:0B:57:6E:87:31',
    uuid: '0000180a-0000-1000-8000-00805f9b34fb',
    id: 7,
    characteristics: {
      '2a29': {
        uuid: '2a29',
        name: 'Manufacturer Name',
        size: '5 bytes',
        type: 'string',
        range: null,
        initialValue: null,
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      '2a24': {
        uuid: '2a24',
        name: 'Model Number',
        size: '10 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        properties: ['R'],
        sloanApp: 'Model Number',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88300': {
    isPrimary: true,
    name: 'Flusher Information',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88300',
    id: 10,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88301': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88301',
        name: 'Sensor Hardware Version',
        nameOG: 'Flusher Serial Number',
        // nameOG: 'AD Hardware Version',
        nameLocaleKey: 'SENSOR_HARDWARE_VER_LABEL',
        size: '4 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        properties: ['R'],
        sloanApp: 'BD Hardware Version',
        remarks: 'Revision Format: AAbb',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 4,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88302': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88302',
        name: 'Sensor Firmware Version',
        nameOG: 'BLE Device Serial Number',
        // nameOG: 'AD Firmware Version',
        nameLocaleKey: 'SENSOR_FIRMWARE_VER_LABEL',
        size: '5 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        properties: ['R'],
        sloanApp: 'BD Firmware Version',
        remarks: 'Revision Format: AAbb',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 5,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88303': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88303',
        name: 'Control Box Serial Number',
        // nameOG: 'BD Serial Number',
        nameOG: 'Flusher Manufacturing Date',
        nameLocaleKey: 'CONTROL_BOX_SERIAL_NUMBER_LABEL',
        size: '10 bytes',
        type: 'string',
        range: null,
        initialValue: 'ANNSSSSSSS',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 7,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88304': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88304',
        name: 'Control Box Hardware Version',
        nameOG: 'BLE Device Manufacturing Date',
        // nameOG: 'BD Hardware Version',
        nameLocaleKey: 'CONTROL_BOX_HARDWARE_VER_LABEL',
        size: '4 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        properties: ['R'],
        sloanApp: 'AD Hardware Version',
        remarks: 'Revision Format: AAbb',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 9,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88305': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88305',
        name: 'Control Box Firmware Version',
        // nameOG: 'BD Firmware Version',
        nameOG: 'Flusher Hardware Version',
        nameLocaleKey: 'CONTROL_BOX_FIRMWARE_VER_LABEL',
        size: '5 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        properties: ['R'],
        sloanApp: 'AD Firmware Version',
        remarks: 'Revision Format: AAbb',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 10,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88306': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88306',
        name: 'Control Box Manufacturing Date',
        // nameOG: 'BD Manufacturing Date',
        nameOG: 'Flusher Firmware Version',
        nameLocaleKey: 'CONTROL_BOX_MANUF_DATE_LABEL',
        size: '6 bytes',
        type: 'string',
        range: null,
        initialValue: 'YYMMDD',
        valueFormat: 'YYMMDD',
        properties: ['R'],
        sloanApp: '',
        remarks: '6 chars for YYMMDD',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 8,
        valueType: 'Date',
        dateFormat: 'YY/MM/DD',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88307': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88307',
        name: 'Sensor Manufacturing Date',
        // nameOG: 'AD Manufacturing Date',
        nameOG: 'BLE Device Hardware Version',
        nameLocaleKey: 'SENSOR_MANUF_DATE_LABEL',
        size: '6 bytes',
        type: 'string',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDD',
        properties: ['R'],
        sloanApp: '',
        remarks: '6 chars for YYMMDD',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 3,
        valueType: 'Date',
        dateFormat: 'YY/MM/DD',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88308': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88308',
        name: 'Sensor Serial Number',
        // nameOG: 'AD Serial Number',
        nameOG: 'BLE Device Firmware Version ',
        nameLocaleKey: 'SENSOR_SERIAL_NUMBER_LABEL',
        size: '10 bytes',
        type: 'string',
        range: null,
        initialValue: null,
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 2,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88309': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88309',
        name: 'Sensor SKU',
        // nameOG: 'AD SKU',
        nameOG: 'Flusher SKU',
        size: '2 bytes',
        type: 'string',
        range: '1-15',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d8830A': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d8830A',
        name: 'Control Box Model',
        // nameOG: 'BD SKU',
        nameOG: 'BLE Device SKU',
        nameLocaleKey: 'CONTROL_BOX_MODEL_LABEL',
        size: '1 bytes',
        type: 'string',
        range: '1-15',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks:
          '1: Non-turbine; 2: turbine without nozzle; 3:turbine with nozzle',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 6,
      },
    },
  },
  '0000180f-0000-1000-8000-00805f9b34fb': {
    isPrimary: true,
    name: 'Battery',
    deviceID: '00:0B:57:6E:87:31',
    uuid: '0000180f-0000-1000-8000-00805f9b34fb',
    id: 31,
    characteristics: {
      '00002a19-0000-1000-8000-00805f9b34fb': {
        uuid: '00002a19-0000-1000-8000-00805f9b34fb',
        name: 'Battery Level',
        size: '1 bytes',
        type: 'uint8_t',
        range: '0-100',
        initialValue: '0',
        properties: ['R'],
        sloanApp: 'Battery Status',
        remarks: '101 means 0%',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88310': {
    isPrimary: true,
    name: 'Statistics Information',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88310',
    id: 34,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88311': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88311',
        name: 'Hours of Operation',
        // nameOG: 'Operating hours since install',
        nameOG: 'Activations since low battery',
        nameLocaleKey: 'HOURS_OF_OPERATION_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: 'in hours',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 2,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88312': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88312',
        name: 'Activations since day 1',
        // nameOG: 'Activations since install',
        nameOG: 'Operating Hours since install',
        nameLocaleKey: 'ACTIVATION_SINCE_DAY_1_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 3,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88313': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88313',
        name: 'Accumulated activation time',
        // nameOG: 'Duration of all activations',
        nameOG: 'Line (Sentinel) Flush Count',
        nameLocaleKey: 'ACCUMULATED_ACTIVATION_TIME_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: 'in seconds',
        generation: 'all',
        prefix: null,
        postfix: ' sec',
        position: 4,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88314 ': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88314',
        name: 'Activations since last change',
        // nameOG: 'Activations since last change',
        nameOG: 'Activations since install ',
        nameLocaleKey: 'ACTIVATIONS_SINCE_LAST_CHANGE_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 6,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88315': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88315',
        name: 'Line flushes since day 1',
        // nameOG: 'Number of flushes',
        nameOG: 'Reduced Flush activations since install',
        nameLocaleKey: 'LINE_FLUSHES_SINCE_DAY_1_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 7,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88316': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88316',
        name: 'Accumulated flush time',
        // nameOG: 'Duration of all flushes',
        nameOG: 'Activations before last FV Change',
        nameLocaleKey: 'ACCUMULATED_FLUSH_TIME_LABEL',
        size: '8 bytes',
        type: 'Hexa String',
        range: '32 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: 'in seconds',
        generation: 'all',
        prefix: null,
        postfix: 'sec',
        position: 8,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88317': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88317',
        name: 'Number of total BLE activations',
        // nameOG: 'Number of total BLE activations',
        nameOG: 'Water Usage before last FV Change',
        size: '4 bytes',
        type: 'Hexa String',
        range: '16 bit value',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88320': {
    isPrimary: true,
    name: 'Changed Setting Log',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88320',
    id: 55,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88321': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88321',
        name: 'Date of last factory reset',
        // nameOG: 'Date of last factory reset',
        nameOG: 'D/T of last factory reset',
        nameLocaleKey: 'DATE_OF_LAST_FACTORY_RESET_LABEL',
        size: '10 bytes',
        type: 'Hexa String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks:
          'Operating hours (HEXA STRING) since last factory reset. Ignore this if "Phone of Factory Reset" is NOT "MANUAL" (never been factory reset)',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 10,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88322': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88322',
        name: 'Date of last mode change',
        // nameOG: 'Date of last mode change',
        nameOG: 'D/T of last range change',
        nameLocaleKey: 'DATE_OF_LAST_MODE_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 11,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88323': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88323',
        name: 'Date of last metered run time change',
        // nameOG: 'Date of last meter run time change',
        nameOG: 'D/T of last Line (Sentinel) Flush change',
        nameLocaleKey: 'DATE_OF_LAST_METERED_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 12,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88324 ': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88324 ',
        name: 'Date of last On-Demand timeout change',
        // nameOG: 'Date of last OD timeout change',
        nameOG: 'D/T of last Flush Volume change',
        nameLocaleKey: 'DATE_OF_LAST_ONDEMAND_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 13,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88325': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88325',
        name: 'Date of last flush enable change',
        // nameOG: 'Date of last flush mode change',
        nameOG: 'D/T of last Dianogstic',
        nameLocaleKey: 'DATE_OF_LAST_FLUSH_ENABLE_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 14,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88326': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88326',
        name: 'Date of last flush time change',
        // nameOG: 'Date of last flush duration change',
        nameOG: 'D/T of last firmware update',
        nameLocaleKey: 'DATE_OF_LAST_FLUSH_TIME_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 15,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88327': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88327',
        name: 'Date of last range change',
        // nameOG: 'Date of last range change',
        nameOG: 'D/T of last Activation time change',
        nameLocaleKey: 'DATE_OF_LAST_FLOW_RATE_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks:
          '10 chars for YYMMDDHHMM. If "Phone of Factory Reset" is "MANUAL", this will be operating hours (in HEXA STRING) since last range change',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 17,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88328': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88328',
        name: 'Date of last factory reset',
        // nameOG: 'Date of last factory reset',
        nameOG: 'D/T of Flusher Note change',
        nameLocaleKey: 'DATE_OF_LAST_FACTORY_RESET_LABEL',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: 'will display "MANUAL"',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'd0aba888-fb10-4dc9-9b17-bdd8f490c92D': {
        uuid: 'd0aba888-fb10-4dc9-9b17-bdd8f490c92D',
        name: 'Phone of last OD timeout change',
        // nameOG: 'Phone of last OD timeout change',
        nameOG: 'Phone of last factory reset ',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88332': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88332',
        name: 'Phone of last flush mode change',
        // nameOG: 'Phone of last flush mode change',
        nameOG: 'Phone of last range change',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88333': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88333',
        name: 'Phone of last flush duration change',
        // nameOG: 'Phone of last flush duration change',
        nameOG: 'Phone of last Line (Sentinel) Flush change',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88334': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88334',
        name: 'Date of last flush interval change',
        // nameOG: 'Date of last flush interval change',
        nameOG: 'Phone of last Flush Volume change ',
        nameLocaleKey: 'DATE_OF_LAST_FLUSH_INTERVAL_CHANGE_LABEL',
        size: '10 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        valueFormat: 'YYMMDDHHmm',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '10 chars for YYMMDDHHMM',
        generation: 'all',
        prefix: null,
        postfix: null,
        position: 16,
        valueType: 'DateTime',
        dateFormat: 'YY/MM/DD HH:mm',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88335': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88335',
        name: 'Phone of last flush interval change',
        // nameOG: 'Phone of last flush interval change',
        nameOG: 'Phone of last Dianogstic ',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88336': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88336',
        name: 'Phone of last range change',
        // nameOG: 'Phone of last range change',
        nameOG: 'Phone of last firmware update',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks:
          '15 chars for phone number. If manually set by button, this will display "MANUAL"',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88337': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88337',
        name: 'Phone of last note change',
        // nameOG: 'Phone of last note change',
        nameOG: 'Phone of last Activation time change',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88338': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88338',
        name: 'Phone of last note change',
        // nameOG: 'Phone of last note change',
        nameOG: 'Phone of Flusher Note change ',
        size: '15 bytes',
        type: 'String',
        range: null,
        initialValue: 'N/A',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '15 chars for phone number',
        generation: 'all',
        prefix: null,
        postfix: null,
        displayInList: false,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88340': {
    isPrimary: true,
    name: 'Flusher Settings Config',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88340',
    id: 88,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88341': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88341',
        name: 'Factory reset',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88342': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88342',
        name: 'Sensor Range',
        size: '1 bytes',
        type: 'String',
        range: '1-5',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
        dateSettingMappped: {
          serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
          characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c922',
        },
        phoneSettingMappped: {
          serviceUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c920',
          characteristicUUID: 'd0aba888-fb10-4dc9-9b17-bdd8f490c92A',
        },
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88343': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88343',
        name: 'Activation Time',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: 'On-demand / meter',
        remarks: '0: On-demand / 1: Meter',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88344': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88344',
        name: 'Line (Sentinel) Flush Time',
        size: '3 bytes',
        type: 'String',
        range: '0-7',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: 'seconds',
        generation: 'all',
        prefix: null,
        postfix: ' Sec',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88345': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88345',
        name: 'Flush Volume',
        size: '4 bytes',
        type: 'String',
        range: null,
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: 'seconds',
        generation: 'all',
        prefix: null,
        postfix: ' Sec',
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88346': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88346',
        name: 'Flusher Note',
        size: '120 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  'd0aba888-fb10-4dc9-9b17-bdd8f490c950': {
    isPrimary: true,
    name: 'App Identification',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'd0aba888-fb10-4dc9-9b17-bdd8f490c950',
    id: 107,
    characteristics: {
      'd0aba888-fb10-4dc9-9b17-bdd8f490c951': {
        uuid: 'd0aba888-fb10-4dc9-9b17-bdd8f490c951',
        name: 'Timestamp',
        size: '6 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['W'],
        sloanApp: '',
        remarks: 'not using in the Sloan Connect app',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'd0aba888-fb10-4dc9-9b17-bdd8f490c952': {
        uuid: 'd0aba888-fb10-4dc9-9b17-bdd8f490c952',
        name: 'Unlock Key',
        size: '32 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['W'],
        sloanApp: '',
        remarks: 'not using in the Sloan Connect app',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'd0aba888-fb10-4dc9-9b17-bdd8f490c953': {
        uuid: 'd0aba888-fb10-4dc9-9b17-bdd8f490c953',
        name: 'Lock Status',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '1',
        properties: ['R'],
        sloanApp: '',
        remarks: 'not using in the Sloan Connect app',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88360': {
    isPrimary: true,
    name: 'Flusher Diagnostic',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88360',
    id: 110,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88361': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88361',
        name: 'Activate Valve Once',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88362': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88362',
        name: 'Diagnostic Init',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88363': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88363',
        name: 'Sensor result',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88364': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88364',
        name: 'Battery Level at Diagnostic',
        size: '1 bytes',
        type: 'uint8_t',
        range: '0-64',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88365': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88365',
        name: 'Communication status',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88366': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88366',
        name: 'Solenoid Status',
        size: '1 bytes',
        type: 'String',
        range: '0-1',
        initialValue: '0',
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  'f89f13e7-83f8-4b7c-9e8b-364576d88370': {
    isPrimary: true,
    name: 'Flusher Factory Settings',
    deviceID: '00:0B:57:6E:87:31',
    uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88370',
    id: 128,
    characteristics: {
      'f89f13e7-83f8-4b7c-9e8b-364576d88371': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88371',
        name: 'Engineering Data 1',
        size: '40 bytes',
        type: 'String',
        range: '0-1',
        initialValue: null,
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      'f89f13e7-83f8-4b7c-9e8b-364576d88372': {
        uuid: 'f89f13e7-83f8-4b7c-9e8b-364576d88372',
        name: 'Engineering Data 2',
        size: '20 bytes',
        type: 'String',
        range: '0-63',
        initialValue: null,
        properties: ['R', 'W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
  '1d14d6ee-fd63-4fa1-bfa4-8f47b42119f0': {
    isPrimary: true,
    name: 'OTA',
    deviceID: '00:0B:57:6E:87:31',
    uuid: '1d14d6ee-fd63-4fa1-bfa4-8f47b42119f0',
    id: 149,
    characteristics: {
      'f7bf3564-fb6d-4e53-88a4-5e37e0326063': {
        uuid: 'f7bf3564-fb6d-4e53-88a4-5e37e0326063',
        name: 'OTA Control',
        size: '1 bytes',
        type: 'uint8_t',
        range: '0-1',
        initialValue: null,
        properties: ['W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
      '984227f3-34fc-4045-a5d0-2c581f81a153': {
        uuid: '984227f3-34fc-4045-a5d0-2c581f81a153',
        name: 'OTA Data Transfer',
        size: '200 bytes',
        type: 'uint8_t array',
        range: '0-1',
        initialValue: null,
        properties: ['W'],
        sloanApp: '',
        remarks: '',
        generation: 'all',
        prefix: null,
        postfix: null,
      },
    },
  },
};
