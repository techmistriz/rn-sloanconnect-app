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
                  onSearchAgainPress && onSearchAgainPress();
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
