import React, {useCallback, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {showToastMessage} from 'src/utils/Helpers/HelperFunction';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import RenderHtml from '@jtreact/react-native-render-html';
import {constants} from 'src/common';
import {EULA_HTML} from 'src/utils/StaticData/HTML';
import {useFocusEffect} from '@react-navigation/native';
import Loader from 'src/components/Loader';
import I18n from 'src/locales/Transaltions';
import LoaderOverlay from 'src/components/LoaderOverlay';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);
  const [terms, setTerms] = useState(false);
  const [isReady, setIsReady] = React.useState(false);

  // const onCompletePress = () => {
  //   if (terms) {
  //     DeviceEventEmitter.emit('TermsAcceptEvent', {termsAccept: true});
  //     NavigationService.goBack();
  //   } else {
  //     showToastMessage('Please accept terms');
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => setIsReady(true), 1000);

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
    <AppContainer
      scroll={true}
      loading={loading}
      scrollViewStyle={{}}
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
        <RenderHtml
          contentWidth={constants.screenWidth}
          source={EULA_HTML?.[settings?.language ?? 'en']}
        />
      </Wrap>
    </AppContainer>
  );
};

export default Index;
