import React, {useEffect, useState} from 'react';
import {Image, Keyboard} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Input from 'src/components/InputPaper';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, KeyboardAvoidWrap} from 'src/components/Common';
import {styles} from './styles';
import {
  consoleLog,
  showSimpleAlert,
  isValidEmail,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {loginRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import VectorIcon from 'src/components/VectorIcon';
import Header from 'src/components/Header';
import I18n from 'src/locales/Transaltions';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // const [email, setEmail] = useState(__DEV__ ? 'deepakmaurya@hotmail.com' : '');
  // const [password, setPassword] = useState(__DEV__ ? 'Maurya@2019' : '');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState(__DEV__ ? 'pk836746+11@gmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '123456' : '');

  /** Function comment */
  useEffect(() => {
    consoleLog('AuthReducer Login Screen==>', {loading, settings});
    checkIfComeFromUnauthenticated();
  }, []);

  /** Function comment */
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

  /** Function comment */
  const checkIfComeFromUnauthenticated = () => {
    if (referrer === 'Unauthenticated') {
      dispatch(loginResetDataAction());
      dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  /** Function comment */
  const onLoginPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email.trim(),
        password: password.trim(),
        source: 'sloan',
      };

      const options = {
        referrer: 'Login',
      };
      dispatch(loginRequestAction(payload, options));
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
    } else if (password.trim() == '') {
      showSimpleAlert('Please enter your password');
      return false;
    } else if (password.trim().length < 6) {
      showSimpleAlert('Password must contain at least minimum 6 characters.');
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
      <KeyboardAvoidWrap>
        <Wrap autoMargin={false} style={styles.container}>
          <Wrap autoMargin={false} style={styles.sectionContainer}>
            <Wrap autoMargin={false} style={styles.section1}>
              <Wrap autoMargin={false} style={styles.imageContainer}>
                <Image
                  source={getImgSource(Images?.appLogoWithText)}
                  style={{width: '50%', height: 80}}
                  resizeMode="contain"
                />

                {/* <Image
                source={getImgSource(Images?.appLogo)}
                style={{width: '60%'}}
                resizeMode="contain"
              />
              <Typography
                size={14}
                text="Water Connect Us"
                style={{textAlign: 'left', marginTop: -10}}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontRegular}
              /> */}
              </Wrap>

              <Wrap autoMargin={false} style={styles.formWrapper}>
                <Typography
                  size={20}
                  text={I18n.t('login.TITLE_LOGIN')}
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      emailTextInputRef = input;
                    }}
                    onChangeText={text => setEmail(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      passwordTextInputRef.focus();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="email-address"
                    placeholder={I18n.t('login.LABEL_EMAIL')}
                    value={email}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
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
                      // onLoginPress();
                    }}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder={I18n.t('login.LABEL_PASSWORD')}
                    value={password}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    placeholderTextColor={Theme.colors.inputPlaceholderColor}
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
                  <Typography
                    size={12}
                    text={I18n.t('login.LABEL_FORGOT_YOUR_PASSWORD')}
                    style={{
                      textAlign: 'right',
                      textDecorationLine: 'underline',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      navigation.navigate('ForgotPassword');
                    }}
                  />
                </Wrap>

                <Wrap
                  autoMargin={false}
                  style={[styles.inputWrapper, {marginTop: 10}]}>
                  <Button
                    title={I18n.t('login.BTN_LOGIN')}
                    onPress={() => {
                      onLoginPress();
                    }}
                    // disable={true}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                  <Typography
                    size={12}
                    text={I18n.t('login.LABEL_DONT_HAVE_ANY_ACCOUNT')}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.darkGray}
                    ff={Theme.fonts.ThemeFontRegular}
                  />

                  <Typography
                    size={13}
                    text={I18n.t('login.LABEL_REGISTER_HERE')}
                    style={{
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      NavigationService.navigate('Register');
                    }}
                  />
                </Wrap>

                {/* <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Typography
                  size={13}
                  text={'Verify Email'}
                  style={{textAlign: 'center', textDecorationLine: 'underline'}}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                  onPress={() => {
                    NavigationService.navigate('VerifyEmail');
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
      </KeyboardAvoidWrap>
    </AppContainer>
  );
};

export default Index;
