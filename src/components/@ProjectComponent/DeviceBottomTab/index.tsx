import React from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {DeviceBottomTabProps} from './types';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import Divider from 'src/components/Divider';
import NavigationService from 'src/services/NavigationService/NavigationService';

// DeviceBottomTab
const DeviceBottomTab = ({
  tabs,
  style,
  onPress,
  onDisconnect,
}: DeviceBottomTabProps) => (
  <Row autoMargin={true} style={styles.row}>
    {tabs.map((item: any, index: number) => {
      return (
        <Wrap key={index.toString()} autoMargin={false} style={styles.col}>
          <TouchableItem
            style={styles.item}
            onPress={() => {
              item?.route
                ? NavigationService.navigate(item?.route)
                : item?.title == 'Disconnect' && onDisconnect
                ? onDisconnect()
                : null;
            }}>
            <>
              <VectorIcon
                iconPack={item?.iconType}
                name={item?.icon}
                size={item?.iconSize}
                color={Theme.colors.midGray}
              />

              <Typography
                size={12}
                text={item?.title}
                style={{
                  textAlign: 'left',
                }}
                color={Theme.colors.black}
                ff={Theme.fonts.ThemeFontLight}
              />
            </>
          </TouchableItem>
        </Wrap>
      );
    })}
  </Row>
);

export default DeviceBottomTab;
