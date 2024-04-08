import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  row: {
    // flex: 1,
    // borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    // flexGrow: 1,
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  leftStyle: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
