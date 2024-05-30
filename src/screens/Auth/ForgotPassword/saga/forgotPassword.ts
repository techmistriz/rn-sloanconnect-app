import {put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {forgotPasswordActionTypes} from 'src/redux/types';
import {
  forgotPasswordFailureAction,
  forgotPasswordSuccessAction,
} from 'src/redux/actions';
import {showToastMessage, consoleLog} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __forgotPasswordRequestSaga({payload, options}: any) {
  // consoleLog('__forgotPasswordRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network('auth/forgot-password', 'POST', payload);
    console.log('__forgotPasswordRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(forgotPasswordSuccessAction({user: null}));

      if (response?.status) {
        showToastMessage(response?.message, 'success');
        // NavigationService.navigate('ResetPassword', {
        //   ...payload,
        //   hash: response?.hash,
        // });

        if (options?.shouldRedirect) {
          NavigationService.navigate('Otp', {
            ...payload,
            hash: response?.hash,
            referrer: options?.referrer,
          });
        }
      } else {
        showToastMessage(response?.message, 'danger');
      }
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
