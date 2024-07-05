import React, {useEffect, useRef, useState} from 'react';
import {Image, FlatList} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {useDispatch} from 'react-redux';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
} from 'src/utils/Helpers/HelperFunction';
import Typography from 'src/components/Typography';
import {Wrap, Row} from 'src/components/Common';
import TouchableItem from 'src/components/TouchableItem';
import NavigationService from 'src/services/NavigationService/NavigationService';
import AppInfo from 'src/components/@ProjectComponent/AppInfo';
import VectorIcon from 'src/components/VectorIcon';
import {styles} from './styles';
import AppContainer from 'src/components/AppContainer';
import Loader from 'src/components/Loader';
import Divider from 'src/components/Divider';
import {BLEService} from 'src/services';
import {cloneDeep} from 'src/services/BLEService/cloneDeep';
import DeviceConnecting from 'src/components/@ProjectComponent/DeviceConnecting';
import NoDeviceFound from 'src/components/@ProjectComponent/NoDeviceFound';
import {Device} from 'react-native-ble-plx';
import {filterBLEDevices} from './helper';
import {DeviceExtendedProps, ScanningProps} from './types';
import ActivateDevice from 'src/components/@ProjectComponent/ActivateDevice';
import {checkAllRequiredPermissions} from 'src/screens/Permission/helper';
import {constants} from 'src/common';

const WAITING_TIMEOUT_FOR_CHECKING_DEVICE = 10000;
const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 2500;
const WAITING_TIMEOUT_FOR_REFRESH_LIST = 5000;
let timeoutID: any = null;
let intervalID: any = null;

const Index = ({navigation, route}: any) => {
  const [isScanning, setScanning] = useState<ScanningProps>(
    ScanningProps.Pending,
  );
  const foundDevicesRef = useRef<DeviceExtendedProps[]>([]);
  const [foundDevices, setFoundDevices] = useState<DeviceExtendedProps[]>([]);
  const connectedDevice: any = BLEService.getDevice();
  const [requiredPermissionAllowed, setRequiredPermissionAllowed] =
    useState(false);
  const [searchAgainFlag, setSearchAgain] = useState(0);

  /** Function comments */
  useEffect(() => {
    consoleLog('useEffect manageRequirePermissions==>', {
      requiredPermissionAllowed,
    });
    __checkAllRequiredPermissions();
  }, []);

  /** Function for manage permissions using in this screen */
  const __checkAllRequiredPermissions = async () => {
    const __checkAllRequiredPermissions = await checkAllRequiredPermissions();
    if (__checkAllRequiredPermissions == constants.TOTAL_PERMISSION_REQUIRED) {
      setRequiredPermissionAllowed(true);
    } else {
      NavigationService.replace('Permission');
    }
  };
  /** component hooks method for focus */
  useEffect(() => {
    // // consoleLog('useEffect DeviceSearching focused==>', {
    // //   requiredPermissionAllowed,
    // // });
    if (requiredPermissionAllowed) {
      // consoleLog('useEffect initlizeApp called==>', {
      //   requiredPermissionAllowed,
      // });
      initlizeApp();
    }
    if (requiredPermissionAllowed) {
      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action
        consoleLog('DeviceSearching useEffect addListener focused');
        if (requiredPermissionAllowed) {
          initlizeApp();
        }
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation, requiredPermissionAllowed, searchAgainFlag]);

  /** component hooks method for checking and setting foundDevicesRef */
  useEffect(() => {
    consoleLog('useEffect foundDevicesRef called');
    // THIS IS THE MAGIC PART
    foundDevicesRef.current = foundDevices;
    if (foundDevices.length) {
      clearTimeout(timeoutID);
      // clearInterval(intervalID);
    } else {
      reInitIntervals();
    }
  }, [foundDevices]);

  const reInitIntervals = () => {
    consoleLog('reInitIntervals called');

    // NoDevice
    timeoutID && clearInterval(timeoutID);
    timeoutID = setInterval(() => {
      if (
        !foundDevicesRef?.current?.length ||
        foundDevicesRef?.current?.length == 0
      ) {
        clearInterval(timeoutID);
        clearInterval(intervalID);
        BLEService.manager.stopDeviceScan();
        setScanning(ScanningProps.NoDevice);
      }
    }, WAITING_TIMEOUT_FOR_CHECKING_DEVICE);
  };

  /** component hooks method for searching timeout */
  useEffect(() => {
    consoleLog('useEffect setTimeout called');
    if (requiredPermissionAllowed) {
      // Clear timeout callback if previously set before creating new one
      // timeoutID && clearTimeout(timeoutID);
      timeoutID && clearInterval(timeoutID);
      timeoutID = setInterval(() => {
        consoleLog(
          'useEffect setTimeout foundDevicesRef?.current?.length',
          foundDevicesRef?.current?.length,
        );

        if (
          !foundDevicesRef?.current?.length ||
          foundDevicesRef?.current?.length == 0
        ) {
          // clearTimeout(timeoutID);
          clearInterval(timeoutID);
          clearInterval(intervalID);
          // BLEService.manager.stopDeviceScan();
          // setScanning(ScanningProps.NoDevice);
        }
      }, WAITING_TIMEOUT_FOR_CHECKING_DEVICE);
    }
    return () => {
      consoleLog('Unmounting clearTimeout');
      // clearTimeout(timeoutID);
      clearInterval(timeoutID);
    };
  }, [requiredPermissionAllowed, searchAgainFlag]);

  /** component hooks method for refresh search list timeout */
  useEffect(() => {
    consoleLog('useEffect setInterval called', requiredPermissionAllowed);
    if (requiredPermissionAllowed) {
      // Clear interval callback if previously set before creating new one
      intervalID && clearInterval(intervalID);
      intervalID = setInterval(() => {
        refreshFoundDevices();
      }, WAITING_TIMEOUT_FOR_REFRESH_LIST);
    }

    return () => {
      consoleLog('Unmounting clearInterval');
      clearInterval(intervalID);
    };
  }, [requiredPermissionAllowed, searchAgainFlag]);

  /** Function comments */
  const initlizeApp = async () => {
    consoleLog('initlizeApp called', {requiredPermissionAllowed});
    if (!requiredPermissionAllowed) {
      return false;
    }
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
      BLEService.scanDevices(addFoundDevice, null, true),
    );
  };

  /** Function comments */
  const addFoundDevice = (__device: DeviceExtendedProps) => {
    // {"deviceCustomName": "FAUCET ETF610 / EBF615, ETF600 / EBF650 T0224 ", "localName": "FAUCET ADSKU02 T0224"}
    const device = filterBLEDevices(__device);
    consoleLog('addFoundDevice device==>', device);
    // const device = __device;
    // device.deviceCustomName = device?.localName ?? 'Unknown';
    // consoleLog('addFoundDevice device names==>', {
    //   localName: device?.localName,
    //   deviceCustomName: device?.deviceCustomName,
    //   // rawScanRecord: __device?.rawScanRecord,
    //   // manufacturerData: __device?.manufacturerData,
    // });
    if (!device) {
      return false;
    }

    if (ScanningProps.DeviceFound != isScanning) {
      setScanning(ScanningProps.DeviceFound);
    }

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
    consoleLog('refreshFoundDevices init intervalID==>', {
      intervalID,
      timeoutID,
    });
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
      checkIfNoFoundDevices(nextState);
      return nextState;
    });
  };

  /** Function comments */
  const checkIfNoFoundDevices = (__foundDevices: any) => {
    consoleLog('checkIfNoFoundDevices called');
    if (!__foundDevices?.length && isScanning == ScanningProps.DeviceFound) {
      setScanning(ScanningProps.Scanning);
      // initlizeApp();
    }
  };

  /** Function comments */
  const onDeviceConnectingPress = (item: any) => {
    consoleLog('onDeviceConnectingPress intervalID & timeoutID==>', {
      timeoutID,
      intervalID,
    });
    clearTimeout(timeoutID);
    clearInterval(intervalID);
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
    }, 2000);
  };

  /** Function comments */
  const onConnectFail = (error: any) => {
    consoleLog('onConnectFail error==>', error);
    showToastMessage(
      'Looks like BD closed the bluetooth connection, please retry',
    );
    initlizeApp();
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

  return (
    <>
      <ActivateDevice />
    </>
  );

  if (isScanning == ScanningProps.Connecting) {
    return <DeviceConnecting />;
  } else if (isScanning == ScanningProps.NoDevice) {
    return (
      <NoDeviceFound
        onSearchAgainPress={() => {
          setScanning(ScanningProps.Scanning);
          setSearchAgain(searchAgainFlag + 1);
          initlizeApp();
        }}
        onBackButtonPress={() => {
          setScanning(ScanningProps.Scanning);
          setSearchAgain(searchAgainFlag + 1);
          initlizeApp();
        }}
      />
    );
  } else if (
    isScanning == ScanningProps.DeviceFound &&
    foundDevices?.length > 0
  ) {
    return (
      <AppContainer
        scroll={false}
        scrollViewStyle={{}}
        backgroundType="solid"
        hasHeader={true}
        hasLogOutButton={true}
        hasDeviceSearchButton
        headerBackgroundType="solid"
        // haslogOutButton={true}
        // hasRightButton={true}
        // onLogoutPress={onLogout}
        // onRightPress={() => {
        //   initlizeApp();
        // }}
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
                  {paddingBottom: 60},
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
    return (
      <>
        <ActivateDevice />
      </>
    );
  }
};

export default Index;
