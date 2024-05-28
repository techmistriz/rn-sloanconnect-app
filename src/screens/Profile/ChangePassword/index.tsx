import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {Button} from 'src/components/Button';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {showSimpleAlert} from 'src/utils/Helpers/HelperFunction';
import {useDispatch, useSelector} from 'react-redux';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import Input from 'src/components/Input';
import {changePasswordRequestAction} from 'src/redux/actions';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const [password, setPassword] = useState(__DEV__ ? '' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? '' : '',
  );

  useEffect(() => {}, []);

  const onChangePasswordPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        password: password,
        password_confirmation: passwordConfirmation,
      };
      dispatch(changePasswordRequestAction(payload));
    }
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    if (password.trim() == '') {
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
          <Wrap autoMargin={true} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Typography
                size={20}
                text="Change Password"
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
                  title="Change Password"
                  onPress={() => {
                    onChangePasswordPress();
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
