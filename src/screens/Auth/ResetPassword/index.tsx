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
  isValidPassword,
} from 'src/utils/Helpers/HelperFunction';
import {
  otpRequestAction,
  resetPasswordRequestAction,
  verifyOtpRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import Input from 'src/components/Input';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const Index = ({route, navigation}: any) => {
  const {email, hash, otp} = route?.params;
  const dispatch = useDispatch();
  const {loading} = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );

  const [password, setPassword] = useState(__DEV__ ? 'Test@12345' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? 'Test@12345' : '',
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
        token: hash,
        password: password,
        password_confirmation: passwordConfirmation,
        source: 'sloan',
        verify_method: 'otp',
        otp: otp,
      };
      dispatch(resetPasswordRequestAction(payload));
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    if (password.trim() == '') {
      showSimpleAlert('Please enter your password');
      return false;
    } else if (password.trim().length < 8) {
      showSimpleAlert('Password must contain at least minimum 8 characters');
      return false;
    } else if (passwordConfirmation.trim() == '') {
      showSimpleAlert('Please enter your confirm password');
      return false;
    } else if (!isValidPassword(passwordConfirmation)) {
      showSimpleAlert('Please enter valid password');
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
                text="Reset Your Password"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />

              <Typography
                size={14}
                text={`Please provide new password for account ${email}`}
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.black}
                ff={Theme.fonts.ThemeFontLight}
              />

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
                <Typography
                  size={13}
                  text={`Password Requirements`}
                  style={{
                    textAlign: 'left',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontBold}
                />

                <Typography
                  size={11}
                  text={`At least 8 characters`}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={`A mixture of both uppercase and lowercase letters`}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={`A mixture of letters and numbers`}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={`Inclusive of at least one special charater, e.g., ! @ # ?`}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
              </Wrap>
              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="RESET PASSWORD"
                  onPress={() => {
                    onResetPasswordPress();
                  }}
                />
              </Wrap>

              {/* <Wrap autoMargin={false} style={[styles.inputWrapper]}>
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
              </Wrap> */}
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
