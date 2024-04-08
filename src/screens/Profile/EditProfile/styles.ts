import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';

/**component styling */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.Layout.MEDIUM_PADDING,
  },
  section1: {
    flex: 1,
    // borderWidth: 1,
  },
  section2: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 20,
    // borderWidth: 1,
    // borderColor: 'green',
  },
  parentItem: {
    marginTop: 70,
    borderRadius: 25,
    backgroundColor: hexToRGBA(Theme.colors.white, 0.7),
    padding: Theme.Layout.MEDIUM_PADDING,
    borderWidth: 2,
    borderColor: Theme.colors.primaryColor,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: -70,
    // borderWidth: 1,
  },
  parentImage: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    borderWidth: 2,
    borderColor: Theme.colors.primaryColor,
    backgroundColor: Theme.colors.gray,
  },
  parentImageEditContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Theme.colors.primaryColor,
    backgroundColor: Theme.colors.white,
    padding: 5,
  },
  formWrapper: {
    // flex: 1,
    paddingTop: 40,
  },
  inputWrapper: {
    marginBottom: 15,
    // paddingHorizontal: Theme.colors.Layout.SMALL_PADDING,
  },
  inputContainer: {
    // borderWidth: 1,
    // borderColor: '#d8dadc',
    borderRadius: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    color: Theme.colors.inputTextColor,
    paddingRight: 10,
    paddingLeft: 10,
    height: 60,
    textAlign: 'center',
  },
});
