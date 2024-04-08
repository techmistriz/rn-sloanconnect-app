import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

// TouchableItemProps Props
type TouchableItemProps = {
  children: JSX.Element;
  style?: ViewStyle | ViewStyle[] | undefined | null;
  borderless?: boolean;
  rippleColor?: string;
  onPress?: () => void;
  disabled?: boolean;
};

const TouchableItem = (props: TouchableItemProps) => {
  /**
   * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
   * therefore only enable it on Android Lollipop and above
   *
   * We need to pass the background prop to specify a borderless ripple effect
   */
  if (
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_LOLLIPOP
  ) {
    const {
      borderless = false,
      rippleColor = 'rgba(0, 0, 0, 0.16)',
      children,
      style,
      disabled,
      ...rest
    } = props;
    return (
      <TouchableNativeFeedback
        disabled={disabled}
        {...rest}
        style={null}
        background={TouchableNativeFeedback.Ripple(rippleColor, borderless)}>
        <View style={style}>{React.Children.only(children)}</View>
      </TouchableNativeFeedback>
    );
  }

  const {children} = props;
  return (
    <TouchableOpacity activeOpacity={0.60} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableItem;
