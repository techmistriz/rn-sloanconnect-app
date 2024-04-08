import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalStyle from 'src/utils/GlobalStyles';
import {styles} from './styles';
import {ImageViewerProps} from './types';
import ImageView from 'react-native-image-viewing';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

// const __images = [
//   {
//     uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
//   },
// ];

const Index = ({
  style,
  visible,
  images = [],
  imageIndex = 0,
  ...props
}: ImageViewerProps) => {
  // consoleLog('ImageViewer images==>', images);
  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={() =>
        props?.onRequestClose && props?.onRequestClose(false)
      }
    />
  );
};

export default Index;
