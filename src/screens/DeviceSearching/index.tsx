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
import {DeviceExtendedProps, ScanningProps} from './types';
import ActivateDevice from 'src/components/@ProjectComponent/ActivateDevice';
import {
  checkBluetoothPermissions,
  PERMISSIONS_RESULTS,
  requestBluetoothPermissions,
  checkLocationPermissions,
  requestLocationPermissions,
} from 'src/utils/Permissions';
import {getBatteryLevel, getTotalWaterUsase} from 'src/utils/Helpers/project';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 5000;
const WAITING_TIMEOUT_FOR_CHECKING_DEVICE = 20000;
const WAITING_TIMEOUT_FOR_REFRESH_LIST = 10000;

const Index = ({navigation, route}: any) => {
  var timeoutID: any = null;
  var intervalID: any = null;
  const dispatch = useDispatch();
  const {user, token} = useSelector((state: any) => state?.AuthReducer);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setScanning] = useState<ScanningProps>(
    ScanningProps.Pending,
  );

  const [foundDevices, setFoundDevices] = useState<DeviceExtendedProps[]>([]);
  const connectedDevice: any = BLEService.getDevice();
  const [requirePermissionAllowed, setRequirePermissionAllowed] =
    useState(false);

  /** Function comments */
  useEffect(() => {
    consoleLog('useEffect manageRequirePermissions==>');
    manageRequirePermissions();
  }, []);

  /** component hooks method */
  useEffect(() => {
    consoleLog('useEffect initlizeApp==>');
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
    consoleLog('useEffect setTimeout NoDevice==>');
    timeoutID = setTimeout(() => {
      if (foundDevices.length == 0) {
        // consoleLog('setTimeout==>', timeoutID);
        // NavigationService.replace('NoDeviceFound');
        // clearTimeout(timeoutID);
        // BLEService.manager.stopDeviceScan();
        // setScanning(ScanningProps.NoDevice);
      }
    }, WAITING_TIMEOUT_FOR_CHECKING_DEVICE);

    return () => {
      consoleLog('Unmounting clearTimeout');
      clearTimeout(timeoutID);
    };
  }, []);

  /** Function comments */
  useEffect(() => {
    consoleLog('useEffect setInterval refreshFoundDevices==>');
    intervalID = setInterval(() => {
      refreshFoundDevices();
    }, WAITING_TIMEOUT_FOR_REFRESH_LIST);

    return () => {
      consoleLog('Unmounting clearInterval');
      clearInterval(intervalID);
    };
  }, []);

  /** Function comments */
  const initlizeApp = async () => {
    consoleLog('initlizeApp ');
    if (connectedDevice?.id) {
      try {
        const isDeviceConnected = await BLEService.isDeviceConnected(
          connectedDevice?.id,
        );
        if (isDeviceConnected) {
          await BLEService.disconnectDeviceById(connectedDevice?.id);
        }
      } catch (error) {
        consoleLog('initlizeApp isDeviceConnected error', error);
      }
    }

    setFoundDevices([]);
    setScanning(ScanningProps.Scanning);
    BLEService.initializeBLE().then(() =>
      BLEService.scanDevices(addFoundDevice, null, false),
    );
  };

  /** Function comments */
  const addFoundDevice = (__device: DeviceExtendedProps) => {
    // {"deviceCustomName": "FAUCET ETF610 / EBF615, ETF600 / EBF650 T0224 ", "localName": "FAUCET ADSKU02 T0224"}
    // consoleLog('addFoundDevice __device==>', __device);
    const device = filterBLEDevices(__device);
    consoleLog('addFoundDevice device names==>', {
      localName: device?.localName,
      deviceCustomName: device?.deviceCustomName,
    });
    if (!device) {
      // refreshFoundDevices(foundDevices);
      return false;
    }

    setScanning(ScanningProps.DeviceFound);
    setFoundDevices(prevState => {
      const __isFoundDeviceUpdateNecessary = isFoundDeviceUpdateNecessary(
        prevState,
        device,
      );

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

  /** Function comments */
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

  /** Function comments */
  const refreshFoundDevices = () => {
    // consoleLog('refreshFoundDevices init==>');
    setFoundDevices(prevState => {
      var nextState = prevState;
      // consoleLog('refreshFoundDevices prevState==>', prevState);

      const findStatus = prevState.find(device => {
        return device?.updateTimestamp < Date.now();
      });
      // consoleLog('findStatus', findStatus);

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

  /** Function comments */
  const onDeviceConnectingPress = (item: any) => {
    setScanning(ScanningProps.Connecting);
    BLEService.connectToDevice(item?.id, item)
      .then(onConnectSuccess)
      .catch(onConnectFail);
  };

  /** Function comments */
  const onConnectSuccess = async () => {
    consoleLog('onConnectSuccess');
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    await BLEService.initDeviceData();
    // NavigationService.navigate('DeviceDashboard');
    setTimeout(() => {
      NavigationService.resetAllAction('BottomTabNavigator');
      setIsConnecting(false);
    }, 2000);
  };

  /** Function comments */
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
                text={`${item?.deviceCustomName}`}
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

  /** Function comments */
  const onLogout = async () => {
    const result = await showConfirmAlert('Are you sure?');
    if (result) {
      dispatch(loginResetDataAction());
      // dispatch(settingsResetDataAction());
      NavigationService.resetAllAction('Login');
    }
  };

  /** Function for manage permissions using in this screen */
  const manageRequirePermissions = async () => {
    consoleLog('manageRequirePermissions called==>');
    let status = 0;
    const __checkBluetoothPermissions = await checkBluetoothPermissions();
    // consoleLog('__checkBluetoothPermissions', __checkBluetoothPermissions);

    if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __requestBluetoothPermissions = await requestBluetoothPermissions();
      if (__requestBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__requestBluetoothPermissions', __requestBluetoothPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    const __checkLocationPermissions = await checkLocationPermissions();
    // consoleLog('__checkLocationPermissions', __checkLocationPermissions);

    if (__checkLocationPermissions == PERMISSIONS_RESULTS.DENIED) {
      const __checkLocationPermissions = await requestLocationPermissions();
      if (__checkLocationPermissions == PERMISSIONS_RESULTS.BLOCKED) {
        // permissionDeniedBlockedAlert(
        //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
        // );
        status++;
      }
      // consoleLog('__checkLocationPermissions', __checkLocationPermissions);
    } else if (__checkBluetoothPermissions == PERMISSIONS_RESULTS.BLOCKED) {
      // permissionDeniedBlockedAlert(
      //   `We need camera permission for chat.\n You have previously denied these permissions, so you have to manually allow these permissions.`,
      // );
      status++;
    }

    if (status == 0) {
      setRequirePermissionAllowed(true);
    }
  };

  if (isScanning == ScanningProps.Connecting) {
    return <DeviceConnecting />;
  } else if (isScanning == ScanningProps.NoDevice) {
    return (
      <NoDeviceFound
        onSearchAgainPress={() => {
          setScanning(ScanningProps.Scanning);
          initlizeApp();
        }}
      />
    );
  } else if (isScanning == ScanningProps.DeviceFound) {
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
  } else {
    return <ActivateDevice onLogout={onLogout} />;
  }
};

export default Index;
