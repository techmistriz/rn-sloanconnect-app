import {put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {verifyEmailActionTypes} from 'src/redux/types';
import {
  verifyEmailFailureAction,
  verifyEmailSuccessAction,
} from 'src/redux/actions';
import {showToastMessage, consoleLog} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __verifyEmailRequestSaga({payload, options}: any) {
  // consoleLog('__verifyEmailRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network('auth/activation-email', 'POST', payload);
    console.log('__verifyEmailRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(verifyEmailSuccessAction({}));

      if (response?.status) {
        showToastMessage(response?.message, 'success');
        NavigationService.navigate('Otp', {
          ...payload,
          hash: response?.hash,
          referrer: options?.referrer,
        });
      } else {
        showToastMessage(response?.message, 'danger');
      }
    } else {
      yield put(verifyEmailFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__verifyEmailRequestSaga error saga==>', error);
    yield put(verifyEmailFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* verifyEmailRequestSaga() {
  consoleLog('saga verifyEmailRequestSaga');
  yield takeLatest(
    verifyEmailActionTypes.VERIFY_EMAIL_REQUEST as never,
    __verifyEmailRequestSaga,
  );
}
