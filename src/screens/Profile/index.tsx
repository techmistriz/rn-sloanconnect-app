import React, {useEffect, useState} from 'react';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {
  showSimpleAlert,
  showConfirmAlert,
  consoleLog,
} from 'src/utils/Helpers/HelperFunction';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction} from 'src/redux/actions';

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
    consoleLog('Profile user==>', JSON.stringify(user));
    // dispatch(userProfileFailureAction({}));
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
      NavigationService.resetAllAction('Login');
    }
  };

  /** compoment render method */
  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Row autoMargin={false} style={styles.profileContentContainerRow}>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Name: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${user?.first_name} ${user?.last_name}`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Email: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${user?.email ?? 'N/A'}`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
        </Row>

        <Row autoMargin={false} style={styles.profileContentContainerRow}>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Phone Number: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${user?.user_metadata?.phone_number ?? 'N/A'}`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Timezone: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${
                user?.organizations?.[0]?.account?.timezone_format ?? 'N/A'
              }`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
        </Row>

        <Row autoMargin={false} style={styles.profileContentContainerRow}>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Company: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${user?.user_metadata?.company ?? 'N/A'}`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`Industry: `}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
              fw="700"
            />
            <Typography
              text={`${user?.user_metadata?.industry ?? 'N/A'}`}
              style={styles.profileName}
              color={Theme?.colors?.black}
              size={16}
            />
          </Wrap>
        </Row>

        <Wrap autoMargin={true} style={[styles.profileItemContainer]}>
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
                  color={Theme?.colors?.black}
                  size={16}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.black}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          {/* <Wrap autoMargin={false} style={[styles.itemContainer]}>
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
                  color={Theme?.colors?.black}
                  size={16}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.black}
                  size={20}
                />
              </Wrap>
            </TouchableItem>
          </Wrap> */}

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem onPress={() => onLogout()} style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Logout"
                  color={Theme?.colors?.black}
                  size={16}
                />
                <VectorIcon
                  iconPack="Feather"
                  name={'chevron-right'}
                  color={Theme.colors.black}
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
