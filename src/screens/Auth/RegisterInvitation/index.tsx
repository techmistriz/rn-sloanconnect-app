import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {Images} from 'src/assets';
import {Button} from 'src/components/Button';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {getImgSource} from 'src/utils/Helpers/HelperFunction';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from 'src/services/NavigationService/NavigationService';
import Copyright from 'src/components/@ProjectComponent/Copyright';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(
    (state: any) => state?.ForgotResetPasswordReducer,
  );
  const {email, hash, referrer} = route?.params;

  useEffect(() => {}, []);

  return (
    <AppContainer
      scroll={true}
      loading={loading}
      scrollViewStyle={{}}
      hasHeader={false}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.imageContainer}>
              <Image
                source={getImgSource(Images?.appLogoWithText)}
                style={{width: '50%', height: 80}}
                resizeMode="contain"
              />
            </Wrap>

            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Typography
                size={20}
                text="Invitation Sent"
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.primaryColor}
                ff={Theme.fonts.ThemeFontMedium}
              />

              <Typography
                size={14}
                text={`We've sent you a link to confirm your email address. Please check you inbox or spam folder. It could take a couple minutes to show up in your inbox.`}
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={Theme.colors.black}
                ff={Theme.fonts.ThemeFontLight}
              />

              <Wrap autoMargin={false} style={[styles.inputWrapper]}>
                <Button
                  title="CONTINUE"
                  onPress={() => {
                    NavigationService.navigate('Otp', {
                      email,
                      hash,
                      referrer,
                    });
                  }}
                />
              </Wrap>
            </Wrap>
          </Wrap>
          <Wrap autoMargin={false} style={styles.section2}>
            <Copyright />
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
