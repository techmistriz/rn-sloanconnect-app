import {all} from 'redux-saga/effects';
import loginRequestSaga from 'src/screens/Auth/Login/saga/login';
import signupRequestSaga from 'src/screens/Auth/Register/saga/signup';
import settingsRequestSaga from 'src/screens/Settings/saga/settings';

function* rootSaga() {
  yield all([
    loginRequestSaga(),
    signupRequestSaga(),
    settingsRequestSaga(),
  ]);
}

export default rootSaga;
