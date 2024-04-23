import React from 'react';
import {Image} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {getImgSource} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import {ActivateDeviceProps} from './types';

const Index = ({onLogout}: ActivateDeviceProps) => {
  return (
    <AppContainer
      scroll={false}
      scrollViewStyle={{}}
      backgroundType="gradient"
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
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
        <Header haslogOutButton onLogoutPress={onLogout && onLogout} />
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Typography
              size={22}
              text={`Activate\n Your Device`}
              style={{textAlign: 'center', marginTop: 0, lineHeight: 25}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontMedium}
            />
            <Typography
              size={14}
              text={`Wave your hand 3 times in front\n of sensor within 10 seconds\n to activate you product.`}
              style={{textAlign: 'center', marginTop: 10, lineHeight: 20}}
              color={Theme.colors.white}
              ff={Theme.fonts.ThemeFontRegular}
            />
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
