import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import {Button} from 'src/components/Button';
import Input from 'src/components/InputPaper';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
} from 'src/utils/Helpers/HelperFunction';
import {
  createNameValueArray,
  findIndexObject,
  findObject,
  isObjectEmpty,
} from 'src/utils/Helpers/array';
import {userProfileRequestAction} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import VectorIcon from 'src/components/VectorIcon';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import DropdownPicker from 'src/components/DropdownPicker';
import Network from 'src/network/Network';
import constants from 'src/common/constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import I18n from 'src/locales/Transaltions';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {user, loading, token} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  const [__loading, __setLoading] = useState<boolean>(false);

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [title, setTitle] = useState(user?.user_metadata?.title ?? '');
  const [company, setCompany] = useState(user?.user_metadata?.company ?? '');
  const [phoneNumber, setPhoneNumber] = useState(
    user?.user_metadata?.phone_number ?? '',
  );
  const [stateInput, setStateInput] = useState<any>();
  const [industry, setIndustry] = useState<any>();
  const [country, setCountry] = useState<any>();
  const [state, setState] = useState<any>();
  const [city, setCity] = useState<any>(user?.user_metadata?.city ?? '');
  const [address, setAddress] = useState<any>(
    user?.user_metadata?.address ?? '',
  );
  const [zip, setZip] = useState<any>(user?.user_metadata?.zipcode ?? '');
  const [timezone, setTimezone] = useState<any>();
  const [password, setPassword] = useState(__DEV__ ? '' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    __DEV__ ? '' : '',
  );
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

  /**
   * Hooks method for keyboard listner
   */
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
   * Hooks method for getting master data for registration
   */
  useEffect(() => {
    getMasters();
  }, []);

  /**
   *
   */
  const getMasters = async () => {
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
          const industry = user?.user_metadata?.industry;
          if (industry) {
            const industryObj = findObject(industry, __industriesMaster, {
              searchKey: 'name',
            });
            if (!isObjectEmpty(industryObj)) {
              setIndustry(industryObj);
            }
            // consoleLog('getMasters industryObj==>', industryObj);
          }
        }

        if (response?.timezones && response?.timezones?.length) {
          setTimezonesMaster(response?.timezones);

          const timezone_id = user?.organizations?.[0]?.account?.timezone_id;
          if (timezone_id) {
            const timezonesObj = findObject(timezone_id, response?.timezones, {
              searchKey: 'id',
            });
            __setTimezone(timezonesObj);
          }
        }

        if (response?.countries && response?.countries?.length) {
          setCountriesMaster(response?.countries);
          // consoleLog('getMasters countries==>', response?.countries);

          const country = user?.user_metadata?.country;
          if (country) {
            const countryObj = findObject(country, response?.countries, {
              searchKey: 'name',
            });
            __setCountry(countryObj, true);
          }
        }
      } else {
      }
    } catch (error) {
      consoleLog('getRegisterMasters error==>', error);
      showToastMessage(I18n.t('common.SOMETHING_WENT_WRONG'));
    } finally {
      __setLoading(false);
    }
  };

  /**
   *
   */
  const onUpdateProfilePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const user_metadata = {
        title: title,
        company: company,
        industry: industry?.name,
        phone_number: phoneNumber,
        country: country?.name,
        state: statesMaster?.length > 0 ? state?.state_name : stateInput,
        city: city,
        address: address,
        zipcode: zip,
      };

      const payload = {
        first_name: firstName,
        last_name: lastName,
        source: 'sloan',
        new_password: password,
        timezone: timezone,
        user_metadata: user_metadata,
        organization: user?.organizations?.[0]?.account?.org_id ?? 0,
      };

      const options = {
        referrer: 'EditProfileScreen',
        token: token,
      };
      consoleLog('onUpdateProfilePress payload==>', JSON.stringify(payload));
      dispatch(userProfileRequestAction(payload, options));
    }
  };

  /**
   * validation checking for email and password
   */
  const checkValidation = () => {
    consoleLog('statestate==>', state);
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
    }

    let isPasswordFilled = password.trim().length;
    if (isPasswordFilled > 0) {
      if (password.trim() && password.trim().length < 6) {
        showSimpleAlert(I18n.t('register.VALIDATION_MSG_MINIMUM_PASSWORD'));
        return false;
      } else if (password.trim() && passwordConfirmation.trim() == '') {
        showSimpleAlert(
          I18n.t('register.VALIDATION_MSG_EMPTY_CONFIRM_PASSWORD'),
        );
        return false;
      } else if (password.trim() !== passwordConfirmation.trim()) {
        showSimpleAlert(I18n.t('register.VALIDATION_MSG_SAME_PASSWORD'));
        return false;
      }
    }

    return true;
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
  const __setCountry = (item: any, setExistingState = false) => {
    setCountry(item);
    const state_name = user?.user_metadata?.state ?? null;
    if (Array.isArray(item?.states) && item?.states?.length) {
      setStatesMaster(item?.states);
      if (setExistingState) {
        if (state_name) {
          const stateObj = findObject(state_name, item?.states, {
            searchKey: 'state_name',
          });

          if (stateObj) {
            setState(stateObj);
          }
        }
      }
    } else {
      setStatesMaster([]);
      setStateInput(state_name);
    }
  };

  /**
   * action for set country code from selection
   */
  const __setState = (item: any) => {
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
          <KeyboardAwareScrollView>
            <Wrap autoMargin={false} style={styles.section1}>
              <Wrap autoMargin={true} style={styles.formWrapper}>
                <Typography
                  size={20}
                  text={I18n.t('profile.EDIT_PROFILE_HEADING')}
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
                <Wrap
                  autoMargin={false}
                  style={{maxHeight: constants.screenHeightCalc / 1.75}}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={{flexGrow: 1}}
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
                        placeholder={`${I18n.t('register.LABEL_FIRST_NAME')}`}
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
                        placeholder={`${I18n.t('register.LABEL_LAST_NAME')}`}
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
                        placeholder={`${I18n.t('register.LABEL_JOB_TITLE')}`}
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
                        placeholder={`${I18n.t('register.LABEL_COMPANY')}`}
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
                        placeholder={`${I18n.t('register.LABEL_INDUSTRY')}`}
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
                          countryTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_PHONE_NUMBER')}`}
                        value={phoneNumber}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.textInput}
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
                          statesMaster?.length > 0
                            ? stateTextInputRef.focus()
                            : stateInputTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_COUNTRY')}`}
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
                          )}`}
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
                          )}`}
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
                        placeholder={`${I18n.t('register.LABEL_CITY')}`}
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
                        placeholder={`${I18n.t('register.LABEL_ADDRESS')}`}
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
                        placeholder={`${I18n.t('register.LABEL_ZIPCODE')}`}
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
                          // @ts-ignore
                          passwordTextInputRef.focus();
                        }}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t('register.LABEL_TIMEZONE')}`}
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

                    {/* <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Typography
                    size={13}
                    text="If you want to change the password please fill it, otherwise leave it blank"
                    style={{}}
                    // color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontMedium}
                  />
                </Wrap> */}

                    <Wrap autoMargin={false} style={styles.inputWrapper}>
                      <Typography
                        size={13}
                        text={`${I18n.t('profile.PASSWORD_CHANGE_MSG')}`}
                        style={{paddingLeft: 5}}
                        color={Theme.colors.darkGray}
                        ff={Theme.fonts.ThemeFontMedium}
                      />

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
                        placeholder={`${I18n.t('register.LABEL_PASSWORD')}`}
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
                          onUpdateProfilePress();
                        }}
                        returnKeyType="done"
                        blurOnSubmit={false}
                        keyboardType="default"
                        placeholder={`${I18n.t(
                          'register.LABEL_CONFIRM_PASSWORD',
                        )}`}
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
                  </ScrollView>
                </Wrap>

                <Wrap
                  autoMargin={false}
                  style={[styles.inputWrapper, {marginTop: 20}]}>
                  <Button
                    title={`${I18n.t('profile.UPDATE_PROFILE_BTN')}`}
                    onPress={() => {
                      onUpdateProfilePress();
                    }}
                  />
                </Wrap>
              </Wrap>
            </Wrap>
          </KeyboardAwareScrollView>
          <Wrap autoMargin={false} style={styles.section2}>
            {!isKeyboardVisible ? <Copyright /> : null}
          </Wrap>

          <DropdownPicker
            dialogVisible={industriesDropdownModal}
            setDialogVisible={() => setIndustriesDropdownModal(false)}
            title={`${I18n.t('register.LABEL_SELECT_INDUSTRY')}`}
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
            title={`${I18n.t('register.LABEL_SELECT_COUNTY')}`}
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
            title={`${I18n.t('register.LABEL_SELECT_STATE')}`}
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
            title={`${I18n.t('register.LABEL_SELECT_TIMEZONE')}`}
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
