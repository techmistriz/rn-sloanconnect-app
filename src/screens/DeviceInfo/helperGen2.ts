import {Device} from 'react-native-ble-plx';
import {BLEService} from 'src/services';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  base64EncodeDecode,
  hexEncodeDecode,
  hexToString,
  addSeparatorInString,
  hexToDecimal,
} from 'src/utils/Helpers/encryption';
import {
  formatCharateristicValue,
  getBleDeviceGeneration,
  getDeviceCharacteristicsByServiceUUID,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
