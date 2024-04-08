import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000097',
    zIndex: 999,
  },
  overlayContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  loaderContainer: {
    // width: 120,
    // height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    backgroundColor: Theme.colors.black,
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.ThemeFontRegular,
    paddingHorizontal: 20,
  },
});
