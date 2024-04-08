import React, {Component, Fragment, useEffect} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import {
  PERMISSIONS_RESULTS,
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
} from 'src/utils/Permissions';
import {BLEService} from 'src/services/BLEService/BLEService';

const Index = ({onSearchAgainPress}: any) => {
  
  /** Function for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    // consoleLog('__checkBluetoothPermissions', __checkBluetoothPermissions);

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__requestBluetoothPermissions', __requestBluetoothPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    const __checkLocationPermissions = await checkLocationPermissions();
    // consoleLog('__checkLocationPermissions', __checkLocationPermissions);

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __checkLocationPermissions = await requestLocationPermissions();
      if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__checkLocationPermissions', __checkLocationPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    if (status > 0) {
      showToastMessage('Please power on your bluetooth.');
    } else {
      const state = await BLEService.manager.state();
      consoleLog('BluetoothDisable state==>', state);
      if (state === 'PoweredOn') {
        onSearchAgainPress && onSearchAgainPress();
      }

      if (state === 'PoweredOff') {
        const isEnable = await BLEService.manager.enable();
        consoleLog('BluetoothDisable isEnable==>', isEnable);
        // if (isEnable === 'PoweredOn') {
        //   onSearchAgainPress && onSearchAgainPress();
        // }
      }
    }
  };

  const __onSearchAgainPress = () => {
    manageRequirePermissions();
  };

  return (
    <AppContainer scroll={false} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Typography
              size={18}
              text={`No Product Found`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={14}
              text={`Please be sure Bluetooth is \n Enabled and try again.`}
              style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap
              autoMargin={false}
              style={[{width: '100%', marginBottom: 10}]}>
              <Button
                type={'link'}
                title="TRUBLESHOOT"
                onPress={() => {
                  NavigationService.navigate('DeviceDiagnosticTroubleshoot');
                }}
                style={{borderColor: Theme.colors.white}}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontBold,
                  color: Theme.colors.white,
                }}
              />
            </Wrap>
            <Wrap
              autoMargin={false}
              style={[{width: '100%', marginBottom: 10}]}>
              <Button
                title="SEARCH AGAIN"
                onPress={() => {
                  __onSearchAgainPress();
                }}
                style={{
                  borderColor: Theme.colors.white,
                  backgroundColor: Theme.colors.white,
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontBold,
                  color: Theme.colors.primaryColor,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
