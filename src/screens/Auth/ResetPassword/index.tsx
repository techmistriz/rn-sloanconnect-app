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
import Input from 'src/components/InputPaper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import VectorIcon from 'src/components/VectorIcon';
import I18n from 'src/locales/Transaltions';

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

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
                text={I18n.t('reset_password.TITLE_RESET_YOUR_PASSWORD')}
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />

              <Typography
                size={14}
                text={`${I18n.t(
                  'reset_password.LABEL_PLZ_PROVIDE_NEW_PASSWORD',
                )} ${email}`}
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
                  placeholder={I18n.t('reset_password.LABEL_PASSWORD')}
                  value={password}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  secureTextEntry={!showPassword}
                  right={
                    <VectorIcon
                      iconPack="Feather"
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={Theme.colors.primaryColor}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  }
                  rightStyle={{right: 0}}
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
                  placeholder={I18n.t('reset_password.LABEL_CONFIRM_PASSWORD')}
                  value={passwordConfirmation}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                  secureTextEntry={!showPasswordConfirmation}
                  right={
                    <VectorIcon
                      iconPack="Feather"
                      name={showPasswordConfirmation ? 'eye-off' : 'eye'}
                      size={20}
                      color={Theme.colors.primaryColor}
                      onPress={() => {
                        setShowPasswordConfirmation(!showPasswordConfirmation);
                      }}
                    />
                  }
                  rightStyle={{right: 0}}
                />
              </Wrap>

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Typography
                  size={13}
                  text={I18n.t('reset_password.LABEL_PASSWORD_REQUIREMENT')}
                  style={{
                    textAlign: 'left',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontBold}
                />

                <Typography
                  size={11}
                  text={I18n.t('reset_password.LABEL_PASSWORD_CONDITION1')}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={I18n.t('reset_password.LABEL_PASSWORD_CONDITION2')}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={I18n.t('reset_password.LABEL_PASSWORD_CONDITION3')}
                  style={{
                    textAlign: 'left',
                    marginBottom: 5,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontLight}
                />
                <Typography
                  size={11}
                  text={I18n.t('reset_password.LABEL_PASSWORD_CONDITION4')}
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
                  title={I18n.t('reset_password.BTN_RESET_PASSWORD')}
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
            {!isKeyboardVisible ? <Copyright /> : null}
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
