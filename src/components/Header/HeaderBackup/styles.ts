import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  __headerContainerStyle: {
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.transparent,
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
    // borderWidth:1
  },
});
