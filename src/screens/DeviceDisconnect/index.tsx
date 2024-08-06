import React, {Component, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';
import LoaderOverlay2 from 'src/components/LoaderOverlay2';
import {BLEService} from 'src/services/BLEService/BLEService';
import {deviceSettingsResetDataAction} from 'src/redux/actions';
import {BLEReport} from 'src/services/BLEService/BLEReport';
import moment from 'moment';
import {
  checkTableExistance,
  createReportTable,
  getDBConnection,
  saveReportItems,
} from 'src/services/DBService/SQLiteDBService';
import {ReportItemModel} from 'src/services/DBService/Models';
import {checkAndSyncPendingSycableItems} from 'src/services/SyncService/SyncService';
import I18n from 'src/locales/Transaltions';

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const connectedDevice: any = BLEService.getDevice();
  const connectedDeviceRaw: any = BLEService.deviceRaw;
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    initlizeApp();
  }, []);

  const initlizeApp = async () => {
    try {
      await handleReport();

      setTimeout(() => {
        dispatch(deviceSettingsResetDataAction());
        BLEService?.disconnectDevice(false);
        NavigationService.resetAllAction('DeviceSearching');
      }, 1000);
    } catch (error) {
      // showToastMessage(
      //   error?.message ?? I18n.t('disconnect.SYNC_ERROR_MGS'),
      //   'danger',
      // );
      NavigationService.goBack();
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      // setLoading(true);
      const allReports = await BLEReport.prepareReport(user);
      consoleLog('DeviceDisconnect initlizeApp==>', allReports);
      const currentTimestamp = timestampInSec();
      const db = await getDBConnection();
      consoleLog('DeviceDisconnect initlizeApp db==>', db);
      const isTableExistance = await checkTableExistance(db, 'table_reports');
      if (!isTableExistance) {
        await createReportTable(db, 'table_reports');
      }

      var deviceName =
        connectedDevice?.localName ?? connectedDevice?.name ?? '';
      const payload: ReportItemModel = {
        // id: currentTimestamp,
        name: `${deviceName}-Report-${moment
          .unix(currentTimestamp)
          .format('YYYY-MM-DD HH:mm')}`,
        value: JSON.stringify(allReports),
        dateTime: currentTimestamp,
        status: 0,
      };
      await saveReportItems(db, [payload]);
      await checkAndSyncPendingSycableItems(token);

      return true;
    } catch (error) {
      return true;
    } finally {
      // setLoading(false);
    }
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="gradient"
      // loading={loading}
      // loadingText={I18n.t('disconnect.SYNC_MGS')}
      >
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Loader
              visible={true}
              loadingText={''}
              activityIndicatorColor={Theme.colors.white}
              loaderType={'image'}
            />
            <Typography
              size={18}
              text={I18n.t('disconnect.DISCONNECTING_MSG1')}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={12}
              text={`${I18n.t('disconnect.DISCONNECTING_MSG2')} ${
                connectedDeviceRaw?.deviceCustomName ??
                connectedDevice?.localName ??
                connectedDevice?.name ??
                'N/A'
              }\n ${I18n.t('disconnect.DISCONNECTING_MSG3')}`}
              style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap autoMargin={false} style={{}}>
              <AppInfo
                style1={{textAlign: 'center', color: Theme.colors.midGray}}
                style2={{textAlign: 'center', color: Theme.colors.midGray}}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
