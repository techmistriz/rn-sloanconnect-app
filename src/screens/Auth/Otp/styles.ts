import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.Layout.MEDIUM_PADDING,
    // borderWidth: 1,
  },
  section2: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    // justifyContent: 'flex-end',

    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,

    // marginTop: 10,
  },
  formWrapper: {
    flex: 1,
    paddingTop: 20,
    // borderWidth: 1,
    // borderColor: 'green',
  },
  inputWrapper: {
    flex: 1,
    // marginBottom: 15,
    // paddingHorizontal: Layout.SMALL_PADDING,
    // borderWidth: 1,
    // borderColor: 'cyan',
  },
  inputOTPWrapper: {
    // flex: 1,
    // height: 200,
    // borderWidth: 1,
    // borderColor: 'green',
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'flex-start',
    // alignSelf: 'center',
  },
  otpInput: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // alignContent: 'center',
    // alignSelf: 'center',
    width: 62,
    height: 62,
    color: Theme.colors.white,
    backgroundColor: Theme.colors.primaryColor,
    borderWidth: 1,
    borderColor: Theme.colors.primaryColor,
    borderRadius: 8,
    fontSize: 26,
    fontFamily: Theme.fonts.ThemeFontBold,
    // marginLeft: 10,
  },
  styleHighLighted: {
    backgroundColor: Theme.colors.white,
    color: Theme.colors.primaryColor,
  },
});
