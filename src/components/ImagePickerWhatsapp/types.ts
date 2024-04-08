import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

// Input Props
export type InputProps = {
  onRef?: () => {};
  value?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => {};
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
  numberOfLines?: number;
  borderColor?: string;
  focusedBorderColor?: string;
  inputContainerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  left?: JSX.Element;
  right?: JSX.Element;
};
