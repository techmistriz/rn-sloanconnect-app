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
import Input from 'src/components/Input';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {styles} from './styles';
import CheckBox from '@react-native-community/checkbox';
import {
  showToastMessage,
  consoleLog,
  getUserAPiPrefixByUserType,
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
import {helpData, invitation} from 'src/utils/StaticData/StaticData';
import Divider from 'src/components/Divider';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {
  }, []);

  return (
    <AppContainer scroll={false} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Image
                source={getImgSource(Images?.appLogo)}
                style={{width: '60%'}}
                resizeMode="contain"
              />
              <Typography
                size={14}
                text="Water Connect Us"
                style={{textAlign: 'left', marginTop: -20}}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontRegular}
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Wrap autoMargin={false}>
                <Typography
                  size={18}
                  text="Invitation Sent"
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
              </Wrap>
              <Wrap autoMargin={false} style={styles.inputWrapper}>
                <Typography
                  size={14}
                  text={invitation}
                  style={{
                    marginBottom: 20,
                  }}
                  color={Theme.colors.black}
                  ff={Theme.fonts.ThemeFontRegular}
                />
              </Wrap>
              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Button
                  title="CONTINUE"
                  onPress={() => {
                    onLoginPress();
                  }}
                />
              </Wrap>
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
