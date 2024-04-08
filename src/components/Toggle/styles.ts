import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {},
  rowContainer: {
    backgroundColor: Theme.colors.primaryColor2,
    borderRadius: 5,
  },
  row: {
    // flex: 1,
  },
  col: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
  },
  item: {
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: Theme.colors.transparent,
  },
  selected: {
    backgroundColor: Theme.colors.white,
  },
});
