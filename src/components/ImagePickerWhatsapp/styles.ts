import {StyleSheet, I18nManager} from 'react-native';
import Theme from 'src/theme';

// ThemeTextInput Config
const isRTL = I18nManager.isRTL;
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 8,
    // paddingLeft: 20,
    // paddingVertical: 4,
    // paddingHorizontal: 4,
    // borderWidth: 1,
    // borderBottomWidth:1,
    // borderColor: 'rgba(0, 0, 0, 0.2)',
    width: INPUT_WIDTH,
    borderRadius: 3,
    backgroundColor: Theme.colors.white,
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    height: INPUT_HEIGHT,
    fontSize: 16,
    color: Theme.colors.secondaryColor,
    textAlign: isRTL ? 'right' : 'left',
    // borderWidth: 1,
  },
  left: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 9,
    left: 0,
    // borderWidth: 1,
    height: 50,
    width: 50,
  },
  right: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    right: 0,
    // borderWidth: 1,
    height: 40,
    width: 40,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  horizontalPadding: {
    paddingHorizontal: 16,
  },
  dropdownTitle: {
    fontWeight: '500',
    marginTop: 5,
  },
  subTitle: {
    marginTop: 5,
  },
  dropdownListText: {
    fontWeight: '500',
    color: '#000',
  },
});
