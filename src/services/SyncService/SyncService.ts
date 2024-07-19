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

export const checkPendingSycableItems = async (): Promise<boolean> => {
  try {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false) {
        return false;
      }
    });

    const promises = [];
    const db = await getDBConnection();
    consoleLog('checkPendingSycableItems db==>', db);
    const isTableExistance = await checkTableExistance(db, 'table_reports');
    consoleLog(
      'checkPendingSycableItems isTableExistance==>',
      isTableExistance,
    );

    if (isTableExistance) {
      const storedReportItems = await getReportItems(db);
      consoleLog(
        'checkPendingSycableItems storedReportItems==>',
        storedReportItems,
      );
      if (storedReportItems.length == 0) {
        return false;
      }

      consoleLog(
        'checkPendingSycableItems storedReportItems.length==>',
        storedReportItems.length,
      );

      for (let index = 0; index < storedReportItems.length; index++) {
        const item = storedReportItems[index];
        const syncStatus: boolean = await syncToServer(item);

        promises.push(syncStatus);
        if (syncStatus) {
          const deleteStatus = await deleteReportItem(db, item.id);
          promises.push(deleteStatus);
        }
      }

      // wait for all the promises in the promises array to resolve
      Promise.all(promises).then(results => {
        // all the fetch requests have completed, and the results are in the "results" array
        return true;
      });
    }
  } catch (error) {
    return false;
  } finally {
    return false;
  }
};

export const syncToServer = async (item: ReportItemModel): Promise<boolean> => {
  try {
    const response = await Network(
      'v1/sloan/save-device-report',
      'POST',
      item?.value,
    );
    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  } finally {
    return false;
  }
};
