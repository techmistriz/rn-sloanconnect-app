/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, Text, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Theme from 'src/theme';
import TouchableItem from 'src/components/TouchableItem';
import { getFileName} from 'src/utils/FilePicker';

export default function ImageCropperPicker(props: any) {
  const {
    showModal,
    setShowModal,
    onSelect,
    width = null,
    height = null,
    cropping = true,
  } = props;

  const cameraLaunch = () => {
    setShowModal(false);
    let options = {
      width: 0,
      height: 0,
      cropping: cropping,
      freeStyleCropEnabled: true,
    };

    if (width) {
      options.width = width;
    }
    if (height) {
      options.height = height;
    }

    ImagePicker.openCamera(options)
      .then(image => {
        // console.log("openCamera image", image);
        // const source = image?.path;
        onSelect({
          fileName: getFileName(image?.path),
          type: image?.mime,
          uri: image?.path,
        });
      })
      .catch((error: any) => {
        console.info('openCamera Error:', error);
      });
  };

  const imageGalleryLaunch = () => {
    setShowModal(false);
    let options = {
      width: 0,
      height: 0,
      cropping: cropping,
      freeStyleCropEnabled: true,
    };

    if (width) {
      options.width = width;
    }
    if (height) {
      options.height = height;
    }

    ImagePicker.openPicker(options)
      .then(image => {
        // console.log("openPicker image", image);
        // const source = image?.path;
        onSelect({
          fileName: getFileName(image?.path),
          type: image?.mime,
          uri: image?.path,
        });
      })
      .catch((error: any) => {
        console.info('openPicker Error:', error);
      });
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType={'slide'}
      onRequestClose={() => {
        setShowModal(!showModal);
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.6)',
        }}>
        <View
          style={{
            backgroundColor: Theme.colors.white,
            width: '90%',
            alignItems: 'center',
            borderRadius: 6,
            elevation: 4,
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: Theme.colors.black,
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 20,
            }}
            onPress={() => cameraLaunch()}>
            Take Photo
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: Theme.colors.gray,
              width: '100%',
            }}
          />

          <Text
            style={{
              color: Theme.colors.black,
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 20,
            }}
            onPress={() => imageGalleryLaunch()}>
            Choose From Gallery
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: Theme.colors.gray,
              width: '100%',
            }}
          />

          <TouchableItem
            style={{
              flexDirection: 'row',
              borderBottomStartRadius: 6,
              borderBottomEndRadius: 6,
            }}
            onPress={() => {
              setShowModal(false);
            }}>
            <Text
              style={{
                color: Theme.colors.red,
                fontSize: 18,
                paddingVertical: 20,
                textAlign: 'center',
                flex: 1,
              }}>
              Cancel
            </Text>
          </TouchableItem>
        </View>
      </View>
    </Modal>
  );
}
