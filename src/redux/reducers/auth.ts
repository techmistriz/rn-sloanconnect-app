import {
  loginActionTypes,
  verifyOtpActionTypes,
  userProfileActionTypes,
  changePasswordActionTypes,
} from 'src/redux/types';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

/**
 * initial stat for reducer
 */
const initialState = {
  user: null,
  token: null,
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
    case loginActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        token: null,
        loading: true,
      };
    case loginActionTypes.BIOMETRIC_LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        token: null,
        loading: true,
      };

    case loginActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action?.payload?.data,
        token: action?.payload?.token,
        loading: false,
      };

    case loginActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };

    case loginActionTypes.LOGIN_RESET_DATA:
      return initialState;

    case verifyOtpActionTypes.VERIFY_OTP_REQUEST:
      return {
        ...state,
        user: null,
        token: null,
        loading: true,
      };

    case verifyOtpActionTypes.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        user: action?.payload.user,
        token: action?.payload.token,
        type: action?.payload?.type,
        media_storage: action?.payload?.media_storage,
        loading: false,
      };

    case verifyOtpActionTypes.VERIFY_OTP_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };

    case userProfileActionTypes.USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userProfileActionTypes.USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: action?.payload?.user,
        loading: false,
      };

    case userProfileActionTypes.USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case userProfileActionTypes.USER_PROFILE_RESET_DATA:
      return initialState;

    case changePasswordActionTypes.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case changePasswordActionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case changePasswordActionTypes.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case changePasswordActionTypes.CHANGE_PASSWORD_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default auth;
