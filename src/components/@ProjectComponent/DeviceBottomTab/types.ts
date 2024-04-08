import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type DeviceBottomTabProps = {
  tabs: any;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  onDisconnect?: () => void;
};
