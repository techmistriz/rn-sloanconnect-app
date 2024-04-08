import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface VideoViewerProps {
  style?: ViewStyle;
  visible: boolean;
  item?: any;
  onRequestClose?: (status: boolean) => void;
  playerRef?:any;
  onBuffer?:any;
  videoError?:any;
}
