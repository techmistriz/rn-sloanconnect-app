import {TextStyle} from 'react-native';
export interface TypographyProps {
  style?: TextStyle | TextStyle[];
  text: string | number | undefined | null;
  color?: string;
  size?: number;
  noOfLine?: number;
  ff?: string;
  fw?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
  children?: JSX.Element | JSX.Element[];
  onPress?: (param?: any) => void;
}
