import {StyleSheet} from 'react-native';
import Theme from 'src/theme';
import {moderateScale, verticalScale} from 'src/utils/Scale';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.Layout.MEDIUM_PADDING,
  },
  sectionContainer: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    // justifyContent: 'flex-end',
    // backgroundColor: Theme.colors.surface2,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    // padding: 12,
    marginTop: 10,
    // alignSelf: 'stretch',
    // overflow: 'hidden',
  },
  section1: {
    justifyContent: 'flex-start',
    // borderWidth: 1,
  },
  section2: {
    flex: 1,
    // borderWidth: 1,
  },
  imageContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'green',
  },
  logoTitleContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: "center",
    // borderWidth: 1,
  },
  touchableWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Theme.colors.white,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 4,
  },
  touchableItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: 150,
    // padding: 20,
    // marginHorizontal: 10,
    paddingVertical: verticalScale(30),
  },
  box: {
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  image: {
    // flex: 1,
    justifyContent: 'center',
    width: 130,
    // height: 40,
  },
});
