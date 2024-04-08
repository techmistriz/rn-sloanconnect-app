import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalStyle from 'src/utils/GlobalStyles';
import {styles} from './styles';
import {VideoViewerProps} from './types';
import Video from 'react-native-video';
import {Wrap} from '../Common';
import VectorIcon from '../VectorIcon';
import Theme from 'src/theme';

const Index = ({style, visible, item, ...props}: VideoViewerProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() =>
        props?.onRequestClose && props?.onRequestClose(false)
      }>
      <Wrap autoMargin={false} style={styles.modalOverlay}>
        <Wrap autoMargin={false} style={styles.modalCloseBtnContainer}>
          <VectorIcon
            iconPack="MaterialCommunityIcons"
            name={'close'}
            size={25}
            color={Theme.colors.white}
            onPress={() => {
              props?.onRequestClose && props?.onRequestClose(false);
            }}
          />
        </Wrap>

        <Wrap autoMargin={false} style={styles.modalView}>
          <View style={styles.videoPlayerContainer}>
            <Video
              source={{uri: item?.video}} // Can be a URL or a local file.
              poster={item?.video_thumb}
              ref={(ref: any) => {
                props?.playerRef ? (props.playerRef = ref) : null;
              }} // Store reference
              onBuffer={props?.onBuffer ? props.onBuffer : null} // Callback when remote video is buffering
              onError={props?.videoError ? props.videoError : null} // Callback when video cannot be loaded
              style={styles.backgroundVideo}
              // resizeMode="cover"
              resizeMode={'contain'}
              // fullscreen={true}
              controls={true}
            />
          </View>
        </Wrap>
      </Wrap>
    </Modal>
  );
};

export default Index;
