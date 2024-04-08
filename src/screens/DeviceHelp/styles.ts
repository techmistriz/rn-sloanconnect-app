import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 70,
  },
  sectionContainer: {
    flex: 1,
  },
  section1: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  formWrapper: {
    flex: 1,
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
    overflow: 'hidden',
    marginBottom: 40,
  },
  inputWrapper: {
    paddingBottom: 10,
    // paddingHorizontal: Layout.SMALL_PADDING,
    // borderWidth: 1,
    // borderColor: 'green'
    // marginBottom: 90,
  },
});
