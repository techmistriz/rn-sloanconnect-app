import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  row: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    borderTopWidth: 1,
    borderColor: Theme.colors.lightGray,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    // marginBottom: 20,
    position: 'absolute',
    bottom: 0,
  },
  col: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 5,
  },
  item: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: Theme.colors.lightGray,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
