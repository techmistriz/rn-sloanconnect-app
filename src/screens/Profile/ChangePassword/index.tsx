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
  getUserAPiPrefixByUserType,
  isValidPassword,
  showSimpleAlert,
  isValidEmail,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {
  changePasswordRequestAction,
  changePasswordFailureAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';

/**Reset Password Screen Component */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {loading, token, type} = useSelector(
    (state: any) => state?.AuthReducer,
  );

  // const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  /**component hooks method */
  useEffect(() => {}, []);

  /**action for change password */
  const onChangePasswordPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        old_password: oldPassword.trim(),
        password: password.trim(),
      };
      const options = {
        type: type,
        referrer: 'ChangePasswordScreen',
        token: token,
      };
      dispatch(changePasswordRequestAction(payload, options));
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    if (oldPassword.trim() === '') {
      showSimpleAlert('Please enter your old password');
      return false;
    } else if (password.trim() == '') {
      showSimpleAlert('Please enter your password');
      return false;
    } else if (password.trim().length < 10) {
      showSimpleAlert('Password must contain at least 10 characters.');
      return false;
    } else if (!isValidPassword(password)) {
      showSimpleAlert(
        'Password should contain atleast one number, one special character',
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
              source={getImgSource(Images?.appLogoTransparent)}
              style={{height: 200}}
              resizeMode="contain"
            />
          </Wrap>

          <Typography
            size={32}
            text="Change Password"
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
            text={`Enter your new password  \n  to change password`}
            style={{textAlign: 'center'}}
            color={Theme.colors.secondaryColor}
          />

          <Wrap autoMargin={false} style={styles.formWrapper}>
            <Wrap autoMargin={false} style={styles.inputWrapper}>
              <Input
                onRef={input => {
                  // @ts-ignore
                  oldpasswordTextInputRef = input;
                }}
                onChangeText={text => setOldPassword(text)}
                onSubmitEditing={() => {
                  // @ts-ignore
                  passwordTextInputRef.focus();
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="default"
                placeholder="Old password"
                secureTextEntry={true}
                value={oldPassword}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.textInput}
                placeholderTextColor={Theme.colors.inputPlaceholderColor}
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
                  cpasswordTextInputRef.focus();
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="default"
                placeholder="New password"
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
                  onChangePasswordPress();
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
                title="Change Password"
                onPress={() => {
                  onChangePasswordPress();
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
