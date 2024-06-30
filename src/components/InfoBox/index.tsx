import React from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {Fonts} from 'src/assets';
import {constants} from 'src/common';
import {moderateScale} from 'src/utils/Scale';
import {Button} from 'src/components/Button';
import {styles} from './styles';

/**
 *
 * Common customize alert box
 */
const Index = ({
  visible = false,
  onRequestClose,
  animationType,
  title,
  message,
  okayText = 'OK',
  onOkayPress,
  messageStyle,
}: any) => {
  /**component render method */
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onRequestClose && onRequestClose()}
      animationType={animationType || 'fade'}
      supportedOrientations={[
        'landscape',
        'landscape-left',
        'landscape-right',
        'portrait',
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => onRequestClose && onRequestClose()}>
        <TouchableWithoutFeedback>
          <View style={styles.main}>
            <View
              style={[
                styles.titleView,
                {
                  // alignItems:
                  //   Platform.OS == 'android' ? 'flex-start' : 'center',
                },
              ]}>
              <Text style={styles.title}>{title || constants.APP_NAME}</Text>
              <Text style={[styles.message, messageStyle]}>{message}</Text>
            </View>
            <View style={styles.btnWrap}>
              <Button
                title={okayText}
                onPress={() => onOkayPress && onOkayPress()}
                style={[styles.btn, styles.okBtn]}
                textStyle={{fontSize: 12}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default Index;
