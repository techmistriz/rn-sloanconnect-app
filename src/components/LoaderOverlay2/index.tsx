/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator, Text, Image} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';
import {Icons} from 'src/assets';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';

const Index = ({
  loading,
  loadingText = 'Applying...',
}: {
  loading: boolean;
  loadingText?: string;
}) => {
  return (
    <>
      {loading && (
        <View style={styles.container}>
          <View style={styles.overlayContainer}>
            <View style={styles.loaderContainer}>
              {/* <ActivityIndicator size="large" color={Theme.colors.white} /> */}
              <Image
                // @ts-ignore
                source={getImgSource(Icons?.loader)}
                style={{width: 30, height: 30}}
                resizeMode="contain"
              />
              <Text style={styles.loaderText}>{loadingText}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Index;
