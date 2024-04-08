import {StyleSheet} from 'react-native';
import GlobalStyle from 'src/utils/GlobalStyles';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: Theme.Layout.MEDIUM_PADDING,
    // marginBottom: 130,
    // borderWidth: 1,
    // borderColor: 'red',
    // overflow: 'hidden',
  },
  screenMargin:{
    marginHorizontal: 20,
  },
  screenPadding:{
    paddingHorizontal: 20,
  },
  sectionContainer: {
    flex: 1,
    // width: '100%',
    // padding: 20,
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 1,
    // justifyContent: 'flex-start',
    // justifyContent: 'flex-end',
    // width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section2: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // paddingBottom: 20,
    // width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  container: {
    // flex: 1,
    // width: '100%',
    // paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  row: {
    // paddingHorizontal: 20,
    alignItems: 'center',
  },
  leftStyle: {},
  centerStyle: {},
  rightStyle: {},
});
