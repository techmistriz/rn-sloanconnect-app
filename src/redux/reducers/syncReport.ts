import {syncReportActionTypes} from '../types';

/**
 * initial stat for reducer
 */
const initialState: {loading: boolean; status: number} = {
  loading: false,
  status: 0,
};

/**
 *
 * @param {*} state
 * @param {*} action
 * Reducer for sync report module
 */
const syncReportReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case syncReportActionTypes.SYNC_REPORT_REQUEST:
      return {
        ...state,
        status: 1,
      };
    case syncReportActionTypes.SYNC_REPORT_SUCCESS:
      return {
        ...state,
        status: 0,
      };
    case syncReportActionTypes.SYNC_REPORT_FAILURE:
      return {
        ...state,
        status: 0,
      };
    case syncReportActionTypes.SYNC_REPORT_RESET_DATA:
      return initialState;

    default:
      return state || initialState;
  }
};

export default syncReportReducer;
