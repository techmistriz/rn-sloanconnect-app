import React from 'react';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap} from 'src/components/Common';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Header from 'src/components/Header';

const Index = ({onSearchAgainPress, onBackButtonPress}: any) => {
  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="gradient"
      hasHeader={false}
      // hasProfileButton={true}
      // hasBackButton
      // headerBackgroundType="solid"
    >
      <Wrap autoMargin={false} style={styles.container}>
        <Header
          hasProfileButton
          headerBackgroundType="transparent"
          onBackButtonPress={() => onBackButtonPress()}
        />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Typography
              size={18}
              text={`No Product Found`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={14}
              text={`Please be sure Bluetooth is \n Enabled and try again.`}
              style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontLight}
            />
          </Wrap>

          <Wrap autoMargin={false} style={styles.section2}>
            <Wrap
              autoMargin={false}
              style={[{width: '100%', marginBottom: 10}]}>
              <Button
                type={'link'}
                title="TROUBLESHOOT"
                onPress={() => {
                  NavigationService.navigate('DeviceDiagnosticTroubleshoot');
                }}
                style={{borderColor: Theme.colors.white}}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontBold,
                  color: Theme.colors.white,
                }}
              />
            </Wrap>
            <Wrap
              autoMargin={false}
              style={[{width: '100%', marginBottom: 10}]}>
              <Button
                title="SEARCH AGAIN"
                onPress={() => {
                  onSearchAgainPress && onSearchAgainPress();
                }}
                style={{
                  borderColor: Theme.colors.white,
                  backgroundColor: Theme.colors.white,
                }}
                textStyle={{
                  fontSize: 12,
                  fontFamily: Theme.fonts.ThemeFontBold,
                  color: Theme.colors.primaryColor,
                }}
              />
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
