import {signupActionTypes} from '../types';

/**
 * initial stat for reducer
 */
const initialState = {
  user: null,
  token: null,
  type: null,
  loading: false,
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for singup module
 */
const signupReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case signupActionTypes.SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case signupActionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case signupActionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case signupActionTypes.SIGNUP_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default signupReducer;
