import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, Image, Keyboard} from 'react-native';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {
  showSimpleAlert,
  showConfirmAlert,
  consoleLog,
  getImgSource,
  getNameByType,
  assetsBaseUrl,
} from 'src/utils/Helpers/HelperFunction';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import {Images} from 'src/assets';
import Theme, {hexToRGBA} from 'src/theme';
import {styles} from './styles';
import {constants} from 'src/common';
import AppContainer from 'src/components/AppContainer';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {
  loginResetDataAction,
  childResetDataAction,
  settingsResetDataAction,
} from 'src/redux/actions';
import AlertBox from 'src/components/AlertBox';
import {
  userProfileRequestAction,
  userProfileFailureAction,
  userProfileSuccessAction,
} from 'src/redux/actions';

/** Home compoment */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {user, loading, token, type} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [photo, setPhoto]: any = useState();

  /** compoment hooks method */
  useEffect(() => {
    consoleLog('user', user);
  }, []);

  /**validation checking for email and password */
  const checkValidation = (_photo: any) => {
    if (typeof _photo?.uri == 'undefined' || !_photo?.uri) {
      showSimpleAlert('Please select your photo');
      return false;
    } else {
      return true;
    }
  };

  /** action for logout */
  const onLogout = async () => {
    const result = await showConfirmAlert('Are you sure?');
    if (result) {
      dispatch(loginResetDataAction());
      dispatch(childResetDataAction());
      // dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  /** compoment render method */
  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.profileContentContainer}>
          <Wrap autoMargin={false} style={styles.imageContainer}>
            {user && user?.user_image ? (
              <Image
                // @ts-ignore
                source={getImgSource(
                  `${assetsBaseUrl()}${getNameByType(type)}/${
                    user?.user_image
                  }`,
                )}
                style={styles.profileImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                // @ts-ignore
                source={getImgSource(Images?.imgHolder)}
                style={styles.profileImage}
                resizeMode="contain"
              />
            )}
          </Wrap>

          <Typography
            style={styles.profileName}
            text={`${user?.name}`}
            color={Theme?.colors?.white}
            size={18}
          />
        </Wrap>

        <Wrap autoMargin={false} style={[styles.profileItemContainer]}>
          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                NavigationService.navigate('EditProfile', {
                  referrer: 'ProfileScreen',
                  type: type,
                });
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Edit Profile"
                  color={Theme?.colors?.white}
                  size={18}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.white}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                NavigationService.navigate('ChangePassword', {
                  email: '',
                  otp: '',
                  referer: 'ProfileScreen',
                });
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Change Password"
                  color={Theme?.colors?.white}
                  size={18}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.white}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                NavigationService.navigate('Settings', {
                  referer: 'ProfileScreen',
                });
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Settings"
                  color={Theme?.colors?.white}
                  size={18}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.white}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem onPress={() => onLogout()} style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Logout"
                  color={Theme?.colors?.white}
                  size={18}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.white}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          {/* <AlertBox visible={true} message={"hello"} /> */}
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
