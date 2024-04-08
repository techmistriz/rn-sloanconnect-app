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
import {constants} from 'src/common';
import {
  parseDateHumanFormat,
  showToastMessage,
  consoleLog,
  getUserAPiPrefixByUserType,
  isValidEmail,
  showSimpleAlert,
  setValue,
  setValueIdFromArray,
  findObjectFromObjectArray,
  getNameByType,
  getImgSource,
  assetsBaseUrl,
} from 'src/utils/Helpers/HelperFunction';
import Network, {ResponseType} from 'src/network/Network';
import ImagePickerWhatsapp from 'src/components/ImagePickerWhatsapp';
import DateTimePicker from 'src/components/DateTimePicker';
import VectorIcon from 'src/components/VectorIcon';
import {useDispatch, useSelector} from 'react-redux';
import DropdownPicker from 'src/components/DropdownPicker';
import {genders, countryCodes} from 'src/utils/StaticData/StaticData';
import {userProfileRequestAction} from 'src/redux/actions';
import {
  checkCameraGalleryPermissions,
  requestCameraGalleryPermissions,
  permissionDeniedBlockedAlert,
  PERMISSIONS_RESULTS,
} from 'src/utils/Permissions';

/**Signup Screen Component */
const Index = ({route, navigation}: any) => {
  const {referrer} = route?.params;
  const dispatch = useDispatch();
  const {token, user, type, loading} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  const [parentName, setParentName] = useState(setValue(user?.name));
  // const [parentBirthday, setParentBirthday] = useState(
  //   parseDateHumanFormat(user?.dob),
  // );
  const [parentGender, setParentGender] = useState(
    findObjectFromObjectArray(user?.gender, genders, {
      searchKey: 'name',
    }),
  );
  const [countryDropdownModal, setCountryDropdownModal] = useState(false);
  const [countryCode, setCountryCode]: any = useState(
    findObjectFromObjectArray(user?.country_code, countryCodes, {
      searchKey: 'code',
    }),
  );
  const [parentContact, setParentContact] = useState(setValue(user?.contact));
  const [photo, setPhoto]: any = useState();
  const [genderDropdownModal, setGenderDropdownModal] = useState(false);
  const [parentBirthdayDatePickerModal, setBirthdateDatePickerModal] =
    useState(false);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [therapistName, setTherapistName] = useState(setValue(user?.name));
  const [therapistPracticeState, setTherapistPracticeState] = useState(
    setValue(user?.practice_state),
  );
  const [degree, setDegree] = useState(setValue(user?.degree));
  const [fallback, setFallback] = useState(false);

  /**component hooks method */
  useEffect(() => {
    // consoleLog('user', {user, type});
    setHeaderTtitle();
    manageRequirePermissions();
  }, []);

  /** Funcation for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    const checkPermissionStatus = await checkCameraGalleryPermissions();
    if (checkPermissionStatus == PERMISSIONS_RESULTS.DENIED) {
      await requestCameraGalleryPermissions();
    } else if (checkPermissionStatus == PERMISSIONS_RESULTS.BLOCKED) {
      permissionDeniedBlockedAlert();
    }
  };

  /**action for setup dynamic header title*/
  const setHeaderTtitle = () => {
    navigation.setOptions({
      title: referrer == 'RegisterScreen' ? 'Create Profile' : 'Update Profile',
    });
  };

  /**action for update user profile */
  const onSavePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      const options = {
        type: type,
        token: token,
        referrer: referrer,
      };

      let payload = new FormData();
      payload.append('name', parentName);
      // payload.append('dob', parentBirthday);
      // payload.append('gender', parentGender?.name);
      payload.append('contact', parentContact);
      payload.append('type', type);
      payload.append('country_code', countryCode?.code ?? null);

      if (photo && typeof photo?.uri != 'undefined') {
        payload.append('user_image', {
          uri: photo?.uri,
          name: photo?.fileName,
          type: photo?.type,
        });
      }

      dispatch(userProfileRequestAction(payload, options));
    }
  };

  /**action for update therapist profile */
  const onTherapistSavePress = () => {
    Keyboard.dismiss();
    const checkValid = checkValidationForTherapist();
    if (checkValid) {
      const options = {
        type: type,
        token: token,
        referrer: referrer,
      };

      let payload = new FormData();
      payload.append('name', therapistName);
      payload.append('practice_state', therapistPracticeState);
      payload.append('degree', degree);

      if (photo && typeof photo?.uri != 'undefined') {
        payload.append('user_image', {
          uri: photo?.uri,
          name: photo?.fileName,
          type: photo?.type,
        });
      }

      dispatch(userProfileRequestAction(payload, options));
    }
  };

  /**action for set gender from selection */
  const __setParentGender = (item: any) => {
    setParentGender(item);
  };
  const __setCountryCode = (item: any) => {
    // console.log('item', item);
    setCountryCode(item);
  };

  /**validation checking for email and password */
  const checkValidation = () => {
    if (parentName == '') {
      showSimpleAlert('Please enter your name');
      return false;
    } else if (parentContact == '') {
      showSimpleAlert('Please enter your mobile number');
      return false;
    } else {
      return true;
    }
  };

  /**validation checking for email and password */
  const checkValidationForTherapist = () => {
    if (therapistName.trim() == '') {
      showSimpleAlert('Please enter your name');
      return false;
    } else if (therapistPracticeState.trim() == '') {
      showSimpleAlert('Please enter your practice state');
      return false;
    } else {
      return true;
    }
  };

  /**component render method */
  return (
    <AppContainer scroll={true} loading={loading}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.section1}>
          <Wrap autoMargin={false} style={styles.parentItem}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Wrap autoMargin={false}>
                {photo && photo?.uri ? (
                  <Image
                    source={getImgSource(photo?.uri)}
                    style={styles.parentImage}
                  />
                ) : fallback == false && user && user?.user_image ? (
                  <Image
                    source={getImgSource(
                      `${assetsBaseUrl()}${getNameByType(type)}/${
                        user?.user_image
                      }`,
                    )}
                    style={[styles.parentImage]}
                    resizeMode="contain"
                    onError={() => {
                      // setFallback(true);
                    }}
                  />
                ) : (
                  <Image
                    source={getImgSource(Images?.imgHolder)}
                    style={styles.parentImage}
                  />
                )}

                <Wrap
                  autoMargin={false}
                  style={styles.parentImageEditContainer}>
                  <VectorIcon
                    iconPack="MaterialCommunityIcons"
                    name={'pencil'}
                    size={20}
                    color={Theme.colors.primaryColor}
                    onPress={() => {
                      setImagePickerModal(true);
                    }}
                  />
                </Wrap>
              </Wrap>
            </Wrap>

            {type == 1 ? (
              <Wrap autoMargin={false} style={styles.formWrapper}>
                {/* <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    placeholder="Email"
                    value={user.email}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    placeholderTextColor={Theme.colors.inputPlaceholderColor}
                    editable={false}
                  />
                </Wrap> */}

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      nameTextInputRef = input;
                    }}
                    onChangeText={text => setParentName(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      parentContactTextInputRef.focus();
                      // Keyboard.dismiss();
                    }}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder={`${
                      type == 1 ? 'Parent Name' : 'Therapist Name'
                    }`}
                    value={parentName}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>

                {/* <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      parentGenderTextInputRef = input;
                    }}
                    onChangeText={text => setParentGender(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      parentContactTextInputRef.focus();
                    }}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder="Gender"
                    value={parentGender?.name || ''}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    placeholderTextColor={Theme.colors.inputPlaceholderColor}
                    editable={false}
                    onPress={() => {
                      setGenderDropdownModal(true);
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
                </Wrap> */}

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Row autoMargin={false}>
                    {/* <Input
                      onRef={input => {
                        // @ts-ignore
                        countryCodeTextInputRef = input;
                      }}
                      onChangeText={keys => setCountryCode(keys)}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      keyboardType="numeric"
                      placeholder="e.g. +1"
                      value={countryCode?.code}
                      editable={false}
                      inputContainerStyle={[
                        styles.inputContainer,
                        {
                          // width: '100%',
                        },
                      ]}
                      inputStyle={styles.textInput}
                      onPress={() => {
                        setCountryDropdownModal(true);
                      }}
                      right={
                        <VectorIcon
                          iconPack="Feather"
                          name={'chevron-down'}
                          size={15}
                          color={Theme.colors.primaryColor}
                        />
                      }
                      rightStyle={{right: -5}}
                    /> */}
                    <Input
                      onRef={input => {
                        // @ts-ignore
                        parentContactTextInputRef = input;
                      }}
                      onChangeText={text => setParentContact(text)}
                      onSubmitEditing={() => {
                        // @ts-ignore
                        Keyboard.dismiss();
                        onSavePress();
                      }}
                      returnKeyType="done"
                      blurOnSubmit={false}
                      keyboardType="numeric"
                      placeholder="Mobile Number"
                      value={parentContact}
                      inputContainerStyle={[
                        styles.inputContainer,
                        // {width: '65%', marginLeft: 10},
                      ]}
                      inputStyle={styles.textInput}
                      placeholderTextColor={Theme.colors.inputPlaceholderColor}
                    />
                  </Row>
                </Wrap>
              </Wrap>
            ) : (
              <Wrap autoMargin={false} style={styles.formWrapper}>
                {/* <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    placeholder="Email"
                    value={user.email}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    placeholderTextColor={Theme.colors.inputPlaceholderColor}
                    editable={false}
                  />
                </Wrap> */}

                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      therapistNameTextInputRef = input;
                    }}
                    onChangeText={text => setTherapistName(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      therapistPracticeStateTextInputRef.focus();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder={`Therapist Name`}
                    value={therapistName}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>
                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      therapistPracticeStateTextInputRef = input;
                    }}
                    onChangeText={text => setTherapistPracticeState(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      therapistDegreeTextInputRef.focus();
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder={`Therapist Practice State`}
                    value={therapistPracticeState}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>
                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      therapistDegreeTextInputRef = input;
                    }}
                    onChangeText={text => setDegree(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      onTherapistSavePress();
                    }}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    keyboardType="default"
                    placeholder={`Degree`}
                    value={degree}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                  />
                </Wrap>
              </Wrap>
            )}

            {/* <DateTimePicker
              mode="date"
              display={constants.isIOS ? 'spinner' : 'default'}
              modalVisible={parentBirthdayDatePickerModal}
              onDateSelectChange={(selectedDate: any, event: any) => {
                if (event?.type == 'dismissed') {
                  setBirthdateDatePickerModal(false);
                } else {
                  setBirthdateDatePickerModal(false);
                  setParentBirthday(parseDateHumanFormat(selectedDate));
                }
              }}
              value={new Date()}
              maximumDate={new Date()}
            /> */}

            <ImagePickerWhatsapp
              showModal={imagePickerModal}
              setShowModal={() => setImagePickerModal(false)}
              width={900}
              height={900}
              onSelect={(imageObj: any) => {
                // consoleLog('imageObj', imageObj);
                setPhoto({
                  fileName: imageObj?.fileName,
                  type: imageObj?.type,
                  uri: imageObj?.uri,
                });
              }}
              onRemovePress={() => {
                setImagePickerModal(false);
                setPhoto(null);
              }}
              dropdownSelectedItem={undefined}
              title={'Choose Photo'}
            />

            <DropdownPicker
              dialogVisible={genderDropdownModal}
              setDialogVisible={() => setGenderDropdownModal(false)}
              title={'Select Gender'}
              data={genders}
              onSelectedItem={(item: any) => {
                setGenderDropdownModal(false);
                __setParentGender(item);
              }}
              dropdownSelectedItem={parentGender?.id}
              dropdownKeyValue={{id: 'id', title: 'name'}}
            />

            <DropdownPicker
              dialogVisible={countryDropdownModal}
              setDialogVisible={() => setCountryDropdownModal(false)}
              title={'Select Country Code'}
              data={countryCodes}
              onSelectedItem={(item: any) => {
                setCountryDropdownModal(false);
                __setCountryCode(item);
              }}
              dropdownSelectedItem={countryCode?.id}
              dropdownKeyValue={{id: 'id', title: 'code', subtitle: 'name'}}
            />
          </Wrap>
        </Wrap>

        <Wrap autoMargin={false} style={styles.section2}>
          <Wrap autoMargin={false} style={{}}>
            <Button
              title="Save"
              onPress={() => {
                type == 1 ? onSavePress() : onTherapistSavePress();
              }}
              textStyle={{fontSize: 18, fontFamily: Theme.fonts.ThemeFontBold}}
            />
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
