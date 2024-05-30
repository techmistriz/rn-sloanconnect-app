import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {loginActionTypes} from 'src/redux/types';
import {
  loginRequestAction,
  loginFailureAction,
  loginSuccessAction,
} from 'src/redux/actions';
import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __loginRequestSaga({payload, options}: any) {
  // console.log('__loginRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    const response = yield Network('auth/login', 'POST', payload, null);
    console.log('__loginRequestSaga response saga==>', response);
    if (
      response?.token &&
      typeof response?.organizations[0] !== 'undefined' &&
      response?.organizations[0]
    ) {
      // consoleLog("loginSuccessAction", {
      //   data: response?.organizations[0],
      //   token: response?.token,
      // })

      const __token = response?.token;
      const __user = response;
      delete __user?.token;
      delete __user?.token_type;
      delete __user?.expires_in;

      yield put(
        loginSuccessAction({
          data: __user,
          token: __token,
        }),
      );
      showToastMessage('Login successful.', 'success');
      NavigationService.navigate('Welcome', {
        referrer: options?.referrer,
      });
    } else {
      yield put(loginFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__loginRequestSaga error saga==>', error);
    yield put(loginFailureAction({}));

    if (error?.error === 'email_unverified') {
      showToastMessage(error?.message, 'warning');
      NavigationService.navigate('VerifyEmail', {
        ...payload,
      });
    } else {
      showToastMessage(error?.message);
    }
  }
}

export default function* loginRequestSaga() {
  console.log('saga loginRequestSaga');
  yield takeLatest(loginActionTypes.LOGIN_REQUEST as never, __loginRequestSaga);
}
