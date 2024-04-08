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
  autoMargin?: boolean | number;
}

export interface RowProps {
  style?: ViewStyle | ViewStyle[];
  autoMargin?: boolean | number;
  children?: JSX.Element | JSX.Element[] | ReactFragment | null;
}

export interface ColProps {
  style?: ViewStyle | ViewStyle[];
  autoMargin?: boolean | number;
  children?: JSX.Element | JSX.Element[] | ReactFragment | null;
}

export interface CardProps {
  style?: ViewStyle | ViewStyle[];
  autoMargin?: boolean | number;
  children?: JSX.Element | JSX.Element[] | ReactFragment | null;
}

export interface WrapProps {
  style?: ViewStyle | ViewStyle[];
  autoMargin?: boolean | number;
  children?: JSX.Element | JSX.Element[] | ReactFragment | null;
}

export interface RippleWrapProps {
  style?: ViewStyle | ViewStyle[] | undefined | null;
  children: JSX.Element;
  onPress?: () => void;
}

export interface TochableWrapProps {
  style?: ViewStyle;
  children: JSX.Element | JSX.Element[] | ReactFragment;
  onPress?: () => void;
}

export interface TypographyProps {
  style?: TextStyle;
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
}

export interface BittonProps {
  style?: TextStyle;
  title: string;
  type?: 'primary' | 'secondary' | 'disabled';
  titleStyle?: TextStyle;
  leftItem?: JSX.Element | JSX.Element[];
  rightItem?: JSX.Element | JSX.Element[];
  onPress: (param?: any) => void;
}

export interface TextInputProps {
  onRef?: () => {};
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => {};
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
  maxLength?: number;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  labelStyles?: TextStyle;
  labelSize?: number;
  labelColor?: string;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'phone-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  editable?: boolean;
  right?: JSX.Element | JSX.Element[] | ReactFragment;
  secureTextEntry?: boolean;
  hint?: string;
  mode?: 'flat' | 'outlined' | undefined;
}

export interface LinkProps {
  style?: TextStyle;
  title?: string;
  titleStyle?: TextStyle;
  color?: string;
  onPress: (param?: any) => void;
  children?: JSX.Element | JSX.Element[] | ReactFragment;
}

export interface KeyboardAvoidProps {
  style?: ViewStyle;
  children: JSX.Element | JSX.Element[] | ReactFragment;
}

export interface IconProps {
  style?: ImageStyle;
  source: ImageSourcePropType;
  color?: string;
}

export interface ThemeType {
  name: string;
  nature: string;
  primaryColor: string;
  primaryTextColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  statusBarColor: string;
  statusBarStyle: 'dark-content' | 'light-content';
  textColor: string;
  surfaceBGColor: string;
  borderColor: string;
  inputBGColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  buttonBGColor: string;
  buttonBGDisableColor: string;
  buttonTextColor: string;
  linkColor: string;
}

export interface SearchBarTypes {
  searchPlaceholder: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  animatedViewStyle?: ViewStyle;
}

export interface SwipableProps {
  type?: 'apple' | 'gmail';
  children: JSX.Element | JSX.Element[] | ReactFragment;
  onPress?: () => void;
  renderLeftActions?: {
    title: string;
    color: string;
    width?: number;
    onPress: () => void;
  }[];
  renderRightActions: {
    title: string | JSX.Element;
    color: string;
    width: number;
    onPress: () => void;
  }[];
}

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
