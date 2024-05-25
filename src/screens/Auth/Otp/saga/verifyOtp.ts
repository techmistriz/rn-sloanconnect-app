import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {verifyOtpActionTypes} from 'src/redux/types';
import {
  verifyOtpRequestAction,
  verifyOtpFailureAction,
  verifyOtpSuccessAction,
  settingsSuccessAction,
} from 'src/redux/actions';

import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __verifyOtpRequestSaga({payload, options}: any) {
  //consoleLog('__verifyOtpRequestSaga payload saga==>', payload);
  try {
    //@ts-ignore
    const response = yield Network('verify-otp', 'POST', payload, null);
    // console.log('__verifyOtpRequestSaga response saga==>', response);
    if (response.status) {
      showToastMessage(response?.message, 'success');

      yield put(
        verifyOtpSuccessAction({
          user: response?.data?.user,
          token: response?.data?.accessToken,
          type: response?.data?.type,
          media_storage: response?.data?.media_storage,
        }),
      );

      const __settings = {
        isNotification: response?.data?.user?.is_notifications_enabled == 1,
        isBiometric:
          response?.data?.user?.is_biometric_enabled == 1
            ? 'ENABLED'
            : 'DISABLED',
        type: response?.data?.type,
      };
      yield put(settingsSuccessAction({settings: __settings}));

      if (options?.referrer == 'SignupScreen') {
        NavigationService.resetAllAction('EditProfile', {
          type: response?.data?.type,
          referrer: options?.referrer,
        });
      } else {
        NavigationService.resetAllAction('DrawerNavigator', {
          type: response?.data?.type,
          referrer: options?.referrer,
        });
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
