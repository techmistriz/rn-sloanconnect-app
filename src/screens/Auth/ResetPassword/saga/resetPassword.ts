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
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __resetPasswordRequestSaga({payload, options}: any) {
  // console.log('__resetPasswordRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    // getUserAPiPrefixByUserType(options?.type) +
    const response = yield Network('auth/reset-password', 'POST', payload);
    // console.log('__resetPasswordRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(resetPasswordSuccessAction({}));

      if (response?.message?.toLowerCase()?.indexOf('invalid otp') > -1) {
        showToastMessage(response?.message, 'danger');
      } else {
        showToastMessage(response?.message, 'success');
        // NavigationService.pop(3);
        NavigationService.navigate('ResetPasswordSuccess');
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
