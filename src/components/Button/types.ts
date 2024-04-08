import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export enum BUTTON_TYPES {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LINK = 'link',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  DISABLED = 'disabled',
}

export interface ButtonProps {
  style?: ViewStyle | ViewStyle[];
  title: string;
  type?: BUTTON_TYPES | any;
  textStyle?: TextStyle;
  disable?: boolean;
  leftItem?: JSX.Element | JSX.Element[];
  rightItem?: JSX.Element | JSX.Element[];
  onPress: (param?: any) => void;
}
