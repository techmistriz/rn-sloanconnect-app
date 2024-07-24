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
import Input from 'src/components/InputPaper';
import InputBase from 'src/components/Input';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row, KeyboardAvoidWrap} from 'src/components/Common';
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
import {createNameValueArray, isObjectEmpty} from 'src/utils/Helpers/array';
import {constants} from 'src/common';
import {signupRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import VectorIcon from 'src/components/VectorIcon';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import CheckBox from '@react-native-community/checkbox';
import DropdownPicker from 'src/components/DropdownPicker';
import Network from 'src/network/Network';
import I18n from 'src/locales/Transaltions';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.SignupReducer);
  const [__loading, __setLoading] = useState<boolean>(false);

  const [firstName, setFirstName] = useState(__DEV__ ? 'Pradeep' : '');
  const [lastName, setLastName] = useState(__DEV__ ? 'Kumar' : '');
  const [title, setTitle] = useState(__DEV__ ? 'Mr' : '');
  const [company, setCompany] = useState(__DEV__ ? 'ABC' : '');
  const [phoneNumber, setPhoneNumber] = useState(__DEV__ ? '+1-91817161' : '');
  const [email, setEmail] = useState(__DEV__ ? 'pk836746+9@gmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '123456' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? '123456' : '',
  );
  const [stateInput, setStateInput] = useState<any>(
    __DEV__ ? 'Test state 2' : '',
  );

  const [industry, setIndustry] = useState<any>();
  const [country, setCountry] = useState<any>();
  const [state, setState] = useState<any>();
  const [city, setCity] = useState<any>(__DEV__ ? 'Test city 2' : '');
  const [address, setAddress] = useState<any>(__DEV__ ? 'Test address 2' : '');
  const [zip, setZip] = useState<any>(__DEV__ ? '444444' : '');
  const [timezone, setTimezone] = useState<any>();
  const [terms, setTerms] = useState<any>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [industriesDropdownModal, setIndustriesDropdownModal] = useState(false);
  const [industriesMaster, setIndustriesMaster] = useState([]);
  const [timezonesDropdownModal, setTimezonesDropdownModal] = useState(false);
  const [timezonesMaster, setTimezonesMaster] = useState([]);
  const [countriesDropdownModal, setCountriesDropdownModal] = useState(false);
  const [countriesMaster, setCountriesMaster] = useState([]);
  const [statesDropdownModal, setStatesDropdownModal] = useState(false);
  const [statesMaster, setStatesMaster] = useState([]);
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

  /**
   * Hooks method for TermsAccept Event
   */
  useEffect(() => {
    DeviceEventEmitter.addListener('TermsAcceptEvent', eventData => {
      if (eventData?.termsAccept) {
        setTerms(true);
      }
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('TermsAcceptEvent');
    };
  }, []);

  /**
   * Hooks method for getting master data for registration
   */
  useEffect(() => {
    getRegisterMasters();
  }, []);

  /**
   *
   */
  const getRegisterMasters = async () => {
    try {
      __setLoading(true);
      const response: any = await Network('auth/sloan-register-data', 'GET');
      // consoleLog('getRegisterMasters response==>', response);

      if (response && !isObjectEmpty(response)) {
        if (response?.industries && response?.industries?.length) {
          const __industriesMaster: any = createNameValueArray(
            response?.industries,
          );
          // consoleLog('__industriesMaster==>', __industriesMaster);
          setIndustriesMaster(__industriesMaster);
        }

        if (response?.timezones && response?.timezones?.length) {
          setTimezonesMaster(response?.timezones);
        }

        if (response?.countries && response?.countries?.length) {
          setCountriesMaster(response?.countries);
        }
      } else {
      }
    } catch (error) {
      consoleLog('getRegisterMasters error==>', error);
      showToastMessage('Something went wrong!');
    } finally {
      __setLoading(false);
    }
  };

  /**
   *
   */
  const onRegisterPress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const user_metadata = {
        title: title,
        company: company,
        industry: industry?.name,
        phone_number: phoneNumber,
        country: country?.id,
        state: state?.id,
        city: city,
        address: address,
        zipcode: zip,
      };

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        password: password.trim(),
        password_confirmation: passwordConfirmation,
        terms: terms ? 'yes' : 'no',
        source: 'sloan',
        verify_method: 'otp',
        timezone: timezone,
        user_metadata: user_metadata,
      };

      const options = {
        referrer: 'Register',
      };
      dispatch(signupRequestAction(payload, options));
    }
  };

  /**
   * validation checking for email and password
   */
  const checkValidation = () => {
    const checkEmail = isValidEmail(email);
    if (firstName.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_FIRST_NAME'));
      return false;
    } else if (lastName.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_LAST_NAME'));
      return false;
    } else if (title.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_JOB_TITLE'));
      return false;
    } else if (company.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_COMPANY'));
      return false;
    } else if (industry?.name === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_INDUSTRY'));
      return false;
    } else if (phoneNumber.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_PHONE_NUMBER'));
      return false;
    } else if (email.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_EMAIL'));
      return false;
    } else if (!checkEmail) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_VALID_EMAIL'));
      return false;
    } else if (password.trim() == '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_PASSWORD'));
      return false;
    } else if (password.trim().length < 6) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_MINIMUM_PASSWORD'));
      return false;
    } else if (passwordConfirmation.trim() == '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_CONFIRM_PASSWORD'));
      return false;
    } else if (password.trim() !== passwordConfirmation.trim()) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_SAME_PASSWORD'));
      return false;
    } else if (!country?.name) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_COUNTRY'));
      return false;
    } else if (statesMaster?.length > 0 && !state?.state_name) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_STATE'));
      return false;
    } else if (statesMaster?.length == 0 && stateInput?.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_STATE'));
      return false;
    } else if (city.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_CITY'));
      return false;
    } else if (address.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_ADDRESS'));
      return false;
    } else if (zip.trim() === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_ZIPCODE'));
      return false;
    } else if (timezone?.format === '') {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_TIMEZONE'));
      return false;
    } else if (!terms) {
      showSimpleAlert(I18n.t('register.VALIDATION_MSG_EMPTY_TERM'));
      return false;
    } else {
      return true;
    }
  };

  /**
   * action for set country code from selection
   */
  const __setIndustry = (item: any) => {
    // console.log('item', item);
    setIndustry(item);
  };

  /**
   * action for set country code from selection
   */
  const __setCountry = (item: any) => {
    // console.log('item', item);
    setCountry(item);

    if (Array.isArray(item?.states) && item?.states?.length) {
      setStatesMaster(item?.states);
    } else {
      setStatesMaster([]);
    }
  };

  /**
   * action for set country code from selection
   */
  const __setState = (item: any) => {
    // console.log('item', item);
    setState(item);
  };

  /**
   * action for set country code from selection
   */
  const __setTimezone = (item: any) => {
    // console.log('item', item);
    setTimezone(item);
  };

  return (
    <AppContainer
      // scroll={true}
      loading={loading || __loading}
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
              </Wrap>

              <Wrap autoMargin={false} style={styles.formWrapper}>
                <Typography
                  size={20}
                  text={I18n.t('register.TITLE_REGISTER')}
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
                <Wrap
                  autoMargin={false}
                  style={{maxHeight: constants.screenHeightCalc / 2.15}}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    // style={{flex: 1}}
                    contentContainerStyle={{}}>
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
                        placeholder={`${I18n.t('register.LABEL_FIRST_NAME')}*`}
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
                          titleTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_LAST_NAME')}*`}
                        value={lastName}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          titleTextInputRef = input;
                        }}
                        onChangeText={text => setTitle(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          companyTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_JOB_TITLE')}*`}
                        value={title}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          companyTextInputRef = input;
                        }}
                        onChangeText={text => setCompany(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          industryTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_COMPANY')}*`}
                        value={company}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          industryTextInputRef = input;
                        }}
                        onChangeText={text => setIndustry(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          phoneNumberTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_INDUSTRY')}*`}
                        value={industry?.name}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                        editable={false}
                        onPress={() => {
                          setIndustriesDropdownModal(true);
                        }}
                        right={
                          <VectorIcon
                            iconPack="Feather"
                            name={'chevron-down'}
                            size={15}
                            color={Theme.colors.primaryColor}
                          />
                        }
                        rightStyle={{right: 0}}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          phoneNumberTextInputRef = input;
                        }}
                        onChangeText={text => setPhoneNumber(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          emailTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t(
                          'register.LABEL_PHONE_NUMBER',
                        )}*`}
                        value={phoneNumber}
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
                        placeholder={`${I18n.t('register.LABEL_EMAIL')}*`}
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
                        placeholder={`${I18n.t('register.LABEL_PASSWORD')}*`}
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
                        placeholder={`${I18n.t(
                          'register.LABEL_CONFIRM_PASSWORD',
                        )}*`}
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
                              setShowPasswordConfirmation(
                                !showPasswordConfirmation,
                              );
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
                          countryTextInputRef = input;
                        }}
                        onChangeText={text => setCountry(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          stateTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_COUNTRY')}*`}
                        value={country?.name}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                        editable={false}
                        onPress={() => {
                          setCountriesDropdownModal(true);
                        }}
                        right={
                          <VectorIcon
                            iconPack="Feather"
                            name={'chevron-down'}
                            size={15}
                            color={Theme.colors.primaryColor}
                          />
                        }
                        rightStyle={{right: 0}}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      {statesMaster?.length > 0 ? (
                        <Input
                          onRef={input => {
                            // @ts-ignore
                            stateTextInputRef = input;
                          }}
                          onChangeText={text => setState(text)}
                          onSubmitEditing={() => {
                            // @ts-ignore
                            cityTextInputRef.focus();
                          }}
                          returnKeyType="next"
                          blurOnSubmit={false}
                          keyboardType="default"
                          placeholder={`${I18n.t(
                            'register.LABEL_STATE_PROVINCE',
                          )}*`}
                          value={state?.state_name}
                          inputContainerStyle={styles.inputContainer}
                          inputStyle={styles.textInput}
                          editable={false}
                          onPress={() => {
                            setStatesDropdownModal(true);
                          }}
                          right={
                            <VectorIcon
                              iconPack="Feather"
                              name={'chevron-down'}
                              size={15}
                              color={Theme.colors.primaryColor}
                            />
                          }
                          rightStyle={{right: 0}}
                        />
                      ) : (
                        <Input
                          onRef={input => {
                            // @ts-ignore
                            stateInputTextInputRef = input;
                          }}
                          onChangeText={text => setStateInput(text)}
                          onSubmitEditing={() => {
                            // @ts-ignore
                            cityTextInputRef.focus();
                          }}
                          returnKeyType="next"
                          blurOnSubmit={false}
                          keyboardType="default"
                          placeholder={`${I18n.t(
                            'register.LABEL_STATE_PROVINCE',
                          )}*`}
                          value={stateInput}
                          inputContainerStyle={styles.inputContainer}
                          inputStyle={styles.textInput}
                        />
                      )}
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          cityTextInputRef = input;
                        }}
                        onChangeText={text => setCity(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          addressTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_CITY')}*`}
                        value={city}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          addressTextInputRef = input;
                        }}
                        onChangeText={text => setAddress(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          zipTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_ADDRESS')}*`}
                        value={address}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          zipTextInputRef = input;
                        }}
                        onChangeText={text => setZip(text)}
                        onSubmitEditing={() => {
                          // @ts-ignore
                          timezoneTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_ZIPCODE')}*`}
                        value={zip}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                      />
                    </Wrap>

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Input
                        onRef={input => {
                          // @ts-ignore
                          timezoneTextInputRef = input;
                        }}
                        onChangeText={text => setTimezone(text)}
                        onSubmitEditing={() => {
                          // onRegisterPress();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_TIMEZONE')}*`}
                        value={timezone?.format}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
                        editable={false}
                        onPress={() => {
                          setTimezonesDropdownModal(true);
                        }}
                        right={
                          <VectorIcon
                            iconPack="Feather"
                            name={'chevron-down'}
                            size={15}
                            color={Theme.colors.primaryColor}
                          />
                        }
                        rightStyle={{right: 0}}
                      />
                    </Wrap>
                  </ScrollView>
                </Wrap>

                <Wrap
                  autoMargin={false}
                  style={[styles.inputWrapper, {marginBottom: 10}]}>
                  <Row
                    autoMargin={false}
                    style={{
                      marginBottom: 0,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <CheckBox
                      style={{
                        borderRadius: 20,
                        marginTop: 3,
                        height: 40,
                        width: 40,
                        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                      }}
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
                      text={`${I18n.t('register.LABEL_TERM')}`}
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
                      text={`${I18n.t('register.LABEL_TERM_LINK')}`}
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

                <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                  <Button
                    title={I18n.t('register.BTN_REGISTER')}
                    onPress={() => {
                      onRegisterPress();
                    }}
                  />
                </Wrap>

                <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                  <Typography
                    size={12}
                    text={I18n.t('register.LABEL_ALREADY_HAVE_AN_ACCOUNT')}
                    style={{textAlign: 'center'}}
                    color={Theme.colors.darkGray}
                  />

                  <Typography
                    size={13}
                    text={I18n.t('register.LABEL_RETURN_TO_LOGIN')}
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
              {!isKeyboardVisible ? <Copyright /> : null}
            </Wrap>

            <DropdownPicker
              dialogVisible={industriesDropdownModal}
              setDialogVisible={() => setIndustriesDropdownModal(false)}
              title={I18n.t('register.LABEL_SELECT_INDUSTRY')}
              data={industriesMaster}
              onSelectedItem={(item: any) => {
                setIndustriesDropdownModal(false);
                __setIndustry(item);
              }}
              dropdownSelectedItem={industry?.value}
              dropdownKeyValue={{id: 'value', title: 'name'}}
            />

            <DropdownPicker
              dialogVisible={countriesDropdownModal}
              setDialogVisible={() => setCountriesDropdownModal(false)}
              title={I18n.t('register.LABEL_SELECT_COUNTY')}
              data={countriesMaster}
              onSelectedItem={(item: any) => {
                setCountriesDropdownModal(false);
                __setCountry(item);
              }}
              dropdownSelectedItem={country?.id}
              dropdownKeyValue={{id: 'id', title: 'name'}}
            />

            <DropdownPicker
              dialogVisible={statesDropdownModal}
              setDialogVisible={() => setStatesDropdownModal(false)}
              title={I18n.t('register.LABEL_SELECT_STATE')}
              data={statesMaster}
              onSelectedItem={(item: any) => {
                setStatesDropdownModal(false);
                __setState(item);
              }}
              dropdownSelectedItem={state?.id}
              dropdownKeyValue={{id: 'id', title: 'state_name'}}
            />

            <DropdownPicker
              dialogVisible={timezonesDropdownModal}
              setDialogVisible={() => setTimezonesDropdownModal(false)}
              title={I18n.t('register.LABEL_SELECT_TIMEZONE')}
              data={timezonesMaster}
              onSelectedItem={(item: any) => {
                setTimezonesDropdownModal(false);
                __setTimezone(item);
              }}
              dropdownSelectedItem={state?.id}
              dropdownKeyValue={{id: 'id', title: 'format'}}
            />
          </Wrap>
        </Wrap>
      </KeyboardAvoidWrap>
    </AppContainer>
  );
};

export default Index;
