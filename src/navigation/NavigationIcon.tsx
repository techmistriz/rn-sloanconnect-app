import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Image,
} from 'react-native';
import Theme from 'src/theme';
import VectorIcon from 'src/components/VectorIcon';
import TouchableItem from 'src/components/TouchableItem';
import {Images} from 'src/assets';
import {getImgSource} from 'src/utils/Helpers/HelperFunction';

interface NavigationIconProps {
  route: string;
  isFocused: boolean;
}

const NavigationIcon = ({route, isFocused}: NavigationIconProps) => {
  const renderIcon = (route: string, isFocues: boolean) => {
    let height: number = 25;
    let width: number = 25;

    switch (route) {
      case 'DeviceDashboardStack':
        return isFocues ? (
          <VectorIcon
            iconPack="MaterialCommunityIcons"
            name={'home'}
            size={height}
            color={Theme?.colors?.tabActiveIconColor}
          />
        ) : (
          <VectorIcon
            iconPack="MaterialCommunityIcons"
            name={'home'}
            size={height}
            color={Theme?.colors?.tabIconColor}
          />
        );
      case 'DeviceDiagnosticsStack':
        return isFocues ? (
          <VectorIcon
            iconPack="Feather"
            name={'crosshair'}
            size={height}
            color={Theme?.colors?.tabActiveIconColor}
          />
        ) : (
          <VectorIcon
            iconPack="Feather"
            name={'crosshair'}
            size={height}
            color={Theme?.colors?.tabIconColor}
          />
        );
      case 'DeviceInfoStack':
        return isFocues ? (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'list-alt'}
            size={height}
            color={Theme?.colors?.tabActiveIconColor}
          />
        ) : (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'list-alt'}
            size={height}
            color={Theme?.colors?.tabIconColor}
          />
        );
      case 'DeviceHelpStack':
        return isFocues ? (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'help-outline'}
            size={height}
            color={Theme?.colors?.tabActiveIconColor}
          />
        ) : (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'help-outline'}
            size={height}
            color={Theme?.colors?.tabIconColor}
          />
        );
      case 'DeviceDisconnectStack':
        return isFocues ? (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'power-settings-new'}
            size={height}
            color={Theme?.colors?.tabActiveIconColor}
          />
        ) : (
          <VectorIcon
            iconPack="MaterialIcons"
            name={'power-settings-new'}
            size={height}
            color={Theme?.colors?.tabIconColor}
          />
        );
      default:
        break;
    }
  };

  return <View>{renderIcon(route, isFocused)}</View>;
};

export const NavigationMenuIcon = (
  navigation: any,
  style: ViewStyle = {
    marginLeft: 5,
    overflow: 'hidden',
    borderRadius: 50,
    justifyContent: 'center',
  },
) => (
  <View style={style}>
    <TouchableItem
      // borderless
      onPress={() => {
        navigation.toggleDrawer();
      }}
      style={{padding: 10}}>
      {/* <VectorIcon
        iconPack="MaterialCommunityIcons"
        name={'menu'}
        size={25}
        color={Theme?.colors?.colors.white}
      /> */}
      <Image
        // @ts-ignore
        source={getImgSource(Images.menu)}
        style={{height: 25, width: 25, tintColor: Theme.colors.white}}
        resizeMode="contain"
      />
    </TouchableItem>
  </View>
);

export const NavigationBackIcon = (
  navigation: any,
  style: ViewStyle = {marginRight: 15},
) => (
  <TouchableItem
    borderless={true}
    onPress={() => navigation.canGoBack() && navigation.goBack()}
    style={style}>
    <VectorIcon
      iconPack="Ionicons"
      name={'chevron-back'}
      size={30}
      color={Theme.colors.white}
    />
  </TouchableItem>
);

export const NavigationNotificationIcon = (
  navigation: any,
  style: ViewStyle = {},
) => (
  <TouchableItem
    borderless={true}
    onPress={() => navigation.navigate('Notification')}
    style={style}>
    <VectorIcon
      iconPack="MaterialCommunityIcons"
      name={'bell-badge-outline'}
      // name={'bell-outline'}
      size={25}
      color={Theme.colors.black}
    />
  </TouchableItem>
);

export const RefreshIcon = (
  onPress?: any,
  style: ViewStyle = {
    backgroundColor: Theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
) => (
  <View
    style={{
      borderRadius: 5,
      overflow: 'hidden',
    }}>
    <TouchableItem
      borderless={false}
      onPress={onPress && onPress}
      style={style}>
      <VectorIcon
        iconPack="MaterialCommunityIcons"
        name={'refresh'}
        size={25}
        color={Theme.colors.primaryColor}
      />
    </TouchableItem>
  </View>
);

const styles = StyleSheet.create({});

export default NavigationIcon;
