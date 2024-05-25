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
import {otpRequestAction, verifyOtpRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import Input from 'src/components/Input';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const Index = ({route, navigation}: any) => {
  const {email, hash} = route?.params;
  const dispatch = useDispatch();
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const __resetPasswordReducer = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );
  const __otpReducer = useSelector((state: any) => state?.OtpReducer);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState(__DEV__ ? 'Maurya@2019' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? 'Maurya@2019' : '',
  );

  useEffect(() => {
    consoleLog('AuthReducer ResetPassword Screen==>', {
      email,
      hash,
    });
    // consoleLog('ResetPasswordReducer OTP Screen==>', {__resetPasswordReducer});
  }, []);

  const onResetPasswordPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email,
        otp: otp,
        token: hash,
        password: password,
        password_confirmation: passwordConfirmation,
        source: 'sloan',
        verify_method: 'otp',
      };
      dispatch(verifyOtpRequestAction(payload));
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    if (otp.length == 0) {
      showSimpleAlert('Please enter your OTP');
      return false;
    } else if (password.trim() == '') {
      showSimpleAlert('Please enter your password');
      return false;
    } else if (password.trim().length < 6) {
      showSimpleAlert('Password must contain at least minimum 6 characters');
      return false;
    } else if (passwordConfirmation.trim() == '') {
      showSimpleAlert('Please enter your confirm password');
      return false;
    } else if (password.trim() !== passwordConfirmation.trim()) {
      showSimpleAlert('Password and confirm password should same');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer
      scroll={true}
      loading={loading}
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
                text="Reset Password"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />

              <Wrap autoMargin={false} style={styles.inputWrapper}>
                <OTPInputView
                  style={{height: 60}}
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
                    // @ts-ignore
                    passwordTextInputRef?.focus();
                    // consoleLog(`Code is ${code}, you are good to go!`);
                  }}
                />
              </Wrap>

              <Wrap autoMargin={false} style={styles.inputWrapper}>
                <Input
                  onRef={input => {
                    // @ts-ignore
                    passwordTextInputRef = input;
                  }}
                  onChangeText={text => setPassword(text)}
                  onSubmitEditing={() => {
                    // @ts-ignore
                    passwordConfirmationTextInputRef.focus();
                  }}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Password"
                  value={password}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  secureTextEntry={true}
                />
              </Wrap>

              <Wrap autoMargin={false} style={styles.inputWrapper}>
                <Input
                  onRef={input => {
                    // @ts-ignore
                    passwordConfirmationTextInputRef = input;
                  }}
                  onChangeText={text => setPasswordConfirmation(text)}
                  onSubmitEditing={() => {
                    // @ts-ignore
                    countryTextInputRef.focus();
                  }}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  secureTextEntry={true}
                />
              </Wrap>

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="Reset Password"
                  onPress={() => {
                    onResetPasswordPress();
                  }}
                />
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