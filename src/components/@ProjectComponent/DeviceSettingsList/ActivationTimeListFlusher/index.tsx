import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {ActivationTimeFlusherProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {useSelector} from 'react-redux';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import I18n from 'src/locales/Transaltions';

// ActivationTimeListFlusher
const ActivationTimeListFlusher = ({
  settings,
  settingsData,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied = false,
  showApplySettingButton,
}: ActivationTimeFlusherProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const [activationTime, setActivationTime] = useState<any>('');

  /** component hooks method */
  useEffect(() => {
    // consoleLog('DeviceSettingsList deviceSettingsData', deviceSettingsData);
    initlizeApp();
  }, [applied, settingsData]);

  /**
   * initlizeApp
   * @returns value
   */
  const initlizeApp = async () => {
    let __activationTime = settingsData?.activationTime?.value ?? '';

    // consoleLog('initlizeApp==>', {
    //   __activationTime,
    // });
    //
    // consoleLog('showApplySettingButton', {showApplySettingButton, applied, deviceSettingsData});

    // Handle unsaved value which were changed
    const resultObj2 = findObject(
      'activationTime',
      deviceSettingsData?.ActivationTime,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj2)) {
      __activationTime = resultObj2?.newValue;
    }

    setActivationTime(__activationTime);
  };

  return (
    <TouchableItem
      style={styles.wrapper}
      onPress={() => {
        settings?.route &&
          NavigationService.navigate(settings?.route, {
            referrer: settings?.title,
            settings: settings,
            settingsData: settingsData,
          });
      }}>
      <>
        {borderTop && borderTop}
        <Row autoMargin={true} style={styles.row}>
          <Wrap autoMargin={false} style={styles.leftStyle}>
            <Typography
              size={14}
              text={settings?.title}
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.rightStyle}>
            <Row autoMargin={false} style={styles.innerRow}>
              <Typography
                size={16}
                text={`${activationTime} ${I18n.t('device_dashboard.SECONDS')}`}
                style={{
                  textAlign: 'right',
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontLight}
              />
              {!isObjectEmpty(deviceSettingsData?.[settings?.name]) &&
              showApplySettingButton ? (
                <>
                  {applied ? (
                    <VectorIcon
                      iconPack="MaterialCommunityIcons"
                      name={'check-circle'}
                      size={20}
                      color={Theme.colors.green}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  ) : (
                    <VectorIcon
                      iconPack="MaterialCommunityIcons"
                      name={'information'}
                      size={20}
                      color={Theme.colors.yellow}
                      style={{
                        transform: [{rotateX: '180deg'}],
                        marginLeft: 5,
                      }}
                    />
                  )}
                </>
              ) : (
                <VectorIcon
                  iconPack="MaterialCommunityIcons"
                  name={'chevron-right'}
                  size={25}
                  color={Theme.colors.midGray}
                  style={
                    {
                      // marginLeft: 5,
                    }
                  }
                />
              )}
            </Row>
          </Wrap>
        </Row>
        {borderBottom && borderBottom}
      </>
    </TouchableItem>
  );
};

export default ActivationTimeListFlusher;
