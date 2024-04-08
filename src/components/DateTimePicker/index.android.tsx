/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {View} from 'react-native';

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

  const onChange = (event: any, selectedDate: any) => {
    onDateSelectChange(selectedDate, event);
  };

  return (
    <View style={{flex: 1}}>
      {modalVisible && (
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
      )}
    </View>
  );
}
