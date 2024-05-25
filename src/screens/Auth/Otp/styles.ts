import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    flex: 1,
  },
  section1: {
    flex: 1,
    // justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
    paddingTop: 40,
  },
  section2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  imageContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // borderWidth: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  formWrapper1: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '100%',
    marginVertical: 10,
  },
  formWrapper: {
    // flex: 1,
    // paddingTop: 20,
    borderWidth: 1,
    borderColor: Theme.colors.midGray,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    paddingRight: 15,
    paddingLeft: 15,
  },

  otpInput: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // alignContent: 'center',
    // alignSelf: 'center',
    width: 40,
    height: 40,
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
