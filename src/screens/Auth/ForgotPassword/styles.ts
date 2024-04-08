import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.Layout.LARGE_PADDING,
  },
  section1: {
    flex: 1,
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  section2: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    // justifyContent: 'flex-end',
    // backgroundColor: Theme.colors.surface2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // padding: Theme.Layout.MEDIUM_PADDING,
    // marginTop: 10,
  },
  imageContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // borderWidth: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  formWrapper: {
    flex: 1,
    paddingTop: 20,
    // borderWidth: 1,
    // borderColor: 'green'
  },
  inputWrapper: {
    marginBottom: 15,
    // paddingHorizontal: Layout.SMALL_PADDING,
    // borderWidth: 1,
    // borderColor: 'green'
  },
  inputContainer: {
    // borderWidth: 1,
    // borderColor: '#d8dadc',
    borderRadius: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: Theme.colors.inputTextColor,
    paddingRight: 15,
    paddingLeft: 15,
    height: 60,
    textAlign: 'center',
  },
});
