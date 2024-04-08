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
  DeviceEventEmitter,
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
  const [terms, setTerms] = useState(false);

  const onCompletePress = () => {
    if (terms) {
      DeviceEventEmitter.emit('TermsAcceptEvent', {termsAccept: true});
      NavigationService.goBack();
    } else {
      showToastMessage('Please accept terms');
    }
  };

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
                  text="End User Liecense Aggreement And Terms Of Use"
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
                <Wrap autoMargin={false} style={styles.inputWrapper}>
                  <Typography
                    size={14}
                    text={helpData}
                    style={{
                      marginBottom: 20,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontRegular}
                  />
                </Wrap>
              </ScrollView>
              <Wrap
                autoMargin={false}
                style={[styles.inputWrapper, {marginTop: 10}]}>
                <Row
                  autoMargin={false}
                  style={{
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    style={{borderRadius: 20, marginTop: 5}}
                    disabled={false}
                    value={terms}
                    onValueChange={newValue => setTerms(newValue)}
                    tintColors={{
                      true: Theme.colors.primaryColor,
                      false: Theme.colors.black,
                    }}
                  />
                  <Typography
                    size={14}
                    text={'I have read and agree to these terms'}
                    style={{
                      textAlign: 'left',
                      // marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontMedium}
                    onPress={() => {
                      setTerms(!terms);
                    }}
                  />
                </Row>

                <Button
                  title="COMPLETE REGISTRATION"
                  onPress={() => {
                    onCompletePress();
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
