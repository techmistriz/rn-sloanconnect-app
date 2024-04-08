import {settingsActionTypes} from 'src/redux/types';

enum IsBiometricProps {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  BLOCKED = 'BLOCKED',
}

export interface SettingsProps {
  loading: boolean;
  settings: {
    isBiometric: IsBiometricProps;
    isNotification: boolean;
    type: number;
  };
}

const initialState: SettingsProps = {
  loading: false,
  settings: {
    isBiometric: IsBiometricProps.DISABLED,
    isNotification: false,
    type: 0,
  },
};

const settings = (state = initialState, action: any) => {
  switch (action.type) {
    case settingsActionTypes.SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case settingsActionTypes.SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload?.settings,
      };

    case settingsActionTypes.SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case settingsActionTypes.SETTINGS_RESET_DATA:
      return initialState;
    default:
      return state || initialState;
  }
};

export default settings;
