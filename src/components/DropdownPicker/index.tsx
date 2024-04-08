/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  // FlatList,
  Image,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import Divider from 'src/components/Divider';
import TouchableItem from 'src/components/TouchableItem';
import EmptyState from 'src/components/EmptyState';
import {styles} from './styles';
import {constants} from 'src/common';
import {Images, Icons} from 'src/assets';
import {FlashList as FlatList} from '@shopify/flash-list';
import { getImgSource } from 'src/utils/Helpers/HelperFunction';

const DROPDOWN_ITEM_HEIGHT = 50;
const DROPDOWN_PICKER_MIN_HEIGHT = 200;
const DROPDOWN_PICKER_MAX_HEIGHT = constants.screenHeightCalc;
const EXTRA_HEIGHT = 100;

export default function DropdownPicker(props: any) {
  const {
    dialogVisible,
    setDialogVisible,
    onSelectedItem,
    title,
    data = [],
    dropdownKeyValue = {id: 'id', title: 'name'},
    noRecordTitle = 'No record.',
    multiple = false,
    dropdownSelectedItem = multiple ? [] : 0,
  } = props;

  const [multipleDataState, setMultipleDataState] =
    useState(dropdownSelectedItem);
  const [dropdownSelectedItemState, setDropdownSelectedItemState] =
    useState(dropdownSelectedItem);

  const dropdownDialogRef = useRef();
  const dropdownHEIGHT = calculateDropdownHeight(data);

  const __onSelectedItem = (item: any, index: any) => {
    if (multiple) {
      __setMultipleDataState(item);
    } else {
      __setSingleDataState(item);
    }
  };

  const __setSingleDataState = (item: any) => {
    setDropdownSelectedItemState(item?.id);
    onSelectedItem(item, multiple);
    setDialogVisible(false);
  };

  const __setMultipleDataState = (item: any) => {
    let multipleDataStateTmp = [...multipleDataState];

    if (
      typeof multipleDataStateTmp != 'undefined' &&
      Array.isArray(multipleDataStateTmp)
    ) {
      let status = multipleDataStateTmp.find(data => data === item?.id);
      if (status) {
        setMultipleDataState((multipleDataStateTmp: any) =>
          multipleDataStateTmp.filter((data: any) => {
            return data !== item?.id;
          }),
        );
        return;
      }

      multipleDataStateTmp.push(item?.id);
      setMultipleDataState(multipleDataStateTmp);
    }
  };

  const checkIfChecked = (item: any) => {
    if (
      typeof multipleDataState != 'undefined' &&
      Array.isArray(multipleDataState)
    ) {
      let status = multipleDataState.find(data => data === item?.id);
      if (status) {
        return true;
      }
    }
    return false;
  };

  const submit = () => {
    onSelectedItem(multipleDataState, multiple);
    setDialogVisible(false);
  };

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <View key={index}>
      <TouchableItem
        // style={{width: '100%'}}
        onPress={() => {
          __onSelectedItem(item, index);
        }}>
        <View style={[styles.row, styles.dropdownPickerRow]}>
          <View style={styles.leftSide}>
            <View style={styles.checkboxContainer}>
              {multiple ? (
                <CheckBox
                  style={{borderRadius: 20}}
                  disabled={false}
                  value={checkIfChecked(item)}
                  onValueChange={newValue => __setMultipleDataState(item)}
                />
              ) : (
                <>
                  {dropdownSelectedItem == item?.id ? (
                    <TouchableItem borderless style={styles.btn}>
                      <Image style={styles.radioImg} source={getImgSource(Icons.radioOn)} />
                    </TouchableItem>
                  ) : (
                    <TouchableItem
                      borderless
                      onPress={() => {
                        __setSingleDataState(item);
                      }}
                      style={styles.btn}>
                      <Image style={styles.radioImg} source={getImgSource(Icons.radioOff)} />
                    </TouchableItem>
                  )}
                </>
              )}
            </View>

            <Typography
              size={16}
              text={item[dropdownKeyValue?.title]}
              style={styles.dropdownListText}
              color={Theme.colors.black}
            />

            {dropdownKeyValue?.subtitle && (
              <Typography
                size={13}
                text={` - ${
                  dropdownKeyValue?.subtitlePrefix
                    ? dropdownKeyValue?.subtitlePrefix
                    : ''
                } ${item[dropdownKeyValue?.subtitle]} ${
                  dropdownKeyValue?.subtitlePostfix
                    ? dropdownKeyValue?.subtitlePostfix
                    : ''
                }`}
                style={styles.dropdownListText}
                color={Theme.colors.black}
              />
            )}
          </View>
        </View>
      </TouchableItem>
      <Divider type="inset" color="#ddd" />
    </View>
  );

  return (
    <Modal
      ref={dropdownDialogRef}
      visible={dialogVisible}
      transparent={true}
      animationType={'slide'}
      onRequestClose={() => {
        setDialogVisible(false);
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setDialogVisible(false);
        }}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContentContainer}>
        <View style={[styles.modalContent, {height: dropdownHEIGHT}]}>
          <View style={styles.modalContent2}>
            <View style={styles.header}>
              {multiple && (
                <TouchableItem
                  borderless={true}
                  style={styles.headerBtn}
                  onPress={() => setDialogVisible(false)}>
                  <VectorIcon
                    iconPack="MaterialIcons"
                    name={'close'}
                    size={30}
                    color={Theme.colors.white}
                  />
                </TouchableItem>
              )}
              <Typography
                size={16}
                text={title}
                style={styles.headerTitle}
                color={Theme.colors.black}
              />
              {multiple ? (
                <TouchableItem
                  borderless={true}
                  style={styles.headerBtn}
                  onPress={() => submit()}>
                  <VectorIcon
                    iconPack="MaterialIcons"
                    name={'check'}
                    size={30}
                    color={Theme.colors.white}
                  />
                </TouchableItem>
              ) : (
                <TouchableItem
                  borderless={true}
                  style={styles.headerBtn}
                  onPress={() => setDialogVisible(false)}>
                  <VectorIcon
                    iconPack="MaterialIcons"
                    name={'close'}
                    size={30}
                    color={Theme.colors.white}
                  />
                </TouchableItem>
              )}
            </View>

            <View style={styles.itemContainer}>
              {data.length > 0 ? (
                <FlatList
                  data={data}
                  estimatedItemSize={50}
                  renderItem={renderItem}
                  keyExtractor={(item: any) =>
                    item[dropdownKeyValue.id].toString()
                  }
                />
              ) : (
                <Typography
                  size={16}
                  text={noRecordTitle}
                  style={styles.noRecordTitle}
                  color={Theme.colors.black}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const calculateDropdownHeight = (data: any) => {
  let dynamicHeight = DROPDOWN_PICKER_MIN_HEIGHT;
  if (
    typeof data.length != 'undefined' &&
    data.length != null &&
    data.length > 0
  ) {
    dynamicHeight = data.length * DROPDOWN_ITEM_HEIGHT;
    dynamicHeight += EXTRA_HEIGHT;
  }

  // console.log("data.length", data.length);
  // console.log("dynamicHeight", dynamicHeight);

  return dynamicHeight > DROPDOWN_PICKER_MAX_HEIGHT
    ? DROPDOWN_PICKER_MAX_HEIGHT
    : dynamicHeight;
};
