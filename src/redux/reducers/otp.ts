import {otpActionTypes} from '../types';

/**
 * initial stat for reducer
 */
const initialState = {
  loading: false,
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for Forgot password module
 */
const otpReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case otpActionTypes.OTP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case otpActionTypes.OTP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case otpActionTypes.OTP_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case otpActionTypes.OTP_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default otpReducer;
