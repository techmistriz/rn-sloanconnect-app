import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {otpActionTypes} from 'src/redux/types';
import {
  otpRequestAction,
  otpFailureAction,
  otpSuccessAction,
} from 'src/redux/actions';

import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {createNameValueArray, isObjectEmpty} from 'src/utils/Helpers/array';

function* __otpRequestSaga({payload, options}: any) {
  //consoleLog('__otpRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network(
      'auth/activation-email',
      'POST',
      payload,
      null,
    );
    // console.log('__otpRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(otpSuccessAction({}));
      showToastMessage(response?.message, 'success');
    } else {
      yield put(otpFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__otpRequestSaga error saga==>', error);
    yield put(otpFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* otpRequestSaga() {
  consoleLog('saga otpRequestSaga');
  yield takeLatest(otpActionTypes.OTP_REQUEST as never, __otpRequestSaga);
}
