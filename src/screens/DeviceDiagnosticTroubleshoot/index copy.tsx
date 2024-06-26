import React, {useEffect} from 'react';
import {
  ScrollView,
} from 'react-native';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import AppContainer from 'src/components/AppContainer';
import {Wrap} from 'src/components/Common';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import Divider from 'src/components/Divider';

const Index = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {referrer} = route?.params || {referrer: undefined};
  const {loading} = useSelector((state: any) => state?.AuthReducer);
  const {settings} = useSelector((state: any) => state?.SettingsReducer);

  useEffect(() => {}, []);

  return (
    <AppContainer
      backgroundType="solid"
      scroll={false}
      loading={loading}
      scrollViewStyle={{}}
      headerContainerStyle={{
        backgroundColor: Theme.colors.primaryColor,
      }}>
      <Wrap autoMargin={false} style={styles.container}>
        <Wrap autoMargin={false} style={styles.sectionContainer}>
          <Wrap autoMargin={false} style={styles.section1}>
            <Wrap autoMargin={false} style={styles.formWrapper}>
              <Wrap autoMargin={false}>
                <Typography
                  size={18}
                  text="Troubleshooting"
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                  color={Theme.colors.primaryColor}
                  ff={Theme.fonts.ThemeFontMedium}
                />
                <Divider style={{marginTop: 10}} />
              </Wrap>
              <ScrollView contentContainerStyle={{}}>
                <Wrap autoMargin={true} style={styles.inputWrapper}>
                  <Typography
                    size={16}
                    text={`Troubleshooting Instructions for Optima Sensor Activated Lavatory Faucets Manufactured after January 1st 2018`}
                    style={{
                      marginBottom: 20,
                      textAlign: 'left',
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={14}
                    text={`Note: To automatically check battery strength, troubleshoot, diagnose and report faucet issues with a wireless device, use Sloan Connect™. Sloan Connect is available free-of-charge at the iTunes Store for Apple iOs devices, or the Google Play Store for Android devices. For more information about Sloan Connect™ and its capabilities, please visit www.sloan.com`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Typography
                    size={14}
                    text={`For Sloan Connect FAQs and links to Faucet Parts Sheets please scroll down to the bottom of these instructions.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />
                  <Typography
                    size={14}
                    text={`LED indicator light in the IR (infrared) sensor is red.`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontBold}
                  />

                  <Typography
                    size={14}
                    text={`To connect your product to the Sloan Connect App, you must complete the following steps:`}
                    style={{
                      marginBottom: 10,
                    }}
                    color={Theme.colors.black}
                    ff={Theme.fonts.ThemeFontLight}
                  />
                  <Wrap
                    autoMargin={true}
                    style={{
                      paddingLeft: 20,
                    }}>
                    <Typography
                      size={14}
                      text={`1. Battery power is low.`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                    <Typography
                      size={14}
                      text={`Install four (4) new AA sized alkaline batteries.
                      Check that the orientation of each battery matches the positive (+) and`}
                      style={{
                        marginBottom: 10,
                      }}
                      color={Theme.colors.black}
                      ff={Theme.fonts.ThemeFontLight}
                    />
                  </Wrap>
                </Wrap>
              </ScrollView>
            </Wrap>
          </Wrap>
        </Wrap>
      </Wrap>
    </AppContainer>
  );
};

export default Index;
