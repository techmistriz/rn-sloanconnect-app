import React, {useCallback, useEffect} from 'react';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {TABS} from 'src/utils/StaticData/StaticData';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import {constants} from 'src/common';
import {FAQS_HTML} from 'src/utils/StaticData/HTML';
import RenderHtml from '@jtreact/react-native-render-html';
import {BLEReport} from 'src/services/BLEService/BLEReport';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import DeviceInfo from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import LoaderOverlay from 'src/components/LoaderOverlay';
import I18n from 'src/locales/Transaltions';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading, user} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // consoleLog('user==>', user);
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    // await BLEReport.mapUserInfo(user);
    // await BLEReport.mapDeviceInfo();
    // await BLEReport.mapUserPreference();
    // await BLEReport.mapFaucetDeviceDetails();
    // await BLEReport.mapAdvanceDeviceDetails();
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => setIsReady(true), 100);

      return () => setIsReady(false);
    }, []),
  );

  if (!isReady) {
    return (
      <LoaderOverlay
        loading={true}
        loadingText={I18n.t('common.LOADING_TEXT')}
      />
    );
  }

  return (
    <>
      <AppContainer
        backgroundType="solid"
        scroll={true}
        loading={loading}
        scrollViewStyle={{}}
        headerContainerStyle={{
          backgroundColor: Theme.colors.primaryColor,
          // flex:1,
          // borderWidth: 1,
          // borderColor: 'green',
        }}>
        <Wrap autoMargin={false} style={styles.container}>
          <RenderHtml
            contentWidth={constants.screenWidth}
            source={FAQS_HTML?.[settings?.language ?? 'en']}
          />
        </Wrap>
      </AppContainer>
      <DeviceBottomTab tabs={TABS} />
    </>
  );
};

export default Index;
