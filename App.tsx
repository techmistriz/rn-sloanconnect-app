import 'react-native-gesture-handler';
import React from 'react';
import {
  YellowBox,
  LogBox,
  StatusBar,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Theme from 'src/theme';
import {Provider as StoreProvider} from 'react-redux';
import store, {persistor} from 'src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import NetworkLost from 'src/components/NetworkLost';
import crashlytics from '@react-native-firebase/crashlytics';
import MainNavigator from 'src/navigation/MainNavigator';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import LoaderOverlay from 'src/components/LoaderOverlay';
import LoaderOverlay3 from 'src/components/LoaderOverlay3';
import {SafeAreaView as SafeAreaViewCustom} from 'react-native-safe-area-context';

enableScreens();
// TODO: Remove when fixed
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Warning: componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.',
  'Non-serializable values were found in the navigation state',
  'new NativeEventEmitter',
]);

// const STATUSBAR_HEIGHT = StatusBar.currentHeight;
// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
// const STATUSBAR_HEIGHT = constants.HAS_NOTCH && constants.isIOS ? 0 : 0;

// const styles = StyleSheet.create({
//   statusBar: {
//     // height: STATUSBAR_HEIGHT ?? (constants.HAS_NOTCH && constants.isIOS ? 60 : 0),
//     height: STATUSBAR_HEIGHT,
//   },
// });

// // consoleLog('STATUSBAR_HEIGHT==>', STATUSBAR_HEIGHT);
// const MyStatusBar = ({backgroundColor, ...props}: any) => (
//   <View style={[styles.statusBar, {backgroundColor}]}>
//     <SafeAreaView>
//       <StatusBar translucent backgroundColor={backgroundColor} {...props} />
//     </SafeAreaView>
//   </View>
// );

function App() {
  const [isInternet, setIsInternet] = React.useState(true);

  try {
    return (
      <StoreProvider store={store}>
        <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
          <SafeAreaProvider>
            <SafeAreaViewCustom
              edges={['top']}
              style={{backgroundColor: Theme.colors.statusBarColor}}
            />
            {/* <MyStatusBar
              backgroundColor={Theme.colors.statusBarColor}
              barStyle={Theme.colors.statusBarContent}
              translucent={true}
            /> */}

            <StatusBar
              // @ts-ignore
              barStyle={Theme.colors.statusBarContent}
              backgroundColor={Theme.colors.statusBarColor}
              translucent={false}
            />
            <MainNavigator />
            <FlashMessage position="bottom" />
            <LoaderOverlay3 />
            {/* <NetworkLost
              isInternet={isInternet}
              setIsInternet={setIsInternet}
              buttonPress={() => {}}
            /> */}
          </SafeAreaProvider>
        </PersistGate>
      </StoreProvider>
    );
  } catch (error: any) {
    //* error handling
    crashlytics()?.recordError(error);
    return null;
  }
}

export default App;
