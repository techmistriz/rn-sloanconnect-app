import {forgotPasswordActionTypes, resetPasswordActionTypes} from '../types';

/**
 * initial stat for reducer
 */
const initialState = {
  loading: false,
  status: 0,
  error: '',
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for Forgot password module
 */
const forgotPasswordReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case forgotPasswordActionTypes.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case forgotPasswordActionTypes.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case forgotPasswordActionTypes.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case resetPasswordActionTypes.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case resetPasswordActionTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case resetPasswordActionTypes.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state || initialState;
  }
};

export default forgotPasswordReducer;
