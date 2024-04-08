import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  __loadingContainerStyle: {
    // flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  __activityIndicatorStyle: {
    paddingRight: 10,
  },
  __loadingTextStyle: {
    color: Theme.colors.black,
    fontSize: 15,
    textAlign: 'center',
  },
});
