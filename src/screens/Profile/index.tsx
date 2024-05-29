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
import {
  deviceSettingsResetDataAction,
  loginResetDataAction,
} from 'src/redux/actions';
import AlertBox from 'src/components/AlertBox';
import {BLEService} from 'src/services';

/** Home compoment */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {user, loading, token, type} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  const [logoutModal, setLogoutModal] = useState<boolean>(false);

  /** compoment hooks method */
  useEffect(() => {
    consoleLog('Profile user==>', JSON.stringify(user));
    // dispatch(userProfileFailureAction({}));
  }, []);

  /** action for logout */
  const onLogout = async () => {
    dispatch(loginResetDataAction());
    await checkDevice();
    NavigationService.resetAllAction('Login');
  };

  const checkDevice = async () => {
    dispatch(deviceSettingsResetDataAction());
    if (BLEService?.deviceGeneration == 'gen2') {
      BLEService?.finishMonitor();
    }
    BLEService?.disconnectDevice(false);
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
              size={12}
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
              size={12}
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
              size={12}
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
              size={12}
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
              size={12}
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
              size={12}
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
            <TouchableItem
              onPress={() => setLogoutModal(true)}
              style={styles.item}>
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

          <AlertBox
            visible={logoutModal}
            title="Logout"
            message={`Are you sure you want to log out?`}
            okayText={'CONFIRM'}
            onCancelPress={() => {
              setLogoutModal(false);
            }}
            onOkayPress={() => {
              setLogoutModal(false);
              onLogout();
            }}
          />
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
