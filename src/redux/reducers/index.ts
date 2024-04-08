import {combineReducers} from 'redux';
import authReducer from './auth';
import otpReducer from './otp';
import forgotResetPassword from './forgotResetPassword';
import signupReducer from './signup';
import settingsReducer from './settings';
import connectedDeviceReducer from './connectedDevice';
import deviceSettingsReducer from './deviceSettings';

const combinedReducers = combineReducers({
  AuthReducer: authReducer,
  OtpReducer: otpReducer,
  ForgotResetPasswordReducer: forgotResetPassword,
  SignupReducer: signupReducer,
  SettingsReducer: settingsReducer,
  ConnectedDeviceReducer: connectedDeviceReducer,
  DeviceSettingsReducer: deviceSettingsReducer,
});

export {combinedReducers};
