/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {View, Modal} from 'react-native';
import {styles} from './styles';
import VectorIcon from 'src/components/VectorIcon';
import {Wrap, Row} from 'src/components/Common';
import Theme from 'src/theme';
import {Button} from 'src/components/Button';

export default function DateTimePickerCustom(props: any) {
  const {
    mode,
    onDateSelectChange,
    value,
    modalVisible,
    minimumDate = undefined,
    maximumDate = undefined,
    display = 'default',
  } = props;

  const [newDate, setNewDate] = React.useState(value);

  const onChange = (event: any, selectedDate: any) => {
    setNewDate(selectedDate);
  };

  const __onDateSelectChange = (event: any, selectedDate: any) => {
    onDateSelectChange(selectedDate, event);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        __onDateSelectChange({type: 'dismissed'}, newDate);
      }}>
      <Wrap autoMargin={false} style={styles.modalOverlay}>
        <Wrap autoMargin={false} style={styles.modalView}>
          <Wrap autoMargin={false} style={styles.modalCloseBtnContainer}>
            <VectorIcon
              iconPack="MaterialCommunityIcons"
              name={'close'}
              size={25}
              color={Theme.colors.black3}
              onPress={() => {
                __onDateSelectChange({type: 'dismissed'}, newDate);
              }}
            />
          </Wrap>
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode={mode}
            is24Hour={false}
            display={display}
            onChange={onChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          <Wrap style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={() => {
                __onDateSelectChange({type: 'selected'}, newDate);
              }}
              textStyle={{
                fontSize: 22,
                fontFamily: Theme.fonts.ThemeFontBold,
              }}
            />
          </Wrap>
        </Wrap>
      </Wrap>
    </Modal>
  );
}
