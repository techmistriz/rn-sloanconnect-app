import React, {useEffect, useState} from 'react';
import {Wrap} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {consoleLog, showToastMessage} from 'src/utils/Helpers/HelperFunction';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {settingsSuccessAction} from 'src/redux/actions';
import {Button} from 'src/components/Button';
import {constants} from 'src/common';
import LANGUAGES from 'src/locales/languages.json';
import I18n from 'src/locales/Transaltions';

/** Home compoment */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {user, token, type} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);
  const [loading, setLoading] = useState(false);

  const findLanguageObject = (languageCode: string) => {
    return LANGUAGES.find((o: any) => o.code === languageCode);
  };

  const [selectedLanguageState, setSelectedLanguageState] = useState(
    findLanguageObject(settings?.language),
  );

  /** compoment hooks method */
  useEffect(() => {}, []);

  /** action for logout */
  const onLanguageChange = async (item: any) => {
    setSelectedLanguageState(item);
  };

  /** action for logout */
  const onSaveLanguage = async () => {
    I18n.locale = selectedLanguageState?.code ?? 'en';
    dispatch(
      settingsSuccessAction({
        settings: {
          language: selectedLanguageState?.code,
          isNotification: settings?.isNotification,
          hasIntroCompleted: true,
        },
      }),
    );

    handleRedirect();
  };

  const handleRedirect = () => {
    if (referrer == 'SplashScreen') {
      if (typeof token != 'undefined' && token != null && token) {
        navigation.replace('Welcome', {
          referrer: 'Login',
        });
      } else {
        navigation.replace('Welcome', {
          referrer: 'SplashScreen',
        });
      }
    } else {
      showToastMessage(
        I18n.t('profile.CHANGE_LANGUAGE_SUCCESS_MSG'),
        'success',
      );
      NavigationService.goBack();
    }
  };

  /** compoment render method */
  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={true} style={[styles.profileItemContainer]}>
          {LANGUAGES.map((item: any, index: number) => {
            return (
              <Wrap
                key={index.toString()}
                autoMargin={false}
                style={[styles.itemContainer]}>
                <TouchableItem
                  onPress={() => {
                    onLanguageChange(item);
                  }}
                  style={styles.item}>
                  <Wrap autoMargin={false} style={styles.itemRow}>
                    <Wrap autoMargin={false}>
                      <Typography
                        text={item?.name}
                        color={Theme?.colors.black}
                        size={16}
                      />
                    </Wrap>
                    <Wrap autoMargin={false} style={styles.itemRow}>
                      {selectedLanguageState?.code == item?.code ? (
                        <VectorIcon
                          iconPack="MaterialCommunityIcons"
                          name={'check'}
                          size={20}
                          color={Theme.colors.green}
                        />
                      ) : null}
                    </Wrap>
                  </Wrap>
                </TouchableItem>
              </Wrap>
            );
          })}

          <Wrap autoMargin={false} style={{}}>
            <Wrap style={styles.item}>
              <Wrap
                autoMargin={false}
                style={[styles.itemRow, {justifyContent: 'center'}]}>
                <Button
                  type={'primary'}
                  title={I18n.t('profile.CHANGE_LANGUAGE_BTN')}
                  onPress={() => {
                    onSaveLanguage();
                  }}
                  style={{width: constants.screenWidth - 40}}
                />
              </Wrap>
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
