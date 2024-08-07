import React from 'react';
import {Platform, ViewStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Theme from 'src/theme';
import {styles} from './styles';
import TouchableItem from 'src/components/TouchableItem';
import {VectorIconProps} from './types';

// VectorIcon
const VectorIcon = ({
  color = Theme.colors.black,
  name,
  size = 22,
  iconPack = 'Feather',
  onPress,
  containerStyle = {},
  style,
}: VectorIconProps) => {
  const iconSize = Platform.OS === 'ios' ? size + 2 : size;

  return onPress ? (
    <TouchableItem
      borderless
      style={[styles._containerStyle, containerStyle]}
      onPress={onPress}>
      <GetIconPack
        iconPack={iconPack}
        name={name}
        color={color}
        size={iconSize}
        style={[
          {
            height: iconSize,
            width: iconSize,
          },
          styles._icon,
          style,
        ]}
      />
    </TouchableItem>
  ) : (
    <GetIconPack
      iconPack={iconPack}
      name={name}
      color={color}
      size={iconSize}
      style={[
        {
          height: iconSize,
          width: iconSize,
        },
        styles._icon,
        style,
      ]}
    />
  );
};

export default VectorIcon;

const GetIconPack = ({iconPack, ...rest}: any) => {
  if (iconPack === 'Entypo') {
    return <Entypo {...rest} />;
  }
  if (iconPack === 'Ionicons') {
    return <Ionicons {...rest} />;
  }
  if (iconPack === 'AntDesign') {
    return <AntDesign {...rest} />;
  }
  if (iconPack === 'FontAwesome') {
    return <FontAwesome {...rest} />;
  }
  if (iconPack === 'Feather') {
    return <Feather {...rest} />;
  }
  if (iconPack === 'EvilIcons') {
    return <EvilIcons {...rest} />;
  }
  if (iconPack === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons {...rest} />;
  }
  if (iconPack === 'MaterialIcons') {
    return <MaterialIcons {...rest} />;
  }
  if (iconPack === 'FontAwesome5') {
    return <FontAwesome5 {...rest} />;
  }
  if (iconPack === 'FontAwesome6') {
    return <FontAwesome6 {...rest} />;
  }
  if (iconPack === 'SimpleLineIcons') {
    return <SimpleLineIcons {...rest} />;
  }
  if (iconPack === 'Octicons') {
    return <Octicons {...rest} />;
  }

  return <Feather {...rest} />;
};
