import {call, put, takeLatest} from 'redux-saga/effects';
import Network from 'src/network/Network';
import {userProfileActionTypes} from 'src/redux/types';
import {
  userProfileRequestAction,
  userProfileFailureAction,
  userProfileSuccessAction,
} from 'src/redux/actions';
import {showToastMessage} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

function* __userProfileRequestSaga({
  payload,
  options,
}: {
  payload: any;
  options: any;
}) {
  try {
    //@ts-ignore
    const response = yield Network('user', 'POST', payload, options?.token);
    console.log('__userProfileRequestSaga response saga==>', response);
    if (!isObjectEmpty(response)) {
      yield put(
        userProfileSuccessAction({
          user: response,
        }),
      );
      showToastMessage('Profile updated successfully', 'success');
      NavigationService.goBack();
    } else {
      yield put(userProfileFailureAction({}));
      showToastMessage(response?.message);
    }
  } catch (error: any) {
    console.log('__userProfile error saga==>', error);
    yield put(userProfileFailureAction({}));
    showToastMessage(error?.message);
  }
}

export default function* userProfileRequestSaga() {
  console.log('saga userProfileRequestSaga');
  yield takeLatest(
    userProfileActionTypes.USER_PROFILE_REQUEST as never,
    __userProfileRequestSaga,
  );
}
