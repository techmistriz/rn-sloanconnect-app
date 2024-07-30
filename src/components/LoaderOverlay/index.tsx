/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';
import I18n from 'src/locales/Transaltions';

const Index = ({
  loading,
  loadingText = I18n.t('common.PLEAE_WAIT_TEXT'),
}: {
  loading: boolean;
  loadingText?: string;
}) => {
  // const [_loading, _setLoading] = useState(false);
  return (
    <>
      {loading && (
        <View style={styles.container}>
          <View style={styles.overlayContainer}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Theme.colors.white} />
              <Text style={styles.loaderText}>{loadingText}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Index;
