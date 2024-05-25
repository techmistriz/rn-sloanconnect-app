import {verifyEmailActionTypes} from '../types';

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
const verifyEmailReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case verifyEmailActionTypes.VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case verifyEmailActionTypes.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case verifyEmailActionTypes.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case verifyEmailActionTypes.VERIFY_EMAIL_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default verifyEmailReducer;
