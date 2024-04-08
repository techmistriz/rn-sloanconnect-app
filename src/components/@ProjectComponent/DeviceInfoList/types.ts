import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type DeviceSettingListProps = {
  item: any;
  style?: ViewStyle | ViewStyle[];
  borderTop?: JSX.Element | null;
  borderBottom?: JSX.Element | null;
};
