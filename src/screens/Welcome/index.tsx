import React, {Component, Fragment, useEffect} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import {Animated, Easing} from 'react-native';
import {constants} from 'src/common';

const Welcome = ({navigation, route}: any) => {
  const {referrer} = route?.params || {referrer: undefined};
  const {user, loading, token, message, media_storage, type} = useSelector(
    (state: any) => state?.AuthReducer,
  );

  const buttonWidthDelay = 500;
  const buttonWidth = new Animated.Value(constants.screenWidth - 60);
  const fadeInDelay = 500;
  const fadeInValue = new Animated.Value(0);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (referrer == 'Login') {
      setTimeout(() => {
        NavigationService.replace('DeviceSearching');
      }, 2000);
    }
  }, [referrer]);

  Animated.sequence([
    Animated.delay(buttonWidthDelay),
    Animated.timing(buttonWidth, {
      toValue: 45,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: false,
    }),
  ]).start();

  Animated.sequence([
    Animated.delay(fadeInDelay),
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]).start();

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
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
        </Wrap>
        <Wrap autoMargin={false} style={styles.section2}>
          <Typography
            size={17}
            text="Welcome"
            style={{textAlign: 'left', marginTop: 0}}
            color={Theme.colors.primaryColor}
            ff={Theme.fonts.ThemeFontBold}
          />
          <Typography
            size={13}
            text="Please tap on the blue button below to begin. You will be redirected to our website to continue."
            style={{textAlign: 'left', marginTop: 10}}
            color={Theme.colors.black}
            ff={Theme.fonts.ThemeFontRegular}
          />
        </Wrap>

        {referrer != 'Login' ? (
          <Wrap autoMargin={false} style={styles.section3}>
            <Wrap autoMargin={false} style={[{marginTop: 10}]}>
              <Button
                title="LOGIN / REGISTER"
                onPress={() => {
                  NavigationService.navigate('Login');
                }}
              />
            </Wrap>
            <Wrap autoMargin={false} style={[{marginTop: 10}]}>
              <Button
                type={'link'}
                title="HELP"
                onPress={() => {
                  NavigationService.navigate('Help');
                  // NavigationService.navigate('Terms');
                  // NavigationService.navigate('Invitation');
                }}
              />
            </Wrap>
          </Wrap>
        ) : (
          <Wrap autoMargin={false} style={styles.section4}>
            <Wrap autoMargin={false} style={[{marginBottom: 10}]}>
              <Animated.View
                style={{
                  width: buttonWidth,
                  alignSelf: 'center',
                }}>
                <Button
                  title=""
                  onPress={() => {
                    NavigationService.navigate('ActivateDevice');
                  }}
                  rightItem={
                    <Animated.View
                      style={{
                        opacity: fadeInValue,
                        transform: [{rotate: spin}],
                      }}>
                      <VectorIcon
                        iconPack="FontAwesome"
                        name={'spinner'}
                        size={25}
                        color={Theme.colors.white}
                      />
                    </Animated.View>
                  }
                  style={{
                    borderRadius: 45 / 2,
                  }}
                />
              </Animated.View>
            </Wrap>
            <AppInfo
              style1={{textAlign: 'center'}}
              style2={{textAlign: 'center'}}
            />
          </Wrap>
        )}
      </Wrap>
    </Wrap>
  );
};

export default Welcome;
