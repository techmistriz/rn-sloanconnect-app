import React, {useEffect, useRef, useState} from 'react';
import {Image, FlatList} from 'react-native';
import Theme from 'src/theme';
import {Images} from 'src/assets';
import {
  consoleLog,
  getImgSource,
  showToastMessage,
  timestampInSec,
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
import {filterBLEDevices} from './helper';
import {DeviceExtendedProps, ScanningProps} from './types';
import ActivateDevice from 'src/components/@ProjectComponent/ActivateDevice';

let timeoutID: any = null;
let timeoutIDForConnecting: any = null;
let intervalID: any = null;
const LAST_SCAN_TIME_IN_SEC = 4;
const LAST_SCAN_INTERVAL_TIME_MS = 2000;
const DEVICE_LIST_CHECKING_TIMEOUT_MS = 20000;

const Index = ({navigation, route}: any) => {
  const [isScanning, setScanning] = useState<ScanningProps>(
    ScanningProps.Pending,
  );
  const foundDevicesRef = useRef<DeviceExtendedProps[]>([]);
  const [foundDevices, setFoundDevices] = useState<DeviceExtendedProps[]>([]);
  const connectedDevice: any = BLEService.getDevice();
  const [searchAgainFlag, setSearchAgain] = useState(0);
  const [isDeviceConnectTimedout, setDeviceConnectTimeout] = useState(false);

  /** Hooks for checking if user turned off bluetooth power */
  useEffect(() => {
    const subscription = BLEService.manager.onStateChange(state => {
      consoleLog('DeviceSearching useEffect state==>', state);
      if (state === 'PoweredOff') {
        NavigationService.replace('Permission');
      }
    }, true);
    return () => subscription.remove();
  }, [BLEService.manager]);

  /** Hooks method checking for first init and came back to another screen */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      consoleLog('DeviceSearching useEffect addListener focused');
      initlizeApp();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
    return () => {
      consoleLog('Unmounting unsubscribe');
      unsubscribe();
    };
  }, [navigation, searchAgainFlag]);

  /** Hooks method for unmounting times when screen moved to another screen */
  useEffect(() => {
    return () => {
      consoleLog('Unmounting clearTimeout & clearInterval');
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    };
  }, []);

  /** Function comments */
  const initlizeApp = async () => {
    consoleLog('initlizeApp called');
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

    initlizeCheckDeviceListTimer();
    initlizeCheckAndRemoveNoAdvertsingDevicesTimer();

    setFoundDevices([]);
    setScanning(ScanningProps.Scanning);
    BLEService.initializeBLE().then(() =>
      BLEService.scanDevices(addFoundDevice, null, true),
    );
  };

  /** Hooks method for checking and setting foundDevicesRef
   * this is because foundDevices var values does not reflect updated in timer functions
   */
  useEffect(() => {
    consoleLog('useEffect foundDevicesRef called', foundDevices);
    foundDevicesRef.current = foundDevices;
    if (foundDevices.length) {
      clearTimeout(timeoutID);
    } else {
      initlizeCheckDeviceListTimer();
    }
  }, [foundDevices]);

  /** component timer method */
  const initlizeCheckDeviceListTimer = () => {
    consoleLog('initlizeCheckDeviceListTimer called');

    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      if (
        !foundDevicesRef?.current?.length ||
        foundDevicesRef?.current?.length == 0
      ) {
        clearTimeout(timeoutID);
        clearInterval(intervalID);
        BLEService.manager.stopDeviceScan();
        setScanning(ScanningProps.NoDevice);
      }
    }, DEVICE_LIST_CHECKING_TIMEOUT_MS);
  };

  /** component timer method */
  const initlizeCheckAndRemoveNoAdvertsingDevicesTimer = () => {
    consoleLog('initlizeCheckAndRemoveNoAdvertsingDevicesTimer called');
    if (intervalID) {
      clearInterval(intervalID);
    }
    intervalID = setInterval(() => {
      CheckAndRemoveNoAdvertsingDevices();
      // consoleLog('initlizeTimers foundDevicesRef==>', foundDevicesRef);
    }, LAST_SCAN_INTERVAL_TIME_MS);
  };

  /** method for CheckAndRemoveNoAdvertsingDevices */
  const CheckAndRemoveNoAdvertsingDevices = () =>
    // __foundDevices1?: DeviceExtendedProps[],
    {
      const __foundDevices: DeviceExtendedProps[] = foundDevicesRef?.current;
      consoleLog(
        'CheckAndRemoveNoAdvertsingDevices __foundDevices called==>',
        __foundDevices?.length,
      );
      consoleLog(
          'CheckAndRemoveNoAdvertsingDevices __foundDevices called isScanning==>',
          isScanning
      );
      if (Array.isArray(__foundDevices) && __foundDevices.length > 0) {
        // LAST_SCAN_INTERVAL_TIME_MS = 2
        // Suppose last scan = 100
        // LAST_SCAN_TIME = 2
        // current time = 101
        // {"LAST_SCAN_TIME_IN_SEC": 4, "lastScan": 1720801168, "timestampInSec": 1720801172}
        // {"LAST_SCAN_TIME_IN_SEC": 5, "lastScan": 1721101249, "timestampInSec": 1721101254}
        let timestampInSecond = timestampInSec();
        const __foundDevicesTmp = __foundDevices.filter(device => {
          consoleLog('checkDevicesIfOld __foundDevicesTmp==>', {
            lastScan: device?.lastScan,
            LAST_SCAN_TIME_IN_SEC,
            timestampInSec: timestampInSecond,
          });
          return device?.lastScan + LAST_SCAN_TIME_IN_SEC >= timestampInSecond;
        });

        if (Array.isArray(__foundDevicesTmp) && __foundDevicesTmp.length > 0) {
          setFoundDevices(__foundDevicesTmp);
        } else {
          setFoundDevices([]);
        }
      }
    };

  /** Function comments */
  const addFoundDevice = (__device: DeviceExtendedProps) => {
    const device = filterBLEDevices(__device);

    if (!device) {
      // consoleLog('Scanning....');
      return false;
    }
    consoleLog('addFoundDevice device==>', {
      deviceCustomName: device?.deviceCustomName,
      timestampInSec: timestampInSec(),
    });

    setScanning(ScanningProps.DeviceFound);

    setFoundDevices(prevState => {
      // const nextState = cloneDeep(prevState); // due to so fast state value updation issue on time
      const nextState = cloneDeep(foundDevicesRef?.current); // ref values are always upto date
      const extendedDevice: DeviceExtendedProps = {
        ...device,
        lastScan: timestampInSec(),
      } as DeviceExtendedProps;

      const indexToReplace = nextState.findIndex(
        currentDevice => currentDevice.id === device.id,
      );
      if (indexToReplace === -1) {
        return nextState.concat(extendedDevice);
      }
      nextState[indexToReplace] = extendedDevice;
      return nextState;
    });
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
    setDeviceConnectTimeout(false);
    BLEService.connectToDevice(item?.id, item)
      .then(() => onConnectSuccess(item?.id))
      .catch(onConnectFail);
    timeoutIDForConnecting = setTimeout(() => {
      setDeviceConnectTimeout(true);
      onConnectFail({}, item?.id);
    }, 15000);
  };

  /** Function comments */
  const onConnectSuccess = async (deviceId) => {
    consoleLog('onConnectSuccess');
    clearTimeout(timeoutIDForConnecting);
    if (isDeviceConnectTimedout) {
      BLEService.disconnectDevice(false, deviceId);
      return;
    }
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    await BLEService.initDeviceData();
    // NavigationService.navigate('DeviceDashboard');
    setTimeout(() => {
      NavigationService.resetAllAction('BottomTabNavigator');
    }, 2000);
  };

  /** Function comments */
  const onConnectFail = async (error: any, deviceId: any = null) => {
    clearTimeout(timeoutIDForConnecting);
    BLEService.disconnectDevice(false, deviceId);
    consoleLog('onConnectFail error==>', error);
    showToastMessage('Failed to establish connection to device. Please retry.');
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

  /** Function comments */
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
