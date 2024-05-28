import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {changePasswordActionTypes} from 'src/redux/types';
import {
  resetPasswordRequestAction,
  changePasswordFailureAction,
  changePasswordSuccessAction,
} from 'src/redux/actions';
import {showToastMessage} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

function* __changePasswordRequestSaga({payload, options}: any) {
  // console.log('__changePasswordRequestSaga payload saga==>', payload);

  try {
    //@ts-ignore
    const response = yield Network('POST', payload, options?.token);
    console.log('__changePasswordRequestSaga response saga==>', response);
    if (response.status) {
      yield put(changePasswordSuccessAction({}));
      showToastMessage(response?.message, 'success');
      NavigationService.goBack();
    } else {
      yield put(changePasswordFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__changePasswordRequestSaga error saga==>', error);
    yield put(changePasswordFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* changePasswordRequestSaga() {
  console.log('saga changePasswordRequestSaga');
  yield takeLatest(
    changePasswordActionTypes.CHANGE_PASSWORD_REQUEST as never,
    __changePasswordRequestSaga,
  );
}
