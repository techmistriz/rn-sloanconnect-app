import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import VectorIcon from 'src/components/VectorIcon';
import Theme from 'src/theme';
import PropTypes from 'prop-types';
import {getImgSource} from 'src/utils/Helpers/HelperFunction';
import {styles} from './styles';

// EmptyState Props
type EmptyStateProps = {
  showIcon: boolean;
  iconName: string;
  image?: any;
  title: string;
  message: string;
};

// EmptyState
const EmptyState = ({
  iconName,
  image,
  title = 'No data',
  message = '',
}: EmptyStateProps) => (
  <View style={styles.container}>
    {iconName && (
      <View style={styles.iconContainer}>
        <VectorIcon
          iconPack="AntDesign"
          name={iconName}
          size={25}
          color={Theme.colors.primaryColor}
        />
      </View>
    )}
    {image && (
      <Image
        // @ts-ignore
        source={getImgSource(image)}
        style={{height: 120, width: 120, marginBottom: 20}}
        resizeMode="contain"
      />
    )}
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

// EmptyState.propTypes = {
//   showIcon: PropTypes.bool,
//   iconName: PropTypes.string,
//   title: PropTypes.string,
//   message: PropTypes.string,
// }

EmptyState.defaultProps = {
  showIcon: false,
  iconName: '',
  title: 'No data',
  message: '',
};

export default EmptyState;
