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
  getUserAPiPrefixByUserType,
  showSimpleAlert,
  isValidEmail,
  showConfirmAlert,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {
  loginRequestAction,
  boimetricLoginRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import VectorIcon from 'src/components/VectorIcon';
import Copyright from 'src/components/@ProjectComponent/Copyright';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  const [email, setEmail] = useState(__DEV__ ? '' : '');
  const [password, setPassword] = useState(__DEV__ ? '' : '');
  const [isSensorAvailable, setIsSensorAvailable] = useState(false);

  useEffect(() => {
    consoleLog('AuthReducer Login Screen==>', {loading, settings});
    checkIfComeFromUnauthenticated();
  }, []);

  const checkIfComeFromUnauthenticated = () => {
    if (referrer === 'Unauthenticated') {
      dispatch(loginResetDataAction());
      dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  const onLoginPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email.trim(),
        password: password.trim(),
      };

      const options = {
        referrer: 'LoginScreen',
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
    <AppContainer scroll={false} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Image
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
              />
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
                    placeholder="Name"
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Title"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Company"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Industry"
                    // value={password}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    right={
                      <VectorIcon
                        iconPack="Feather"
                        name={'chevron-down'}
                        size={15}
                        color={Theme.colors.black}
                      />
                    }
                    rightStyle={{right: 0}}
                    editable={false}
                    onPress={() => {}}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      passwordTextInputRef = input;
                    }}
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="numeric"
                    placeholder="Phone Number"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Email Address"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Country"
                    // value={password}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    right={
                      <VectorIcon
                        iconPack="Feather"
                        name={'chevron-down'}
                        size={15}
                        color={Theme.colors.black}
                      />
                    }
                    rightStyle={{right: 0}}
                    editable={false}
                    onPress={() => {}}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      passwordTextInputRef = input;
                    }}
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="State Province"
                    // value={password}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    right={
                      <VectorIcon
                        iconPack="Feather"
                        name={'chevron-down'}
                        size={15}
                        color={Theme.colors.black}
                      />
                    }
                    rightStyle={{right: 0}}
                    editable={false}
                    onPress={() => {}}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      passwordTextInputRef = input;
                    }}
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="City"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Address"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="numeric"
                    placeholder="Zip / Postal Code"
                    // value={password}
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
                    // onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      // onLoginPress();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Timezone"
                    // value={password}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    right={
                      <VectorIcon
                        iconPack="Feather"
                        name={'chevron-down'}
                        size={15}
                        color={Theme.colors.black}
                      />
                    }
                    rightStyle={{right: 0}}
                    editable={false}
                    onPress={() => {}}
                  />
                </Wrap>
              </ScrollView>

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="Next"
                  onPress={() => {
                    onLoginPress();
                  }}
                />
              </Wrap>

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Typography
                  size={14}
                  text={`Already have an account?`}
                  style={{textAlign: 'center'}}
                  color={Theme.colors.black}
                />

                <Typography
                  size={15}
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
