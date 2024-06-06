import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Input from 'src/components/InputPaper';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {styles} from './styles';
import {
  showToastMessage,
  consoleLog,
  showSimpleAlert,
  isValidEmail,
  showConfirmAlert,
  getImgSource,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import {
  loginRequestAction,
  boimetricLoginRequestAction,
} from 'src/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import VectorIcon from 'src/components/VectorIcon';
import Copyright from 'src/components/@ProjectComponent/Copyright';
import {helpData} from 'src/utils/StaticData/StaticData';
import Divider from 'src/components/Divider';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {}, []);

  return (
    <AppContainer
      scroll={false}
      loading={loading}
      scrollViewStyle={{}}
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Image
                source={getImgSource(Images?.appLogoWithText)}
                style={{width: '50%', height: 80}}
                resizeMode="contain"
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Wrap autoMargin={false}>
                <Typography
                  size={18}
                  text="Help"
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
                <AppInfo />
                <Divider style={{marginTop: 10}} />
              </Wrap>
              <ScrollView contentContainerStyle={{}}>
                <Wrap autoMargin={true} style={styles.inputWrapper}>
                  <Typography
                    size={12}
                    text={`Contact Support`}
                    style={
                      {
                        // marginBottom: 20,
                      }
                    }
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={12}
                    text={`help@sloansupport.com`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`Sloan Connect App FAQ's`}
                    style={
                      {
                        // marginBottom: 20,
                      }
                    }
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={12}
                    text={`Below is a list of questions for the Sloan Connect App`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />

                  <Typography
                    size={12}
                    text={`To connect your product to the Sloan Connect App, you must complete the following steps:`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Wrap
                    autoMargin={true}
                    style={{
                      paddingLeft: 20,
                    }}>
                    <Typography
                      size={12}
                      text={`1. Turn on your smartphone’s Bluetooth.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={12}
                      text={`2. Open the Sloan Connect App.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={12}
                      text={`3. Complete all Sign In fields and agree to the End User License Agreement and Terms of Use.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={12}
                      text={`4. Activate your product’s Bluetooth transmitter by slowly waving your hand in front of the sensor three (3) times within ten (10) seconds. Note: water will run during this process.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={12}
                      text={`5. When your product’s Bluetooth transmitter is activated, the Sloan Connect App will display your product.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={12}
                      text={`6. Select your product to confirm and connect to the Sloan Connect App.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Wrap>
                  <Typography
                    size={12}
                    text={`Can I still use my app and product if there is no internet connection?`}
                    style={{
                      marginBottom: 0,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={12}
                    text={`Yes. The Sloan Connect App and products are designed to work in offline mode. All connectivity occurs via Bluetooth, which does not require an internet connection. If your phone is running Android 7, there is a built-in feature to prevent abusive BLE scanning. This change prevents an app from stopping and starting BLE scans more than 5 times in a window of 30 seconds. If this app does not detect any product and your phone is running Android 7, just exit the app and restart the app 30 seconds later.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`My faucet is not showing in advertised devices.`}
                    style={{
                      marginBottom: 0,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={14}
                    text={`Please be sure your device has power. Check that there are no loose or disconnected wires and ensure the batteries are properly installed. Then repeat the connection process. If you are still experiencing issues, contact Sloan.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`How do I save and load settings?`}
                    style={{
                      marginBottom: 0,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={14}
                    text={`Each time you update settings on a faucet, they are stored in the app. If you would like to load the settings from a previous faucet to a new faucet, connect to that faucet and select the "Load Previous Settings". This will display a dialogue box showing the previous settings. Click "Confirm" to load those settings into the app, then select "Apply Settings To Faucet" button at the bottom of your dashboard.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={12}
                    text={`Why is the dashboard photo of my faucet not correct?`}
                    style={{
                      marginBottom: 0,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={14}
                    text={`Each Sloan faucet type has several images associated with it. Use the left and right arrows to view the different faucet images.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
              </ScrollView>
              <Divider style={{marginTop: 5}} />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
