import {connectedDeviceActionTypes} from 'src/redux/types';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

/**
 * initial stat for reducer
 */
const initialState = {
  device: null,
  status: null,
  loading: false,
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for Login module
 */
const auth = (state = initialState, action: any) => {
  switch (action.type) {
    case connectedDeviceActionTypes.CONNECTED_DEVICE_REQUEST:
      return {
        ...state,
        device: null,
        status: null,
        loading: true,
      };

    case connectedDeviceActionTypes.CONNECTED_DEVICE_SUCCESS:
      return {
        ...state,
        device: action?.payload?.data,
        status: action?.payload?.status,
        loading: false,
      };

    case connectedDeviceActionTypes.CONNECTED_DEVICE_FAILURE:
      return {
        ...state,
        device: null,
        status: null,
        loading: false,
      };

    case connectedDeviceActionTypes.CONNECTED_DEVICE_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default auth;
