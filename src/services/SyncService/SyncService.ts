import Network from 'src/network/Network';
import {ReportItemModel} from 'src/services/DBService/Models';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {
  getDBConnection,
  checkTableExistance,
  getReportItems,
  deleteReportItem,
} from 'src/services/DBService/SQLiteDBService';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {
  syncReportRequestAction,
  syncReportSuccessAction,
} from 'src/redux/actions';

export const checkAndSyncPendingSycableItems = async (
  token: string,
): Promise<boolean> => {
  // const dispatch = useDispatch();

  try {
    const state = await NetInfo.fetch();
    if (state.isConnected == false) {
      return false;
    }

    const promises = [];
    const db = await getDBConnection();
    consoleLog('checkAndSyncPendingSycableItems db==>', db);
    const isTableExistance = await checkTableExistance(db, 'table_reports');
    consoleLog(
      'checkAndSyncPendingSycableItems isTableExistance==>',
      isTableExistance,
    );

    if (isTableExistance) {
      const storedReportItems = await getReportItems(db);
      consoleLog(
        'checkAndSyncPendingSycableItems storedReportItems==>',
        storedReportItems,
      );
      if (storedReportItems.length == 0) {
        return false;
      }

      consoleLog(
        'checkAndSyncPendingSycableItems storedReportItems.length==>',
        storedReportItems.length,
      );

      // dispatch(syncReportRequestAction({status: 1}));

      for (let index = 0; index < storedReportItems.length; index++) {
        const item = storedReportItems[index];

        const payload =
          typeof item?.value === 'string'
            ? JSON.parse(item?.value)
            : item?.value;
        // consoleLog('onSync payload==>', payload);

        const syncStatus: boolean = await syncToServer(payload, token);

        promises.push(syncStatus);
        if (syncStatus) {
          const deleteStatus = await deleteReportItem(db, item.id);
          promises.push(deleteStatus);
        }
      }

      // wait for all the promises in the promises array to resolve
      Promise.all(promises).then(results => {
        // all the fetch requests have completed, and the results are in the "results" array
        // dispatch(syncReportSuccessAction({status: 0}));
        return true;
      });
    }
  } catch (error) {
    return false;
  } finally {
    return false;
  }
};

export const syncToServer = async (
  payload: any,
  token: string,
): Promise<any> => {
  try {
    const response = await Network(
      'sloan/save-device-report',
      'POST',
      payload,
      token,
    );

    // consoleLog('syncToServer response==>', response);
    if (response) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return {
      status: false,
      message: error?.message,
      data: {},
    };
  } finally {
    //
  }
};
