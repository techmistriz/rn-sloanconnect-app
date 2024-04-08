import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baselayer: {
    position: 'absolute',
  },
  firstProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  secondProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  offsetLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  textContainerMain: {
    position: 'absolute',
  },
  textContainer: {
    flexDirection: 'row',
  },
  mainText:{

  },
  otherText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
