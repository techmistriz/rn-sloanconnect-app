import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {CopyrightProps} from './types';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import {constants} from 'src/common';

// Copyright
const Copyright = ({}: CopyrightProps) => (
  <>
    <Typography
      size={11}
      text={`${constants.COMPANY_NAME}`}
      style={{textAlign: 'left', marginTop: 0}}
      color={Theme.colors.darkGray}
      ff={Theme.fonts.ThemeFontMedium}
    />
    <Typography
      size={10}
      text={`${constants.COPYRIGHT_TEXT}`}
      style={{textAlign: 'left', marginTop: 0}}
      color={Theme.colors.darkGray}
      ff={Theme.fonts.ThemeFontRegular}
    />
  </>
);

export default Copyright;
