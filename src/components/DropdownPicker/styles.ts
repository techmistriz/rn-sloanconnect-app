import {StyleSheet, I18nManager} from 'react-native';
import Theme from 'src/theme';
const DROPDOWN_ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // margin: '5%',
  },
  modalContent: {
    backgroundColor: Theme.colors.white,
    width: '100%',
    // borderRadius: 5,
    elevation: 4,
    flexDirection: 'column',
    // height: dropdownHEIGHT,
  },
  modalContent2: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primaryColor,
    padding: 5,
    // borderTopLeftRadius: 5,
    // borderTopEndRadius: 5,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'left',
    flex: 1,
    color: 'white',
    paddingLeft: 10,
  },
  headerBtn: {
    padding: 5,
  },
  itemContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  noRecordTitle: {
    textAlign: 'center',
    color: Theme.colors.gray,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  dropdownPickerRow: {
    height: DROPDOWN_ITEM_HEIGHT,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  dropdownListText: {
    fontWeight: '500',
    color: Theme.colors.black,
  },
  checkboxContainer: {
    paddingRight: 10,
  },
  radioImg: {
    height: 20,
    width: 20,
    // tintColor: Theme.colors.primaryColor,
  },
  btn: {
    flexDirection: 'row',
  },
});
