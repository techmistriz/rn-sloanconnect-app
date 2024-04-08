import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  base64EncodeDecode,
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import StorageService from 'src/services/StorageService/StorageService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';
import {BLEService} from 'src/services/BLEService/BLEService';
import {deviceSettingsResetDataAction} from 'src/redux/actions';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID,
  getDeviceModelData,
} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import {BLE_GATT_SERVICES} from 'src/utils/StaticData/BLE_GATT_SERVICES';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const connectedDevice = BLEService.getDevice();
  const {onBackFromApplying} = route?.params;

  useEffect(() => {
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    if (!isObjectEmpty(deviceSettingsData)) {
      // setLoading(true);
      for (const [key, value] of Object.entries(deviceSettingsData)) {
        if (
          typeof value != 'undefined' &&
          Array.isArray(value) &&
          value.length > 0
        ) {
          for (let index = 0; index < value.length; index++) {
            const element = value[index];

            if (
              element?.serviceUUID &&
              element?.characteristicUUID &&
              element?.newValue != ''
            ) {
              const writeCharacteristic =
                await BLEService.writeCharacteristicWithResponseForDevice(
                  element?.serviceUUID,
                  element?.characteristicUUID,
                  base64EncodeDecode(element?.newValue, 'decode'),
                );
            }
          }
        }
      }

      setTimeout(() => {
        saveSettings();
      }, 4000);
    }
  };

  const saveSettings1 = async () => {
  }
  
  const saveSettings = async () => {
    var DEVICE_PREVIOUS_SETTINGS_RAW = await StorageService.getItem(
      '@DEVICE_PREVIOUS_SETTINGS',
    );
    if (DEVICE_PREVIOUS_SETTINGS_RAW) {
      var DEVICE_PREVIOUS_SETTINGS = JSON.parse(DEVICE_PREVIOUS_SETTINGS_RAW);
      if (!isObjectEmpty(DEVICE_PREVIOUS_SETTINGS)) {
      }
    }

    // consoleLog(
    //   'DEVICE_PREVIOUS_SETTINGS',
    //   JSON.stringify(DEVICE_PREVIOUS_SETTINGS),
    // );

    const deviceGen = getBleDeviceGeneration(connectedDevice?.name);
    const deviceVersion = getBleDeviceVersion(connectedDevice?.name, deviceGen);

    var DEVICE_NEW_SETTINGS =
      DEVICE_PREVIOUS_SETTINGS?.[deviceGen]?.[deviceVersion] ?? {};

    // consoleLog('DEVICE_NEW_SETTINGS', JSON.stringify(DEVICE_NEW_SETTINGS));

    for (const [key, value] of Object.entries(deviceSettingsData)) {
      if (
        typeof value != 'undefined' &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          if (
            element?.serviceUUID &&
            element?.characteristicUUID &&
            element?.newValue != ''
          ) {
            const __deviceStaticDataMain =
              getDeviceCharacteristicByServiceUUIDAndCharacteristicUUID(
                element?.serviceUUID,
                element?.characteristicUUID,
                BLE_GATT_SERVICES,
              );
            if (!isObjectEmpty(__deviceStaticDataMain)) {
              // DEVICE_NEW_SETTINGS.push({
              //   serviceUUID: element?.serviceUUID,
              //   characteristicUUID: element?.characteristicUUID,
              //   ...__deviceStaticDataMain,
              //   value: base64EncodeDecode(element?.newValue, 'decode'),
              // });

              DEVICE_NEW_SETTINGS = {
                ...DEVICE_NEW_SETTINGS,
                [element?.characteristicUUID]: {
                  serviceUUID: element?.serviceUUID,
                  characteristicUUID: element?.characteristicUUID,
                  ...__deviceStaticDataMain,
                  value: base64EncodeDecode(element?.newValue, 'decode'),
                },
              };
            }
          }
        }
      }
    }

    const DEVICE_PREVIOUS_SETTINGS_SAVED = {
      ...DEVICE_PREVIOUS_SETTINGS,
      [deviceGen]: {
        [deviceVersion]: {
          ...DEVICE_NEW_SETTINGS,
        },
      },
    };

    // consoleLog(
    //   'DEVICE_PREVIOUS_SETTINGS_SAVED',
    //   JSON.stringify(DEVICE_PREVIOUS_SETTINGS_SAVED),
    // );

    await StorageService.setItem(
      '@DEVICE_PREVIOUS_SETTINGS',
      DEVICE_PREVIOUS_SETTINGS_SAVED,
    );
    cleanAndRedirect();
  };

  const cleanAndRedirect = async () => {
    dispatch(deviceSettingsResetDataAction());
    onBackFromApplying && onBackFromApplying();
    setTimeout(() => {
      // setLoading(false);
      // showToastMessage('Success', 'success', 'Settings changed successfully.');
      NavigationService.goBack();
    }, 1000);
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="gradient"
      loading={loading}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Loader
              visible={true}
              loadingText={''}
              activityIndicatorColor={Theme.colors.white}
            />
            <Typography
              size={18}
              text={`Applying`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
