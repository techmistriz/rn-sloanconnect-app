import React, {useEffect} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import Divider from 'src/components/Divider';
import HTMLView from 'react-native-htmlview';
import RenderHtml from '@jtreact/react-native-render-html';
import {constants} from 'src/common';
import {TROUBLESHOOTING_HTML} from 'src/utils/StaticData/HTML';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Header from 'src/components/Header';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  /** component hooks method for hardwareBackPress */
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        if (referrer == 'DeviceDiagnostics') {
          NavigationService.pop(2);
        } else {
          NavigationService.goBack();
        }

        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /** component hooks method for dynamic header for back button */
  useEffect(() => {

    // If came from DeviceDiagnostics when tapping on 'NO' button, then need to back 2 screen back.
    if (referrer == 'DeviceDiagnostics') {
      navigation.setOptions({
        header: () => (
          <Header
            onBackButtonPress={() => {
              NavigationService.pop(2);
            }}
          />
        ),
      });
    }
  }, []);

  return (
    <AppContainer
      backgroundType="solid"
      scroll={true}
      loading={loading}
      scrollViewStyle={{}}
      headerContainerStyle={{
        backgroundColor: Theme.colors.primaryColor,
      }}>
      <Wrap autoMargin={false} style={styles.container}>
        <RenderHtml
          contentWidth={constants.screenWidth}
          source={TROUBLESHOOTING_HTML?.[settings?.language ?? 'en']}
        />
      </Wrap>
    </AppContainer>
  );
};

export default Index;
