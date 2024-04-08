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
import {constants, colors} from 'src/common';
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
  cancelText = 'CANCEL',
  onCancelPress,
  onOkayPress,
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
              <Text style={styles.appName}>{title || constants.AppName}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
            <View style={styles.btnWrap}>
              <Button
                type={'default'}
                title={cancelText}
                onPress={() => onCancelPress && onCancelPress()}
                style={[styles.btn, styles.cancelBtn]}
                textStyle={{fontSize: 12}}
              />
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
