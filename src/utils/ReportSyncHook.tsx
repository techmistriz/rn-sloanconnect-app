import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  getDBConnection,
  checkTableExistance,
  getReportItems,
  deleteReportItems,
} from 'src/services/DBService/SQLiteDBService';
import {syncToServer} from 'src/services/SyncService/SyncService';
import {consoleLog} from './Helpers/HelperFunction';
import {
  syncReportRequestAction,
  syncReportSuccessAction,
} from 'src/redux/actions';
import {View} from 'react-native';

const useReportSync = () => {
  const dispatch = useDispatch();
  const {isConnected, isInternetReachable} = useNetInfo();
  const {token} = useSelector((state: any) => state?.AuthReducer);

  /**componet render method */
  useEffect(() => {
    consoleLog('useReportSync called', {
      isConnected,
      isInternetReachable,
    });
    let subscription: any;
    if (isConnected && isInternetReachable && token) {
      checkAndSyncPendingSycableItems();
    }
    return () => {
      subscription?.remove();
    };
  }, [isConnected, isInternetReachable, token]);

  /**componet render method */
  const checkAndSyncPendingSycableItems = async () => {
    const db = await getDBConnection();
    consoleLog('useReportSync checkAndSyncPendingSycableItems db==>', db);
    const isTableExistance = await checkTableExistance(db, 'table_reports');
    consoleLog(
      'useReportSync checkAndSyncPendingSycableItems isTableExistance==>',
      isTableExistance,
    );

    if (isTableExistance) {
      const storedReportItems = await getReportItems(db);
      consoleLog(
        'useReportSync checkAndSyncPendingSycableItems storedReportItems.length==>',
        storedReportItems.length,
      );
      if (storedReportItems.length == 0) {
        return false;
      }
      const promises: any = [];
      const deletableIds: number[] = [];

      dispatch(syncReportRequestAction({status: 1}));

      for (let index = 0; index < storedReportItems.length; index++) {
        const item: any = storedReportItems[index];

        const payload =
          typeof item?.value === 'string'
            ? JSON.parse(item?.value)
            : item?.value;
        const syncStatus = syncToServer(payload, token);
        promises.push(syncStatus);
        deletableIds.push(item.id);
        consoleLog('checkAndSyncPendingSycableItems2 item.id==>', item.id);
      }

      // wait for all the promises in the promises array to resolve
      Promise.all(promises).then(results => {
        // all the fetch requests have completed, and the results are in the "results" array
        dispatch(syncReportSuccessAction({status: 0}));
        deleteReportItems(db, deletableIds);
        consoleLog('checkAndSyncPendingSycableItems2 romise.all called');
        return true;
      });
    }
  };

  /**componet render method */
  return <View />;
};

export default useReportSync;
