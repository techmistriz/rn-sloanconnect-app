import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {PermissionListProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import {Button} from 'src/components/Button';

const PermissionList = ({
  item,
  borderTop,
  borderBottom,
  style,
  onAllowedPress,
}: PermissionListProps) => (
  <Wrap autoMargin={false} style={[
    styles.wrapper,
    style
  ]}>
    <>
      <Row autoMargin={false} style={styles.row}>
        <Wrap autoMargin={false} style={styles.leftStyle}>
          <Typography
            size={14}
            text={item?.title ?? 'N/A'}
            style={{
              textAlign: 'left',
            }}
            color={Theme.colors.black}
            ff={Theme.fonts.ThemeFontMedium}
          />
          <Typography
            size={12}
            text={item?.description ?? 'N/A'}
            style={{
              textAlign: 'left',
            }}
            color={Theme.colors.black}
            ff={Theme.fonts.ThemeFontLight}
          />
        </Wrap>

        <Wrap autoMargin={false} style={styles.rightStyle}>
          <Row autoMargin={false} style={styles.innerRow}>
            {item?.allowed ? (
              <VectorIcon
                iconPack="MaterialCommunityIcons"
                name={'check'}
                size={20}
                color={Theme.colors.green}
              />
            ) : (
              <Wrap autoMargin={false} style={[styles.buttonWrapper]}>
                <Button
                  title="ALLOW"
                  onPress={() => {
                    onAllowedPress && onAllowedPress(item);
                  }}
                  style={{height: 35}}
                />
              </Wrap>
            )}
          </Row>
        </Wrap>
      </Row>
      {borderBottom && borderBottom}
    </>
  </Wrap>
);

export default PermissionList;
