import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Device} from 'react-native-ble-plx';

export type DeviceExtendedProps = Device & {
  updateTimestamp?: number;
  modelStaticData?: any;
};
