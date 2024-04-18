/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
// import App from 'react-native-ble-manager/example/App';
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background! index.js==>', remoteMessage);
// });

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
