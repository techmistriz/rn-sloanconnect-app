import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface ImageViewerProps {
  style?: ViewStyle;
  visible: boolean;
  images?: Object[];
  imageIndex?: number;
  onRequestClose?: (status: boolean) => void;
}
