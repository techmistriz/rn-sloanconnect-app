import {settingsActionTypes} from 'src/redux/types';

export interface SettingsProps {
  loading: boolean;
  settings: {
    isNotification: boolean;
    language: string;
  };
}

const initialState: SettingsProps = {
  loading: false,
  settings: {
    isNotification: false,
    language: 'en',
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
