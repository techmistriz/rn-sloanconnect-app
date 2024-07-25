import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {DeviceSettingListProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {useSelector} from 'react-redux';
import I18n from 'src/locales/Transaltions';

// DeviceSettingList
const DeviceSettingList = ({
  settings,
  settingsData,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied = false,
  showApplySettingButton,
}: DeviceSettingListProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const [sensorRange, setSensorRange] = useState<any>('');

  /** component hooks method */
  useEffect(() => {
    initlizeApp();
  }, [applied, settingsData]);

  const initlizeApp = async () => {
    let __sensorRange = settingsData?.sensorRange?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'sensorRange',
      deviceSettingsData?.SensorRange,
      {
        searchKey: 'name',
      },
    );
    // consoleLog('__sensorRange resultObj==>', deviceSettingsData);

    if (!isObjectEmpty(resultObj)) {
      __sensorRange = resultObj?.newValue;
    }

    setSensorRange(__sensorRange);
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
              text={I18n.t('device_dashboard.UNITS')}
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.darkGray}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.rightStyle}>
            <Row autoMargin={false} style={styles.innerRow}>
              <Typography
                size={16}
                text={sensorRange}
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

export default DeviceSettingList;
