import {StyleSheet} from 'react-native';
import {constants} from 'src/common';
import Theme from 'src/theme';

// BottomSheet styles
export const styles = StyleSheet.create({
  modalBox: {
    overflow: 'hidden',
    width: constants.screenWidth,
    height: constants.screenHeight - 200,
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'flex-end',
    paddingBottom: 10,
  },
  line: {
    width: 30,
    height: 4,
    backgroundColor: Theme.colors.gray4,
    marginBottom: 12,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
});
