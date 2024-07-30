import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import {styles} from './styles';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Icons} from 'src/assets';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import I18n from 'src/locales/Transaltions';

// LoadMoreLoaderText Props
type LoaderProps = {
  visible: boolean;
  loadingText?: string;
  loadingContainerStyle?: ViewStyle;
  activityIndicatorColor?: string;
  activityIndicatorStyle?: ViewStyle;
  loadingTextStyle?: TextStyle;
  loaderType?: 'image' | 'default';
};

// LoadMore
const Index = ({
  visible = false,
  loadingText = I18n.t('common.LOADING_TEXT'),
  loadingContainerStyle,
  activityIndicatorColor = Theme.colors.primaryColor,
  activityIndicatorStyle,
  loadingTextStyle,
  loaderType,
}: LoaderProps) => (
  <View>
    {visible ? (
      <View
        style={{...styles.__loadingContainerStyle, ...loadingContainerStyle}}>
        {loaderType == 'image' ? (
          <Image
            // @ts-ignore
            source={getImgSource(Icons?.loader2)}
            style={{width: 80, height: 10}}
            resizeMode="contain"
          />
        ) : (
          <ActivityIndicator
            color={activityIndicatorColor}
            style={{
              ...styles.__activityIndicatorStyle,
              ...activityIndicatorStyle,
            }}
          />
        )}

        <Typography
          size={12}
          text={loadingText}
          style={{...styles.__loadingTextStyle, ...loadingTextStyle}}
          color={Theme.colors.primaryColor}
        />
      </View>
    ) : null}
  </View>
);

export default Index;
