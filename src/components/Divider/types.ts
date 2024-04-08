import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type DividerProps = {
  marginLeft?: number;
  type?: 'full-bleed' | 'inset' | 'middle';
  color?: string;
  style?: ViewStyle;
};
