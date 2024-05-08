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
} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getImgSource,
  getTimezone,
  parseDateHumanFormat,
} from 'src/utils/Helpers/HelperFunction';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
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
  applied = false,
}: // onSettingChange,
// onSettingSaved,
DeviceSettingListProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const [flowRate, setFlowRate] = useState('');
  const [flowRateTypeDivider, setFlowRateTypeDivider] = useState(10);

  /** component hooks method */
  useEffect(() => {
    initlizeApp();
  }, [applied, settingsData]);

  const initlizeApp = async () => {
    let __flowRate = settingsData?.flowRate?.value ?? '';

    // Handle unsaved value which were changed
    const resultObj = findObject('flowRate', deviceSettingsData?.FlowRate, {
      searchKey: 'name',
    });
    consoleLog('__flowRate resultObj==>', resultObj);

    if (!isObjectEmpty(resultObj)) {
      __flowRate = resultObj?.newValue;
    }

    setFlowRate(getCalculatedValue(__flowRate));
  };

  const getCalculatedValue = (value: string, divider: number = 10) => {
    // consoleLog('getCalculatedValue', value);
    var result: number = 0;
    const valueInNumber = Number(value ?? 0);
    result = valueInNumber / divider;
    return result?.toString();
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
            // deviceStaticDataMain: deviceStaticDataMain,
            // characteristicMain: characteristicMain,
            // deviceStaticDataRight: deviceStaticDataRight,
            // characteristicRight: characteristicRight,
            // deviceStaticDataRight2: deviceStaticDataRight2,
            // characteristicRight2: characteristicRight2,
            // onSettingChange: __onSettingChange,
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
                text={`${flowRate} lpm`}
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
