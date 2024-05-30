import {put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {verifyOtpActionTypes} from 'src/redux/types';
import {
  verifyOtpFailureAction,
  verifyOtpSuccessAction,
} from 'src/redux/actions';

import {showToastMessage, consoleLog} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __verifyOtpRequestSaga({payload, options}: any) {
  // consoleLog('__verifyOtpRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network(
      options?.referrer == 'ForgotPassword'
        ? 'auth/validate-otp'
        : 'auth/verify-email',
      'POST',
      payload,
      null,
    );
    console.log('__verifyOtpRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(verifyOtpSuccessAction({}));

      if (options?.referrer == 'ForgotPassword') {
        if (response?.message?.toLowerCase()?.indexOf('invalid otp') > -1) {
          showToastMessage(response?.message, 'danger');
        } else {
          // showToastMessage(response?.message, 'success');
          NavigationService.navigate('ResetPassword', {
            ...payload,
            hash: response?.hash,
            otp: response?.otp,
          });
        }
      } else {
        showToastMessage(response?.message, 'success');
        NavigationService.pop(2);
      }
    } else {
      yield put(verifyOtpFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__loginRequestSaga error saga==>', error);
    yield put(verifyOtpFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* verifyOtptpRequestSaga() {
  consoleLog('saga verifyOtptpRequestSaga');
  yield takeLatest(
    verifyOtpActionTypes.VERIFY_OTP_REQUEST as never,
    __verifyOtpRequestSaga,
  );
}
