import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {
  getImgSource,
  getNameByType,
  showConfirmAlert,
  showToastMessage,
  assetsBaseUrl,
} from 'src/utils/Helpers/HelperFunction';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Theme, {hexToRGBA} from 'src/theme';
import {styles} from './styles';
import {constants} from 'src/common';
import AppContainer from 'src/components/AppContainer';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from 'src/assets';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {verticalScale, moderateScale} from 'src/utils/Scale';
import {
  settingsRequestAction,
  settingsFailureAction,
  settingsSuccessAction,
} from 'src/redux/actions';
import Network from 'src/network/Network';
import {useFocusEffect} from '@react-navigation/native';

/**Home Screen Component */
const Index = ({route, navigation}: any) => {
  useEffect(() => {
    // consoleLog("media_storage", media_storage);
  }, []);

  /** component hooks method */
  useEffect(() => {
    // consoleLog('AuthReducer Home', {loading, token, type, settings});
    // consoleLog('SettingsReducer settings', {settings});
  }, []);

  /** component render method */
  return (
    <AppContainer scroll={true}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              {/* <Image
                // @ts-ignore
                source={getImgSource(
                  `${assetsBaseUrl()}${getNameByType(type)}/${
                    user?.user_image
                  }`,
                )}
                style={{
                  height: verticalScale(180),
                  width: constants.screenWidth - 100,
                  borderWidth: 1,
                }}
                resizeMode="contain"
              /> */}
              <Image
                source={getImgSource(Images?.appLogo)}
                style={{height: verticalScale(180)}}
                resizeMode="contain"
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
