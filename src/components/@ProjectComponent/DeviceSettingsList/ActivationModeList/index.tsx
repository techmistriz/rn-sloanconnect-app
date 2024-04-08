import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {FlowRateProps} from './types';
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
  base64EncodeDecode,
  consoleLog,
  getImgSource,
  getTimezone,
  parseDateHumanFormat,
} from 'src/utils/Helpers/HelperFunction';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {useDispatch, useSelector} from 'react-redux';

// FlowRate
const FlowRate = ({
  setting,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied = false,
}: // onSettingChange,
// onSettingSaved,
FlowRateProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );

  const [characteristicMain, setCharacteristicMain] = useState<any>();
  // const [characteristicMainDecodeValue, setCharacteristicMainDecodeValue] =
  // useState<string>('');
  const [deviceStaticDataMain, setDeviceStaticDataMain] = useState<any>();
  const [characteristicRight, setCharacteristicRight] = useState<any>();
  const [deviceStaticDataRight, setDeviceStaticDataRight] = useState<any>();
  const [characteristicRight2, setCharacteristicRight2] = useState<any>();
  const [deviceStaticDataRight2, setDeviceStaticDataRight2] = useState<any>();
  // const [settingChangeData, setSettingChangeData] = useState<any>();

  /** component hooks method */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // consoleLog('DeviceSettingsList ActivationModeList component focused');
      initlizeApp();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /** component hooks method */
  useEffect(() => {
    // consoleLog('DeviceSettingsList ActivationModeList component re-render');
    initlizeApp();
  }, [applied]);

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

    // consoleLog(
    //   'initialize __characteristicMain==>',
    //   JSON.stringify(__characteristicMain),
    // );

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

      // consoleLog('decodedValue', decodedValue);
      // setCharacteristicMainDecodeValue(decodedValue);
      // MQ== 1
      // MA== 0
      const obj = findObject(
        __characteristicMain?.uuid,
        deviceSettingsData?.[setting?.name],
        {
          searchKey: 'characteristicUUID',
        },
      );

      consoleLog('deviceSettingsData==>', deviceSettingsData);

      if (!isObjectEmpty(obj)) {
        decodedValue = base64EncodeDecode(obj?.newValue, 'decode');
        // consoleLog('obj decodedValue', decodedValue);
      }

      if (
        decodedValue &&
        typeof __deviceStaticDataMain?.UUIDMapped != 'undefined' &&
        typeof __deviceStaticDataMain?.UUIDMapped?.[decodedValue] !=
          'undefined' &&
        __deviceStaticDataMain?.UUIDMapped?.[decodedValue]
      ) {
        var uuid1 = __deviceStaticDataMain?.UUIDMapped?.[decodedValue];

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
      }
    }
  };

  /**
   * map setting value
   * @param {any} characteristic
   * @param {any} deviceStaticData
   * @returns value
   */
  const __mapValue = (characteristic: any, deviceStaticData: any = null) => {
    // Check for new value if any changed occured
    const newValue = hasSettingChangedValueAvailable(
      characteristic,
      deviceStaticData,
      deviceSettingsData?.[setting?.name],
    );

    // consoleLog('newValue', newValue);

    if (newValue) {
      return newValue;
    }

    // Check for old value if any changed did not occured
    return mapValue(characteristic, deviceStaticData);
  };

  const hasSettingChangedValueAvailable = (
    characteristic: any,
    deviceStaticData: any,
    __deviceSettingsData: any,
  ) => {
    var result = '';
    var prefix = '';
    var postfix = '';

    if (typeof __deviceSettingsData != 'undefined') {
      const obj = findObject(characteristic?.uuid, __deviceSettingsData, {
        searchKey: 'characteristicUUID',
      });

      consoleLog('obj', obj);

      if (!isObjectEmpty(obj)) {
        var decodedValue = base64EncodeDecode(obj?.newValue, 'decode');
        if (typeof deviceStaticData?.prefix != 'undefined') {
          prefix = deviceStaticData?.prefix;
        }

        if (typeof deviceStaticData?.postfix != 'undefined') {
          postfix = deviceStaticData?.postfix;
        }
        if (
          deviceStaticData &&
          decodedValue &&
          typeof deviceStaticData?.valueMapped != 'undefined' &&
          typeof deviceStaticData?.valueMapped[decodedValue] != 'undefined'
        ) {
          result = deviceStaticData?.valueMapped[decodedValue];
        } else {
          result = decodedValue;
        }
      }
    }

    return `${prefix ?? ''}${result}${postfix ?? ''}`;
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
              text={__mapValue(characteristicMain, deviceStaticDataMain)}
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
                text={__mapValue(characteristicRight, deviceStaticDataRight)}
                style={{
                  textAlign: 'right',
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontLight}
              />

              {!isObjectEmpty(deviceSettingsData?.[setting?.name]) ? (
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

export default FlowRate;
