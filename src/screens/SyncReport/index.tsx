import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, useColorScheme} from 'react-native';
import {
  consoleLog,
  getImgSource,
  parseDateHumanFormatFromUnix,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Theme from 'src/theme';
import {
  getDBConnection,
  getReportItems,
  saveReportItems,
  createReportTable,
  deleteReportItem,
  checkTableExistance,
  updateReportItem,
  clearTable,
} from 'src/services/DBService/SQLiteDBService';
import {ReportItemModel} from 'src/services/DBService/Models';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import AppContainer from 'src/components/AppContainer';
import {Wrap, Row} from 'src/components/Common';
import Loader from 'src/components/Loader';
import {Divider} from 'react-native-paper';
import {Images} from 'src/assets';
import TouchableItem from 'src/components/TouchableItem';
import Typography from 'src/components/Typography';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import EmptyComponent from 'src/components/EmptyState';
import {constants} from 'src/common';
import LoaderComponent from 'src/components/Loader';
import Network from 'src/network/Network';
import {syncToServer} from 'src/services/SyncService/SyncService';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {BLEService} from 'src/services';
import DeviceInfo from 'react-native-device-info';

const initReports = [
  {
    id: 1,
    name: 'Diagnostic report 1',
    value: 'go to shop',
    status: 0,
    dateTime: timestampInSec(),
  },
  {
    id: 2,
    name: 'Diagnostic report 2',
    value: 'eat at least a one healthy foods',
    status: 0,
    dateTime: timestampInSec(),
  },
  {
    id: 3,
    name: 'Diagnostic report 2',
    value: 'Do some exercises',
    status: 0,
    dateTime: timestampInSec(),
  },
];

const Index = () => {
  const [reports, setReports] = useState<ReportItemModel[]>([]);
  const [newReport, setNewReport] = useState('');
  const [apiRequestCompleted, setApiRequestCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const {user, token} = useSelector((state: any) => state?.AuthReducer);

  const loadDataCallback = useCallback(async () => {
    consoleLog('loadDataCallback called==>');

    try {
      const db = await getDBConnection();
      consoleLog('loadDataCallback db==>', db);
      // await clearTable(db, 'table_reports');
      // await createReportTable(db, 'table_reports');
      const isTableExistance = await checkTableExistance(db, 'table_reports');
      consoleLog('loadDataCallback isTableExistance==>', isTableExistance);
      const storedReportItems = await getReportItems(db);
      consoleLog('loadDataCallback storedReportItems==>', storedReportItems);
      if (storedReportItems.length) {
        consoleLog(
          'loadDataCallback storedReportItems.length==>',
          storedReportItems.length,
        );
        setReports(storedReportItems);
      } else {
        // await saveReportItems(db, initReports);
        consoleLog('loadDataCallback saveReportItems==>', initReports);
        setReports([]);
      }

      consoleLog('reports==>', reports);
    } catch (error) {
      consoleLog('reports error==>', error);
    }
  }, []);

  useEffect(() => {
    consoleLog('Sync useEffect loadDataCallback called');
    loadDataCallback();
  }, [loadDataCallback]);

  useEffect(() => {
    consoleLog('Sync useEffect called==>');

    DeviceInfo.getFirstInstallTime().then(info => {
      consoleLog('Sync getFirstInstallTime==> ', info);
    });
  }, []);

  const onSync = async (item: ReportItemModel) => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected == false) {
        showToastMessage('No internet connection.', 'danger');
        return false;
      }

      setLoading(true);
      const db = await getDBConnection();
      await updateReportItem(db, item, 1);
      loadDataCallback();
      const payload =
        typeof item?.value === 'string' ? JSON.parse(item?.value) : item?.value;
      consoleLog('onSync payload==>', payload);
      const response: any = await syncToServer(payload, token);
      // consoleLog('onSync syncToServer response==>', response);

      if (response?.status) {
        await deleteReportItem(db, item?.id);
        showToastMessage('Report sent successfully.', 'success');
        loadDataCallback();
      } else {
        await updateReportItem(db, item, 2);
        loadDataCallback();
        showToastMessage(
          response?.message ?? 'Something went wrong!',
          'danger',
        );
      }
    } catch (error) {
      showToastMessage(error?.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (item: ReportItemModel) => {
    const db = await getDBConnection();
    await deleteReportItem(db, item?.id);
    loadDataCallback();
    showToastMessage('Report deleted from offline list.', 'success');
  };

  /**Flatlist render method */
  const renderItem = ({item}: any) => {
    return (
      <TouchableItem disabled style={{}}>
        <>
          <Row
            autoMargin={false}
            style={{
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Wrap
              autoMargin={false}
              style={{flex: 1, justifyContent: 'flex-start', paddingLeft: 10}}>
              <Typography
                size={14}
                text={`${item?.name}`}
                style={{
                  textAlign: 'left',
                }}
                color={Theme.colors.black}
                noOfLine={2}
              />
              <Typography
                size={12}
                text={`Date: ${parseDateHumanFormatFromUnix(
                  item?.dateTime,
                  'DD/MM/YYYY HH:mm:ss a z',
                )}`}
                style={{
                  textAlign: 'left',
                  fontStyle: 'italic',
                }}
                color={Theme.colors.darkGray}
                noOfLine={1}
              />
            </Wrap>
            <Wrap autoMargin={false} style={{justifyContent: 'flex-end'}}>
              {item?.status == 0 ? (
                <Row autoMargin={false}>
                  <VectorIcon
                    iconPack="Ionicons"
                    name={'sync-outline'}
                    size={25}
                    color={Theme.colors.primaryColor}
                    onPress={() => {
                      onSync(item);
                    }}
                    style={{marginRight: 10}}
                  />
                  <VectorIcon
                    iconPack="Ionicons"
                    name={'trash'}
                    size={25}
                    color={Theme.colors.red}
                    onPress={() => {
                      onDelete(item);
                    }}
                  />
                </Row>
              ) : item?.status == 1 ? (
                <>
                  <Row autoMargin={false}>
                    <VectorIcon
                      iconPack="Ionicons"
                      name={'sync-outline'}
                      size={25}
                      color={Theme.colors.primaryColor}
                      onPress={() => {
                        onSync(item);
                      }}
                      style={{marginRight: 10}}
                    />
                    <VectorIcon
                      iconPack="Ionicons"
                      name={'trash'}
                      size={25}
                      color={Theme.colors.red}
                      onPress={() => {
                        onDelete(item);
                      }}
                    />
                  </Row>

                  <Typography
                    size={12}
                    text={`Syncing...`}
                    style={{
                      textAlign: 'left',
                      marginTop: 10,
                    }}
                    color={Theme.colors.darkGray}
                    noOfLine={1}
                  />
                </>
              ) : (
                <>
                  <Row autoMargin={false}>
                    <VectorIcon
                      iconPack="Ionicons"
                      name={'sync-outline'}
                      size={25}
                      color={Theme.colors.primaryColor}
                      onPress={() => {
                        onSync(item);
                      }}
                      style={{marginRight: 10}}
                    />
                    <VectorIcon
                      iconPack="Ionicons"
                      name={'trash'}
                      size={25}
                      color={Theme.colors.red}
                      onPress={() => {
                        onDelete(item);
                      }}
                    />
                  </Row>
                  <Typography
                    size={12}
                    text={`Failed`}
                    style={{
                      textAlign: 'left',
                      marginTop: 10,
                    }}
                    color={Theme.colors.red}
                    noOfLine={1}
                  />
                </>
              )}
            </Wrap>
          </Row>
          <Divider />
        </>
      </TouchableItem>
    );
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="solid"
      hasHeader={false}
      loading={loading}
      headerContainerStyle={{backgroundColor: Theme.colors.primaryColor}}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={reports ?? []}
              renderItem={renderItem}
              keyExtractor={(item, index) => index?.toString()}
              onEndReachedThreshold={0.01}
              ListFooterComponent={() => null}
              contentContainerStyle={[
                {paddingBottom: 60},
                reports.length == 0 && {flex: 1},
              ]}
              ListEmptyComponent={() =>
                apiRequestCompleted ? (
                  <Wrap
                    autoMargin={false}
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <EmptyComponent
                      image={Images.noNotification}
                      title="You're all cought up"
                      message="This is where you'll see all pending report to be synced on server."
                    />
                  </Wrap>
                ) : (
                  <Wrap
                    autoMargin={false}
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <LoaderComponent visible={true} />
                  </Wrap>
                )
              }
            />
          </Wrap>
        </Wrap>

        <Wrap
          autoMargin={false}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
          }}>
          <Row
            autoMargin={false}
            style={{
              alignItems: 'center',
              paddingVertical: 5,
              backgroundColor: 'white',
              shadowRadius: 2,
              shadowOffset: {
                width: 0,
                height: -3,
              },
              shadowColor: '#000000',
              elevation: 4,
              paddingHorizontal: 30,
              overflow: 'hidden',
              borderTopWidth: 1,
              borderTopColor: Theme.colors.lightGray,
            }}>
            <Wrap autoMargin={false} style={{}}>
              <Image
                // @ts-ignore
                source={getImgSource(Images.appLogoWhite)}
                style={{height: 40, width: 80}}
                tintColor={Theme.colors.midGray}
                resizeMode="contain"
              />
            </Wrap>
            <Wrap autoMargin={false} style={{}}>
              <AppInfo
                style1={{textAlign: 'center', color: Theme.colors.midGray}}
                style2={{textAlign: 'center', color: Theme.colors.midGray}}
              />
            </Wrap>
          </Row>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
