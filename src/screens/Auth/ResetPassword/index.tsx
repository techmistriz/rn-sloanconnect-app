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
  isValidPassword,
  showSimpleAlert,
  isValidEmail,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {resetPasswordRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import VectorIcon from 'src/components/VectorIcon';
import Network from 'src/network/Network';

/**Reset Password Screen Component */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {type, email, otp} = route?.params;
  const {loading} = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );

  // const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  /**component hooks method */
  useEffect(() => {}, []);

  /**action for reset password */
  const onResetPasswordPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email.trim(),
        otp: otp,
        password: password.trim(),
      };
      const options = {
        type: type,
        referrer: 'ResetPasswordScreen',
      };

      dispatch(resetPasswordRequestAction(payload, options));
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
    } else if (password.trim().length < 10) {
      showSimpleAlert('Password must contain at least 10 characters.');
      return false;
    } else if (!isValidPassword(password)) {
      showSimpleAlert(
        'Password should contain atleast 2 numbers, 1 special character',
      );
      return false;
    } else if (password != cpassword) {
      showSimpleAlert('Confirm password should be same as password');
      return false;
    } else {
      return true;
    }
  };

  /**component render method */
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
            text="Reset Password"
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
            text={`Enter your new password  \n  to reset password`}
            style={{textAlign: 'center'}}
            color={Theme.colors.secondaryColor}
          />

          <Wrap autoMargin={false} style={styles.formWrapper}>
            <Wrap autoMargin={false} style={styles.inputWrapper}>
              <Input
                onRef={input => {
                  // @ts-ignore
                  passwordTextInputRef = input;
                }}
                onChangeText={text => setPassword(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  cpasswordTextInputRef.focus();
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="default"
                placeholder="New Password"
                secureTextEntry={true}
                value={password}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
                placeholderTextColor={Theme.colors.inputPlaceholderColor}
              />
              <Typography
                size={14}
                text={`10 character minimum\n 2 numbers \n 1 special character`}
                style={{
                  textAlign: 'left',
                }}
                color={Theme.colors.secondaryColor}
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.inputWrapper}>
              <Input
                onRef={input => {
                  // @ts-ignore
                  cpasswordTextInputRef = input;
                }}
                onChangeText={text => setCpassword(text)}
                onSubmitEditing={() => {
                  onResetPasswordPress();
                }}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="default"
                placeholder="Re-enter new password"
                secureTextEntry={true}
                value={cpassword}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
                placeholderTextColor={Theme.colors.inputPlaceholderColor}
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
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
