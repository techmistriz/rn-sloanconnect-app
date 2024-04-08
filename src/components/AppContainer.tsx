import React from 'react';
import {StyleSheet, ViewStyle, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Theme, {hexToRGBA} from 'src/theme';
import {constants} from 'src/common';
import LoaderOverlay from './LoaderOverlay';
import LinearGradient from 'react-native-linear-gradient';
import Header from 'src/components/Header';
import {Wrap, Row} from 'src/components/Common';

// AppContainer Props
type AppContainerProps = {
  children: JSX.Element | JSX.Element[];
  safeAreaViewStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  scrollViewContentContainerStyle?: ViewStyle;
  bottomGutter?: number;
  scroll?: boolean;
  loading?: boolean;
  loadingText?: string;
  backgroundType?: string;
  headerContainerStyle?: ViewStyle;
  headerLeftStyle?: ViewStyle;
  headerRightStyle?: ViewStyle;
  haslogOutButton?: boolean;
  hasBackButton?: boolean;
  hasLeftButton?: boolean;
  hasRightButton?: boolean;
  hasHeader?: boolean;
  // onLeftPress?: boolean;
  // onRightPress?: boolean;
  // onLogoutPress?: boolean;
  // onBackPress?: boolean;
};

// AppContainer
const AppContainer = ({
  children,
  safeAreaViewStyle = {},
  scrollViewStyle = {},
  scrollViewContentContainerStyle = {},
  bottomGutter = 0,
  scroll = true,
  loading = false,
  loadingText = 'Loading...',
  backgroundType = 'solid',
  hasHeader = true,
  ...rest
}: AppContainerProps) => {
  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.__safeAreaViewStyle, safeAreaViewStyle]}>
      {scroll ? (
        <>
          {backgroundType == 'solid' ? (
            <View style={styles.linearGradient}>
              <ScrollView
                style={[styles.__scrollViewStyle, scrollViewStyle]}
                contentContainerStyle={[
                  styles.__scrollViewContentContainerStyle,
                  scrollViewContentContainerStyle,
                ]}>
                {hasHeader && <Header {...rest} />}

                {children}
                {bottomGutter > 0 && (
                  <View style={{height: bottomGutter}}></View>
                )}
              </ScrollView>
            </View>
          ) : (
            <LinearGradient
              start={{x: 0.0, y: 0.5}}
              end={{x: 0, y: 1.0}}
              // locations={[0, 0.5]}
              colors={[
                Theme.colors.gradientBg1,
                hexToRGBA(Theme.colors.gradientBg2, 0.7) as never,
              ]}
              style={styles.linearGradient}>
              <ScrollView
                style={[styles.__scrollViewStyle, scrollViewStyle]}
                contentContainerStyle={[
                  styles.__scrollViewContentContainerStyle,
                  scrollViewContentContainerStyle,
                ]}>
                {hasHeader && <Header {...rest} />}
                {children}
                {bottomGutter > 0 && (
                  <View style={{height: bottomGutter}}></View>
                )}
              </ScrollView>
            </LinearGradient>
          )}
        </>
      ) : (
        <>
          {backgroundType == 'solid' ? (
            <View style={styles.linearGradient}>
              <View style={[styles.__scrollViewStyle, scrollViewStyle]}>
                {hasHeader && <Header {...rest} />}
                {children}
                {bottomGutter > 0 && (
                  <View style={{height: bottomGutter}}></View>
                )}
              </View>
            </View>
          ) : (
            <LinearGradient
              start={{x: 0.0, y: 0.5}}
              end={{x: 0, y: 1.0}}
              // locations={[0, 0.5]}
              colors={[
                Theme.colors.gradientBg1,
                hexToRGBA(Theme.colors.gradientBg2, 0.7) as never,
              ]}
              style={styles.linearGradient}>
              <View style={[styles.__scrollViewStyle, scrollViewStyle]}>
                {hasHeader && <Header {...rest} />}
                {children}
                {bottomGutter > 0 && (
                  <View style={{height: bottomGutter}}></View>
                )}
              </View>
            </LinearGradient>
          )}
        </>
      )}
      {loading && <LoaderOverlay loading={true} loadingText={loadingText} />}
    </SafeAreaView>
  );
};

export default AppContainer;

// AppContainer Styles
const styles = StyleSheet.create({
  __safeAreaViewStyle: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    // borderWidth:1,
    // paddingBottom: 80
  },
  __scrollViewStyle: {
    flex: 1,
    // flexGrow: 1,
    // paddingTop: 10,
    // paddingHorizontal: 15,
    // borderWidth:1,
    // backgroundColor: 'rgba(255,0,0,0.1)'
  },
  __scrollViewContentContainerStyle: {
    // flex: 1,
    // borderWidth: 1,
    flexGrow: 1,
  },
  linearGradient: {
    flex: 1,
    paddingBottom: constants.isIOS ? 10 : 0,
  },
});
