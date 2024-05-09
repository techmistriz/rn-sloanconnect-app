import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, FlatList, Keyboard} from 'react-native';
import Theme from 'src/theme';
import {consoleLog, showSimpleAlert} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row, Col} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import {useDispatch, useSelector} from 'react-redux';
import VectorIcon from 'src/components/VectorIcon';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

const NUMBER_PAD = [
  {
    id: 1,
    name: '1',
    value: 1,
    border: true,
    icon: null,
  },
  {
    id: 2,
    name: '2',
    value: 2,
    border: true,
    icon: null,
  },
  {
    id: 3,
    name: '3',
    value: 3,
    border: true,
    icon: null,
  },
  {
    id: 4,
    name: '4',
    value: 4,
    border: true,
    icon: null,
  },
  {
    id: 5,
    name: '5',
    value: 5,
    border: true,
    icon: null,
  },
  {
    id: 6,
    name: '6',
    value: 6,
    border: true,
    icon: null,
  },
  {
    id: 7,
    name: '7',
    value: 7,
    border: true,
    icon: null,
  },
  {
    id: 8,
    name: '8',
    value: 8,
    border: true,
    icon: null,
  },
  {
    id: 9,
    name: '9',
    value: 9,
    border: true,
    icon: null,
  },
  {
    id: 10,
    name: '.',
    value: '.',
    border: false,
    icon: 'dot-single',
    iconPack: 'Entypo',
  },
  {
    id: 11,
    name: '0',
    value: 0,
    border: false,
    icon: null,
  },
  {
    id: 12,
    name: 'x',
    value: 'x',
    border: false,
    icon: 'closesquareo',
    iconPack: 'AntDesign',
  },
];

const Index = ({navigation, route}: any) => {
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();
  const {title, subTitle, minValue, maxValue, flowRateType} = route?.params;

  const [flowRateInput, setFlowRateInput] = useState('');

  useEffect(() => {}, []);

  const onDonePress = async () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      DeviceEventEmitter.emit('FlowRateInputEvent', {
        flowRateInput:
          flowRateType == '0'
            ? Number(flowRateInput) * BLE_CONSTANTS.COMMON.GMP_FORMULA
            : Number(flowRateInput),
      });
      NavigationService.goBack();
    }
  };

  /**validation checking for flow rate value */
  const checkValidation = () => {
    if (flowRateInput.trim() === '') {
      showSimpleAlert('Please enter flow rate');
      return false;
    } else if (parseFloat(flowRateInput) < minValue) {
      showSimpleAlert('Flow rate can`t be less than ' + minValue);
      return false;
    } else if (parseFloat(flowRateInput) > maxValue) {
      showSimpleAlert('Flow rate can`t be greater than ' + maxValue);
      return false;
    } else {
      return true;
    }
  };

  const onKeypadButtonPress = (value: string | number) => {
    setFlowRateInput(prevState => {
      if (value == 'x') {
        return prevState.slice(0, -1);
      }
      if (value == '.' && prevState.indexOf('.') > -1) {
        return prevState;
      }
      return `${prevState}${value.toString()}`;
    });
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="gradient"
      // title="Confirm Flow Rate"
    >
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={true} style={[styles.row, {marginTop: 40}]}>
              <Typography
                size={12}
                text={title}
                style={{textAlign: 'center', marginBottom: 10}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Row autoMargin={false}>
                <Wrap autoMargin={false} style={{flex: 1}}>
                  <Input
                    onRef={input => {
                      // @ts-ignore
                      lineFlushIntervalTextInputRef = input;
                    }}
                    onChangeText={text => setFlowRateInput(text)}
                    onSubmitEditing={() => {
                      // @ts-ignore
                      Keyboard.dismiss();
                    }}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    keyboardType="numeric"
                    placeholder=""
                    value={flowRateInput}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.textInput}
                    editable={false}
                  />
                  <Typography
                    size={12}
                    text={subTitle}
                    style={{textAlign: 'center', marginTop: 5}}
                    color={Theme.colors.white}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </Wrap>
              </Row>
            </Wrap>
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={3}
              data={NUMBER_PAD}
              renderItem={({item}) => {
                return (
                  <Col
                    autoMargin={false}
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    <Button
                      type={'link'}
                      title={!item.icon ? item?.name : ''}
                      leftItem={
                        item.icon ? (
                          <VectorIcon
                            iconPack={item?.iconPack}
                            name={item.icon}
                            size={20}
                            color={Theme.colors.white}
                          />
                        ) : null
                      }
                      onPress={() => {
                        onKeypadButtonPress(item?.value);
                      }}
                      textStyle={{
                        fontSize: 20,
                        fontFamily: Theme.fonts.ThemeFontLight,
                        color: Theme.colors.white,
                      }}
                      style={[
                        item?.border
                          ? {
                              borderTopWidth: 0,
                              borderRightWidth: 0,
                              borderLeftWidth: 0,
                              borderBottomWidth: 1,
                              borderColor: Theme.colors.white,
                              borderRadius: 0,
                            }
                          : {
                              borderWidth: 0,
                              borderRadius: 0,
                            },
                      ]}
                    />
                  </Col>
                );
              }}
              keyExtractor={(item, index) => index?.toString()}
              onEndReachedThreshold={0.01}
              contentContainerStyle={[{paddingBottom: 10}]}
            />

            <Wrap autoMargin={false} style={{paddingTop: 20}}>
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
