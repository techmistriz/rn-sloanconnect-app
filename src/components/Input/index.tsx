import React from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {InputProps} from './types';
import {styles} from './styles';
import Theme from 'src/theme';
import TouchableItem from 'src/components/TouchableItem';
import { constants } from 'src/common';

// Input
const Input = ({
  onRef,
  accessibilityLabel,
  onChangeText,
  onFocus,
  inputFocused,
  onSubmitEditing,
  returnKeyType,
  blurOnSubmit,
  onKeyPress,
  keyboardType,
  autoCapitalize = 'none',
  maxLength,
  placeholder,
  placeholderTextColor = Theme.colors.inputPlaceholderColor,
  value,
  inputTextColor,
  secureTextEntry,
  editable = true,
  spellCheck = false,
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  borderColor,
  focusedBorderColor,
  inputContainerStyle,
  inputStyle,
  left,
  leftStyle,
  right,
  rightStyle,
  onPress,
}: InputProps) =>
  onPress ? (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        borderRadius: inputContainerStyle?.borderRadius || 15,
      }}>
      <TouchableItem
        onPress={onPress}
        style={[
          styles.container,
          //@ts-ignore
          inputContainerStyle && inputContainerStyle,
          //@ts-ignore
          inputFocused && {borderColor: focusedBorderColor},
        ]}>
        <>
          {left ? (
            <View style={[styles.left, leftStyle && leftStyle]}>{left}</View>
          ) : null}
          <View style={{flex: 1, pointerEvents: 'none'}}>
            <TextInput
              ref={onRef}
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              onKeyPress={onKeyPress}
              onSubmitEditing={onSubmitEditing}
              blurOnSubmit={blurOnSubmit}
              returnKeyType={returnKeyType}
              // inputFocused={inputFocused}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              maxLength={maxLength}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              secureTextEntry={secureTextEntry}
              editable={editable}
              spellCheck={spellCheck}
              multiline={multiline}
              numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
              minHeight={
                Platform.OS === 'ios' && numberOfLines
                  ? 20 * numberOfLines
                  : null
              }
              style={[
                styles.textInput,
                //@ts-ignore
                inputTextColor && {color: inputTextColor},
                inputStyle,
                //@ts-ignore
                multiline && {height: 25 * numberOfLines, verticalAlign: 'top'},
              ]}
            />
          </View>
          {right ? (
            <View style={[styles.right, rightStyle && rightStyle]}>
              {right}
            </View>
          ) : null}
        </>
      </TouchableItem>
    </View>
  ) : (
    <View
      style={[
        styles.container,
        //@ts-ignore
        inputContainerStyle && inputContainerStyle,
        inputFocused && {borderColor: focusedBorderColor},
      ]}>
      {left ? (
        <View style={[styles.left, leftStyle && leftStyle]}>{left}</View>
      ) : null}
      <TextInput
        ref={onRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        returnKeyType={returnKeyType}
        inputFocused={inputFocused}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        editable={editable}
        spellCheck={spellCheck}
        multiline={multiline}
        numberOfLines={constants.isIOS ? null : numberOfLines}
        minHeight={constants.isIOS && numberOfLines ? 20 * numberOfLines : null}
        style={[
          styles.textInput,
          //@ts-ignore
          inputTextColor && {color: inputTextColor},
          inputStyle,
          //@ts-ignore
          multiline && {height: 'auto', verticalAlign: 'top'},
        ]}
      />
      {right ? (
        <View style={[styles.right, rightStyle && rightStyle]}>{right}</View>
      ) : null}
    </View>
  );

export default Input;
