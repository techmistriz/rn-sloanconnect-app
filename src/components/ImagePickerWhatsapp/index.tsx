/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Modal, Text, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Theme from 'src/theme';
import TouchableItem from 'src/components/TouchableItem';
import { getFileName, selectFile} from 'src/utils/FilePicker';
import {BottomSheet} from 'src/components/BottomSheet';
import {calculateDropdownHeight} from './helpers';
import Divider from 'src/components/Divider';
import VectorIcon from 'src/components/VectorIcon';
import Typography from 'src/components/Typography';
import {styles} from './styles';

export default function ImageCropperPicker({
  title,
  showModal,
  setShowModal,
  onSelect,
  onRemovePress,
  onSelectDocument,
  width = null,
  height = null,
  cropping = true,
  showRemoveOption = false,
  showDocumentChooseOption = false,
}: any) {
  const modalRef: any = useRef();
  const [dropdownHEIGHT] = useState(() => {
    return 200;
  });

  const cameraLaunch = () => {
    modalRef.current.closeModal();
    const _TIMEOUT = setTimeout(() => {
      __cameraLaunch();
      clearTimeout(_TIMEOUT);
    }, 500);
  };

  const __cameraLaunch = () => {
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
    modalRef.current.closeModal();
    const __TIMEOUT = setTimeout(() => {
      __imageGalleryLaunch();
      clearTimeout(__TIMEOUT);
    }, 500);
  };

  const __imageGalleryLaunch = () => {
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

  const onDocumentPress = async () => {
    modalRef.current.closeModal();
    const __TIMEOUT = setTimeout(() => {
      __onDocumentPress();
      clearTimeout(__TIMEOUT);
    }, 500);
  };

  const __onDocumentPress = async () => {
    try {
      const documentObj = await selectFile();
      onSelectDocument && onSelectDocument(documentObj);
    } catch (error) {}
  };

  return (
    <BottomSheet
      ref={modalRef}
      visible={showModal}
      height={dropdownHEIGHT}
      onClosed={() => setShowModal(false)}>
      <View
        style={[
          styles.rowContainer,
          styles.horizontalPadding,
          {paddingBottom: 10},
        ]}>
        <Typography
          size={20}
          text={title}
          style={styles.dropdownTitle}
          color={Theme.colors.black}
        />

        <VectorIcon
          iconPack="Ionicons"
          name="close"
          color={Theme.colors.black}
          size={25}
          onPress={() => {
            modalRef.current.closeModal();
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          // borderWidth: 1,
          marginBottom: 20,
        }}>
        <TouchableItem
          style={{
            paddingVertical: 0,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
          onPress={() => cameraLaunch()}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                // flex: 1,
                justifyContent: 'center',
                borderColor: '#ddd',
                borderRadius: 50,
                borderWidth: 1,
                height: 50,
                width: 50,
              }}>
              <VectorIcon
                iconPack="Ionicons"
                name="camera"
                color={Theme.colors.primaryColor}
                size={25}
              />
            </View>
            <Typography
              size={16}
              text={'Camera'}
              style={styles.subTitle}
              color={Theme.colors.black}
            />
          </View>
        </TouchableItem>

        <TouchableItem
          style={{
            paddingVertical: 0,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
          onPress={() => imageGalleryLaunch()}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                // flex: 1,
                justifyContent: 'center',
                borderColor: '#ddd',
                borderRadius: 50,
                borderWidth: 1,
                height: 50,
                width: 50,
              }}>
              <VectorIcon
                iconPack="Ionicons"
                name="image"
                color={Theme.colors.primaryColor}
                size={25}
              />
            </View>
            <Typography
              size={16}
              text={'Gallery'}
              style={styles.subTitle}
              color={Theme.colors.black}
            />
          </View>
        </TouchableItem>

        {showDocumentChooseOption && (
          <TouchableItem
            style={{
              padding: 20,
              // borderWidth: 1,
            }}
            onPress={() => {
              onDocumentPress();
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  // flex: 1,
                  justifyContent: 'center',
                  borderColor: '#ddd',
                  borderRadius: 50,
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                }}>
                <VectorIcon
                  iconPack="Ionicons"
                  name="documents-outline"
                  color={Theme.colors.primaryColor}
                  size={25}
                />
              </View>
              <Typography
                size={16}
                text={'Document'}
                style={styles.subTitle}
                color={Theme.colors.black}
              />
            </View>
          </TouchableItem>
        )}

        {showRemoveOption && (
          <TouchableItem
            style={{
              paddingVertical: 0,
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}
            onPress={onRemovePress}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  // flex: 1,
                  justifyContent: 'center',
                  borderColor: '#ddd',
                  borderRadius: 50,
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                }}>
                <VectorIcon
                  iconPack="Ionicons"
                  name="trash"
                  color={Theme.colors.red}
                  size={25}
                />
              </View>
              <Typography
                size={16}
                text={'Remove'}
                style={styles.subTitle}
                color={Theme.colors.black}
              />
            </View>
          </TouchableItem>
        )}
      </View>
    </BottomSheet>
  );
}
