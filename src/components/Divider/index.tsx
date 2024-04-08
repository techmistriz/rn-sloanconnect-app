import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {DividerProps} from './types';
import Theme from 'src/theme';

// Divider
const Divider = ({
  marginLeft,
  type = 'inset',
  color = Theme.colors.lightGray,
  style,
}: DividerProps) => (
  <View
    style={[
      styles.container,
      type === 'inset' && {marginLeft},
      type === 'middle' && styles.mh16,
      {backgroundColor: color},
      style,
    ]}
  />
);

export default Divider;
