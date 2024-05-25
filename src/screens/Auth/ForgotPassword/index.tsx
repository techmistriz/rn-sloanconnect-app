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
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {forgotPasswordRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import VectorIcon from 'src/components/VectorIcon';
import Network from 'src/network/Network';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  // const {type} = route?.params;
  const {loading} = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );
  // const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {}, []);

  const onForgotPasswordPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email.trim(),
      };
      const options = {
        referrer: 'ForgotPasswordScreen',
      };
      dispatch(forgotPasswordRequestAction(payload, options));
    }
  };

  /**validation checking for email */
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

  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.section2}>
          <Wrap autoMargin={false} style={styles.imageContainer}>
            <Image
              source={getImgSource(Images?.appLogo)}
              style={{height: 200}}
              resizeMode="contain"
            />
          </Wrap>

          <Typography
            size={32}
            text="Forgot Password"
            style={{
              textAlign: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: {width: 0, height: 3},
              textShadowRadius: 10,
            }}
            color={Theme.colors.secondaryColor}
            ff={Theme.fonts.ThemeFontMedium}
          />

          <Typography
            size={18}
            text={`Enter your email`}
            style={{textAlign: 'center'}}
            color={Theme.colors.secondaryColor}
          />

          <Wrap autoMargin={false} style={styles.formWrapper}>
            <Wrap autoMargin={false} style={styles.inputWrapper}>
              <Input
                onRef={input => {
                  // @ts-ignore
                  emailTextInputRef = input;
                }}
                onChangeText={text => setEmail(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  onForgotPasswordPress();
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="Email Id"
                value={email}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
              />
            </Wrap>

            <Wrap
              autoMargin={false}
              style={[styles.inputWrapper, {marginTop: 10}]}>
              <Button
                title="Forgot Password"
                onPress={() => {
                  onForgotPasswordPress();
                }}
              />
            </Wrap>

            <Wrap
              autoMargin={false}
              style={[styles.inputWrapper, {marginTop: 10}]}>
              <Button
                title="Switch to "
                onPress={() => {
                  navigation.navigate('Login');
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: Theme.colors.white,
                }}
                textStyle={{
                  fontFamily: Theme.fonts.ThemeFontRegular,
                }}
                rightItem={
                  <Typography
                    size={18}
                    text={`Login`}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.secondaryColor}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                }
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
