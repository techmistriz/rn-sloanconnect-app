import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {settingsActionTypes} from 'src/redux/types';
import {settingsFailureAction, settingsSuccessAction} from 'src/redux/actions';
import {
  showToastMessage,
  consoleLog,
  getUserAPiPrefixByUserType,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __settingsRequestSaga({payload, options}: any) {
  // consoleLog('__settingsRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    const response = yield Network(
      getUserAPiPrefixByUserType(options?.type) + 'profile/update',
      'POST',
      payload,
      options?.token,
    );
    const __settings = {
      isNotification: response?.data?.user?.is_notifications_enabled == 1,
      isBiometric:
        response?.data?.user?.is_biometric_enabled == 1
          ? 'ENABLED'
          : 'DISABLED',
      type: options?.type,
    };
    consoleLog('__settingsRequestSaga response saga==>', response);
    if (response.status) {
      showToastMessage(response?.message, 'success');
      yield put(settingsSuccessAction({settings: __settings}));
      if (options?.rererer == 'BiometricScreen') {
        NavigationService.goBack();
      }
    } else {
      yield put(settingsFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    consoleLog('__settingsRequestSaga error saga==>', error);
    yield put(settingsFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* settingsRequestSaga() {
  consoleLog('saga settingsRequestSaga');
  yield takeLatest(
    settingsActionTypes.SETTINGS_REQUEST as never,
    __settingsRequestSaga,
  );
}
