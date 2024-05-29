import {StyleSheet} from 'react-native';
import Theme from 'src/theme';
import {constants} from 'src/common';
import {moderateScale} from 'src/utils/Scale';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
    padding: 20,
  },
  main: {
    // flex: 1,
    backgroundColor: Theme.colors.white,
    // marginHorizontal:
    //   constants.screenWidth > constants.screenHeight
    //     ? moderateScale(100)
    //     : moderateScale(20),
    width: '100%',
    borderRadius: moderateScale(5),
    // borderWidth: 1,
    // borderColor: 'red',
    padding: 20,
    alignSelf: 'center',
  },
  titleView: {
    // borderWidth: 1,
    // alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  appName: {
    color: Theme.colors.primaryColor,
    fontSize: moderateScale(16),
    fontFamily: Theme.fonts.ThemeFontMedium,
    textAlign: 'center',
  },
  message: {
    color: Theme.colors.black,
    fontSize: moderateScale(12),
    fontFamily: Theme.fonts.ThemeFontLight,
    marginTop: 10,
    textAlign: 'left',
  },
  btnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  btnView: {
    flex: 1,
    // paddingVertical: moderateScale(10),
    // width: '50%',
  },
  btnText: {
    color: Theme.colors.black,
    // fontSize: moderateScale(14),
    textTransform: 'uppercase',
  },
  btn: {
    // width: constants.screenWidth / 2 - 60,
    // marginHorizontal: 10,
    shadowColor: Theme.colors.transparent,
    elevation: 4,
  },
  cancelBtn: {},
  okBtn: {},
});
