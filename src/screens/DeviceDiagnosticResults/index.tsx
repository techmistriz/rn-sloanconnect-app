import React, {useEffect, useState} from 'react';
import Theme from 'src/theme';
import {useSelector} from 'react-redux';
import {cleanCharacteristic} from 'src/utils/Helpers/project';
import {
  consoleLog,
  getTimezone,
  parseDateHumanFormat,
  parseDateHumanFormatFromUnix,
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

const Index = ({navigation, route}: any) => {
  const {
    referrer,
    previousDiagnosticResults,
    diagnosticResults,
    waterDispensed,
    sensorResult,
    dateResult,
    dateLastResult,
  } = route?.params || {referrer: undefined};
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<boolean>(false);

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
    if (BLEService.deviceGeneration == 'gen1') {
      initlizeAppGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
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
  };

  return (
    <AppContainer
      scroll={true}
      scrollViewStyle={{}}
      backgroundType="solid"
      hasBackButton={true}
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
                        dateResult?.value && dateResult?.value > 0
                          ? parseDateHumanFormatFromUnix(
                              dateResult?.value,
                              'ddd, DD MMMM YYYY HH:MM:SS a z',
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
            {waterDispensed == 1 && sensorResult?.value == '0' && (
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
                            dateLastResult?.value && dateLastResult?.value > 0
                              ? parseDateHumanFormatFromUnix(
                                  dateLastResult?.value,
                                  'ddd, DD MMMM YYYY HH:MM:SS a z',
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

            <Wrap
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
            </Wrap>

            <Wrap
              autoMargin={true}
              style={[styles.container, styles.screenMargin]}>
              <Row autoMargin={false} style={{}}>
                <Col autoMargin={false} style={{flex: 1, paddingRight: 20}}>
                  <Button
                    type={'link'}
                    title={'SEND REPORT'}
                    onPress={() => {}}
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

            <Wrap
              autoMargin={true}
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
        onOkayPress={() => {
          setInfoModal(false);
        }}
      />
    </AppContainer>
  );
};

export default Index;
