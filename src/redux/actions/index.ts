import {
  loginActionTypes,
  otpActionTypes,
  verifyOtpActionTypes,
  verifyEmailActionTypes,
  signupActionTypes,
  forgotPasswordActionTypes,
  resetPasswordActionTypes,
  settingsActionTypes,
  connectedDeviceActionTypes,
  deviceSettingsActionTypes,
} from 'src/redux/types';

/** login module related actions */
export const loginRequestAction = (payload: any, options?: any) => ({
  type: loginActionTypes.LOGIN_REQUEST,
  payload,
  options,
});

/** login module related actions */
export const boimetricLoginRequestAction = (payload: any, options?: any) => ({
  type: loginActionTypes.BIOMETRIC_LOGIN_REQUEST,
  payload,
  options,
});

export const loginSuccessAction = (payload: any) => ({
  type: loginActionTypes.LOGIN_SUCCESS,
  payload,
});

export const loginFailureAction = (payload: any) => ({
  type: loginActionTypes.LOGIN_FAILURE,
  payload,
});

export const loginResetDataAction = () => ({
  type: loginActionTypes.LOGIN_RESET_DATA,
});

/** otp module related actions */
export const otpRequestAction = (payload: any, options?: any) => ({
  type: otpActionTypes.OTP_REQUEST,
  payload,
  options,
});

export const otpSuccessAction = (payload: any) => ({
  type: otpActionTypes.OTP_SUCCESS,
  payload,
});

export const otpFailureAction = (payload: any) => ({
  type: otpActionTypes.OTP_FAILURE,
  payload,
});

export const otpResetDataAction = () => ({
  type: otpActionTypes.OTP_RESET_DATA,
});

/** verify otp module related actions */
export const verifyOtpRequestAction = (payload: any, options?: any) => ({
  type: verifyOtpActionTypes.VERIFY_OTP_REQUEST,
  payload,
  options,
});

export const verifyOtpSuccessAction = (payload: any) => ({
  type: verifyOtpActionTypes.VERIFY_OTP_SUCCESS,
  payload,
});

export const verifyOtpFailureAction = (payload: any) => ({
  type: verifyOtpActionTypes.VERIFY_OTP_FAILURE,
  payload,
});

export const verifyOtpResetDataAction = () => ({
  type: verifyOtpActionTypes.VERIFY_OTP_RESET_DATA,
});

/** verify otp module related actions */
export const verifyEmailRequestAction = (payload: any, options?: any) => ({
  type: verifyEmailActionTypes.VERIFY_EMAIL_REQUEST,
  payload,
  options,
});

export const verifyEmailSuccessAction = (payload: any) => ({
  type: verifyEmailActionTypes.VERIFY_EMAIL_SUCCESS,
  payload,
});

export const verifyEmailFailureAction = (payload: any) => ({
  type: verifyEmailActionTypes.VERIFY_EMAIL_FAILURE,
  payload,
});

export const verifyEmailResetDataAction = () => ({
  type: verifyEmailActionTypes.VERIFY_EMAIL_RESET_DATA,
});

/** signup module related actions */
export const signupRequestAction = (payload: any, options?: any) => ({
  type: signupActionTypes.SIGNUP_REQUEST,
  payload,
  options,
});

export const signupSuccessAction = (payload: any) => ({
  type: signupActionTypes.SIGNUP_SUCCESS,
  payload,
});

export const signupFailureAction = (payload: any) => ({
  type: signupActionTypes.SIGNUP_FAILURE,
  payload,
});

export const signupResetDataAction = () => ({
  type: signupActionTypes.SIGNUP_RESET_DATA,
});

/** forgot password module related actions */
export const forgotPasswordRequestAction = (payload: any, options?: any) => ({
  type: forgotPasswordActionTypes.FORGOT_PASSWORD_REQUEST,
  payload,
  options,
});

export const forgotPasswordSuccessAction = (payload: any) => ({
  type: forgotPasswordActionTypes.FORGOT_PASSWORD_SUCCESS,
  payload,
});

export const forgotPasswordFailureAction = (payload: any) => ({
  type: forgotPasswordActionTypes.FORGOT_PASSWORD_FAILURE,
  payload,
});

export const forgotPasswordResetDataAction = () => ({
  type: forgotPasswordActionTypes.FORGOT_PASSWORD_RESET_DATA,
});

/** reset password module related actions */
export const resetPasswordRequestAction = (payload: any, options?: any) => ({
  type: resetPasswordActionTypes.RESET_PASSWORD_REQUEST,
  payload,
  options,
});

export const resetPasswordSuccessAction = (payload: any) => ({
  type: resetPasswordActionTypes.RESET_PASSWORD_SUCCESS,
  payload,
});

export const resetPasswordFailureAction = (payload: any) => ({
  type: resetPasswordActionTypes.RESET_PASSWORD_FAILURE,
  payload,
});

export const resetPasswordResetDataAction = () => ({
  type: resetPasswordActionTypes.RESET_PASSWORD_RESET_DATA,
});

/** settings module related actions */
export const settingsRequestAction = (payload: any, options?: any) => ({
  type: settingsActionTypes.SETTINGS_REQUEST,
  payload,
  options,
});

export const settingsSuccessAction = (payload: any) => ({
  type: settingsActionTypes.SETTINGS_SUCCESS,
  payload,
});

export const settingsFailureAction = (payload: any) => ({
  type: settingsActionTypes.SETTINGS_FAILURE,
  payload,
});

export const settingsResetDataAction = () => ({
  type: settingsActionTypes.SETTINGS_RESET_DATA,
});

/** connectedDevice module related actions */
export const connectedDeviceRequestAction = (payload: any, options?: any) => ({
  type: connectedDeviceActionTypes.CONNECTED_DEVICE_REQUEST,
  payload,
  options,
});

export const connectedDeviceSuccessAction = (payload: any) => ({
  type: connectedDeviceActionTypes.CONNECTED_DEVICE_SUCCESS,
  payload,
});

export const connectedDeviceFailureAction = (payload: any) => ({
  type: connectedDeviceActionTypes.CONNECTED_DEVICE_FAILURE,
  payload,
});

export const connectedDeviceResetDataAction = () => ({
  type: connectedDeviceActionTypes.CONNECTED_DEVICE_RESET_DATA,
});

/** deviceSettings module related actions */
export const deviceSettingsRequestAction = (payload: any, options?: any) => ({
  type: deviceSettingsActionTypes.DEVICE_SETTINGS_REQUEST,
  payload,
  options,
});

export const deviceSettingsSuccessAction = (payload: any) => ({
  type: deviceSettingsActionTypes.DEVICE_SETTINGS_SUCCESS,
  payload,
});

export const deviceSettingsFailureAction = (payload: any) => ({
  type: deviceSettingsActionTypes.DEVICE_SETTINGS_FAILURE,
  payload,
});

export const deviceSettingsResetDataAction = () => ({
  type: deviceSettingsActionTypes.DEVICE_SETTINGS_RESET_DATA,
});
