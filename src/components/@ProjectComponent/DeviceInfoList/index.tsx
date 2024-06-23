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

const BDSKU_LIST = {
  '1': 'EFP-39-A-1',
  '2': 'EFP-11-A-1',
  '3': 'EFP-40-A-1',
  '4': 'EFP-39-A-2',
  '5': 'EFP-11-A-2',
  '6': 'EFP-40-A-2',
  '7': 'EFP-39-A-SMT-2',
};

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
              text={item?.name?.toUpperCase()}
              style={{
                textAlign: 'left',
              }}
              color={Theme.colors.midGray}
              ff={Theme.fonts.ThemeFontLight}
            />

            {item?.name?.toUpperCase() == 'CONTROL BOX MODEL' ? (
              <Typography
                size={14}
                text={BDSKU_LIST?.[item?.value] ?? item?.value}
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
