import React, {useEffect, useState} from 'react';
import {Image, Linking, Platform} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Container, Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import {constants} from 'src/common';
import {BLEService} from 'src/services';
import {BleErrorCode, State as BluetoothState} from 'react-native-ble-plx';
import {
  checkBluetoothPermissions,
  PERMISSIONS_RESULTS,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
  requestGeoLocationPermission,
  openSettings,
} from 'src/utils/Permissions';
import AlertBox from 'src/components/AlertBox';
import RNExitApp from 'react-native-exit-app';
import {checkAllRequiredPermissions} from './helper';
import PermissionList from 'src/components/@ProjectComponent/PermissionList';
import AppContainer from 'src/components/AppContainer';
import I18n from 'src/locales/Transaltions';

let timeoutIDForPermissionCheckiOS: any = null;
const IOS_PERMISSION_CHECKING_TIMEOUT_MS = 2000;

const Permission = ({navigation, route}: any) => {
  const [nearbyDevicesPermissionStatus, setNearbyDevicesPermissionStatus] =
    useState(0);
  const [bluetoothStateStatus, setBluetoothStateStatus] = useState(0);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState(0);
  const [geoPermissionStatus, setGeoPermissionStatus] = useState(0);
  const [iosBluetoothSettingsModel, setIosBluetoothSettingsModel] =
    useState(false);

  const [settingModal, setSettingModal] = useState<any>({
    status: false,
    title: '',
    message: '',
  });
  const [permissionModal, setPermissionModal] = useState<any>({
    status: false,
    title: '',
    message: '',
    permission: '',
    result: '',
  });

  useEffect(() => {
    const subscription = BLEService.manager.onStateChange(state => {
      consoleLog('useEffect state==>', state);
      if (state === 'PoweredOn') {
        setBluetoothStateStatus(1);
      }
    }, true);
    return () => subscription.remove();
  }, [BLEService.manager]);

  /** Function for manage permissions using in this screen */
  useEffect(() => {
    consoleLog('useEffect PermissionScreen==>', {
      API_LEVEL: constants.API_LEVEL,
      TOTAL_PERMISSION_REQUIRED: constants.TOTAL_PERMISSION_REQUIRED,
    });
    __checkAllRequiredPermissions();
  }, []);

  /** Function for manage permissions using in this screen */
  useEffect(() => {
    consoleLog('useEffect PermissionScreen timeoutIDForPermissionCheckiOS==>');

    if (constants.isIOS) {
      timeoutIDForPermissionCheckiOS = setInterval(() => {
        __checkAllRequiredPermissions();
      }, IOS_PERMISSION_CHECKING_TIMEOUT_MS);
    }

    return () => {
      consoleLog('Unmounting clearInterval');
      clearInterval(timeoutIDForPermissionCheckiOS);
    };
  }, []);

  /** Function for manage permissions using in this screen */
  const __checkAllRequiredPermissions = async () => {
    const requiredPermissionsStatuses: any = await checkAllRequiredPermissions(
      2,
      true,
    );

    consoleLog(
      'PermissionScreen checkAllRequiredPermissions requiredPermissionsStatuses ==>',
      requiredPermissionsStatuses,
    );

    if (requiredPermissionsStatuses.NearbyDevices) {
      setNearbyDevicesPermissionStatus(1);
    }

    if (requiredPermissionsStatuses.Location) {
      setLocationPermissionStatus(1);
    }

    if (requiredPermissionsStatuses.GeoLocation) {
      setGeoPermissionStatus(1);
    }

    if (requiredPermissionsStatuses.BluetoothState) {
      setBluetoothStateStatus(1);
    }
  };

  /** Function for manage permissions using in this screen */
  const onNextPress = async () => {
    const requiredPermissionCount: any = await checkAllRequiredPermissions();
    if (requiredPermissionCount >= constants.TOTAL_PERMISSION_REQUIRED) {
      allPermissionGivenAndRedirect();
    } else {
      showToastMessage('Please allow required permissions.');
    }
  };

  /** Function for manage permissions using in this screen */
  const allPermissionGivenAndRedirect = (
    shouldShowMessage: boolean = false,
  ) => {
    // shouldShowMessage && showToastMessage('All permissions given.', 'success');
    NavigationService.replace('DeviceSearching');
  };

  /** Function for manage permissions using in this screen */
  const requireNearbyDevicesPermissions = async () => {
    consoleLog('requireNearbyDevicesPermissions called==>');
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    consoleLog(
      'requireNearbyDevicesPermissions __checkBluetoothPermissions==>',
      __checkBluetoothPermissions,
    );

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
      setNearbyDevicesPermissionStatus(1);
    } else if (
      __checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED ||
      __checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED
    ) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.GRANTED) {
        setNearbyDevicesPermissionStatus(1);
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Nearby Devices',
          message: 'We need Nearby Devices Permission for searching devices.',
          permission: 'NearbyDevices',
          result: 'denied',
        });
        return false;
      } else if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        setSettingModal({
          status: true,
          title: 'Permission Blocked',
          message: `We need Bluetooth Permission for searching devices\nYou have previously denied this permission, So you have to manually allow this permission.`,
        });
        return false;
      }
      consoleLog(
        'requireNearbyDevicesPermissions __requestBluetoothPermissions==>',
        __requestBluetoothPermissions,
      );
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // setSettingModal({
      //   status: true,
      //   title: 'Permission Blocked',
      //   message: `We need Bluetooth Permission for searching devices\n You have previously denied this permission, So you have to manually allow this permission.`,
      // });

      return false;
    }
  };

  /** Function for manage permissions using in this screen */
  const requireBluetoothEnablePermissions = async () => {
    consoleLog('requireBluetoothEnablePermissions called==>');
    const bleState = await BLEService.manager.state();
    consoleLog('requireBluetoothEnablePermissions bleState==>', bleState);

    if (bleState === BluetoothState.PoweredOff) {
      try {
        await BLEService.manager.enable();
        consoleLog('requireBluetoothEnablePermissions enabled==>');
      } catch (error: any) {
        consoleLog('requireBluetoothEnablePermissions enable error==>', error);
        if (error?.errorCode === BleErrorCode?.BluetoothUnauthorized) {
          showToastMessage('Please allow Nearby Device Permission first.');
        } else if (
          error?.errorCode === BleErrorCode?.BluetoothStateChangeFailed
        ) {
          showToastMessage(
            'Bluetooth enabling failed, Please enable manually.',
          );
        } else {
          // showToastMessage(error?.message);
        }
      }
    } else if (bleState === BluetoothState.PoweredOn) {
      setBluetoothStateStatus(1);
    } else if (bleState === BluetoothState.Unsupported) {
      showToastMessage('Unsupported device for Bluetooth');
    }
  };

  /** Function for manage permissions using in this screen */
  const requireLocationPermissions = async () => {
    consoleLog('requireLocationPermissions called==>');
    const __checkLocationPermissions = await checkLocationPermissions();
    consoleLog(
      'requireLocationPermissions __checkLocationPermissions==>',
      __checkLocationPermissions,
    );

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
      setLocationPermissionStatus(1);
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestLocationPermissions = await requestLocationPermissions();

      consoleLog(
        'requireLocationPermissions __requestLocationPermissions==>',
        __checkLocationPermissions,
      );

      if (__requestLocationPermissions == PERMISSIONS_RESULTS.GRANTED) {
        setLocationPermissionStatus(1);
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
        setPermissionModal({
          status: true,
          title: 'Location Permission',
          message: 'We need Location Permission for searching devices.',
          permission: 'Location',
          result: 'denied',
        });
      } else if (__requestLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        setSettingModal({
          status: true,
          title: 'Location Permission Blocked',
          message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        });
      }
      consoleLog(
        'manageRequirePermissions __requestLocationPermissions==>',
        __requestLocationPermissions,
      );
    } else if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      setSettingModal({
        status: true,
        title: 'Location Permission Blocked',
        message: `We need Location Permission for searching devices\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      });
    }
  };

  /** Function for manage permissions using in this screen */
  const requireGeoLocationPermissions = async () => {
    consoleLog('requireGeoLocationPermissions called==>');
    const __requestGeoLocationPermission = await requestGeoLocationPermission();
    consoleLog(
      'requireGeoLocationPermissions __requestGeoLocationPermission==>',
      __requestGeoLocationPermission,
    );

    if (__requestGeoLocationPermission) {
      setGeoPermissionStatus(1);
    }
  };

  /** Function for manage permissions using in this screen */
  const handlePermissionPopup = async () => {
    consoleLog('handlePermissionPopup called==>');
    const __permissionModal = {...permissionModal};
    setPermissionModal({
      ...permissionModal,
      status: false,
      permission: '',
      result: '',
    });

    if (__permissionModal?.result == 'denied') {
      if (__permissionModal?.permission == 'NearbyDevices') {
        await requireNearbyDevicesPermissions();
      } else if (__permissionModal?.permission == 'Location') {
        await requireLocationPermissions();
      } else if (__permissionModal?.permission == 'GeoLocation') {
        await requireGeoLocationPermissions();
      } else if (__permissionModal?.permission == 'BluetoothEnable') {
        await requireBluetoothEnablePermissions();
      }
    }
  };

  const openBluetoothSettings = () => {
    try {
      Linking.openURL('App-Prefs:Bluetooth');
    } catch (error) {
      showToastMessage(
        'App counld not open Bluetooth settings, Please open manually.',
      );
    }
  };

  return (
    <AppContainer scroll={true} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Image
          source={getImgSource(Images?.splashScreen)}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0.1,
          }}
          resizeMode="cover"
        />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Image
              source={getImgSource(Images?.appLogoWithText)}
              style={{width: '50%', height: 80}}
              resizeMode="contain"
            />

            <Typography
              size={17}
              text={I18n.t('permission.PERMISSION_TITLE')}
              style={{textAlign: 'left', marginTop: 20}}
              color={Theme.colors.primaryColor}
              ff={Theme.fonts.ThemeFontBold}
            />
            <Typography
              size={13}
              text={I18n.t('permission.PERMISSION_SUBTITLE')}
              style={{textAlign: 'left'}}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontRegular}
            />

            <Typography
              size={10}
              text={I18n.t('permission.PERMISSION_DESCRIPTION')}
              style={{textAlign: 'left', marginBottom: 20}}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontRegular}
            />

            <PermissionList
              item={{
                title: I18n.t('permission.NEARBY_DEVICES_TITLE'),
                description: I18n.t('permission.NEARBY_DEVICES_DESC'),
                allowed: nearbyDevicesPermissionStatus,
              }}
              onAllowedPress={() => {
                requireNearbyDevicesPermissions();
              }}
              style={{
                marginTop: 10,
              }}
            />

            <PermissionList
              item={{
                title: I18n.t('permission.BLUETOOTH_TITLE'),
                description: I18n.t('permission.BLUETOOTH_DESC'),
                allowed: bluetoothStateStatus,
              }}
              onAllowedPress={() => {
                constants.isAndroid
                  ? requireBluetoothEnablePermissions()
                  : setIosBluetoothSettingsModel(true);
              }}
              style={{
                marginTop: 10,
              }}

              // borderBottom={<Divider color={Theme.colors.lightGray} />}
            />

            {constants.isAndroid && constants.API_LEVEL <= 30 && (
              <PermissionList
                item={{
                  title: I18n.t('permission.LOCATION_TITLE'),
                  description: I18n.t('permission.LOCATION_DESC'),
                  allowed: locationPermissionStatus,
                }}
                onAllowedPress={() => {
                  requireLocationPermissions();
                }}
                style={{
                  marginTop: 10,
                }}
              />
            )}

            {constants.isAndroid && constants.API_LEVEL <= 30 && (
              <PermissionList
                item={{
                  title: I18n.t('permission.GEO_LOCATION_TTILE'),
                  description: I18n.t('permission.GEO_LOCATION_DESC'),
                  allowed: geoPermissionStatus,
                }}
                onAllowedPress={() => {
                  requireGeoLocationPermissions();
                }}
                style={{
                  marginTop: 10,
                }}
              />
            )}
          </Wrap>

          <Wrap autoMargin={false} style={styles.section3}>
            <Wrap autoMargin={false} style={[{marginTop: 10}]}>
              <Button
                title={I18n.t('permission.BTN_NEXT')}
                onPress={() => {
                  onNextPress();
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>

      <AlertBox
        visible={permissionModal?.status}
        title={permissionModal?.title}
        message={permissionModal?.message}
        onCancelPress={() => {
          setPermissionModal({
            ...permissionModal,
            status: false,
          });
        }}
        cancelText={I18n.t('button_labels.CLOSE_BUTTON_LABEL')}
        onOkayPress={() => {
          handlePermissionPopup();
        }}
        okayText={I18n.t('button_labels.ENABLE_BUTTON_LABEL')}
      />

      <AlertBox
        visible={settingModal?.status}
        title={settingModal?.title}
        message={settingModal?.message}
        onCancelPress={() => {
          setSettingModal(false);
        }}
        cancelText={I18n.t('button_labels.CLOSE_BUTTON_LABEL')}
        onOkayPress={() => {
          setSettingModal({
            status: false,
            title: '',
            message: '',
          });
          openSettings();
        }}
        okayText={I18n.t('button_labels.OPEN_SETTING_BUTTON_LABEL')}
      />

      <AlertBox
        visible={iosBluetoothSettingsModel}
        title={`${constants.APP_NAME} ${I18n.t(
          'permission.ALLOWE_PERMISSION_TITLE',
        )}`}
        message={I18n.t('permission.ALLOWE_PERMISSION_MSG')}
        onCancelPress={() => {
          setIosBluetoothSettingsModel(false);
        }}
        cancelText={I18n.t('button_labels.CLOSE_BUTTON_LABEL')}
        onOkayPress={() => {
          setIosBluetoothSettingsModel(false);
          openBluetoothSettings();
        }}
        okayText={I18n.t('button_labels.OPEN_SETTING_BUTTON_LABEL')}
      />
    </AppContainer>
  );
};

export default Permission;
