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
  profileContentContainer: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#E9E9E9',
    paddingVertical: 10,
    // justifyContent: 'flex-start',
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Theme?.colors?.secondaryColor,
    alignSelf: 'center',
    backgroundColor: Theme.colors.gray,
  },
  profileName: {
    marginBottom: 5,
    alignSelf: 'center',
  },
  profileItemContainer: {
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    // paddingVertical: 20,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
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
