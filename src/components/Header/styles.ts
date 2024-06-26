import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  __headerContainerStyle: {
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.transparent,
    // backgroundColor: Theme.colors.gradientBg1,
    // borderWidth: 1,
    paddingVertical: 15,
  },
  __headerLeftStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  __headerRightStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  __headerCenterStyle: {
    flex: 1,
    justifyContent: 'center',
    // borderWidth: 1,
  },
});
