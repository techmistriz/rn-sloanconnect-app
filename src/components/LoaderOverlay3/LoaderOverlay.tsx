import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {View, ActivityIndicator, Text, Image} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';
import {LoaderOverlayRefProp} from './types';
import LoaderOverlayController from './LoaderOverlayController';
import {Icons} from 'src/assets';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';

const LoaderOverlay = () => {
  const loaderOverlayRef = useRef<LoaderOverlayRefProp>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  useLayoutEffect(() => {
    LoaderOverlayController.setLoaderOverlayRef(loaderOverlayRef);
  }, []);

  useImperativeHandle(
    loaderOverlayRef,
    () => ({
      showLoaderOverlay: (message = 'Loading...') => {
        consoleLog(
          'LoaderOverlay useImperativeHandle setLoaderOverlayRef called',
        );

        setMessage(message);
        setLoading(true);
      },
      hideLoaderOverlay: () => {
        consoleLog(
          'LoaderOverlay useImperativeHandle setLoaderOverlayRef called',
        );

        setLoading(false);
      },
    }),
    [],
  );

  return (
    <View
      ref={loaderOverlayRef}
      style={[
        styles.container,
        loading && {
          zIndex: 999999,
        },
      ]}>
      {loading && (
        <View style={styles.container}>
          <View style={styles.overlayContainer}>
            <View style={styles.loaderContainer}>
              <Image
                // @ts-ignore
                source={getImgSource(Icons?.loader)}
                style={{width: 30, height: 30}}
                resizeMode="contain"
              />
              <Text style={styles.loaderText}>{message}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default forwardRef(LoaderOverlay);
