import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {forgotPasswordActionTypes} from 'src/redux/types';
import {
  forgotPasswordRequestAction,
  forgotPasswordFailureAction,
  forgotPasswordSuccessAction,
} from 'src/redux/actions';

import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __forgotPasswordRequestSaga({payload, options}: any) {
  //consoleLog('__forgotPasswordRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network('forgot-password', 'POST', payload);
    console.log('__forgotPasswordRequestSaga response saga==>', response);
    if (response.status) {
      yield put(forgotPasswordSuccessAction({user: null}));
      showToastMessage(response?.message, 'success');
      NavigationService.navigate('Otp', {
        ...payload,
        referrer: options?.referrer,
        type: response?.data?.type,
      });
    } else {
      yield put(forgotPasswordFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__forgotPasswordRequestSaga error saga==>', error);
    yield put(forgotPasswordFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* forgotPasswordRequestSaga() {
  consoleLog('saga forgotPasswordRequestSaga');
  yield takeLatest(
    forgotPasswordActionTypes.FORGOT_PASSWORD_REQUEST as never,
    __forgotPasswordRequestSaga,
  );
}
