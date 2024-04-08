import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Switch,
  Keyboard,
} from 'react-native';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import {
  showSimpleAlert,
  showConfirmAlert,
  consoleLog,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import {Images} from 'src/assets';
import Theme, {hexToRGBA} from 'src/theme';
import {styles} from './styles';
import {constants} from 'src/common';
import AppContainer from 'src/components/AppContainer';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';

import {
  settingsRequestAction,
  settingsFailureAction,
  settingsSuccessAction,
} from 'src/redux/actions';

/** Home compoment */
const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {user, token, type} = useSelector((state: any) => state?.AuthReducer);
  const {settings, loading} = useSelector(
    (state: any) => state?.SettingsReducer,
  );
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    settings?.isNotification,
  );
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    settings?.isBiometric === 'ENABLED',
  );

  /** compoment hooks method */
  useEffect(() => {
    // dispatch(settingsFailureAction({}));
    setIsNotificationEnabled(settings?.isNotification);
    setIsBiometricEnabled(settings?.isBiometric === 'ENABLED');
  }, [settings]);

  const onIsNotificationTogglePress = (value: boolean) => {
    // setIsNotificationEnabled(value);
    // dispatch(settingsRequestAction({}));
    // const __settings = {...settings};
    // __settings.isNotification = value;
    // dispatch(settingsSuccessAction({settings: __settings}));
    // showToastMessage('Settings updated', 'success');

    setIsNotificationEnabled(value);
    const payload = {
      is_notifications_enabled: value ? 1 : 0,
    };

    const options = {
      type: type,
      token: token,
    };

    dispatch(settingsRequestAction(payload, options));
  };

  /** compoment render method */
  return (
    <AppContainer scroll={true} loading={loading} scrollViewStyle={{}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={[styles.mainItemContainer]}>
          <Wrap autoMargin={false} style={[styles.itemContainer]}>
            <TouchableItem
              onPress={() => {
                // NavigationService.navigate('EditProfile');
              }}
              style={styles.item}>
              <Wrap autoMargin={false} style={styles.itemRow}>
                <Typography
                  text="Notifications"
                  color={Theme?.colors?.white}
                  size={18}
                />
                <Switch
                  trackColor={{
                    false: Theme.colors.gray5,
                    true: Theme.colors.primaryColor2,
                  }}
                  thumbColor={
                    isNotificationEnabled
                      ? Theme.colors.primaryColor2
                      : Theme.colors.gray
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onIsNotificationTogglePress}
                  value={isNotificationEnabled}
                />
              </Wrap>
            </TouchableItem>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
