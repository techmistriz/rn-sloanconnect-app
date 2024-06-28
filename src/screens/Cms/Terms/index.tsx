import React, {useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {showToastMessage} from 'src/utils/Helpers/HelperFunction';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import RenderHtml from '@jtreact/react-native-render-html';
import {constants} from 'src/common';
import {
  EULA_HTML,
} from 'src/utils/StaticData/CMS_DATA';


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
      <Wrap autoMargin={false} style={styles.container}>
        <RenderHtml
          contentWidth={constants.screenWidth}
          source={EULA_HTML}
        />
      </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
