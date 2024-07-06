import React, {useEffect} from 'react';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {TABS} from 'src/utils/StaticData/StaticData';
import DeviceBottomTab from 'src/components/@ProjectComponent/DeviceBottomTab';
import {constants} from 'src/common';
import {FAQS_HTML} from 'src/utils/StaticData/CMS_DATA';
import RenderHtml from '@jtreact/react-native-render-html';
import {BLEReport} from 'src/services/BLEService/BLEReport';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {
    // BLEReport.mapFaucetSettings();
  }, []);

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
          <RenderHtml contentWidth={constants.screenWidth} source={FAQS_HTML} />
        </Wrap>
      </AppContainer>
      <DeviceBottomTab tabs={TABS} />
    </>
  );
};

export default Index;
