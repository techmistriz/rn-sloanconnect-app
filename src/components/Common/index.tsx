import React from 'react';
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
import {
  KeyboardAvoidProps,
  TochableWrapProps,
  WrapProps,
  ContainerProps,
  RowProps,
  ColProps,
  CardProps,
  RippleWrapProps,
} from './types';
import {styles} from './styles';
import TouchableItem from 'src/components/TouchableItem';

export const Container = ({
  style,
  autoMargin = true,
  children,
}: ContainerProps) => {
  return (
    <View
      style={[
        GlobalStyle.container,
        {marginTop: autoMargin ? 20 : 0},
        ,
        style,
      ]}>
      {children}
    </View>
  );
};

export const Row = ({style, children, autoMargin = true}: RowProps) => {
  return (
    <View style={[GlobalStyle.row, {marginTop: autoMargin ? 20 : 0}, style]}>
      {children}
    </View>
  );
};

export const Col = ({style, children, autoMargin = true}: ColProps) => {
  return (
    <View style={[GlobalStyle.col, {marginTop: autoMargin ? 20 : 0}, style]}>
      {children}
    </View>
  );
};

export const Card = ({style, children, autoMargin = true}: CardProps) => {
  return (
    <View
      style={[
        GlobalStyle.card,
        styles.card,
        {marginTop: autoMargin ? 20 : 0},
        style,
      ]}>
      {children}
    </View>
  );
};

export const Wrap = ({style, autoMargin = true, children}: WrapProps) => {
  return (
    <View style={[GlobalStyle.wrap, {marginTop: autoMargin ? 20 : 0}, style]}>
      {children}
    </View>
  );
};

export const RippleWrap = ({style, children, onPress}: RippleWrapProps) => {
  return (
    // @ts-ignore
    <TouchableItem style={[GlobalStyle.rippleWrap, style]} onPress={onPress}>
      {React.Children.only(children)}
    </TouchableItem>
  );
};

export const TochableWrap = ({style, children, onPress}: TochableWrapProps) => {
  return (
    <TouchableOpacity
      style={[GlobalStyle.tochableWrap, style]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export const KeyboardAvoidWrap = ({style, children}: KeyboardAvoidProps) => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1, ...style}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}>
      {children}
    </KeyboardAvoidingView>
  );
};
