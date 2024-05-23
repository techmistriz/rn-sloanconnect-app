import React from 'react';
import {Easing, StatusBar, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Theme from 'src/theme';
import {NavigationBackIcon, NavigationNotificationIcon} from './NavigationIcon';
import BottomTabNavigator from './BottomTabNavigator';

// Screens
import SplashScreen from 'src/screens/SplashScreen';
import Welcome from 'src/screens/Welcome';
import Login from 'src/screens/Auth/Login';
import Register from 'src/screens/Auth/Register';
// import ForgotPassword from 'src/screens/Auth/ForgotPassword';
// import ResetPassword from 'src/screens/Auth/ResetPassword';
import Profile from 'src/screens/Profile';
// import EditProfile from 'src/screens/Profile/EditProfile';
import ChangePassword from 'src/screens/Profile/ChangePassword';
import Notification from 'src/screens/Notification';
import Settings from 'src/screens/Settings';

//Cms
import Help from 'src/screens/Cms/Help';
import Terms from 'src/screens/Cms/Terms';
import Invitation from 'src/screens/Cms/Invitation';
import ActivateDevice from 'src/screens/ActivateDevice';
import DeviceSearching from 'src/screens/DeviceSearching';
// import DeviceDashboard from 'src/screens/DeviceDashboard';
import DeviceDiagnostics from 'src/screens/DeviceDiagnostics';
import DeviceDiagnosticResults from 'src/screens/DeviceDiagnosticResults';
import DeviceDiagnosticTroubleshoot from 'src/screens/DeviceDiagnosticTroubleshoot';
import DeviceDisconnect from 'src/screens/DeviceDisconnect';
import ActivationMode from 'src/screens/DeviceSettings/ActivationMode';
import LineFlush from 'src/screens/DeviceSettings/LineFlush';
import FlowRate from 'src/screens/DeviceSettings/FlowRate';
import FlowRateInput from 'src/screens/DeviceSettings/FlowRate/FlowRateInput';
import SensorRange from 'src/screens/DeviceSettings/SensorRange';
import Notes from 'src/screens/DeviceSettings/Notes';
import DeviceInfo from 'src/screens/DeviceInfo';
import DeviceHelp from 'src/screens/DeviceHelp';

// create stack navigator
const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer
      ref={navigator => NavigationService.setTopLevelNavigator(navigator)}>
      <Stack.Navigator
        screenOptions={({navigation}) => ({
          // animation: 'slide_from_right',
          // animationDuration: 200,
          // headerLeft: () => NavigationBackIcon(navigation),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          // headerTitleStyle: {
          //   fontFamily: Theme.fonts.ThemeFontMedium,
          //   color: Theme.colors.headerTextColor,
          //   fontSize: 18,
          // },
          // headerStyle: {
          //   // backgroundColor: Theme.colors.gradientBg1,
          // },
        })}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            title: '',
          }}
        />

        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({navigation}) => ({
            // headerLeft: () => false,
            headerShown: true,
            title: 'My Profile',
          })}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: true,
            title: 'Change Password',
          }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: true,
            title: 'Settings',
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          // options={{
          //     headerShown: false,
          // }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          // options={{
          //     headerShown: false,
          // }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          // options={{
          //     headerShown: false,
          // }}
        />
        <Stack.Screen
          name="Invitation"
          component={Invitation}
          // options={{
          //     headerShown: false,
          // }}
        />
        <Stack.Screen
          name="ActivateDevice"
          component={ActivateDevice}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="DeviceSearching"
          component={DeviceSearching}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeviceDiagnostics"
          component={DeviceDiagnostics}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeviceDiagnosticResults"
          component={DeviceDiagnosticResults}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DeviceDiagnosticTroubleshoot"
          component={DeviceDiagnosticTroubleshoot}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeviceDisconnect"
          component={DeviceDisconnect}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ActivationMode"
          component={ActivationMode}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LineFlush"
          component={LineFlush}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FlowRate"
          component={FlowRate}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FlowRateInput"
          component={FlowRateInput}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SensorRange"
          component={SensorRange}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notes"
          component={Notes}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeviceInfo"
          component={DeviceInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeviceHelp"
          component={DeviceHelp}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
