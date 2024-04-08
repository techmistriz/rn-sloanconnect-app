import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 15,
    // backgroundColor: Theme.colors.primaryColor,
    // borderWidth: 1,
    // borderColor: 'yellow',
  },
  mainItemContainer: {
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    // paddingVertical: 20,
  },
  itemContainer: {
    // borderBottomWidth: 1,
    // borderBottomColor: Theme?.colors?.primaryColor2,
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginRight: -10,
    // paddingVertical: 10,
  },
});
