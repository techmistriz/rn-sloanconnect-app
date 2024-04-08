import {StyleSheet} from 'react-native';
import Theme, {hexToRGBA} from 'src/theme';
import {constants} from 'src/common';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
  },
  searchWrapper: {
    marginBottom: 15,
    // borderWidth: 1,
  },
  inputContainer: {
    // borderWidth: 1,
    // borderColor: '#d8dadc',
    borderRadius: 5,
    backgroundColor: '#D2FDFF',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#404752',
    paddingRight: 10,
    paddingLeft: 45,
    height: 50,
  },
  section2: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    paddingHorizontal: Theme.Layout.MEDIUM_PADDING,
  },
  flatListContainer: {
    flex: 1,
    paddingVertical: 30,
    // borderWidth: 1,
    // borderColor: 'yellow',
  },
  touchableWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: hexToRGBA(Theme.colors.white, 0.7),
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.primaryColor,
  },
  touchableItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    borderRadius: 15,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    // elevation: 4,
  },
  box: {
    alignItems: 'flex-start',
  },
  image: {
    // flex: 1,
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    // borderWidth: 1,
    // borderColor: 'red',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 35,
    width: constants.screenWidth - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  modalCloseBtnContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    position: 'absolute',
    right: 0,
    padding: 15,
  },
  modalImageContainer: {},
  modalImage: {
    justifyContent: 'center',
    width: 116,
    height: 116,
    borderRadius: 100,
  },
  modalTextContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  buttonContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: '100%',
  },
});
