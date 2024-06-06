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
import {SETTINGS, TABS} from 'src/utils/StaticData/StaticData';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {}, []);

  return (
    <>
      <AppContainer
        backgroundType="solid"
        scroll={false}
        loading={loading}
        scrollViewStyle={{}}
        headerContainerStyle={{
          backgroundColor: Theme.colors.primaryColor,
          // flex:1,
          // borderWidth: 1,
          // borderColor: 'green',
        }}>
        <Wrap autoMargin={false} style={styles.container}>
          <Wrap autoMargin={false} style={styles.sectionContainer}>
            <Wrap autoMargin={false} style={styles.section1}>
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
                  <Divider style={{marginTop: 10}} />
                </Wrap>
                <ScrollView contentContainerStyle={{}}>
                  <Wrap autoMargin={true} style={styles.inputWrapper}>
                    <Typography
                      size={16}
                      text={`Product FAQs`}
                      style={{
                        marginBottom: 20,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontBold}
                    />
                    <Typography
                      size={14}
                      text={`How do I connect my product to the Sloan Connect App?`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontBold}
                    />

                    <Typography
                      size={14}
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
                        size={14}
                        text={`1. Turn on your smartphone’s Bluetooth.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                      <Typography
                        size={14}
                        text={`2. Open the Sloan Connect App.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                      <Typography
                        size={14}
                        text={`3. Complete all Sign In fields and agree to the End User License Agreement and Terms of Use.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                      <Typography
                        size={14}
                        text={`4. Activate your product’s Bluetooth transmitter by slowly waving your hand in front of the sensor three (3) times within ten (10) seconds. Note: water will run during this process.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                      <Typography
                        size={14}
                        text={`5. When your product’s Bluetooth transmitter is activated, the Sloan Connect App will display your product.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                      <Typography
                        size={14}
                        text={`6. Select your product to confirm and connect to the Sloan Connect App.`}
                        style={{
                          marginBottom: 10,
                        }}
                        color={Theme.colors.black}
                        ff={Theme.fonts.ThemeFontLight}
                      />
                    </Wrap>
                    <Typography
                      size={14}
                      text={`Can I still use my app and product if there is no internet connection?`}
                      style={{
                        marginBottom: 0,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontBold}
                    />
                    <Typography
                      size={14}
                      text={`Yes. The Sloan Connect App and products are designed to work in offline mode. All connectivity occurs via Bluetooth, which does not require an internet connection. If your phone is running Android 7, there is a built-in feature to prevent abusive BLE scanning. This change prevents an app from stopping and starting BLE scans more than 5 times in a window of 30 seconds. If this app does not detect any product and your phone is running Android 7, just exit the app and restart the app 30 seconds later.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={14}
                      text={`My product is not showing in advertised devices.`}
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
                      size={16}
                      text={`Contact Support`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontBold}
                    />
                    <Typography
                      size={14}
                      text={`When assistance is required, please contact Sloan Technical Support at: +1-888-SLOAN-14 (1-888-756-2614) (USA only) or +1-847-671-4300 (all other locations), or visit www.sloan.com`}
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
      <DeviceBottomTab tabs={TABS} />
    </>
  );
};

export default Index;
