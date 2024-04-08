import {StyleSheet} from 'react-native';
import {constants} from 'src/common';
import Theme, {hexToRGBA} from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: Theme.colors.black,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  sectionContainer: {
    flex: 1,
    // width: '100%',
    // padding: 20,
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section1: {
    flex: 1,
    marginTop: 20,
    // justifyContent: 'center',
    // width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
    alignItems: 'center',
  },
  section2: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  row: {
    // flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    // paddingHorizontal: 50,
    // width: constants.screenWidth - 40,
    // borderWidth: 1,
  },
  col: {},
  inputContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    // width: 100,
    backgroundColor: Theme.colors.primaryColor3,
    borderWidth: 1,
    borderColor: Theme.colors.primaryColor3,
    // marginHorizontal: 20,
  },
  textInput: {
    fontSize: 14,
    // paddingRight: 15,
    color: Theme.colors.white,
    // textAlign: 'center',
    verticalAlign: 'top',
    fontFamily: Theme.fonts.ThemeFontLight,
  },
});
