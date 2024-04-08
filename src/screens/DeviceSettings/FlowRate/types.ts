import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface ContainerProps {
  style?: ViewStyle;
  children?: JSX.Element | JSX.Element[] | ReactFragment | null;
}

export interface FlowRateRangeProps {
  min: number;
  max: number;
}
