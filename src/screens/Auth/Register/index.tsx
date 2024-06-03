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
      showSimpleAlert('Please enter your first name');
      return false;
    } else if (lastName.trim() === '') {
      showSimpleAlert('Please enter your last name');
      return false;
    } else if (title.trim() === '') {
      showSimpleAlert('Please enter your title');
      return false;
    } else if (company.trim() === '') {
      showSimpleAlert('Please enter your company');
      return false;
    } else if (industry?.name === '') {
      showSimpleAlert('Please select your industry');
      return false;
    } else if (phoneNumber.trim() === '') {
      showSimpleAlert('Please enter your phone number');
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
    } else if (country?.name === '') {
      showSimpleAlert('Please select your country');
      return false;
    } else if (statesMaster?.length > 0 && state?.name === '') {
      showSimpleAlert('Please select your state');
      return false;
    } else if (statesMaster?.length == 0 && stateInput?.trim() === '') {
      showSimpleAlert('Please select your state');
      return false;
    } else if (city.trim() === '') {
      showSimpleAlert('Please enter your city');
      return false;
    } else if (address.trim() === '') {
      showSimpleAlert('Please enter your address');
      return false;
    } else if (zip.trim() === '') {
      showSimpleAlert('Please enter your zipcode');
      return false;
    } else if (timezone?.format === '') {
      showSimpleAlert('Please enter your address');
      return false;
    } else if (!terms) {
      showSimpleAlert('Please agree our terms and condition');
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
      scroll={false}
      loading={loading || __loading}
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
                      titleTextInputRef.focus();
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
                    placeholder="Title"
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
                    placeholder="Company"
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
                    placeholder="Industry"
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
                    placeholder="Phone Number"
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
                    placeholder="Confirm Password"
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
                    placeholder="Country"
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
                      placeholder="State/Province"
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
                      placeholder="State/Province"
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
                    placeholder="City"
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
                    placeholder="Address"
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
                    placeholder="Zip/Postal"
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
                    placeholder="Timezone"
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

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Row
                  autoMargin={false}
                  style={{
                    marginBottom: 10,
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

          <DropdownPicker
            dialogVisible={industriesDropdownModal}
            setDialogVisible={() => setIndustriesDropdownModal(false)}
            title={'Select Industry'}
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
            title={'Select Country'}
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
            title={'Select State'}
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
            title={'Select Timezone'}
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
    </AppContainer>
  );
};

export default Index;
