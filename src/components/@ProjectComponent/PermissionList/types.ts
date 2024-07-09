import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type PermissionListProps = {
  item: any;
  style?: ViewStyle | ViewStyle[];
  borderTop?: JSX.Element | null;
  borderBottom?: JSX.Element | null;
  onAllowedPress?: (item: any) => void;
};
