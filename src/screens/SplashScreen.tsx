import React, {useEffect} from 'react';
import {StyleSheet, Image} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useSelector} from 'react-redux';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap} from 'src/components/Common';
import constants from 'src/common/constants';
import I18n from 'react-native-i18n';

const SplashScreen = ({navigation}: any) => {
  const {user, loading, token} = useSelector(
    (state: any) => state?.AuthReducer,
  );
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {
    console.log('SplashScreen useEffect settings==>', settings);
    if (settings?.language) {
      I18n.locale = settings?.language;
    } else {
      I18n.locale = 'en';
    }
  }, []);

  /** component hooks method for not in use*/
  useEffect(() => {
    consoleLog('AuthReducer SplashScreen==>', {user, token});
    if (typeof token != 'undefined' && token != null && token) {
      setTimeout(() => {
        navigation.replace('Welcome', {
          referrer: 'Login',
        });
        // navigation.replace('ProductDetails');
      }, 1500);
    } else {
      setTimeout(() => {
        if (!settings?.hasIntroCompleted) {
          navigation.replace('Language', {
            referrer: 'SplashScreen',
          });
        } else {
          navigation.replace('Welcome', {
            referrer: 'SplashScreen',
          });
        }

        // navigation.replace('Login');
      }, 1500);
    }
  }, []);

  return (
    <>
      {/* <StatusBar
        backgroundColor={Theme.colors.statusBarColor}
        barStyle="light-content"
      /> */}
      <Wrap autoMargin={false} style={styles.container}>
        <Image
          // @ts-ignore
          source={getImgSource(Images?.splashScreen)}
          style={{width: '100%', height: '100%', position: 'absolute'}}
          resizeMode="cover"
        />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Image
              // @ts-ignore
              source={getImgSource(Images?.appLogoWhite)}
              style={{width: '60%'}}
              resizeMode="contain"
            />
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Typography
              size={12}
              text={`${constants.APP_NAME} ${constants.APP_VERSION}`}
              style={{textAlign: 'left', marginTop: 0}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={10}
              text={constants.RELEASE_TEXT}
              style={{textAlign: 'left', marginTop: 0}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontRegular}
            />
          </Wrap>
        </Wrap>
      </Wrap>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  section2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});
