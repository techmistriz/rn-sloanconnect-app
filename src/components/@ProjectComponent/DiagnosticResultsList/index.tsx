import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {DiagnosticResultsListProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';

// DiagnosticResultsList
const DiagnosticResultsList = ({
  item,
  borderTop,
  borderBottom,
  style,
}: DiagnosticResultsListProps) => (
  <TouchableItem style={styles.wrapper} disabled>
    <>
      {borderTop && borderTop}
      <Row autoMargin={true} style={styles.row}>
        <Wrap autoMargin={false} style={styles.leftStyle}>
          <Typography
            size={14}
            text={item?.nameLocale ?? 'N/A'}
            style={{
              textAlign: 'left',
            }}
            color={Theme.colors.black}
            ff={Theme.fonts.ThemeFontLight}
          />
        </Wrap>

        <Wrap autoMargin={false} style={styles.rightStyle}>
          <Row autoMargin={false} style={styles.innerRow}>
            {!item?.forceText &&
            item?.value == '2' &&
            item?.name == 'Turbine' ? (
              <Typography
                size={12}
                text={`N/A`}
                style={{
                  textAlign: 'right',
                }}
                color={Theme.colors.midGray}
                ff={Theme.fonts.ThemeFontMedium}
              />
            ) : !item?.forceText && item?.value == '1' ? (
              <VectorIcon
                iconPack="MaterialCommunityIcons"
                name={'check'}
                size={20}
                color={Theme.colors.green}
              />
            ) : !item?.forceText && item?.value == '0' ? (
              <VectorIcon
                iconPack="MaterialCommunityIcons"
                name={'close'}
                size={20}
                color={Theme.colors.red}
              />
            ) : (
              <Typography
                size={12}
                text={`${item?.prefix ?? ''}${item?.value ?? 'N/A'}${
                  item?.postfix ?? ''
                }`}
                style={{
                  textAlign: 'right',
                }}
                color={Theme.colors.midGray}
                ff={Theme.fonts.ThemeFontMedium}
              />
            )}
          </Row>
        </Wrap>
      </Row>
      {borderBottom && borderBottom}
    </>
  </TouchableItem>
);

export default DiagnosticResultsList;
