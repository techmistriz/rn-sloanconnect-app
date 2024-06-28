import React, {useEffect} from 'react';
import {Dimensions, Image, ScrollView, useWindowDimensions} from 'react-native';
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
import {
  TROUBLESHOOTING_HTML,
  EULA_HTML,
  FAQS_HTML,
} from 'src/utils/StaticData/CMS_DATA';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {}, []);

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
          source={TROUBLESHOOTING_HTML}
        />
      </Wrap>
    </AppContainer>
  );
};

export default Index;
