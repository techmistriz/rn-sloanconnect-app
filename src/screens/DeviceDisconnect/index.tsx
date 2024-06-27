import React, {Component, Fragment, useEffect, useState} from 'react';
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
import Loader from 'src/components/Loader';
import LoaderOverlay2 from 'src/components/LoaderOverlay2';
import {BLEService} from 'src/services/BLEService/BLEService';
import {deviceSettingsResetDataAction} from 'src/redux/actions';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const connectedDevice: any = BLEService.getDevice();
  const connectedDeviceRaw: any = BLEService.deviceRaw;
  // const [deviceData, setDeviceData] = useState<any>(connectedDevice);

  useEffect(() => {
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    setTimeout(() => {
      // if (BLEService?.deviceGeneration == 'gen2') {
      //   BLEService?.finishMonitor();
      // }
      dispatch(deviceSettingsResetDataAction());
      BLEService?.disconnectDevice(false);
      NavigationService.resetAllAction('DeviceSearching');
    }, 1000);
  };

  return (
    <AppContainer scroll={false} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Loader
              visible={true}
              loadingText={''}
              activityIndicatorColor={Theme.colors.white}
              loaderType={'image'}
            />
            <Typography
              size={18}
              text={`Disconnecting`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={12}
              text={`Disconnecting to your ${
                connectedDeviceRaw?.deviceCustomName ??
                connectedDevice?.localName ??
                connectedDevice?.name ??
                'N/A'
              }\n Might take a few seconds.`}
              style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <AppInfo
                style1={{textAlign: 'center', color: Theme.colors.midGray}}
                style2={{textAlign: 'center', color: Theme.colors.midGray}}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
