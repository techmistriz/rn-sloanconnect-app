import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {consoleLog, getImgSource} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Row, Col, Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import Header from 'src/components/Header';
import {BLEService} from 'src/services';
import AppContainer from 'src/components/AppContainer';

const Index = ({navigation, route}: any) => {
  const connectedDevice = BLEService.getDevice();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c960';
    const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c961';

    setLoading(true);
    const writeCharacteristicWithResponseForDevice =
      await BLEService.writeCharacteristicWithResponseForDevice(
        serviceUUID,
        characteristicUUID,
        '1',
      );
    consoleLog(
      'initialize writeCharacteristicWithResponseForDevice==>',
      JSON.stringify(writeCharacteristicWithResponseForDevice),
    );
    setLoading(false);
  };

  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="solid"
      loading={loading}>
      <Wrap autoMargin={false} style={styles.mainContainer}>
        <Image
          // @ts-ignore
          source={getImgSource(Images?.activateFaucet)}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0.7,
          }}
          resizeMode="cover"
          // blurRadius={1}
        />
        <Header hasBackButton headerBackgroundType="transparent" />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false}>
              <Typography
                size={22}
                text={`Diagnostics`}
                style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontMedium}
              />
              <Typography
                size={14}
                text={`Place your hand in front of the \nfaucet for at least 3 seconds.`}
                style={{textAlign: 'center', marginTop: 15, lineHeight: 20}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Typography
                size={14}
                text={`Did you see water dispense?`}
                style={{textAlign: 'center', marginTop: 20, lineHeight: 20}}
                color={Theme.colors.white}
                ff={Theme.fonts.ThemeFontLight}
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.section2}>
              <Wrap autoMargin={false} style={styles.container}>
                <Row autoMargin={false} style={styles.row}>
                  <Col
                    autoMargin={false}
                    style={[styles.col, {paddingRight: 5}]}>
                    <Button
                      type={'secondary'}
                      title="NO"
                      onPress={() => {
                        NavigationService.goBack();
                      }}
                      textStyle={{
                        fontSize: 10,
                        fontFamily: Theme.fonts.ThemeFontMedium,
                      }}
                    />
                  </Col>
                  <Col
                    autoMargin={false}
                    style={[styles.col, {paddingLeft: 5}]}>
                    <Button
                      type={'secondary'}
                      title="YES"
                      onPress={() => {
                        NavigationService.navigate('DeviceDiagnosticResults');
                      }}
                      textStyle={{
                        fontSize: 10,
                        fontFamily: Theme.fonts.ThemeFontMedium,
                      }}
                    />
                  </Col>
                </Row>
              </Wrap>
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
