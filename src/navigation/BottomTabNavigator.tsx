import React, {useState} from 'react';
import {View, Pressable, Dimensions, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationIcon from './NavigationIcon';
import Theme, {generateBoxShadowStyle} from 'src/theme';
import {constants} from 'src/common';
import DeviceDashboard from '../screens/DeviceDashboard';
import DeviceSettingsApplying from '../screens/DeviceSettingsApplying';
import DeviceDiagnostics from '../screens/DeviceDiagnostics';
import DeviceDiagnosticResults from '../screens/DeviceDiagnosticResults';
import DeviceDiagnosticTroubleshoot from '../screens/DeviceDiagnosticTroubleshoot';
import DeviceInfo from '../screens/DeviceInfo';
import DeviceHelp from '../screens/DeviceHelp';
import DeviceDisconnect from '../screens/DeviceDisconnect';
import {NavigationMenuIcon, NavigationNotificationIcon} from './NavigationIcon';
import Typography from 'src/components/Typography';
import AlertBox from 'src/components/AlertBox';
import NavigationService from 'src/services/NavigationService/NavigationService';

const Stack = createNativeStackNavigator();

type BottomTabNavigatorTabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

const DeviceDashboardStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceDashboard"
        component={DeviceDashboard}
        options={{
          headerShown: false,
          title: 'Device Dashboard', //Set Header Title
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        }}
      />
      <Stack.Screen
        name="DeviceSettingsApplying"
        component={DeviceSettingsApplying}
        options={{
          headerShown: false,
          title: 'Settings Applying', //Set Header Title
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const DeviceDiagnosticsStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceDiagnostics"
        component={DeviceDiagnostics}
        options={{
          headerShown: false,
          title: 'Device Diagnostics',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        }}
      />
      <Stack.Screen
        name="DeviceDiagnosticResults"
        component={DeviceDiagnosticResults}
        options={{
          headerShown: false,
          title: 'Diagnostics Results',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        }}
      />
      <Stack.Screen
        name="DeviceDiagnosticTroubleshoot"
        component={DeviceDiagnosticTroubleshoot}
        options={{
          headerShown: false,
          title: 'Diagnostics Results',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const DeviceInfoStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceInfo"
        component={DeviceInfo}
        options={({navigation}) => ({
          headerShown: false,
          // headerRight: () => NavigationNotificationIcon(navigation),
          title: 'DeviceInfo', //Set Header Title
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        })}
      />
    </Stack.Navigator>
  );
};

const DeviceHelpStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceHelp"
        component={DeviceHelp}
        options={({navigation}) => ({
          headerShown: false,
          // headerRight: () => NavigationNotificationIcon(navigation),
          title: 'DeviceInfo', //Set Header Title
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        })}
      />
    </Stack.Navigator>
  );
};

const DeviceDisconnectStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceDisconnect"
        component={DeviceDisconnect}
        options={({navigation}) => ({
          headerShown: false,
          // headerRight: () => NavigationNotificationIcon(navigation),
          title: 'DeviceInfo', //Set Header Title
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: Theme.fonts.ThemeFontRegular,
          },
        })}
      />
    </Stack.Navigator>
  );
};

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  const [disconnectModal, setDisconnectModal] = useState<boolean>(false);
  var mainContainerStyle = {};

  return (
    <View
      style={[
        styles.mainContainer,
        // generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717'),
        mainContainerStyle,
      ]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            // We are not using DeviceDiagnosticsStack & DeviceDisconnectStack due to bottom tabs
            // We don't use bottom tab on DeviceDiagnostics & DeviceDisconnect
            if (route?.name == 'DeviceDisconnectStack') {
              setDisconnectModal(true);
            } else if (route?.name == 'DeviceDiagnosticsStack') {
              navigation.navigate('DeviceDiagnostics');
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        if (route?.name == 'DeviceDashboardStack') {
          return null;
        }

        return (
          <View key={index} style={[styles.mainItemContainer]}>
            <Pressable
              onPress={onPress}
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: isFocused
                  ? Theme.colors.tabActiveBGColor
                  : Theme.colors.tabBGColor,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NavigationIcon route={label} isFocused={isFocused} />
                <Typography
                  size={12}
                  text={options.tabBarLabel}
                  style={{
                    textAlign: 'left',
                  }}
                  color={
                    isFocused
                      ? Theme.colors.tabActiveTextColor
                      : Theme.colors.tabTextColor
                  }
                  ff={Theme.fonts.ThemeFontLight}
                />
              </View>
            </Pressable>
          </View>
        );
      })}

      <AlertBox
        visible={disconnectModal}
        title="Disconnect"
        message={'Are you sure you want to disconnect?'}
        onCancelPress={() => {
          setDisconnectModal(false);
        }}
        onOkayPress={() => {
          setDisconnectModal(false);
          NavigationService.resetAllAction('DeviceDisconnect');
        }}
      />
    </View>
  );
};

// create bottom tab navigator
const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="DeviceHelp"
      backBehavior="initialRoute"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      <BottomTab.Screen
        name="DeviceDashboardStack"
        component={DeviceDashboardStack}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Home',
        }}
      />
      <BottomTab.Screen
        name="DeviceDiagnosticsStack"
        component={DeviceDiagnosticsStack}
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Diagnostics',
        }}
      />
      <BottomTab.Screen
        name="DeviceInfoStack"
        component={DeviceInfoStack}
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Details',
        }}
      />
      <BottomTab.Screen
        name="DeviceHelpStack"
        component={DeviceHelpStack}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Help',
        }}
      />
      <BottomTab.Screen
        name="DeviceDisconnectStack"
        component={DeviceDisconnectStack}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Disconnect',
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    position: 'absolute',
    height: 60,
    width: constants.screenWidth,
    bottom: 0,
    backgroundColor: Theme.colors.tabContainerBGColor,
    // borderRadius: 10,
    // marginHorizontal: constants.screenWidth * 0.05,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.lightGray,
  },
  mainItemContainer: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Theme.colors.lightGray,
    padding: 0,
  },
});

export default BottomTabNavigator;
