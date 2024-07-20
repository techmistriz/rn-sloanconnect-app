import React, {useEffect, useState} from 'react';
import Theme from 'src/theme';
import {useSelector} from 'react-redux';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getTimezone,
  parseDateHumanFormat,
  parseDateHumanFormatFromUnix,
  showToastMessage,
  timestampInSec,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Row, Col, Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import DiagnosticResultsList from 'src/components/@ProjectComponent/DiagnosticResultsList';
import InfoBox from 'src/components/InfoBox';
import {base64EncodeDecode} from 'src/utils/Helpers/encryption';
import {readingDiagnostic} from '../DeviceDiagnostics/helperGen1';
import {BackHandler} from 'react-native';
import Header from 'src/components/Header';
import {BLEReport} from 'src/services/BLEService/BLEReport';
import moment from 'moment';
import {ReportItemModel} from 'src/services/DBService/Models';
import {
  getDBConnection,
  checkTableExistance,
  createReportTable,
  saveReportItems,
} from 'src/services/DBService/SQLiteDBService';
import {checkAndSyncPendingSycableItems} from 'src/services/SyncService/SyncService';

const Index = ({navigation, route}: any) => {
  const {
    previousScreen,
    referrer,
    previousDiagnosticResults,
    diagnosticResults,
    waterDispensed,
    sensorResult,
    dateResult,
    dateLastResult,
  } = route?.params || {referrer: undefined};
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<boolean>(false);

  /** component hooks method for hardwareBackPress */
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        if (previousScreen != 'DeviceDashboard') {
          NavigationService.replace('BottomTabNavigator');
        } else {
          NavigationService.pop(2);
        }

        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /** component hooks method for dynamic header for back button */
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          onBackButtonPress={() => {
            NavigationService.pop(2);
          }}
        />
      ),
    });
  }, []);

  /** Function comments */
  useEffect(() => {
    // consoleLog('DeviceDiagnosticResults useEffect==>', {
    //   dateResult,
    //   waterDispensed,
    //   sensorResult,
    //   previousDiagnosticResults,
    //   diagnosticResults,
    // });
    initlizeApp();
  }, []);

  /** Function comments */
  const initlizeApp = async () => {
    // const allReports = await BLEReport.prepareReport(user);
    // consoleLog('allReports==>', allReports);

    if (BLEService.deviceGeneration == 'gen1') {
      initlizeAppGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      initlizeAppGen2();
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  const initlizeAppGen1 = async () => {
    if (waterDispensed == 1 && sensorResult?.value == '0') {
      setInfoModal(true);
    }
    handleSendReport('no', false);
  };

  const initlizeAppGen2 = async () => {
    if (waterDispensed == 1 && sensorResult?.value == '0') {
      setInfoModal(true);
    }
    handleSendReport('no', false);
  };

  const handleSendReport = async (
    isReportManual: string,
    showToast: boolean = true,
  ) => {
    try {
      setLoading(true);
      const allReports = await BLEReport.prepareReport(
        user,
        true,
        isReportManual,
      );
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
      showToast && showToastMessage('Report sent', 'success');

      return true;
    } catch (error) {
      return true;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer
      scroll={true}
      scrollViewStyle={{}}
      backgroundType="solid"
      loading={loading}
      headerContainerStyle={{
        backgroundColor: Theme.colors.primaryColor,
      }}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.container}>
              <Row
                autoMargin={false}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 30,
                  // borderWidth: 1,
                }}>
                <Col autoMargin={false}>
                  <Wrap autoMargin={false}>
                    <Typography
                      size={18}
                      text={'Diagnostic Results'}
                      style={{
                        textAlign: 'center',
                        // marginBottom: 30,
                      }}
                      color={Theme.colors.primaryColor}
                      ff={Theme.fonts.ThemeFontMedium}
                    />
                  </Wrap>
                </Col>
              </Row>
            </Wrap>

            {/* Current Diagnostic */}
            <Wrap autoMargin={false} style={styles.container}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{flex: 1}}>
                  <Wrap
                    autoMargin={false}
                    style={{
                      backgroundColor: Theme.colors.lightGray,
                    }}>
                    <Typography
                      size={10}
                      text={`DIAGNOSTIC RESULTS ${
                        dateResult?.value &&
                        dateResult?.value > 0 &&
                        dateResult?.value?.toString()?.length > 6
                          ? parseDateHumanFormatFromUnix(
                              dateResult?.value,
                              'ddd, DD MMMM YYYY HH:mm:ss a z',
                            )
                          : 'N/A'
                      }`}
                      style={{
                        textAlign: 'left',
                        paddingVertical: 10,
                        paddingLeft: 20,
                      }}
                      color={Theme.colors.midGray}
                      ff={Theme.fonts.ThemeFontMedium}
                    />
                  </Wrap>
                </Col>
              </Row>
            </Wrap>

            <Wrap autoMargin={false} style={styles.container}>
              {diagnosticResults.map((item: any, index: number) => {
                if (item?.showInList) {
                  return (
                    <DiagnosticResultsList
                      key={index.toString()}
                      item={item}
                      borderBottom={
                        index >= 0 ? (
                          <Divider color={Theme.colors.lightGray} />
                        ) : null
                      }
                    />
                  );
                }
              })}
            </Wrap>

            {/* Previous Diagnostic */}
            {waterDispensed == 1 && (
              <>
                <Wrap autoMargin={false} style={styles.container}>
                  <Row autoMargin={false} style={{}}>
                    <Col autoMargin={false} style={{flex: 1}}>
                      <Wrap
                        autoMargin={false}
                        style={{
                          backgroundColor: Theme.colors.lightGray,
                        }}>
                        <Typography
                          size={10}
                          text={`LAST DIAGNOSTIC RESULTS ${
                            dateLastResult?.value &&
                            dateLastResult?.value > 0 &&
                            dateLastResult?.value?.toString()?.length > 6
                              ? parseDateHumanFormatFromUnix(
                                  dateLastResult?.value,
                                  'ddd, DD MMMM YYYY HH:mm:ss a z',
                                )
                              : 'N/A'
                          }`}
                          style={{
                            textAlign: 'left',
                            paddingVertical: 10,
                            paddingLeft: 20,
                          }}
                          color={Theme.colors.midGray}
                          ff={Theme.fonts.ThemeFontMedium}
                        />
                      </Wrap>
                    </Col>
                  </Row>
                </Wrap>

                <Wrap autoMargin={false} style={styles.container}>
                  {previousDiagnosticResults &&
                    previousDiagnosticResults.map(
                      (item: any, index: number) => {
                        if (item?.showInList) {
                          return (
                            <DiagnosticResultsList
                              key={index.toString()}
                              item={item}
                              borderBottom={
                                index >= 0 ? (
                                  <Divider color={Theme.colors.lightGray} />
                                ) : null
                              }
                            />
                          );
                        }
                      },
                    )}
                </Wrap>
              </>
            )}

            {/* <Wrap
              autoMargin={true}
              style={[styles.container, styles.screenMargin]}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{width: '50%'}}>
                  <Button
                    type={'link'}
                    title={`PREVIEW\nREPORT`}
                    onPress={() => {}}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                      color: Theme.colors.midGray,
                    }}
                    style={{
                      borderColor: Theme.colors.midGray,
                    }}
                    leftItem={
                      <VectorIcon
                        iconPack="Feather"
                        name={'book'}
                        size={25}
                        color={Theme.colors.midGray}
                        style={{marginRight: 10}}
                      />
                    }
                  />
                </Col>
              </Row>
            </Wrap> */}

            <Wrap
              autoMargin={true}
              style={[
                styles.container,
                styles.screenMargin,
                {paddingBottom: 10},
              ]}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{flex: 1, paddingRight: 20}}>
                  <Button
                    type={'link'}
                    title={'SEND REPORT'}
                    onPress={() => {
                      handleSendReport('yes');
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                    style={{
                      borderColor: Theme.colors.primaryColor,
                    }}
                  />
                </Col>
                <Col autoMargin={false} style={{flex: 1}}>
                  <Button
                    type={'link'}
                    title={'TROUBLESHOOT'}
                    onPress={() => {
                      NavigationService.navigate(
                        'DeviceDiagnosticTroubleshoot',
                        {
                          referrer: 'DeviceDiagnosticResults',
                        },
                      );
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: Theme.fonts.ThemeFontMedium,
                    }}
                    style={{
                      borderColor: Theme.colors.primaryColor,
                    }}
                  />
                </Col>
              </Row>
            </Wrap>

            {/* <Wrap
              autoMargin={true}
              style={[
                styles.container,
                styles.screenMargin,
                {paddingBottom: 10},
              ]}>
              <Button
                type={'link'}
                title={'TROUBLESHOOT'}
                onPress={() => {
                  NavigationService.navigate('DeviceDiagnosticTroubleshoot', {
                    referrer: 'DeviceDiagnosticResults',
                  });
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontMedium,
                }}
                style={{
                  borderColor: Theme.colors.primaryColor,
                }}
              />
            </Wrap> */}

            <Wrap
              autoMargin={false}
              style={[
                styles.container,
                styles.screenMargin,
                {paddingBottom: 10},
              ]}>
              <Button
                title={'DONE'}
                onPress={() => {
                  NavigationService.pop(2);
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontMedium,
                  color: Theme.colors.white,
                }}
                style={{
                  borderColor: Theme.colors.primaryColor,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
      <InfoBox
        visible={infoModal}
        title="Hint"
        message={`If water was dispensed continously\nbefore running diagnostic, the\nsolenoid is probably faulty.`}
        messageStyle={{textAlign: 'center'}}
        onOkayPress={() => {
          setInfoModal(false);
        }}
      />
    </AppContainer>
  );
};

export default Index;
