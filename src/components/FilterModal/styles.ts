import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';
import {constants} from 'src/common';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // width: constants.screenWidth,
    // height: '100%',
  },
  mainContainer2: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Theme.colors.white,
    width: '100%',
    // paddingHorizontal:10,
    // height: height,
    // elevation: 4,
  },
  leftSideContainer: {
    // flex: 1,
    width: '30%',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // borderRightWidth: 1,
    // borderRightColor: Theme.colors.gray,
    backgroundColor: Theme.colors.gray,
    // paddingLeft: 10,
  },
  leftSide: {
    // marginTop: 10,
  },
  leftSideItem: {
    paddingVertical: 15,
    paddingLeft: 10,
  },

  rightSideContainer: {
    flex: 1,
    // width: '70%',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rightSide: {
    // paddingVertical: 20,
    paddingLeft: 10,
    marginTop: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterSubtitle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  checkbox: {
    alignSelf: 'center',
    // height: 25,
    // width: 25,
  },
});
