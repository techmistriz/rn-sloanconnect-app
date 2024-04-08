import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

// EmptyState Styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primaryColor,
  },
  title: {
    marginBottom: 15,
    fontSize: 15,
    color: Theme.colors.black,
    fontFamily: Theme.fonts.ThemeFontRegular,
  },
  message: {
    paddingHorizontal: 40,
    paddingBottom: 30,
    fontSize: 12,
    textAlign: 'center',
    color: Theme.colors.black,
    fontFamily: Theme.fonts.ThemeFontRegular,
  },
});
