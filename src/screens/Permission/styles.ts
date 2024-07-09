import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    // justifyContent: 'center',
    paddingTop: 30,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    padding: 30,
    // alignItems: 'center',
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section4: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
