import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, Keyboard} from 'react-native';
import Theme from 'src/theme';
import {showSimpleAlert} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Input from 'src/components/Input';
import {useDispatch, useSelector} from 'react-redux';

const Index = ({navigation, route}: any) => {
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const dispatch = useDispatch();
  const {title, subTitle, minValue, maxValue} = route?.params;

  const [flowRateInput, setFlowRateInput] = useState('');

  useEffect(() => {}, []);

  const onDonePress = async () => {
    Keyboard.dismiss();
    const checkValid = checkValidation();
    if (checkValid) {
      DeviceEventEmitter.emit('FlowRateInputEvent', {
        flowRateInput: flowRateInput,
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

  return (
    <AppContainer scroll={true} scrollViewStyle={{}} backgroundType="gradient">
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
