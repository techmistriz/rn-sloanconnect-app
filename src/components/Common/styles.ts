import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  safeView: {flex: 1},
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
