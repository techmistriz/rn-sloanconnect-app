import React, {useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationIcon from './NavigationIcon';
import Theme from 'src/theme';
import {constants} from 'src/common';
import DeviceDashboard from '../screens/DeviceDashboard';
import DeviceDiagnostics from '../screens/DeviceDiagnostics';
import DeviceDiagnosticResults from '../screens/DeviceDiagnosticResults';
import DeviceDiagnosticTroubleshoot from '../screens/DeviceDiagnosticTroubleshoot';
import DeviceInfo from '../screens/DeviceInfo';
import DeviceHelp from '../screens/DeviceHelp';
import DeviceDisconnect from '../screens/DeviceDisconnect';
import Typography from 'src/components/Typography';
import AlertBox from 'src/components/AlertBox';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Header from 'src/components/Header';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import I18n from 'src/locales/Transaltions';

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
          headerShown: true,
          header: () => (
            <Header hasBackButton={false} hasProfileButton={true} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const DeviceDiagnosticsStack = (props: any) => {
  return (
    <Stack.Navigator>
      {/* Create fake screen for bottom tabs  */}
      <Stack.Screen
        name="DeviceDiagnostics"
        component={DeviceDiagnostics}
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      {/* <Stack.Screen
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
      /> */}
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
          headerShown: true,
          header: () => <Header />,
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
          headerShown: true,
          header: () => <Header />,
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
          headerShown: true,
          header: () => <Header />,
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

          const currentRoute = NavigationService?.getCurrentRoute();

          if (!isFocused && !event.defaultPrevented) {
            // We are not using DeviceDiagnosticsStack & DeviceDisconnectStack due to bottom tabs UI
            // We don't use bottom tab on DeviceDiagnostics & DeviceDisconnect
            if (route?.name == 'DeviceDisconnectStack') {
              setDisconnectModal(true);
            } else if (route?.name == 'DeviceDiagnosticsStack') {
              navigation.navigate('DeviceDiagnostics', {
                previousScreen: currentRoute?.name ?? undefined,
              });
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
                paddingBottom: 20,
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
        title={I18n.t('device_dashboard.DISCONNECTING_HEADING')}
        message={I18n.t('device_dashboard.DISCONNECTING_MSG')}
        okayText={I18n.t('button_labels.OK')}
        cancelText={I18n.t('button_labels.CANCEL')}
        onCancelPress={() => {
          setDisconnectModal(false);
        }}
        onOkayPress={() => {
          setDisconnectModal(false);
          NavigationService.navigate('DeviceDisconnect');
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
      initialRouteName="DeviceDashboardStack"
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
          tabBarLabel: I18n.t('device_landing.TAB_HOME'),
        }}
      />
      <BottomTab.Screen
        name="DeviceDiagnosticsStack"
        component={DeviceDiagnosticsStack}
        options={{
          unmountOnBlur: true,
          tabBarLabel: I18n.t('device_landing.TAB_DIAGNOSTICS'),
        }}
      />
      <BottomTab.Screen
        name="DeviceInfoStack"
        component={DeviceInfoStack}
        options={{
          unmountOnBlur: true,
          tabBarLabel: I18n.t('device_landing.TAB_DETAILS'),
        }}
      />
      <BottomTab.Screen
        name="DeviceHelpStack"
        component={DeviceHelpStack}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: I18n.t('device_landing.TAB_HELP'),
        }}
      />
      <BottomTab.Screen
        name="DeviceDisconnectStack"
        component={DeviceDisconnectStack}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: I18n.t('device_landing.TAB_DISCONNECT'),
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
    height: constants.BOTTOM_TAB_HEIGHT,
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
