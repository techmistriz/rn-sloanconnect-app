import {TextStyle, ViewStyle} from 'react-native';

export type VectorIconProps = {
  color?: string;
  name: string;
  size?: number;
  iconPack?:
    | 'Ionicons'
    | 'AntDesign'
    | 'FontAwesome'
    | 'Feather'
    | 'EvilIcons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'FontAwesome5'
    | 'FontAwesome6'
    | 'Entypo'
    | 'SimpleLineIcons';
  onPress?: () => void;
  containerStyle?: ViewStyle | ViewStyle[] | {};
  style?: ViewStyle | ViewStyle[];
};
