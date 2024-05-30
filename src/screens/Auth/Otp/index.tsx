import React, {useEffect, useState} from 'react';
import {Image, Keyboard} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import {styles} from './styles';
import {
  consoleLog,
  showSimpleAlert,
  isValidEmail,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {
  forgotPasswordRequestAction,
  otpRequestAction,
  verifyOtpRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import Input from 'src/components/Input';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const Index = ({route, navigation}: any) => {
  const {email, hash, referrer} = route?.params;
  const dispatch = useDispatch();
  const {loading} = useSelector((state: any) => state?.AuthReducer);

  // const __otpReducer = useSelector((state: any) => state?.OtpReducer);
  const __forgotResetPasswordReducer = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );
  // const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    consoleLog('AuthReducer OTP Screen==>', {loading, hash, referrer});
    // consoleLog('ResetPasswordReducer OTP Screen==>', {__resetPasswordReducer});
  }, []);

  const onOtpPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email,
        otp: otp,
        token: hash,
      };
      const options = {
        referrer: referrer,
      };
      dispatch(verifyOtpRequestAction(payload, options));
    }
  };

  const onResendOtpPress = () => {
    Keyboard.dismiss();
    if (referrer == 'ForgotPassword') {
      const payload = {
        email: email.trim(),
        source: 'sloan',
        verify_method: 'otp',
      };

      const options = {
        referrer: 'ForgotPassword',
        shouldRedirect: false,
      };
      dispatch(forgotPasswordRequestAction(payload, options));
    } else {
      const checkValid = checkValidation();
      if (checkValid) {
        const payload = {email: email, source: 'sloan', verify_method: 'otp'};
        dispatch(otpRequestAction(payload));
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
    if (otp?.length == 0) {
      showSimpleAlert('Please enter your OTP');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer
      scroll={true}
      loading={loading || __forgotResetPasswordReducer?.loading}
      scrollViewStyle={{}}
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Image
                source={getImgSource(Images?.appLogoWithText)}
                style={{width: '50%', height: 80}}
                resizeMode="contain"
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Typography
                size={20}
                text="Verify OTP"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <Wrap autoMargin={false} style={styles.inputWrapper}>
                {/* <Input
                  onRef={input => {
                    // @ts-ignore
                    emailTextInputRef = input;
                  }}
                  // onChangeText={text => setEmail(text)}
                  onSubmitEditing={() => {
                    // @ts-ignore
                    passwordTextInputRef.focus();
                  }}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="email-address"
                  placeholder="Email Address"
                  value={email}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                /> */}
                <OTPInputView
                  style={{height: 80}}
                  pinCount={6}
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

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="Verify"
                  onPress={() => {
                    onOtpPress();
                  }}
                  // disable={true}
                />
              </Wrap>

              <Wrap autoMargin={false}>
                <Row
                  autoMargin={false}
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Typography
                    size={16}
                    text="I didn't receive the code, "
                    color={Theme.colors.black}
                  />

                  <Typography
                    size={16}
                    text="Resend"
                    style={{
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      onResendOtpPress();
                    }}
                  />
                </Row>
              </Wrap>

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Typography
                  size={13}
                  text={'Back to login'}
                  style={{textAlign: 'center', textDecorationLine: 'underline'}}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                  onPress={() => {
                    NavigationService.pop(2);
                  }}
                />
              </Wrap>
            </Wrap>
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Copyright />
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
