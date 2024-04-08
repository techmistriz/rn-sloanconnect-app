import {TypographyProps} from './types';
import React from 'react';
import {Text, TextStyle} from 'react-native';
import {getResponsiveFontSize} from 'src/utils/Helpers/HelperFunction';
import Theme, {hexToRGBA} from 'src/theme';

const Typography = ({
  style,
  text,
  color,
  size,
  noOfLine,
  ff = Theme.fonts.ThemeFontRegular,
  fw,
  children,
  onPress,
}: TypographyProps) => {
  const fontSize = 14;
  const fontFam: TextStyle = ff ? {fontFamily: ff} : {};
  return (
    <Text
      style={[
        {
          color: color ? color : Theme.colors.labelTextColor,
          fontSize: getResponsiveFontSize(size, fontSize),
          fontWeight: fw,
        },
        fontFam,
        style,
      ]}
      numberOfLines={noOfLine}
      onPress={onPress}>
      {text}
      {children}
    </Text>
  );
};

export default Typography;
