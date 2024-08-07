import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationService from 'src/services/NavigationService/NavigationService';
import BottomTabNavigator from './BottomTabNavigator';

// Screens
import SplashScreen from 'src/screens/SplashScreen';
import Welcome from 'src/screens/Welcome';
import Permission from 'src/screens/Permission';
import Login from 'src/screens/Auth/Login';
import Register from 'src/screens/Auth/Register';
import RegisterInvitation from 'src/screens/Auth/RegisterInvitation';
import RegisterSuccess from 'src/screens/Auth/RegisterSuccess';
import ForgotPassword from 'src/screens/Auth/ForgotPassword';
import ResetPassword from 'src/screens/Auth/ResetPassword';
import ResetPasswordSuccess from 'src/screens/Auth/ResetPasswordSuccess';
import Otp from 'src/screens/Auth/Otp';
import VerifyEmail from 'src/screens/Auth/VerifyEmail';
import Settings from 'src/screens/Settings';
import Profile from 'src/screens/Profile';
import EditProfile from 'src/screens/Profile/EditProfile';
import ChangePassword from 'src/screens/Profile/ChangePassword';
import SyncReport from 'src/screens/SyncReport';
import Language from 'src/screens/Profile/Language';

//Cms
import Help from 'src/screens/Cms/Help';
import Terms from 'src/screens/Cms/Terms';
import Invitation from 'src/screens/Cms/Invitation';
import DeviceSearching from 'src/screens/DeviceSearching';
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
import Header from 'src/components/Header';

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
          name="Permission"
          component={Permission}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            title: 'Login',
            header: () => <Header headerBackgroundType="white" title=" " />,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: true,
            title: 'Register',
            header: () => <Header headerBackgroundType="white" title=" " />,
          }}
        />
        <Stack.Screen
          name="RegisterInvitation"
          component={RegisterInvitation}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="RegisterSuccess"
          component={RegisterSuccess}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="ResetPasswordSuccess"
          component={ResetPasswordSuccess}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={{
            headerShown: false,
            title: '',
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
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            title: 'Profile',
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: true,
            title: 'Edit Profile',
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: true,
            title: 'Change Password',
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{
            headerShown: true,
            title: 'Help',
            header: () => <Header headerBackgroundType="white" title=" " />,
          }}
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
          name="DeviceSearching"
          component={DeviceSearching}
          options={{
            headerShown: false,
            // header: () => <Header />,
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
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="DeviceDiagnosticTroubleshoot"
          component={DeviceDiagnosticTroubleshoot}
          options={{
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="DeviceDisconnect"
          component={DeviceDisconnect}
          options={{
            headerShown: true,
            header: () => <Header hasBackButton={false} />,
          }}
        />

        <Stack.Screen
          name="ActivationMode"
          component={ActivationMode}
          options={{
            headerShown: true,
            header: () => <Header title="Activation Mode" />,
          }}
        />
        <Stack.Screen
          name="LineFlush"
          component={LineFlush}
          options={{
            headerShown: true,
            header: () => <Header title="Line Flush" />,
          }}
        />
        <Stack.Screen
          name="FlowRate"
          component={FlowRate}
          options={{
            headerShown: true,
            header: () => <Header title="Flow Rate" />,
          }}
        />
        <Stack.Screen
          name="FlowRateInput"
          component={FlowRateInput}
          options={{
            headerShown: true,
            header: () => <Header title="Flow Rate" />,
          }}
        />
        <Stack.Screen
          name="SensorRange"
          component={SensorRange}
          options={{
            headerShown: true,
            header: () => <Header title="Sensor Range" />,
          }}
        />
        <Stack.Screen
          name="Notes"
          component={Notes}
          options={{
            headerShown: true,
            // headerRight: () => <Header route={route?.params?.image} />
            header: () => <Header title="Notes" />,
          }}
        />
        <Stack.Screen
          name="SyncReport"
          component={SyncReport}
          options={{
            headerShown: true,
            // headerRight: () => <Header route={route?.params?.image} />
            header: () => <Header title="Sync Report" />,
          }}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          options={{
            headerShown: true,
            // headerRight: () => <Header route={route?.params?.image} />
            header: () => <Header title="Language" />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
