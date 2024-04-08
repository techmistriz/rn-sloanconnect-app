import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type AuthData = {
  id: number;
  email: string;
  name: string;
  user_name: string;
  version: number;
  token: string;
  mobile_no: string;
  image?: string;
};
