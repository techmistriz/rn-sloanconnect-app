import {BLEService} from 'src/services';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {base64EncodeDecode, base64ToText} from 'src/utils/Helpers/encryption';
import {useRef} from 'react';

let loaderRef = useRef<any>(null);

/**
 *
 * @param {*} navigatorRef
 * set the navigator ref to local ref from NavigationRoot file
 */
function setLoaderRef(navigatorRef: any) {
  loaderRef = navigatorRef;
}

/**
 * Navigation Service Facility for provide different Kind of routing
 */
export default {
  setLoaderRef,
};
