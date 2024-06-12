import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.black,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section2: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // position: 'absolute',
    // bottom: 80,
    // paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'black',
    justifyContent: 'center',
    // paddingBottom: 20,
  },
  container: {
    // flex: 1,
    // width: '100%',
    // paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  row: {
    // flex: 1,
    // paddingHorizontal: 20,
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'green',
  },
  col: {
    // flex: 1,
    width: '50%',
    // paddingHorizontal: 20,
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'blue',
  },
});
