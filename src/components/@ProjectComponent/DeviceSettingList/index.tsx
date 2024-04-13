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
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';

// DeviceSettingList
const DeviceSettingList = ({
  setting,
  borderTop,
  borderBottom,
  style,
  navigation,
}: // onSettingChange,
DeviceSettingListProps) => {
  const [characteristicMain, setCharacteristicMain] = useState<any>();
  const [characteristicMainDecodeValue, setCharacteristicMainDecodeValue] =
    useState<string>('');
  const [deviceStaticDataMain, setDeviceStaticDataMain] = useState<any>();
  const [characteristicRight, setCharacteristicRight] = useState<any>();
  const [deviceStaticDataRight, setDeviceStaticDataRight] = useState<any>();
  const [characteristicRight2, setCharacteristicRight2] = useState<any>();
  const [deviceStaticDataRight2, setDeviceStaticDataRight2] = useState<any>();
  const [settingChangeData, setSettingChangeData] = useState<any>();

  /** component hooks method */
  useEffect(() => {
    // consoleLog(
    //   'DeviceSettingList component (settingChangeData)',
    //   settingChangeData,
    // );
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      consoleLog('DeviceSettingList component focused');
      initlizeApp();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const initlizeApp = async () => {
    const __deviceStaticDataMain =
      getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
        setting?.serviceUUID,
        setting?.characteristicUUID,
        BLE_GATT_SERVICES,
      );
    // consoleLog('__deviceStaticDataMain', __deviceStaticDataMain);
    setDeviceStaticDataMain(__deviceStaticDataMain);

    const __characteristicMain = await BLEService.readCharacteristicForDevice(
      setting?.serviceUUID,
      setting?.characteristicUUID,
    );

    if (setting?.characteristicUUID == 'd0aba888-fb10-4dc9-9b17-bdd8f490c949') {
      // consoleLog(
      //   'initialize __characteristicMain==>',
      //   JSON.stringify(__characteristicMain),
      // );
    }

    setCharacteristicMain(cleanCharacteristic(__characteristicMain));

    // For UUIDMapped
    if (
      __deviceStaticDataMain &&
      __deviceStaticDataMain?.UUIDMapped &&
      __characteristicMain?.value
    ) {
      var decodedValue = base64EncodeDecode(
        __characteristicMain?.value,
        'decode',
      );

      setCharacteristicMainDecodeValue(decodedValue);

      if (
        decodedValue &&
        typeof __deviceStaticDataMain?.UUIDMapped != 'undefined' &&
        typeof __deviceStaticDataMain?.UUIDMapped[decodedValue] !=
          'undefined' &&
        __deviceStaticDataMain?.UUIDMapped[decodedValue]
      ) {
        var uuid1 = null;
        var uuid2 = null;
        if (
          Array.isArray(__deviceStaticDataMain?.UUIDMapped[decodedValue]) &&
          __deviceStaticDataMain?.UUIDMapped[decodedValue].length >= 2
        ) {
          uuid1 = __deviceStaticDataMain?.UUIDMapped[decodedValue][0];
          uuid2 = __deviceStaticDataMain?.UUIDMapped[decodedValue][1];
        } else {
          uuid1 = __deviceStaticDataMain?.UUIDMapped[decodedValue];
        }

        if (uuid1) {
          const __deviceStaticDataRight =
            getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
              setting?.serviceUUID,
              uuid1,
              BLE_GATT_SERVICES,
            );
          // consoleLog('__deviceStaticDataRight', __deviceStaticDataRight);
          setDeviceStaticDataRight(__deviceStaticDataRight);

          const __characteristicRight =
            await BLEService.readCharacteristicForDevice(
              setting?.serviceUUID,
              uuid1,
            );

          // consoleLog(
          //   'initialize __characteristicRight==>',
          //   JSON.stringify(__characteristicRight),
          // );
          setCharacteristicRight(cleanCharacteristic(__characteristicRight));
        }
        if (uuid2) {
          const __deviceStaticDataRight2 =
            getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
              setting?.serviceUUID,
              uuid2,
              BLE_GATT_SERVICES,
            );
          // consoleLog('__deviceStaticDataRight2', __deviceStaticDataRight2);
          setDeviceStaticDataRight2(__deviceStaticDataRight2);

          const __characteristicRight2 =
            await BLEService.readCharacteristicForDevice(
              setting?.serviceUUID,
              uuid2,
            );

          // consoleLog(
          //   'initialize __characteristicRight2==>',
          //   JSON.stringify(__characteristicRight2),
          // );
          setCharacteristicRight2(cleanCharacteristic(__characteristicRight2));
        }
      }
    }
  };

  // const __onSettingChange = (data: any) => {
  //   // consoleLog('DeviceSettingList __onSettingChange data==>', data);
  //   setSettingChangeData(data);
  //   onSettingChange && onSettingChange(data);
  // };

  const hasSettingValueChanged = () => {
    // consoleLog(
    //   'hasSettingValueChanged settingChangeData==>',
    //   settingChangeData?.[setting?.name],
    // );

    if (typeof settingChangeData?.[setting?.name] != 'undefined') {
      return true;
    }
    return false;
  };

  return (
    <TouchableItem
      style={styles.wrapper}
      onPress={() => {
        setting?.route &&
          NavigationService.navigate(setting?.route, {
            referrer: setting?.title,
            setting: setting,
            deviceStaticDataMain: deviceStaticDataMain,
            characteristicMain: characteristicMain,
            deviceStaticDataRight: deviceStaticDataRight,
            characteristicRight: characteristicRight,
            deviceStaticDataRight2: deviceStaticDataRight2,
            characteristicRight2: characteristicRight2,
            // onSettingChange: __onSettingChange,
          });
      }}>
      <>
        {borderTop && borderTop}
        <Row autoMargin={true} style={styles.row}>
          <Wrap autoMargin={false} style={styles.leftStyle}>
            <Typography
              size={14}
              text={setting?.title}
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.black}
              ff={Theme.fonts.ThemeFontLight}
            />
            <Typography
              size={10}
              text={
                setting?.subTitle ??
                mapValue(characteristicMain, deviceStaticDataMain)
              }
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.darkGray}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.rightStyle}>
            <Row autoMargin={false} style={styles.innerRow}>
              {setting?.hasValueCondition ? (
                <>
                  {setting?.hasValueCondition ==
                  characteristicMainDecodeValue ? (
                    <Typography
                      size={16}
                      text={
                        setting?.subTitle
                          ? mapValue(characteristicMain, deviceStaticDataMain)
                          : mapValue(characteristicRight, deviceStaticDataRight)
                      }
                      style={{
                        textAlign: 'right',
                      }}
                      color={Theme.colors.primaryColor}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  ) : (
                    <Typography
                      size={16}
                      text={'-'}
                      style={{
                        textAlign: 'right',
                      }}
                      color={Theme.colors.primaryColor}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  )}
                </>
              ) : (
                <Typography
                  size={16}
                  text={
                    setting?.subTitle
                      ? mapValue(characteristicMain, deviceStaticDataMain)
                      : mapValue(characteristicRight, deviceStaticDataRight)
                  }
                  style={{
                    textAlign: 'right',
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontLight}
                />
              )}

              {characteristicRight2 &&
                setting?.hasValueCondition == characteristicMainDecodeValue && (
                  <Typography
                    size={16}
                    text={` - ${mapValue(
                      characteristicRight2,
                      deviceStaticDataRight2,
                    )}`}
                    style={{
                      textAlign: 'right',
                    }}
                    color={Theme.colors.primaryColor}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                )}

              {!hasSettingValueChanged() && (
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
              {hasSettingValueChanged() && (
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
            </Row>
          </Wrap>
        </Row>
        {borderBottom && borderBottom}
      </>
    </TouchableItem>
  );
};

export default DeviceSettingList;
