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
import I18n from 'src/locales/Transaltions';

const LoaderOverlay = () => {
  const loaderOverlayRef = useRef<LoaderOverlayRefProp>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(I18n.t('common.LOADING_TEXT'));

  useLayoutEffect(() => {
    LoaderOverlayController.setLoaderOverlayRef(loaderOverlayRef);
  }, []);

  useImperativeHandle(
    loaderOverlayRef,
    () => ({
      showLoaderOverlay: (message = I18n.t('common.LOADING_TEXT')) => {
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
