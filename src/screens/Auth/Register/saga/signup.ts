import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {signupActionTypes} from 'src/redux/types';
import {
  signupRequestAction,
  signupFailureAction,
  signupSuccessAction,
} from 'src/redux/actions';
import {
  showToastMessage,
  consoleLog,
  getUserAPiPrefixByUserType,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __signupRequestSaga({payload, options}: any) {
  // consoleLog('__signupRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    const response = yield Network('auth/register', 'POST', payload, null);
    // consoleLog('__signupRequestSaga response saga==>', response);

    if (response.message == 'Registration successful.') {
      yield put(signupSuccessAction({}));
      showToastMessage(response?.message, 'success');
      NavigationService.goBack();
    } else {
      yield put(signupFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    consoleLog('__signupRequestSaga error saga==>', error);
    yield put(signupFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* signupRequestSaga() {
  consoleLog('saga signupRequestSaga');
  yield takeLatest(
    signupActionTypes.SIGNUP_REQUEST as never,
    __signupRequestSaga,
  );
}
