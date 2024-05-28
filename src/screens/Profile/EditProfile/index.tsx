import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import {Button} from 'src/components/Button';
import Input from 'src/components/Input';
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

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {user, loading, token} = useSelector(
    (state: any) => state?.AuthReducer,
  );

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [title, setTitle] = useState(user?.first_name ?? '');
  const [company, setCompany] = useState(user?.last_name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(
    user?.user_metadata?.phone_number ?? '',
  );
  const [email, setEmail] = useState(user?.email ?? '');

  const [industry, setIndustry] = useState<any>();
  const [country, setCountry] = useState<any>();
  const [state, setState] = useState<any>();
  const [city, setCity] = useState<any>(user?.city ?? '');
  const [address, setAddress] = useState<any>(user?.address_line_1 ?? '');
  const [zip, setZip] = useState<any>(user?.zip ?? '');
  const [timezone, setTimezone] = useState<any>();

  const [industriesDropdownModal, setIndustriesDropdownModal] = useState(false);
  const [industriesMaster, setIndustriesMaster] = useState([]);
  const [timezonesDropdownModal, setTimezonesDropdownModal] = useState(false);
  const [timezonesMaster, setTimezonesMaster] = useState([]);
  const [countriesDropdownModal, setCountriesDropdownModal] = useState(false);
  const [countriesMaster, setCountriesMaster] = useState([]);
  const [statesDropdownModal, setStatesDropdownModal] = useState(false);
  const [statesMaster, setStatesMaster] = useState([]);

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
      const response: any = await Network('auth/sloan-register-data', 'GET');
      // consoleLog('getRegisterMasters response==>', response);

      if (response && !isObjectEmpty(response)) {
        if (response?.industries && response?.industries?.length) {
          const __industriesMaster: any = createNameValueArray(
            response?.industries,
          );
          // consoleLog('__industriesMaster==>', __industriesMaster);
          setIndustriesMaster(__industriesMaster);
          // const org_id = user?.account?.org_id;
          // if (org_id) {
          //   const org = findObject(org_id, __industriesMaster, {
          //     searchKey: 'name',
          //   });
          //   consoleLog('getMasters org==>', org);
          // }
        }

        if (response?.timezones && response?.timezones?.length) {
          setTimezonesMaster(response?.timezones);

          const timezone_id = user?.account?.timezone_id;
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

          const country_id = user?.account?.country_id;
          if (country_id) {
            const countryObj = findObject(country_id, response?.countries, {
              searchKey: 'id',
            });
            __setCountry(countryObj, true);
          }
        }
      } else {
      }
    } catch (error) {
      consoleLog('getRegisterMasters error==>', error);
      showToastMessage('Something went wrong!');
    } finally {
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
        source: 'sloan',
        timezone: timezone,
        user_metadata: user_metadata,
      };

      const options = {
        referrer: 'EditProfileScreen',
      };
      dispatch(userProfileRequestAction(payload, options));
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
    } else if (email.trim() === '') {
      showSimpleAlert('Please enter your email');
      return false;
    } else if (!checkEmail) {
      showSimpleAlert('Please enter valid email');
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
  const __setCountry = (item: any, setExistingState = false) => {
    setCountry(item);

    if (Array.isArray(item?.states) && item?.states?.length) {
      setStatesMaster(item?.states);
      if (setExistingState) {
        const state_id = user?.account?.state_id;
        if (state_id) {
          const stateObj = findObject(state_id, item?.states, {
            searchKey: 'id',
          });

          if (stateObj) {
            setState(stateObj);
          }
        }
      }
    } else {
      setStatesMaster([]);
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
      loading={loading}
      scrollViewStyle={{}}
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={true} style={styles.formWrapper}>
              <Typography
                size={20}
                text="Edit Profile"
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
                      countryTextInputRef.focus();
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
                      // onUpdateProfilePress();
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

              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 20}]}>
                <Button
                  title="Update"
                  onPress={() => {
                    onUpdateProfilePress();
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
