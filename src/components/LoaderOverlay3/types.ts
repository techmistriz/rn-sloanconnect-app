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
  scroll?: boolean;
  scrollViewStyle?: ViewStyle;
  spinnerType?: 'loading' | 'success' | 'failure';
  onLoaderClose?: () => void;
  header?: boolean;
  headerTitle?: string;
  footer?: boolean;
}