import React, {useEffect, useState} from 'react';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {
  showSimpleAlert,
  showConfirmAlert,
  consoleLog,
  showToastMessage,
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
import {Button} from 'src/components/Button';
import Network from 'src/network/Network';
import {constants} from 'src/common';
import LANGUAGES from 'src/locales/languages.json';
import I18n from 'src/locales/Transaltions';

/** Home compoment */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {user, token, type} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const selectedLanguage = React.useMemo(() => {
    return LANGUAGES.find((o: any) => o.code === settings?.language);
  }, [settings]);

  /** compoment hooks method */
  useEffect(() => {
    consoleLog('Profile user==>', JSON.stringify(user));
    // dispatch(userProfileFailureAction({}));
  }, []);

  /** action for logout */
  const onLogout = async () => {
    dispatch(loginResetDataAction());
    await checkDeviceOnLogout();
    NavigationService.resetAllAction('Login');
  };

  const checkDeviceOnLogout = async () => {
    dispatch(deviceSettingsResetDataAction());
    BLEService?.disconnectDevice(false);
  };

  /** */
  const onDeleteAccountPress = async () => {
    try {
      setLoading(true);
      const response = await Network('profile', 'DELETE', {}, token);
      if (response?.status) {
        showToastMessage(response?.message, 'success');
        onLogout();
      } else {
        showToastMessage(response?.message);
      }
    } catch (error: any) {
      showToastMessage(error?.message);
    } finally {
      setLoading(false);
    }
  };

  /** compoment render method */
  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Row autoMargin={false} style={styles.profileContentContainerRow}>
          <Wrap autoMargin={false} style={styles.profileContentContainer}>
            <Typography
              text={`${I18n.t('profile.NAME_TITLE')}: `}
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
              text={`${I18n.t('profile.EMAIL_TITLE')}: `}
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
              text={`${I18n.t('profile.PHONE_NUMBER_TITLE')}: `}
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
              text={`${I18n.t('profile.TIMEZONE_TITLE')}: `}
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
              text={`${I18n.t('profile.COMPANY_TITLE')}: `}
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
              text={`${I18n.t('profile.INDUSTRY_TITLE')}: `}
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
                  text={`${I18n.t('profile.EDIT_PROFILE_MENU_TITLE')}`}
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

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                NavigationService.navigate('SyncReport', {
                  referrer: 'ProfileScreen',
                  type: type,
                });
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text={`${I18n.t('profile.SYNC_REPORT_MENU_TITLE')}`}
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

          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                NavigationService.navigate('Language', {
                  referrer: 'ProfileScreen',
                  type: type,
                });
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Wrap autoMargin={false}>
                  <Typography
                    text={`${I18n.t('profile.LANGUAGE_MENU_TITLE')}`}
                    color={Theme?.colors.black}
                    size={16}
                  />
                </Wrap>
                <Wrap autoMargin={false} style={styles.itemRow}>
                  <Typography
                    text={selectedLanguage?.name}
                    color={Theme?.colors?.black}
                    size={12}
                  />
                  <VectorIcon
                    iconPack="Feather"
                    name={'chevron-right'}
                    color={Theme?.colors?.black}
                    size={20}
                  />
                </Wrap>
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
                  text={`${I18n.t('profile.LOGOUT_MENU_TITLE')}`}
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

          <Wrap autoMargin={true} style={{}}>
            <TouchableItem
              onPress={() => setLogoutModal(true)}
              style={styles.item}>
              <Wrap
                autoMargin={false}
                style={[styles.itemRow, {justifyContent: 'center'}]}>
                <Button
                  type={'danger'}
                  title={`${I18n.t('profile.DELETE_ACCOUNT_BTN_LABEL')}`}
                  onPress={() => {
                    setDeleteAccountModal(true);
                  }}
                  style={{width: constants.screenWidth - 40}}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>

          <AlertBox
            visible={logoutModal}
            title={`${I18n.t('profile.LOGOUT_HEADING')}`}
            message={`${I18n.t('profile.LOGOUT_MSG')}`}
            okayText={I18n.t('button_labels.CONFIRM')}
            onCancelPress={() => {
              setLogoutModal(false);
            }}
            onOkayPress={() => {
              setLogoutModal(false);
              onLogout();
            }}
          />

          <AlertBox
            visible={deleteAccountModal}
            title={`${I18n.t('profile.DELETE_ACCOUNT_HEADING')}`}
            message={`${I18n.t('profile.DELETE_ACCOUNT_MSG')}`}
            okayText={I18n.t('button_labels.CONFIRM')}
            onCancelPress={() => {
              setDeleteAccountModal(false);
            }}
            onOkayPress={() => {
              setDeleteAccountModal(false);
              onDeleteAccountPress();
            }}
          />
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
