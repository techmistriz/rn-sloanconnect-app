import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type LoaderOverlayRefProp = {
  showLoaderOverlay: (message?: string) => void;
  hideLoaderOverlay: () => void;
};
