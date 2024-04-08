import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 20,
    // justifyContent: 'center',
    // padding: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section2: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section3: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section4: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});
