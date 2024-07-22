import React, {useState} from 'react';
import {Image, ViewStyle} from 'react-native';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import {styles} from './styles';
import {Icons, Images} from 'src/assets';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import TouchableItem from 'src/components/TouchableItem';
import {
  consoleLog,
  getImgSource,
  showConfirmAlert,
} from 'src/utils/Helpers/HelperFunction';
import {
  deviceSettingsResetDataAction,
  loginResetDataAction,
} from 'src/redux/actions';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AlertBox from 'src/components/AlertBox';
import {BLEService} from 'src/services/BLEService/BLEService';
import {useNetInfo} from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';

// Header Props
type HeaderProps = {
  hasLogOutButton?: boolean;
  hasBackButton?: boolean;
  hasDeviceSearchButton?: boolean;
  hasProfileButton?: boolean;
  hasOnlineOfflineIcon?: boolean;
  onLogOutButtonPress?: (params?: any) => void;
  onBackButtonPress?: (params?: any) => void;
  onDeviceSearchButtonPress?: (params?: any) => void;
  onProfileButtonPress?: (params?: any) => void;
  title?: string;
  headerContainerStyle?: ViewStyle;
  headerLeftStyle?: ViewStyle;
  headerRightStyle?: ViewStyle;
  headerBackgroundType?: 'transparent' | 'solid' | 'white';
};

// Header
const Header = ({
  hasBackButton = true,
  hasLogOutButton = false,
  hasDeviceSearchButton = false,
  hasProfileButton = false,
  hasOnlineOfflineIcon = false,
  onLogOutButtonPress,
  onBackButtonPress,
  onDeviceSearchButtonPress,
  onProfileButtonPress,
  title = '',
  headerContainerStyle,
  headerLeftStyle,
  headerRightStyle,
  headerBackgroundType = 'solid',
}: HeaderProps) => {
  const dispatch = useDispatch();
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const {isConnected, isInternetReachable} = useNetInfo();
  const {status} = useSelector((state: any) => state?.SyncReportReducer);

  /** action for logout */
  const onLogout = async () => {
    dispatch(loginResetDataAction());
    await checkDevice();
    NavigationService.resetAllAction('Welcome');
  };

  const checkDevice = async () => {
    dispatch(deviceSettingsResetDataAction());
    // if (BLEService?.deviceGeneration == 'gen2') {
    //   BLEService?.finishMonitor();
    // }

    try {
      BLEService.manager.stopDeviceScan();
      BLEService?.disconnectDevice(false);
    } catch (error) {}
  };

  // consoleLog('Header onBackButtonPress==>', onBackButtonPress);

  return (
    <Row
      autoMargin={false}
      style={[
        styles.__headerContainerStyle,
        {...headerContainerStyle},
        // @ts-ignore
        {
          backgroundColor:
            headerBackgroundType == 'solid'
              ? Theme.colors.gradientBg1
              : headerBackgroundType == 'white'
              ? Theme.colors.white
              : Theme.colors.transparent,
        },
      ]}>
      <Wrap
        autoMargin={false}
        style={[styles.__headerLeftStyle, {...headerLeftStyle}]}>
        {hasLogOutButton ? (
          <TouchableItem
            borderless={true}
            onPress={() => {
              setLogoutModal(true);
            }}>
            <VectorIcon
              iconPack="MaterialIcons"
              name={'logout'}
              size={22}
              color={
                headerBackgroundType == 'solid' ||
                headerBackgroundType == 'transparent'
                  ? Theme.colors.white
                  : Theme.colors.black
              }
              style={{
                transform: [{rotateY: '180deg'}],
              }}
            />
          </TouchableItem>
        ) : hasBackButton ? (
          <TouchableItem
            borderless={true}
            onPress={() => {
              onBackButtonPress
                ? onBackButtonPress()
                : NavigationService.goBack();
            }}
            style={{}}>
            <VectorIcon
              iconPack="MaterialIcons"
              name={'arrow-back'}
              size={22}
              color={
                headerBackgroundType == 'solid' ||
                headerBackgroundType == 'transparent'
                  ? Theme.colors.white
                  : Theme.colors.black
              }
              style={{}}
            />
          </TouchableItem>
        ) : (
          <TouchableItem borderless={true} onPress={() => {}}>
            {/* Placeholder */}
            <VectorIcon
              iconPack="MaterialIcons"
              name={'blur-on'}
              size={22}
              color={
                headerBackgroundType == 'solid' ||
                headerBackgroundType == 'transparent'
                  ? Theme.colors.white
                  : Theme.colors.black
              }
              onPress={() => {}}
              style={{
                display: 'none',
              }}
            />
          </TouchableItem>
        )}
      </Wrap>
      <Wrap autoMargin={false} style={styles.__headerCenterStyle}>
        {title ? (
          <Typography
            size={16}
            text={title}
            style={{textAlign: 'center'}}
            color={
              headerBackgroundType == 'solid' ||
              headerBackgroundType == 'transparent'
                ? Theme.colors.white
                : Theme.colors.black
            }
            ff={Theme.fonts.ThemeFontMedium}
          />
        ) : (
          <Image
            // @ts-ignore
            source={getImgSource(Images?.appLogoWhite)}
            style={{
              width: '90%',
              height: 40,
            }}
            resizeMode="contain"
          />
        )}
      </Wrap>
      <Wrap
        autoMargin={false}
        style={[styles.__headerRightStyle, {...headerRightStyle}]}>
        {hasDeviceSearchButton && (
          <TouchableItem borderless={true} onPress={() => {}}>
            <>
              <Image
                // @ts-ignore
                source={getImgSource(Icons?.loader)}
                style={{width: 22, height: 22}}
                resizeMode="contain"
              />
            </>
          </TouchableItem>
        )}
        {hasOnlineOfflineIcon && (
          <TouchableItem disabled>
            <>
              {status == 1 ? (
                <VectorIcon
                  iconPack="Ionicons"
                  name={'sync-outline'}
                  size={20}
                  color={Theme.colors.green}
                />
              ) : (
                <VectorIcon
                  iconPack="Octicons"
                  name={'dot-fill'}
                  size={20}
                  color={isConnected ? Theme.colors.green : Theme.colors.red}
                />
              )}
            </>
          </TouchableItem>
        )}
        {hasProfileButton && (
          <TouchableItem
            borderless={true}
            onPress={() => {
              NavigationService.navigate('Profile');
            }}>
            <VectorIcon
              iconPack="SimpleLineIcons"
              name={'user'}
              size={22}
              color={
                headerBackgroundType == 'solid' ||
                headerBackgroundType == 'transparent'
                  ? Theme.colors.white
                  : Theme.colors.black
              }
            />
          </TouchableItem>
        )}
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
    </Row>
  );
};

export default Header;
