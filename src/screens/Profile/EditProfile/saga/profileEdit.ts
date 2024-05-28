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

function* __userProfileRequestSaga({
  payload,
  options,
}: {
  payload: any;
  options: any;
}) {
  // console.log('__userProfileRequestSaga payload saga==>', payload);
  // console.log('__userProfileRequestSaga options saga==>', options);

  try {
    //@ts-ignore
    const response = yield Network('POST', payload, options?.token);
    // console.log('__userProfileRequestSaga response saga==>', response);
    if (response.status) {
      yield put(
        userProfileSuccessAction({
          user: response?.data?.user,
        }),
      );
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
