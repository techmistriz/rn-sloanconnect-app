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
  },
  overlayContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 200,
    height: 200,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {color: '#fff', marginTop: 10, fontSize: 18},
});
