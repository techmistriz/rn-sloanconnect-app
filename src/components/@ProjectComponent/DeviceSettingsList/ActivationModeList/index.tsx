import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {FlowRateProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import {mapValue} from 'src/utils/Helpers/project';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {findObject, isObjectEmpty} from 'src/utils/Helpers/array';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';

const DeviceSettingList = ({
  settings,
  settingsData,
  borderTop,
  borderBottom,
  style,
  navigation,
  applied = false,
  showApplySettingButton,
}: FlowRateProps) => {
  const {deviceSettingsData} = useSelector(
    (state: any) => state?.DeviceSettingsReducer,
  );
  const [modeSelection, setModeSelection] = useState<any>('');
  const [metered, setMetered] = useState<any>('');
  const [onDemand, setOnDemand] = useState<any>('');

  /** component hooks method */
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // initlizeApp();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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
    let __modeSelection = settingsData?.modeSelection?.value ?? '';
    let __onDemand = settingsData?.onDemand?.value ?? '';
    let __metered = settingsData?.metered?.value ?? '';

    // consoleLog('__modeSelection', {
    //   __modeSelection,
    //   __onDemand,
    //   __metered,
    // });
    // Handle unsaved value which were changed
    const resultObj = findObject(
      'modeSelection',
      deviceSettingsData?.ActivationMode,
      {
        searchKey: 'name',
      },
    );
    // consoleLog('mapModeSelectionValue resultObj==>', resultObj);

    if (!isObjectEmpty(resultObj)) {
      __modeSelection = resultObj?.newValue;
    }

    if (__modeSelection == '0') {
      const resultObj2 = findObject(
        'onDemand',
        deviceSettingsData?.ActivationMode,
        {
          searchKey: 'name',
        },
      );
      if (!isObjectEmpty(resultObj2)) {
        __onDemand = resultObj2?.newValue;
      }
    } else if (__modeSelection == '1') {
      const resultObj3 = findObject(
        'metered',
        deviceSettingsData?.ActivationMode,
        {
          searchKey: 'name',
        },
      );
      if (!isObjectEmpty(resultObj3)) {
        __metered = resultObj3?.newValue;
      }
    }

    setModeSelection(__modeSelection);
    setOnDemand(__onDemand);
    setMetered(__metered);
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
              // text={mapModeSelectionValue()}
              text={
                modeSelection == '0'
                  ? 'On Demand'
                  : modeSelection == '1'
                  ? 'Metered'
                  : ''
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
              <Typography
                size={16}
                // text={`${mapMeteredOnDemandValue()} Sec`}
                text={`${
                  modeSelection == '0'
                    ? onDemand
                    : modeSelection == '1'
                    ? metered
                    : ''
                } Sec`}
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
