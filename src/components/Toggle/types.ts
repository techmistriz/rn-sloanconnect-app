import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type ToggleProps = {
  style?: ViewStyle | ViewStyle[];
  selected?: number | string | null | undefined;
  options: any[];
  onSelect?: (value: string) => void;
};
