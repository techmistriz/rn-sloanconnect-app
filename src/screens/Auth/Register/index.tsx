import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  Platform,
  Keyboard,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Input from 'src/components/Input';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {styles} from './styles';
import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
  showConfirmAlert,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {
  signupRequestAction,
  boimetricLoginRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import VectorIcon from 'src/components/VectorIcon';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import CheckBox from '@react-native-community/checkbox';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.SignupReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  const [firstName, setFirstName] = useState(__DEV__ ? 'Pradeep' : '');
  const [lastName, setLastName] = useState(__DEV__ ? 'Kumar' : '');
  const [email, setEmail] = useState(__DEV__ ? 'pk836746+5@gmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '123456' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? '123456' : '',
  );
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener('TermsAcceptEvent', eventData =>
      TermsAcceptEventCallback(eventData),
    );
    return () => {
      DeviceEventEmitter.removeAllListeners('TermsAcceptEvent');
    };
  }, []);

  const TermsAcceptEventCallback = (eventData: any) => {
    if (eventData?.termsAccept) {
      setTerms(true);
    }
  };

  const onRegisterPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        password: password.trim(),
        password_confirmation: passwordConfirmation,
        terms: terms ? 'yes' : 'no',
        source: 'sloan',
      };

      const options = {
        referrer: 'RegisterScreen',
      };
      dispatch(signupRequestAction(payload, options));
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    const checkEmail = isValidEmail(email);
    if (firstName.trim() === '') {
      showSimpleAlert('Please enter your first name');
      return false;
    } else if (lastName.trim() === '') {
      showSimpleAlert('Please enter your last name');
      return false;
    } else if (email.trim() === '') {
      showSimpleAlert('Please enter your email');
      return false;
    } else if (!checkEmail) {
      showSimpleAlert('Please enter valid email');
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
    } else if (!terms) {
      showSimpleAlert('Please agree our terms and condition');
      return false;
    } else {
      return true;
    }
  };

  return (
    <AppContainer
      scroll={false}
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
                text="Register"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <ScrollView>
                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      firstNameTextInputRef = input;
                    }}
                    onChangeText={text => setFirstName(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      lastNameTextInputRef.focus();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="First Name"
                    value={firstName}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      lastNameTextInputRef = input;
                    }}
                    onChangeText={text => setLastName(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      emailTextInputRef.focus();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Last Name"
                    value={lastName}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>

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
                    keyboardType="default"
                    placeholder="Email"
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
                      onRegisterPress();
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
              </ScrollView>

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Row
                  autoMargin={false}
                  style={{
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    style={{borderRadius: 20, marginTop: 3}}
                    disabled={false}
                    value={terms}
                    onValueChange={newValue => setTerms(newValue)}
                    tintColors={{
                      true: Theme.colors.primaryColor,
                      false: Theme.colors.black,
                    }}
                  />
                  <Typography
                    size={12}
                    text={'I have read and agree to these '}
                    style={{
                      textAlign: 'left',
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      setTerms(!terms);
                    }}
                  />
                  <Typography
                    size={12}
                    text={'Terms'}
                    style={{
                      textAlign: 'left',
                      textDecorationLine: 'underline',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      NavigationService.navigate('Terms');
                    }}
                  />
                </Row>
              </Wrap>

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 0}]}>
                <Button
                  title="Next"
                  onPress={() => {
                    onRegisterPress();
                  }}
                />
              </Wrap>

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Typography
                  size={12}
                  text={`Already have an account?`}
                  style={{textAlign: 'center'}}
                  color={Theme.colors.darkGray}
                />

                <Typography
                  size={13}
                  text={'Login Here'}
                  style={{
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                  onPress={() => {
                    NavigationService.goBack();
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
