import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {MutableRefObject} from 'react';
import {LoaderOverlayRefProp} from './types';
import LoaderOverlayController from './LoaderOverlayController';

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

  /**
   * Instace ref function to handle show loader
   * Pass some `message` string as first attribute to display a loader
   *
   * ```
   * this.refs.YOUR_REF.showLoaderOverlay("Your message)
   * ```
   */
  // const showLoaderOverlay = (message: string) => {
  //   if (!!message) {
  //     setMessage(message);
  //     setLoading(true);
  //   }
  // };

  /**
   * Instace ref function to programmatically hide message
   *
   * ```
   * this.refs.YOUR_REF.hideLoaderOverlay()
   * ```
   */
  // const hideLoaderOverlay = () => {
  //   setLoading(false);
  // };

  return (
    <View
      ref={loaderOverlayRef}
      style={[
        loading
          ? styles.container
          : {
              zIndex: -11,
              display: 'none',
            },
      ]}>
      {loading && (
        <View style={styles.container}>
          <View style={styles.overlayContainer}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Theme.colors.white} />
              <Text style={styles.loaderText}>{message}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default forwardRef(LoaderOverlay);
