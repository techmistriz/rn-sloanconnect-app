import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import Typography from 'src/components/Typography';
import {Button} from 'src/components/Button';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';

const NetworkLost = (props: any) => {
  const {isConnected, isInternetReachable} = useNetInfo();

  useEffect(() => {
    _setIsInternet();
  }, [isConnected]);

  const _setIsInternet = () => {
    // consoleLog('NetworkLost useNetInfo==>', {
    //   isConnected,
    //   isInternetReachable,
    //   Route: props?.route?.name,
    // });

    if (isConnected === false && isInternetReachable == false) {
      props.setIsInternet(false);
    } else {
      props.setIsInternet(true);
    }
  };

  const _refresh = () => {
    const currentRoute = NavigationService?.getCurrentRoute();
    if (currentRoute?.name) {
      NavigationService.resetAction(currentRoute?.name, currentRoute?.params);
    }
  };

  return (
    <React.Fragment>
      {!props.isInternet ? (
        <View style={[styles.container]}>
          <View style={styles.contentView}>
            <Image
              source={getImgSource(Images.noInternet)}
              style={[styles.icon]}
              resizeMode="contain"
            />
            <Typography
              size={30}
              text={props?.title || 'Ooops!'}
              style={{marginBottom: 20}}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontBold}
            />

            <Typography
              size={20}
              text={props?.message || 'No internet connection found.'}
              color={Theme.colors.black}
            />

            <Typography
              size={20}
              text={props?.message2 || 'Check your connection.'}
              color={Theme.colors.black}
            />

            <View style={{overflow: 'hidden'}}>
              <Button
                title={props?.btnText || 'TRY AGAIN'}
                onPress={() => {
                  _setIsInternet();
                  // props?.buttonPress && props.buttonPress();
                  _refresh();
                }}
                style={{marginTop: 10}}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Theme.fonts.ThemeFontRegular,
                }}
              />
            </View>
          </View>
        </View>
      ) : null}
    </React.Fragment>
  );
};

export default NetworkLost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    // borderWidth: 1,
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // height: '100%',
    // borderWidth: 1,
  },
  icon: {
    height: 120,
  },
});
