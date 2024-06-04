import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

// Input Props
export type InputProps = {
  onRef?: (r:any) => void;
  accessibilityLabel?:string;
  value?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  onKeyPress?: () => {};
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
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  blurOnSubmit?: boolean;
  inputFocused?: boolean;
  maxLength?: number;
  placeholder?: string;
  placeholderTextColor?: string;
  inputTextColor?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  spellCheck?: boolean;
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number|null;
  borderColor?: string;
  focusedBorderColor?: string;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  left?: JSX.Element;
  leftStyle?: ViewStyle;
  right?: JSX.Element;
  rightStyle?: ViewStyle;
  onPress?: () => void;
};
