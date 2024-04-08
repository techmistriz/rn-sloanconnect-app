import {deviceSettingsActionTypes} from 'src/redux/types';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {isObjectEmpty} from 'src/utils/Helpers/array';

/**
 * initial stat for reducer
 */
const initialState = {
  deviceSettingsData: {},
  loading: false,
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for Login module
 */
const deviceSettings = (state = initialState, action: any) => {
  switch (action.type) {
    case deviceSettingsActionTypes.DEVICE_SETTINGS_REQUEST:
      return {
        ...state,
        deviceSettingsData: null,
        loading: true,
      };

    case deviceSettingsActionTypes.DEVICE_SETTINGS_SUCCESS:
      var deviceSettingsDataOld = {};
      if (!isObjectEmpty(state?.deviceSettingsData)) {
        deviceSettingsDataOld = state?.deviceSettingsData;
      }

      // consoleLog('deviceSettingsDataOld', deviceSettingsDataOld);
      const deviceSettingsDataNew = action?.payload?.data;
      // consoleLog('deviceSettingsDataNew', deviceSettingsDataNew);

      return {
        ...state,
        deviceSettingsData: {
          ...deviceSettingsDataOld,
          ...deviceSettingsDataNew,
        },
        loading: false,
      };

    case deviceSettingsActionTypes.DEVICE_SETTINGS_FAILURE:
      return {
        ...state,
        deviceSettingsData: null,
        loading: false,
      };

    case deviceSettingsActionTypes.DEVICE_SETTINGS_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default deviceSettings;
