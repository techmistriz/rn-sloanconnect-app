import React, {useEffect, useState} from 'react';
import {Image, Keyboard} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Input from 'src/components/InputPaper';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {
  showSimpleAlert,
  isValidEmail,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {verifyEmailRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Copyright from 'src/components/@ProjectComponent/Copyright';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {loading} = useSelector((state: any) => state?.VerifyEmailReducer);
  const [email, setEmail] = useState(route?.params?.email ?? '');

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

  const onVerifyEmailPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const payload = {
        email: email.trim(),
        source: 'sloan',
        verify_method: 'otp',
      };
      const options = {
        referrer: 'VerifyEmail',
      };
      dispatch(verifyEmailRequestAction(payload, options));
    }
  };

  /**validation checking for email */
  const checkValidation = () => {
    const checkEmail = isValidEmail(email);
    if (email.trim() === '') {
      showSimpleAlert('Please enter your email address');
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
                text="Verify Email"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <Typography
                size={14}
                text="Enter your email to receive the verification code in your inbox."
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
                  placeholder="Email Address"
                  value={email}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textInput}
                />
              </Wrap>

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="VERIFY EMAIL"
                  onPress={() => {
                    onVerifyEmailPress();
                  }}
                  // disable={true}
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
                    NavigationService.goBack();
                  }}
                />
              </Wrap>
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
