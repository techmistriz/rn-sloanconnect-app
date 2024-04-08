import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {AppInfoProps} from './types';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import {constants} from 'src/common';

// AppInfo
const AppInfo = ({style1, style2}: AppInfoProps) => (
  <>
    <Typography
      size={11}
      text={`${constants.APP_NAME} ${
        constants.isAndroid
          ? constants.ANDROID_APP_VERSION
          : constants.IOS_APP_VERSION
      }`}
      style={[{textAlign: 'left', marginTop: 0}, {...style1}]}
      color={Theme.colors.black}
      ff={Theme.fonts.ThemeFontMedium}
    />
    <Typography
      size={10}
      text={`${constants.RELEASE_TEXT}`}
      style={[{textAlign: 'left', marginTop: 0}, {...style2}]}
      color={Theme.colors.black}
      ff={Theme.fonts.ThemeFontRegular}
    />
  </>
);

export default AppInfo;
