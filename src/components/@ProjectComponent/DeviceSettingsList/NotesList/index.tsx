import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {DeviceSettingListProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Divider from 'src/components/Divider';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {BLEService} from 'src/services';
import {
  cleanCharacteristic,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceModelData,
  getDeviceService,
  mapValue,
} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getImgSource,
  getTimezone,
  parseDateHumanFormat,
} from 'src/utils/Helpers/HelperFunction';
import {base64EncodeDecode, cleanString} from 'src/utils/Helpers/encryption';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {useDispatch, useSelector} from 'react-redux';

// DeviceSettingList
const DeviceSettingList = ({
  settings,
  settingsData,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied,
}: DeviceSettingListProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const [note, setNote] = useState<any>('');

  /** component hooks method */
  useEffect(() => {
    initlizeApp();
  }, [applied, settingsData]);

  const initlizeApp = async () => {
    let __note = settingsData?.note?.value ?? '';
    // consoleLog("__note==>", __note.toString("utf8").length);

    // Handle unsaved value which were changed
    const resultObj = findObject(
      'note',
      deviceSettingsData?.note,
      {
        searchKey: 'name',
      },
    );
    // consoleLog('__note resultObj==>', deviceSettingsData);

    if (!isObjectEmpty(resultObj)) {
      __note = resultObj?.newValue;
    }
    setNote(cleanString(__note));
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
              text={settings?.subTitle}
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
                text={note}
                style={{
                  textAlign: 'right',
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontLight}
              />

              {!isObjectEmpty(deviceSettingsData?.[settings?.name]) ? (
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
