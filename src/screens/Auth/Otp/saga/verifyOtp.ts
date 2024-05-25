import {put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {verifyOtpActionTypes} from 'src/redux/types';
import {
  verifyOtpFailureAction,
  verifyOtpSuccessAction,
} from 'src/redux/actions';

import {
  showToastMessage,
  consoleLog,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __verifyOtpRequestSaga({payload, options}: any) {
  //consoleLog('__verifyOtpRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network('auth/verify_otp', 'POST', payload, null);
    // console.log('__verifyOtpRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      showToastMessage(response?.message, 'success');

      yield put(
        verifyOtpSuccessAction({
          user: null,
          token: null,
        }),
      );

      NavigationService.pop(2);
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
