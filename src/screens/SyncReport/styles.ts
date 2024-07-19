import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: Theme.Layout.MEDIUM_PADDING,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: Theme.colors.black,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    // width: '100%',
    // padding: 20,
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 1,
    justifyContent: 'flex-start',
    // justifyContent: 'flex-end',
    // width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // paddingBottom: 20,
    // width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});
