import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  BackHandler,
} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showConfirmAlert,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row, TochableWrap} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import {Button} from 'src/components/Button';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import Header from 'src/components/Header';
import AppContainer from 'src/components/AppContainer';
import EmptyComponent from 'src/components/EmptyState';
import Loader from 'src/components/Loader';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import {cloneDeep} from 'src/services/BLEService/cloneDeep';
import DeviceConnecting from 'src/components/@ProjectComponent/DeviceConnecting';
import NoDeviceFound from 'src/components/@ProjectComponent/NoDeviceFound';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import {loginResetDataAction} from 'src/redux/actions';
import {filterBLEDevices} from './helper';
import {DeviceExtendedProps} from './types';

const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 5000;

const Index = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const [displayText, setDisplaText] = useState<any>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSearching, setSearching] = useState(true);
  const [foundDevices, setFoundDevices] = useState<DeviceExtendedProps[]>([]);
  const connectedDevice: any = BLEService.getDevice();
  var timeoutID: any = null;
  var intervalID: any = null;
  const WAITING_TIMEOUT = 20000;
  const WAITING_TIMEOUT_FOR_REFRESH_LIST = 10000;

  /** component hooks method */
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        BLEService.manager.stopDeviceScan();
        NavigationService.replace('ActivateDevice');
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /** component hooks method */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      consoleLog('DeviceSearching focused');
      initlizeApp();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /** Function comments */
  useEffect(() => {
    consoleLog('useEffect setTimeout==>');
    timeoutID = setTimeout(() => {
      // consoleLog('setTimeout==>', timeoutID);
      clearTimeout(timeoutID);
      BLEService.manager.stopDeviceScan();
      NavigationService.replace('NoDeviceFound');
    }, WAITING_TIMEOUT);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  /** Function comments */
  useEffect(() => {
    // consoleLog('useEffect foundDevices init==>');
    intervalID = setInterval(() => {
      // setFoundDevices([]);
      refreshFoundDevices();
    }, WAITING_TIMEOUT_FOR_REFRESH_LIST);

    return () => {
      consoleLog('Unmounting clearInterval');
      clearInterval(intervalID);
    };
  }, []);

  const refreshFoundDevices = () => {
    // consoleLog('refreshFoundDevices init==>');
    setFoundDevices(prevState => {
      var nextState = prevState;
      // consoleLog('refreshFoundDevices prevState==>', prevState);

      const findStatus = prevState.find(device => {
        return device?.updateTimestamp < Date.now();
      });
      consoleLog('findStatus', findStatus);

      if (findStatus) {
        nextState = prevState.filter(device => {
          // consoleLog('filter', {
          //   updateTimestamp: device?.updateTimestamp,
          //   current: Date.now(),
          // });
          return device?.updateTimestamp > Date.now();
        });
        // consoleLog('nextState==>', nextState);
      }
      return nextState;
    });
  };

  const initlizeApp = async () => {
    if (connectedDevice?.id) {
      try {
        const isDeviceConnected = await BLEService.isDeviceConnected(
          connectedDevice?.id,
        );
        if (isDeviceConnected) {
          await BLEService.disconnectDeviceById(connectedDevice?.id);
        }
      } catch (error) {
        consoleLog('__scanDevices error', error);
      }
    }

    setFoundDevices([]);
    // consoleLog('connectedDevice?.name', connectedDevice?.name);
    if (connectedDevice?.name) {
      // NavigationService.navigate('DeviceDashboard');
    } else {
      setSearching(true);
      BLEService.initializeBLE().then(() =>
        BLEService.scanDevices(addFoundDevice, null, false),
      );
    }
  };

  const addFoundDevice = (__device: DeviceExtendedProps) => {
    // consoleLog('device', device?.localName);
    const device: DeviceExtendedProps = filterBLEDevices(__device);
    consoleLog('device?.localName==>', device?.localName);
    if (!device) {
      // refreshFoundDevices(foundDevices);
      return false;
    }
    setFoundDevices(prevState => {
      const __isFoundDeviceUpdateNecessary = isFoundDeviceUpdateNecessary(
        prevState,
        device,
      );
      // consoleLog(
      //   '__isFoundDeviceUpdateNecessary',
      //   __isFoundDeviceUpdateNecessary,
      // );
      if (!__isFoundDeviceUpdateNecessary) {
        return prevState;
      }
      // deep clone
      const nextState = cloneDeep(prevState);
      const extendedDevice: DeviceExtendedProps = {
        ...device,
        updateTimestamp: Date.now() + MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS,
      } as DeviceExtendedProps;

      const indexToReplace = nextState.findIndex(
        currentDevice => currentDevice.id === device.id,
      );
      // consoleLog('indexToReplace', indexToReplace);
      if (indexToReplace === -1) {
        return nextState.concat(extendedDevice);
      }
      nextState[indexToReplace] = extendedDevice;

      return nextState;
    });
  };

  const isFoundDeviceUpdateNecessary = (
    currentDevices: DeviceExtendedProps[],
    updatedDevice: Device,
  ) => {
    const currentDevice = currentDevices.find(
      ({id}) => updatedDevice.id === id,
    );
    if (!currentDevice) {
      return true;
    }
    return currentDevice?.updateTimestamp < Date.now();
  };

  const onDeviceConnectingPress = (item: any) => {
    setIsConnecting(true);
    BLEService.connectToDevice(item?.id, item)
      .then(onConnectSuccess)
      .catch(onConnectFail);
  };

  const onConnectSuccess = async () => {
    consoleLog('onConnectSuccess');
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    // NavigationService.navigate('DeviceDashboard');
    NavigationService.resetAllAction('BottomTabNavigator');
    setIsConnecting(false);
  };

  const onConnectFail = (error: any) => {
    consoleLog('onConnectFail error==>', error);
    // NavigationService.navigate('BottomTabNavigator');
    setIsConnecting(false);
  };

  /**Child flatlist render method */
  const renderItem = ({item}: any) => {
    return (
      <TouchableItem
        onPress={() => {
          onDeviceConnectingPress(item);
        }}
        style={{}}>
        <>
          <Row
            autoMargin={false}
            style={{alignItems: 'center', paddingHorizontal: 15}}>
            <Wrap autoMargin={false} style={{justifyContent: 'flex-start'}}>
              <Image
                // @ts-ignore
                source={getImgSource(
                  typeof item?.modelStaticData?.models[0]?.image != 'undefined'
                    ? item?.modelStaticData?.models[0]?.image
                    : Images.imgHolder,
                )}
                style={{height: 80, width: 80}}
                resizeMode="contain"
              />
            </Wrap>

            <Wrap
              autoMargin={false}
              style={{flex: 1, justifyContent: 'flex-start', paddingLeft: 10}}>
              <Typography
                size={14}
                text={`${item?.localName ?? item?.name}`}
                style={{
                  textAlign: 'left',
                  // paddingVertical: 10,
                }}
                color={Theme.colors.black}
                noOfLine={2}
              />
              <Typography
                size={12}
                text={`Version ${item?.modelStaticData?.generation ?? 'N/A'}`}
                style={{
                  textAlign: 'left',
                  fontStyle: 'italic',
                }}
                color={Theme.colors.darkGray}
                noOfLine={1}
              />
            </Wrap>
            <Wrap autoMargin={false} style={{justifyContent: 'flex-end'}}>
              <VectorIcon
                iconPack="MaterialCommunityIcons"
                name={'link-variant'}
                size={25}
                color={Theme.colors.lightGray}
              />
            </Wrap>
          </Row>
          <Divider />
        </>
      </TouchableItem>
    );
  };

  const flatListHeader = () => {
    return (
      <>
        <Wrap autoMargin={false} style={{paddingVertical: 30}}>
          <Typography
            size={18}
            text={`Connect Your Product`}
            style={{
              textAlign: 'center',
              marginTop: 0,
              lineHeight: 25,
            }}
            color={Theme.colors.primaryColor}
            ff={Theme.fonts.ThemeFontMedium}
          />
        </Wrap>
        <Divider />
      </>
    );
  };

  if (isConnecting) {
    return <DeviceConnecting />;
  } else if (!isSearching) {
    return <NoDeviceFound onSearchAgainPress={() => setSearching(true)} />;
  } else {
    return (
      <AppContainer
        scroll={false}
        scrollViewStyle={{}}
        backgroundType="solid"
        haslogOutButton={true}
        hasRightButton={true}
        // onLogoutPress={onLogout}
        onRightPress={() => {
          initlizeApp();
        }}
        headerContainerStyle={{backgroundColor: Theme.colors.primaryColor}}>
        <Wrap autoMargin={false} style={styles.container}>
          <Wrap autoMargin={false} style={styles.sectionContainer}>
            <Wrap autoMargin={false} style={styles.section1}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={foundDevices ?? []}
                renderItem={renderItem}
                keyExtractor={(item, index) => index?.toString()}
                onEndReachedThreshold={0.01}
                ListHeaderComponent={flatListHeader}
                ListFooterComponent={() => null}
                contentContainerStyle={[
                  {paddingBottom: 10},
                  foundDevices.length == 0 && {flex: 1},
                ]}
                ListEmptyComponent={() => (
                  <Wrap
                    autoMargin={false}
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Loader
                      visible={true}
                      loadingText="Searching nearby devices..."
                    />
                  </Wrap>
                )}
              />
            </Wrap>
          </Wrap>

          <Wrap
            autoMargin={false}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: 'white',
            }}>
            <Row
              autoMargin={false}
              style={{
                alignItems: 'center',
                paddingVertical: 5,
                backgroundColor: 'white',
                shadowRadius: 2,
                shadowOffset: {
                  width: 0,
                  height: -3,
                },
                shadowColor: '#000000',
                elevation: 4,
                paddingHorizontal: 30,
                overflow: 'hidden',
                borderTopWidth: 1,
                borderTopColor: Theme.colors.lightGray,
              }}>
              <Wrap autoMargin={false} style={{}}>
                <Image
                  // @ts-ignore
                  source={getImgSource(Images.appLogoWhite)}
                  style={{height: 40, width: 80}}
                  tintColor={Theme.colors.midGray}
                  resizeMode="contain"
                />
              </Wrap>
              <Wrap autoMargin={false} style={{}}>
                <AppInfo
                  style1={{textAlign: 'center', color: Theme.colors.midGray}}
                  style2={{textAlign: 'center', color: Theme.colors.midGray}}
                />
              </Wrap>
            </Row>
          </Wrap>
        </Wrap>
      </AppContainer>
    );
  }
};

export default Index;
