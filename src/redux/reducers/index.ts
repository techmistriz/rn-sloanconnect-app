import {combineReducers} from 'redux';
import authReducer from './auth';
import otpReducer from './otp';
import forgotResetPassword from './forgotResetPassword';
import verifyEmailReducer from './verifyEmail';
import signupReducer from './signup';
import settingsReducer from './settings';
import deviceSettingsReducer from './deviceSettings';

const combinedReducers = combineReducers({
  AuthReducer: authReducer,
  OtpReducer: otpReducer,
  ForgotResetPasswordReducer: forgotResetPassword,
  VerifyEmailReducer: verifyEmailReducer,
  SignupReducer: signupReducer,
  SettingsReducer: settingsReducer,
  DeviceSettingsReducer: deviceSettingsReducer,
});

export {combinedReducers};
