import React, {} from 'react';
import Theme from 'src/theme';
import Typography from 'src/components/Typography';
import {Wrap} from 'src/components/Common';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';

const Index = ({navigation, route}: any) => {
  return (
    <AppContainer scroll={false} scrollViewStyle={{}} backgroundType="gradient">
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
              text={`Connecting`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={12}
              text={`Connecting to your Sloan Faucet\n Might take a few seconds.`}
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
