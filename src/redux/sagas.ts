import {all} from 'redux-saga/effects';
import loginRequestSaga from 'src/screens/Auth/Login/saga/login';
import otpRequestSaga from 'src/screens/Auth/Otp/saga/sendOtp';
import verifyOtpRequestSaga from 'src/screens/Auth/Otp/saga/verifyOtp';
import signupRequestSaga from 'src/screens/Auth/Register/saga/signup';
import userProfileRequestSaga from 'src/screens/Profile/EditProfile/saga/profileEdit';
import forgotPasswordRequestSaga from 'src/screens/Auth/ForgotPassword/saga/forgotPassword';
import resetPasswordRequestSaga from 'src/screens/Auth/ResetPassword/saga/resetPassword';
import changePasswordRequestSaga from 'src/screens/Profile/ChangePassword/saga/changePassword';
import settingsRequestSaga from 'src/screens/Settings/saga/settings';

function* rootSaga() {
  yield all([
    loginRequestSaga(),
    otpRequestSaga(),
    verifyOtpRequestSaga(),
    signupRequestSaga(),
    userProfileRequestSaga(),
    forgotPasswordRequestSaga(),
    resetPasswordRequestSaga(),
    changePasswordRequestSaga(),
    settingsRequestSaga(),
  ]);
}

export default rootSaga;
