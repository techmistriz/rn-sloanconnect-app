import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {ToggleProps} from './types';
import Theme from 'src/theme';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import TouchableItem from 'src/components/TouchableItem';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

// Toggle
const Toggle = ({style = {}, selected, onSelect, options}: ToggleProps) => {
  const [selectedState, setSelectedState] = useState(selected);

  useEffect(() => {
    // consoleLog('useEffect selected', selected);
    setSelectedState(selected);
  }, [selected]);

  const __onSelect = (item: any) => {
    // consoleLog('__onSelect', item);
    setSelectedState(item?.value);
    onSelect && onSelect(item);
  };

  return (
    <Wrap autoMargin={false} style={[styles.container, style]}>
      <Wrap autoMargin={false} style={styles.rowContainer}>
        <Row autoMargin={false} style={styles.row}>
          {options.map((item, index) => {
            return (
              <Wrap
                key={index.toString()}
                autoMargin={false}
                style={styles.col}>
                <TouchableItem
                  style={[
                    styles.item,
                    // @ts-ignore
                    selectedState == item?.value && styles.selected,
                  ]}
                  onPress={() => {
                    __onSelect(item);
                  }}>
                  <Typography
                    size={14}
                    text={item?.name}
                    style={{textAlign: 'center'}}
                    color={
                      selectedState == item?.value
                        ? Theme.colors.primaryColor
                        : Theme.colors.white
                    }
                    ff={Theme.fonts.ThemeFontLight}
                  />
                </TouchableItem>
              </Wrap>
            );
          })}
        </Row>
      </Wrap>
    </Wrap>
  );
};

export default Toggle;
