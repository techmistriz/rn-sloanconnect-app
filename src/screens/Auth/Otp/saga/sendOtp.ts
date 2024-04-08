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
  getUserAPiPrefixByUserType,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __otpRequestSaga({payload, options}: any) {
  //consoleLog('__otpRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network(
      getUserAPiPrefixByUserType(options?.type) + 'send-otp',
      'POST',
      payload,
      null,
    );
    // console.log('__otpRequestSaga response saga==>', response);
    if (response.status) {
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
