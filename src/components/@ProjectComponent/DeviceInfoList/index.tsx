import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {DeviceSettingListProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Divider from 'src/components/Divider';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

// DeviceSettingList
const DeviceSettingList = ({
  item,
  borderTop,
  borderBottom,
  style,
}: DeviceSettingListProps) => {
  return (
    <TouchableItem style={styles.wrapper} disabled>
      <>
        {borderTop && borderTop}
        <Row autoMargin={true} style={styles.row}>
          <Wrap autoMargin={false} style={styles.leftStyle}>
            <Typography
              size={12}
              text={
                item?.nameLocale
                  ? item?.nameLocale?.toUpperCase()
                  : item?.name?.toUpperCase()
              }
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.midGray}
              ff={Theme.fonts.ThemeFontLight}
            />

            {item?.name?.toUpperCase() == 'CONTROL BOX MODEL' ? (
              <Typography
                size={14}
                text={
                  BLE_CONSTANTS.COMMON.BDSKU_LIST?.[item?.value] ?? item?.value
                }
                style={{
                  textAlign: 'left',
                }}
                color={Theme.colors.black}
                ff={Theme.fonts.ThemeFontRegular}
              />
            ) : (
              <Typography
                size={14}
                text={`${item?.prefix ? ' ' + item?.prefix : ''}${
                  item?.value
                } ${item?.postfix ?? ''}`}
                style={{
                  textAlign: 'left',
                }}
                color={Theme.colors.black}
                ff={Theme.fonts.ThemeFontRegular}
              />
            )}
          </Wrap>
        </Row>
        {borderBottom && borderBottom}
      </>
    </TouchableItem>
  );
};
export default DeviceSettingList;
