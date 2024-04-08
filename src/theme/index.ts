import {Platform} from 'react-native';

export const fonts = {
  ThemeFontMedium: 'Roboto-Medium',
  ThemeFontRegular: 'Roboto-Regular',
  ThemeFontBold: 'Roboto-Bold',
  ThemeFontLight: 'Roboto-Light',
  ThemeFontThin: 'Roboto-Thin',
};

export const colors = {
  primaryColor: '#006CBB',
  primaryColor2: '#045fa0', // input bg/toggle bg color on Activation screen
  primaryColor3: '#4ca0d3', // input border color on Activation screen
  secondaryColor: '#E6E6E6',
  labelTextColor: '#000',
  labelBGColor: 'transparent',
  labelBorderColor: '#000',
  inputTextColor: '#000',
  inputBorderColor: '#C5C5C5',
  inputLabelColor: '#047fed',
  inputPlaceholderColor: '#C5C5C5',
  headerTextColor: '#fff',
  headerBGColor: '#FBF5F2',
  headerBorderColor: '#FBF5F2',
  iconColor1: '#fff',
  iconColor2: '#fff',
  statusBarColor: '#006CBB',
  statusBarContent: 'light-content',
  // Bottom Tabs
  tabContainerBGColor: '#fafafa',
  tabBGColor: '#fff',
  tabActiveBGColor: '#A3A3A3',
  tabIconColor: '#C5C5C5',
  tabActiveIconColor: '#fff',
  tabTextColor: '#484848',
  tabActiveTextColor: '#fff',
  // Bottom Tabs
  buttonTextColor: '#fff',
  buttonBgColor: '#fff',
  filterBadgeBgColor: '#fc4142',
  surface: '#fff',
  black: '#484848',
  white: '#fff',
  lightGray: '#E6E6E6',
  midGray: '#C5C5C5',
  darkGray: '#A3A3A3',
  gray: '#ddd',
  red: '#FE0000',
  blue: 'blue',
  pink: 'pink',
  yellow: '#F5A623',
  cyan: 'cyan',
  orange: 'orange',
  green: '#8ABF63',
  violet: 'violet',
  purple: 'purple',
  indigo: 'indigo',
  gradientBg1: '#006CBB',
  gradientBg2: '#006CBB',
  transparent: 'transparent',
};

export const fontSizes = {
  headLine: 24,
  body: 16,
  subheading: 14,
  caption: 10,
};

export const fontLineHeights = {
  headLine: 32,
  body: 24,
};

export const typography = {
  headLine: {
    fontFamily: fonts.ThemeFontMedium,
    fontSize: fontSizes.headLine,
    color: colors.labelTextColor,
    lineHeight: fontLineHeights.headLine,
  },
  body1: {
    fontFamily: fonts.ThemeFontMedium,
    fontWeight: 'bold',
    fontSize: fontSizes.body,
    color: colors.labelTextColor,
    lineHeight: fontLineHeights.body,
  },
  body2: {
    fontFamily: fonts.ThemeFontRegular,
    color: colors.gray,
    fontWeight: 'normal',
    fontSize: fontSizes.body,
    lineHeight: fontLineHeights.body,
  },
};

export const Layout = {
  SMALL_MARGIN: 10,
  SMALL_PADDING: 10,
  MEDIUM_MARGIN: 20,
  MEDIUM_PADDING: 20,
  LARGE_MARGIN: 30,
  LARGE_PADDING: 30,
};

export default {
  fonts,
  colors,
  fontSizes,
  fontLineHeights,
  typography,
  Layout,
};

export const hexToRGBA = (hex: string | undefined, opacity: number = 1) => {
  let c: any;
  try {
    if (hex && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
        'rgba(' +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
        ',' +
        opacity +
        ')'
      );
    }
  } catch (error) {
    return 'rgba(255,255,255,1)';
  }
};

export const generateBoxShadowStyle = (
  xOffset: any,
  yOffset: any,
  shadowColorIos: any,
  shadowOpacity: any,
  shadowRadius: any,
  elevation: any,
  shadowColorAndroid: any,
) => {
  let boxShadow = {};
  if (Platform.OS === 'ios') {
    boxShadow = {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    boxShadow = {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
  return boxShadow;
};
