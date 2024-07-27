import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {LineFlushListFlusherProps} from './types';
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

// LineFlushListFlusher
const LineFlushListFlusher = ({
  settings,
  settingsData,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied = false,
  showApplySettingButton,
}: LineFlushListFlusherProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const [flush, setFlush] = useState<any>('');
  const [flushTime, setFlushTime] = useState<any>('');
  const [flushVolume, setFlushVolume] = useState<any>('');

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
    let __flush = settingsData?.flush?.value ?? '1';
    let __flushTime = settingsData?.flushTime?.value ?? '';
    let __flushVolume = settingsData?.flushVolume?.value ?? '';

    // consoleLog('initlizeApp==>', {
    //   __flush,
    //   __flushTime,
    //   __flushVolume,
    // });
    // Handle unsaved value which were changed
    const resultObj = findObject('flush', deviceSettingsData?.LineFlush, {
      searchKey: 'name',
    });
    // consoleLog('mapModeSelectionValue resultObj==>', resultObj);

    if (!isObjectEmpty(resultObj)) {
      __flush = resultObj?.newValue;
    }

    const resultObj2 = findObject('flushTime', deviceSettingsData?.LineFlush, {
      searchKey: 'name',
    });

    if (!isObjectEmpty(resultObj2)) {
      __flushTime = resultObj2?.newValue;
    }
    const resultObj3 = findObject(
      'flushVolume',
      deviceSettingsData?.LineFlush,
      {
        searchKey: 'name',
      },
    );

    if (!isObjectEmpty(resultObj3)) {
      __flushVolume = resultObj3?.newValue;
    }

    setFlush(__flush);
    setFlushTime(__flushTime);
    setFlushVolume(__flushVolume);
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
            <Typography
              size={10}
              text={flush == '1' ? 'On' : flush == '0' ? 'Off' : ''}
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.darkGray}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.rightStyle}>
            <Row autoMargin={false} style={styles.innerRow}>
              {flush == '1' ? (
                <>
                  <Typography
                    size={16}
                    text={`${I18n.t(
                      'device_dashboard.EVERY',
                    )} ${flushTime} ${I18n.t('device_dashboard.DAYS')}`}
                    style={{
                      textAlign: 'right',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </>
              ) : (
                <Typography
                  size={16}
                  text={`-`}
                  style={{
                    textAlign: 'right',
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontLight}
                />
              )}

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

export default LineFlushListFlusher;
