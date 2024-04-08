import {StyleSheet} from 'react-native';
import Theme from 'src/theme';

export const styles = StyleSheet.create({
  touchableWrapper: {
    overflow: 'hidden',
    borderRadius: 5,
  },
  __buttonStyle: {
    width: '100%',
    height: 45,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  __defaultButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.darkGray,
    backgroundColor: Theme.colors.darkGray,
  },
  __primaryButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.primaryColor,
    backgroundColor: Theme.colors.primaryColor,
  },
  __secondaryButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.secondaryColor,
    backgroundColor: Theme.colors.secondaryColor,
  },
  __linkButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.primaryColor,
    backgroundColor: Theme.colors.transparent,
  },
  __successButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.green,
    backgroundColor: Theme.colors.green,
  },
  __dangerButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.red,
    backgroundColor: Theme.colors.red,
  },
  __warningButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.yellow,
    backgroundColor: Theme.colors.yellow,
  },
  __disabledButtonStyle: {
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    backgroundColor: Theme.colors.lightGray,
  },
  __textStyle: {
    color: Theme.colors.white,
  },
  __defaultButtonTextStyle: {
    color: Theme.colors.white,
  },
  __primaryButtonTextStyle: {
    color: Theme.colors.white,
  },
  __secondaryButtonTextStyle: {
    color: Theme.colors.primaryColor,
  },
  __linkButtonTextStyle: {
    color: Theme.colors.primaryColor,
  },
  _successButtonTextStyle: {
    color: Theme.colors.white,
  },
  __dangerButtonTextStyle: {
    color: Theme.colors.white,
  },
  __warningButtonTextStyle: {
    color: Theme.colors.white,
  },
  __disabledButtonTextStyle: {
    color: Theme.colors.white,
  },
});
