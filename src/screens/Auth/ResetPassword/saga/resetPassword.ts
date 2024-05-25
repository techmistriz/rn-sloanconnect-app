import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {resetPasswordActionTypes} from 'src/redux/types';
import {
  resetPasswordRequestAction,
  resetPasswordFailureAction,
  resetPasswordSuccessAction,
} from 'src/redux/actions';

import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __resetPasswordRequestSaga({payload, options}: any) {
  // console.log('__resetPasswordRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    // getUserAPiPrefixByUserType(options?.type) +
    const response = yield Network('reset-password', 'POST', payload);
    // console.log('__resetPasswordRequestSaga response saga==>', response);
    if (response?.status) {
      yield put(resetPasswordSuccessAction({}));
      showToastMessage(response?.message, 'success');

      if (
        options?.referrer == 'ForgotPasswordScreen' &&
        payload.type == 'VERIFY_OTP'
      ) {
        NavigationService.resetAction('ResetPassword', {
          ...payload,
          type: options?.type,
        });
      } else {
        NavigationService.resetAllAction('Login', {type: options?.type});
      }
    } else {
      yield put(resetPasswordFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__resetPasswordRequestSaga error saga==>', error);
    yield put(resetPasswordFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* resetPasswordRequestSaga() {
  console.log('saga resetPasswordRequestSaga');
  yield takeLatest(
    resetPasswordActionTypes.RESET_PASSWORD_REQUEST as never,
    __resetPasswordRequestSaga,
  );
}
