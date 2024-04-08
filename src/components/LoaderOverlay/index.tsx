/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';

const Index = ({
  loading,
  loadingText = 'Please wait...',
}: {
  loading: boolean;
  loadingText?: string;
}) => {
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlayContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Theme.colors.white} />
            <Text style={styles.loaderText}>{loadingText}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Index;
