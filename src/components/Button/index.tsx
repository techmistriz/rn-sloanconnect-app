import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';
import Theme from 'src/theme';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import VectorIcon from 'src/components/VectorIcon';
import TouchableItem from 'src/components/TouchableItem';
import {styles} from './styles';
import {ButtonProps, BUTTON_TYPES} from './types';

export const Button = ({
  style,
  title,
  type = 'primary',
  textStyle,
  disable,
  leftItem,
  rightItem,
  onPress,
}: ButtonProps) => {
  return (
    <View
      style={[
        styles.touchableWrapper,
        style?.borderRadius && {borderRadius: style?.borderRadius},
      ]}>
      <TouchableItem
        onPress={onPress}
        style={[
          styles.__buttonStyle,
          type == BUTTON_TYPES.DEFAULT && styles.__defaultButtonStyle,
          type == BUTTON_TYPES.PRIMARY && styles.__primaryButtonStyle,
          type == BUTTON_TYPES.SECONDARY && styles.__secondaryButtonStyle,
          type == BUTTON_TYPES.LINK && styles.__linkButtonStyle,
          type == BUTTON_TYPES.SUCCESS && styles.__successButtonStyle,
          type == BUTTON_TYPES.DANGER && styles.__dangerButtonStyle,
          type == BUTTON_TYPES.WARNING && styles.__warningButtonStyle,
          type == BUTTON_TYPES.DISABLED && styles.__disabledButtonStyle,
          disable && {opacity: 0.6},
          style,
        ]}
        disabled={disable || type === BUTTON_TYPES.DISABLED}>
        <>
          {leftItem && <>{leftItem}</>}
          <Typography
            text={title}
            style={[
              styles.__textStyle,
              type == BUTTON_TYPES.DEFAULT && styles.__defaultButtonTextStyle,
              type == BUTTON_TYPES.PRIMARY && styles.__primaryButtonTextStyle,
              type == BUTTON_TYPES.SECONDARY &&
                styles.__secondaryButtonTextStyle,
              type == BUTTON_TYPES.LINK && styles.__linkButtonTextStyle,
              type == BUTTON_TYPES.SUCCESS && styles.__successButtonTextStyle,
              type == BUTTON_TYPES.DANGER && styles.__dangerButtonTextStyle,
              type == BUTTON_TYPES.WARNING && styles.__warningButtonTextStyle,
              type == BUTTON_TYPES.DISABLED && styles.__disabledButtonTextStyle,
              textStyle,
            ]}
            // color={Theme.colors.buttonTextColor}
            size={textStyle?.fontSize || 14}
            ff={Theme.fonts.ThemeFontRegular}
          />
          {rightItem && <>{rightItem}</>}
        </>
      </TouchableItem>
    </View>
  );
};
