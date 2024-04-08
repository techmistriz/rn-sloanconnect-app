import React from 'react';
import {Share, Image, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Wrap, Row} from 'src/components/Common';
import Typography from 'src/components/Typography';
import Theme from 'src/theme';
import {
  getImgSource,
  openUrl,
  onShare,
  showConfirmAlert,
  assetsBaseUrl,
} from 'src/utils/Helpers/HelperFunction';
import {constants} from 'src/common';
import TouchableItem from 'src/components/TouchableItem';
import VectorIcon from 'src/components/VectorIcon';
import {Images} from 'src/assets';
// import screens
import Home from 'src/screens/Home';
import {NavigationMenuIcon, NavigationNotificationIcon} from './NavigationIcon';
import {useDispatch, useSelector} from 'react-redux';
import {loginResetDataAction, settingsResetDataAction} from 'src/redux/actions';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from 'src/services/NavigationService/NavigationService';

// create stack navigator
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({navigation}) => ({
        drawerContentContainerStyle: {
          // flex: 1,
          // height: constants.screenHeight,
          // borderWidth: 1,
          paddingVertical: 0,
          marginVertical: 0,
        },
        drawerContentStyle: {
          // flex: 1,
          // height: constants.screenHeight,
          // borderWidth: 1,
          paddingVertical: 0,
          marginVertical: 0,
        },
        drawerStyle: {
          flex: 1,
          // width: '100%',
          backgroundColor: Theme.colors.gradientBg2,
          // paddingTop: 0,
          // marginTop: 0,
          // borderWidth: 1,
          // height: constants.screenHeight,
          paddingVertical: 0,
          marginVertical: 0,
        },
        // headerLeft: () => NavigationNotificationIcon(navigation),
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: Theme.fonts.ThemeFontMedium,
          color: Theme.colors.headerTextColor,
          fontSize: 18,
        },
        // headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: Theme.colors.gradientBg1,
        },
      })}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Dashboard',
          headerLeft: () => NavigationMenuIcon(navigation),
          // headerRight: () => NavigationNotificationIcon(navigation),
          // lazy: true
        })}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props: any) => {
  const {user, type} = useSelector((state: any) => state?.AuthReducer);

  const dispatch = useDispatch();
  const onLogout = async () => {
    const result = await showConfirmAlert('Are you sure?');
    if (result) {
      props.navigation.toggleDrawer();
      dispatch(loginResetDataAction());
      // dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'red',
        // height: 200,
        // paddingTop: 0,
        // marginTop: 0,
        // paddingHorizontal: 0,
        // paddingVertical: 0,
        paddingVertical: 0,
        marginVertical: 0,
      }}>
      <LinearGradient
        start={{x: 0.0, y: 0.4}}
        end={{x: 0, y: 1.0}}
        // locations={[0, 0.5]}
        colors={[Theme.colors.gradientBg1, Theme.colors.gradientBg2]}
        style={{flex: 1, height: constants.screenHeight}}>
        <Wrap autoMargin={false} style={styles.customDrawerContainer}>
          <Wrap
            autoMargin={false}
            style={{
              ...styles.imageBackground,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              // flex: 1,
            }}>
            {user && user?.user_image ? (
              <Image
                // @ts-ignore
                source={getImgSource(`${assetsBaseUrl()}/${user?.user_image}`)}
                style={styles.customDrawerProfileImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                // @ts-ignore
                source={getImgSource(Images?.imgHolder)}
                style={styles.customDrawerProfileImage}
                resizeMode="contain"
              />
            )}

            <Typography
              style={styles.customDrawerProfileName}
              text={user?.name || '--'}
              color={Theme.colors.white}
              size={22}
              ff={Theme.fonts.ThemeFontBold}
            />

            {/* <Typography
              style={styles.customDrawerProfileName}
              text={`DOB: ${user?.dob || '--/--/----'}`}
              color={Theme.colors.white}
              size={14}
            /> */}
          </Wrap>

          <Wrap autoMargin={false} style={[{flex: 1, marginTop: 20}]}>
            <Wrap autoMargin={false}>
              {/* <Typography
                style={{
                  paddingLeft: 15,
                  marginBottom: 10,
                }}
                text="Account"
                color={Theme.colors.white}
                size={18}
                ff={Theme.fonts.ThemeFontBold}
              /> */}

              <TouchableItem
                onPress={() => {
                  props.navigation.toggleDrawer();
                  NavigationService.navigate('Profile');
                }}
                style={styles.extraContentList}>
                <Wrap autoMargin={false} style={styles.extraContentListRow}>
                  <Typography
                    text="Profile"
                    color={Theme.colors.white}
                    size={16}
                  />
                  <VectorIcon
                    iconPack="Feather"
                    name={'chevron-right'}
                    color={Theme.colors.white}
                    size={16}
                    style={{marginRight: -5}}
                  />
                </Wrap>
              </TouchableItem>
            </Wrap>

            <Wrap autoMargin={true}>
              <Typography
                style={{
                  paddingLeft: 15,
                  marginBottom: 10,
                }}
                text="Others"
                color={Theme.colors.white}
                size={16}
                ff={Theme.fonts.ThemeFontBold}
              />

              <TouchableItem
                onPress={() => {
                  props.navigation.toggleDrawer();
                  openUrl(constants.PRIVACY_POLICY_LINK);
                }}
                style={styles.extraContentList}>
                <Wrap autoMargin={false} style={styles.extraContentListRow}>
                  <Typography
                    text="Privacy Policy"
                    color={Theme.colors.white}
                    size={16}
                  />
                  <VectorIcon
                    iconPack="Feather"
                    name={'chevron-right'}
                    size={15}
                    color={Theme.colors.white}
                  />
                </Wrap>
              </TouchableItem>

              <TouchableItem
                onPress={() => {
                  props.navigation.toggleDrawer();
                  openUrl(constants.TERMS_CONDITIONS_LINK);
                }}
                style={styles.extraContentList}>
                <Wrap autoMargin={false} style={styles.extraContentListRow}>
                  <Typography
                    text="Terms of Use"
                    color={Theme.colors.white}
                    size={16}
                  />
                  <VectorIcon
                    iconPack="Feather"
                    name={'chevron-right'}
                    size={16}
                    color={Theme.colors.white}
                  />
                </Wrap>
              </TouchableItem>

              <TouchableItem
                onPress={() => onLogout()}
                style={styles.extraContentList}>
                <Wrap autoMargin={false} style={styles.extraContentListRow}>
                  <Typography
                    text="Logout"
                    color={Theme.colors.white}
                    size={16}
                  />
                  <VectorIcon
                    iconPack="Feather"
                    name={'chevron-right'}
                    size={16}
                    color={Theme.colors.white}
                  />
                </Wrap>
              </TouchableItem>
            </Wrap>

            <Wrap
              autoMargin={false}
              style={[
                styles.customDrawerRouteItemContainer,
                {
                  flex: 1,
                  justifyContent: 'flex-end',
                },
              ]}>
              <Wrap
                autoMargin={false}
                style={[
                  styles.item,
                  {
                    flex: 1,
                    paddingVertical: 20,
                    justifyContent: 'flex-end',
                  },
                ]}>
                <Wrap autoMargin={false} style={styles.itemRow}>
                  <Typography
                    text={`Version v${constants.ANDROID_APP_VERSION}`}
                    color={Theme?.colors?.white}
                    size={15}
                  />
                </Wrap>
              </Wrap>
            </Wrap>
          </Wrap>
        </Wrap>
      </LinearGradient>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  customDrawerContainer: {
    flex: 1,
    // height: constants.screenHeightCalc,
    // borderWidth: 1,
    // paddingTop: 0,
    // backgroundColor: Theme.colors.surface,
  },
  customDrawerProfileImage: {
    height: 110,
    width: 110,
    borderRadius: 110,
    marginBottom: 10,
    backgroundColor: Theme.colors.gray,
  },

  customDrawerProfileName: {
    // color: '#fff',
    marginBottom: 5,
  },
  imageBackground: {
    padding: 20,
  },
  customDrawerRouteContainer: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingTop: 10,
  },

  extraContentContainer: {
    // padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  extraContentList: {
    // paddingVertical: 10,
    // marginHorizontal: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E9E9E9',
  },
  extraContentListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  customDrawerRouteItemContainer: {
    // padding: 10,
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 10,
  },
});

export default DrawerNavigator;
