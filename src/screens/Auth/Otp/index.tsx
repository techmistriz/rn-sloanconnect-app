import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import {styles} from './styles';
import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import Network from 'src/network/Network';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  otpRequestAction,
  verifyOtpRequestAction,
  forgotPasswordRequestAction,
  resetPasswordRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';

const Index = ({route, navigation}: any) => {
  const {email, password, type, referrer} = route?.params;
  const dispatch = useDispatch();
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const __resetPasswordReducer = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );
  const __otpReducer = useSelector((state: any) => state?.OtpReducer);
  // const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    consoleLog('AuthReducer OTP Screen==>', {loading, type, referrer});
    // consoleLog('ResetPasswordReducer OTP Screen==>', {__resetPasswordReducer});
  }, []);

  const onOtpPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email,
        otp: otp,
        type: 'VERIFY_OTP',
      };

      const options = {
        type: type,
        referrer: referrer,
      };

      if (referrer == 'ForgotPasswordScreen') {
        dispatch(resetPasswordRequestAction(payload, options));
      } else {
        dispatch(verifyOtpRequestAction(payload, options));
      }
    }
  };

  const onResendOtpPress = () => {
    consoleLog('referrer', referrer);
    Keyboard.dismiss();
    const checkValid = checkValidationForResendOtp();
    if (checkValid) {
      const payload = {email: email, type: 'VERIFY_OTP'};
      const options = {
        type: type,
        referrer: referrer,
      };
      if (referrer == 'ForgotPasswordScreen') {
        dispatch(forgotPasswordRequestAction(payload, options));
      } else {
        dispatch(otpRequestAction(payload, options));
      }
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    const checkEmail = isValidEmail(email);
    if (email.trim() === '') {
      showSimpleAlert('Please enter your email address');
      return false;
    } else if (!checkEmail) {
      showSimpleAlert('Please enter valid email address');
      return false;
    } else {
      return true;
    }
  };

  /**validation checking for email */
  const checkValidationForResendOtp = () => {
    const checkEmail = isValidEmail(email);
    if (email.trim() === '') {
      showSimpleAlert('Please enter your email address');
      return false;
    } else if (!checkEmail) {
      showSimpleAlert('Please enter valid email address');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer
      scroll={false}
      loading={
        loading || __resetPasswordReducer?.loading || __otpReducer?.loading
      }>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.section2}>
          <Typography
            size={26}
            text="2 Step Verification"
            style={{textAlign: 'center', marginTop: 18}}
            color={Theme.colors.white}
            ff={Theme.fonts.ThemeFontBold}
          />
          <Row
            autoMargin={false}
            style={{
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Typography
              size={18}
              text="Verify your "
              style={{textAlign: 'center'}}
              color={Theme.colors.white}
            />
            <Typography
              size={18}
              text="Email Id "
              style={{textAlign: 'center'}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontBold}
            />
            <Typography
              size={18}
              text="with codes "
              style={{textAlign: 'center'}}
              color={Theme.colors.white}
            />
          </Row>
          <Typography
            size={18}
            text="sent to you"
            style={{textAlign: 'center'}}
            color={Theme.colors.white}
          />

          <Wrap autoMargin={false} style={styles.formWrapper}>
            <Wrap autoMargin={false} style={[styles.inputWrapper]}>
              <Wrap autoMargin={false} style={[styles.inputOTPWrapper]}>
                <OTPInputView
                  style={{height: 100}}
                  pinCount={4}
                  // code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                  // onCodeChanged={code => {
                  //   consoleLog('OTP', otp);
                  // }}
                  // autoFocusOnLoad
                  codeInputFieldStyle={styles.otpInput}
                  codeInputHighlightStyle={styles.styleHighLighted}
                  onCodeFilled={code => {
                    setOtp(code);
                    // consoleLog(`Code is ${code}, you are good to go!`);
                  }}
                />
              </Wrap>

              <Wrap>
                <Row
                  autoMargin={false}
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Typography
                    size={16}
                    text="I didn't receive the code, "
                    color={Theme.colors.white}
                  />

                  <Typography
                    size={16}
                    text="Resend"
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontBold}
                    style={{textDecorationLine: 'underline'}}
                    onPress={() => {
                      onResendOtpPress();
                    }}
                  />
                </Row>
              </Wrap>
            </Wrap>

            <Wrap
              autoMargin={false}
              style={[styles.inputWrapper, {justifyContent: 'flex-end'}]}>
              <Button
                title="Submit"
                onPress={() => {
                  onOtpPress();
                }}
                style={{marginTop: 10}}
                textStyle={{
                  fontSize: 18,
                  fontFamily: Theme.fonts.ThemeFontBold,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
