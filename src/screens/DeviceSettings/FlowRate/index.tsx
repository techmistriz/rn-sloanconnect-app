import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Keyboard,
  FlatList,
} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showSimpleAlert,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';
import Input from 'src/components/Input';
import Toggle from 'src/components/Toggle';
import {BLEService} from 'src/services/BLEService/BLEService';
import {
  getFlowRateType,
  getFlowRateValue,
  getFlowRateRange,
  getCalculatedValue,
} from './helper';
import {deviceSettingsSuccessAction} from 'src/redux/actions';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {hasDateSetting, hasPhoneSetting} from 'src/utils/Helpers/project';

const Index = ({navigation, route}: any) => {
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();

  const {
    referrer,
    setting,
    deviceStaticDataMain,
    characteristicMain,
    deviceStaticDataRight,
    characteristicRight,
    deviceStaticDataRight2,
    characteristicRight2,
  } = route?.params;

  const FLOW_RATES = getFlowRateRange(deviceStaticDataMain);
  const flowRateOld = getFlowRateValue(characteristicMain);

  const [flowRateTypeDivider, setFlowRateTypeDivider] = useState(10);
  const [flowRateType, setFlowRateType] = useState('1');
  const [flowRate, setFlowRate] = useState(flowRateOld);

  useEffect(() => {
    // consoleLog('LineFlush==>', {
    //   referrer,
    //   setting,
    //   deviceStaticDataMain,
    //   characteristicMain,
    //   deviceStaticDataRight,
    //   characteristicRight,
    //   deviceStaticDataRight2,
    //   characteristicRight2,
    // });
  }, []);

  const onDonePress = async () => {
    Keyboard.dismiss();
    var params = [];

    if (flowRateOld != flowRate) {
      params.push({
        serviceUUID: characteristicMain?.serviceUUID,
        characteristicUUID: characteristicMain?.uuid,
        oldValue: base64EncodeDecode(flowRateOld),
        newValue: base64EncodeDecode(flowRate),
      });
    }

    if (params.length) {
      dispatch(
        deviceSettingsSuccessAction({
          data: {FlowRate: params},
        }),
      );

      const dateSettingResponse = hasDateSetting(deviceStaticDataMain);
      if (!isObjectEmpty(dateSettingResponse)) {
        params.push({
          ...dateSettingResponse,
          allowedInPreviousSetting: false,
        });
      }

      const phoneSettingResponse = hasPhoneSetting(deviceStaticDataMain, user);
      if (!isObjectEmpty(phoneSettingResponse)) {
        params.push({
          ...phoneSettingResponse,
          allowedInPreviousSetting: false,
        });
      }
    }
    NavigationService.goBack();
  };

  return (
    <AppContainer scroll={true} scrollViewStyle={{}} backgroundType="gradient">
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.row}>
              <Typography
                size={18}
                text={`Confirm Flow Rate`}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.row}>
              <Wrap
                autoMargin={false}
                style={[styles.col, {width: 200, alignSelf: 'center'}]}>
                <Toggle
                  selected={flowRateType}
                  options={[
                    {id: '0', name: 'GPM', value: '0'},
                    {id: '1', name: 'LPM', value: '1'},
                  ]}
                  onSelect={(val: any) => {
                    setFlowRateType(val);
                  }}
                />
              </Wrap>
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[
                styles.row,
                {
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={FLOW_RATES}
                renderItem={({item}: any) => (
                  <Wrap
                    autoMargin={false}
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 15,
                      // borderWidth: 1,
                    }}>
                    <Button
                      type={'link'}
                      title={getCalculatedValue(
                        item?.value,
                        flowRateTypeDivider,
                        flowRateType,
                      )}
                      onPress={() => {
                        setFlowRate(item?.value);
                      }}
                      textStyle={{
                        fontSize: 20,
                        fontFamily: Theme.fonts.ThemeFontLight,
                        color:
                          flowRate == item?.value
                            ? Theme.colors.primaryColor
                            : Theme.colors.primaryColor3,
                      }}
                      style={{
                        borderColor: Theme.colors.primaryColor3,
                        backgroundColor:
                          flowRate == item?.value
                            ? Theme.colors.white
                            : Theme.colors.primaryColor2,
                        height: 60,
                        width: 60,
                        borderRadius: 60 / 2,
                      }}
                    />
                  </Wrap>
                )}
                keyExtractor={(item, index) => index?.toString()}
                onEndReachedThreshold={0.01}
              />
            </Wrap>
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <Button
                type={'link'}
                title="DONE"
                onPress={() => {
                  onDonePress();
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontMedium,
                  color: Theme.colors.white,
                }}
                style={{
                  borderColor: Theme.colors.white,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
