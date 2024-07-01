import {
  BleError,
  BleErrorCode,
  BleManager,
  Device,
  State as BluetoothState,
  LogLevel,
  type DeviceId,
  type TransactionId,
  type UUID,
  type Characteristic,
  type Base64,
  type Subscription,
  ScanMode,
} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  base64EncodeDecode,
  base64EncodeFromByteArray,
  fromHexStringUint8Array,
} from 'src/utils/Helpers/encryption';
import {
  getBatteryLevel,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceModelData,
  getTotalWaterUsase,
  intiGen2SecurityKey,
} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';
import {DeviceExtendedProps} from 'src/screens/DeviceSearching/types';
import BLE_CONSTANTS from 'src/utils/StaticData/BLE_CONSTANTS';

const deviceNotConnectedErrorText = 'Device is not connected';

class BLEServiceInstance {
  manager: BleManager;

  device: Device | null;

  deviceRaw: Device | null;

  scannedDevices: Device[];

  deviceGeneration: string;

  deviceVersion: string;

  batteryLevel: number;

  totalWaterUsase: number;

  connectedDeviceStaticData: any;

  characteristicMonitorDeviceDataIntegers: any;

  characteristicMonitorDeviceDataIntegersMapped: any;

  characteristicMonitorDeviceDataString: any;

  characteristicMonitorDeviceDataStringMapped: any;

  characteristicMonitorDataCollection: any;

  characteristicMonitorDataCollectionMapped: any;

  characteristicMonitorRealTimeData: any;

  characteristicMonitorRealTimeDataMapped: any;

  characteristicMonitorDiagnostic: any;

  characteristicMonitorDiagnosticMapped: any;

  characteristicMonitor: Subscription | null;

  characteristicMonitorDeviceDataIntegersSubscriprion: Subscription | null;

  characteristicMonitorDeviceDataStringSubscriprion: Subscription | null;

  characteristicMonitorDataCollectionIntegerSubscriprion: Subscription | null;

  characteristicMonitorRealTimeDataSubscriprion: Subscription | null;

  isCharacteristicMonitorDisconnectExpected = false;

  constructor() {
    this.device = null;
    this.deviceRaw = null;
    this.scannedDevices = [];
    this.deviceGeneration = '';
    this.deviceVersion = '01';
    this.batteryLevel = 0;
    this.totalWaterUsase = 0;
    this.connectedDeviceStaticData = null;
    this.characteristicMonitorDeviceDataIntegers = [];
    this.characteristicMonitorDeviceDataIntegersMapped = [];
    this.characteristicMonitorDeviceDataString = [];
    this.characteristicMonitorDeviceDataStringMapped = [];
    this.characteristicMonitorDataCollection = [];
    this.characteristicMonitorDataCollectionMapped = [];
    this.characteristicMonitorRealTimeData = [];
    this.characteristicMonitorRealTimeDataMapped = [];
    this.characteristicMonitor = null;
    this.characteristicMonitorDeviceDataIntegersSubscriprion = null;
    this.characteristicMonitorDeviceDataStringSubscriprion = null;
    this.characteristicMonitorDataCollectionIntegerSubscriprion = null;
    this.characteristicMonitorRealTimeDataSubscriprion = null;
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
  }

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getDevice = () => this.device;

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  initializeBLE = () =>
    new Promise<void>(resolve => {
      const subscription = this.manager.onStateChange(state => {
        switch (state) {
          case BluetoothState.Unsupported:
            // this.showErrorToast('');
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            // this.manager.enable().catch((error: BleError) => {
            //   if (error?.errorCode === BleErrorCode?.BluetoothUnauthorized) {
            //     this.requestBluetoothPermission();
            //   }
            // });
            break;
          case BluetoothState.Unauthorized:
            this.showErrorToast('Bluetooth Unauthorized');
            // this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            // this.onBluetoothPowerOn();
            resolve();
            subscription.remove();
            break;
          default:
            consoleLog('Unsupported state: ', state);
        }
      }, true);
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  disconnectDevice = (showToast: boolean = true) => {
    new Promise<boolean>((resolve, reject) => {
      if (!this.device?.id) {
        // this.showErrorToast(deviceNotConnectedErrorText);
        return resolve(true);
        // throw new Error(deviceNotConnectedErrorText);
      }
      this.manager
        .cancelDeviceConnection(this.device.id)
        .then(() => {
          this.device = null;
          showToast && this.showSuccessToast('Device disconnected');
          resolve(true);
        })
        .catch(error => {
          if (error?.code !== BleErrorCode.DeviceDisconnected) {
            this.onError(error);
          }
          resolve(true);
        });
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  disconnectDeviceById = (id: DeviceId) =>
    new Promise<boolean>((resolve, reject) => {
      this.manager
        .cancelDeviceConnection(id)
        .then(() => {
          this.showSuccessToast('Device disconnected');
          resolve(true);
        })
        .catch(error => {
          if (error?.code !== BleErrorCode.DeviceDisconnected) {
            this.onError(error);
          }
          resolve(true);
        });
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  onBluetoothPowerOff = () => {
    this.showErrorToast('Bluetooth is turned off');
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  onBluetoothPowerOn = () => {
    this.showSuccessToast('Bluetooth is turned on');
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  scanDevices = async (
    onDeviceFound: (device: DeviceExtendedProps) => void,
    UUIDs: UUID[] | null = null,
    legacyScan?: boolean,
  ) => {
    this.manager.startDeviceScan(
      UUIDs,
      {legacyScan: legacyScan, scanMode: ScanMode.LowLatency},
      (error, device) => {
        if (error) {
          this.onError(error);
          this.manager.stopDeviceScan();
          return;
        }

        if (device) {
          onDeviceFound(device);
        }
      },
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  connectToDevice = (deviceId: DeviceId, __device: Device) =>
    new Promise<Device>((resolve, reject) => {
      this.manager.stopDeviceScan();
      this.manager
        .connectToDevice(deviceId)
        .then(device => {
          // Device localName not getting fetched when device connected
          // But when device scanning, localName available
          var deviceLocalName = __device?.localName ?? __device?.name;
          device.localName = deviceLocalName;
          this.device = device;
          this.deviceRaw = __device;
          const deviceGen = getBleDeviceGeneration(deviceLocalName);
          const deviceVer = getBleDeviceVersion(__device, deviceGen);
          this.deviceGeneration = deviceGen;
          this.deviceVersion = deviceVer;
          resolve(device);
        })
        .catch(error => {
          if (
            error.errorCode === BleErrorCode.DeviceAlreadyConnected &&
            this.device
          ) {
            resolve(this.device);
          } else {
            this.onError(error);
            reject(error);
          }
        });
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  discoverAllServicesAndCharacteristicsForDevice = async () =>
    new Promise<Device>((resolve, reject) => {
      if (!this.device) {
        navigateToDeviceSearch();
        return;
        // return this.showErrorToast(deviceNotConnectedErrorText);
        // reject(new Error(deviceNotConnectedErrorText));
      }
      this.manager
        .discoverAllServicesAndCharacteristicsForDevice(this.device.id)
        .then(device => {
          resolve(device);
          // consoleLog(
          //   'discoverAllServicesAndCharacteristicsForDevice device==>',
          //   JSON.stringify(device),
          // );
          this.device = device;
        })
        .catch(error => {
          this.onError(error);
          reject(error);
        });
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  readCharacteristicForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
  ) =>
    new Promise<Characteristic | null>((resolve, reject) => {
      if (!this.device) {
        navigateToDeviceSearch();
        return;
        // this.showErrorToast(deviceNotConnectedErrorText);
      }
      this.manager
        .readCharacteristicForDevice(
          this.device.id,
          serviceUUID,
          characteristicUUID,
        )
        .then(characteristic => {
          resolve(characteristic);
        })
        .catch(error => {
          this.onError(error);
          consoleLog('readCharacteristicForDevice error==>', error);
          resolve(null);
        });
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  writeCharacteristicWithResponseForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    value: Base64 | string,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        base64EncodeDecode(value),
      )
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  writeCharacteristicWithResponseForDevice2 = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    value: Uint8Array,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        base64EncodeFromByteArray(value),
      )
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  writeCharacteristicWithoutResponseForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    value: Base64 | string,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithoutResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        base64EncodeDecode(value),
      )
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setupMonitor = (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    onCharacteristicReceived: (characteristic: Characteristic) => void,
    onError: (error: Error) => void,
    transactionId?: TransactionId,
    hideErrorDisplay?: boolean,
  ) => {
    this.characteristicMonitor?.remove();
    consoleLog('this.characteristicMonitor', this.characteristicMonitor);

    // if (this.characteristicMonitor) {
    //   return this.showErrorToast('characteristicMonitor');
    //   // throw new Error(deviceNotConnectedErrorText);
    // }

    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
      this.device?.id,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        // consoleLog('setupMonitor characteristic==>', characteristic);
        if (error) {
          if (
            error.errorCode === 2 &&
            this.isCharacteristicMonitorDisconnectExpected
          ) {
            this.isCharacteristicMonitorDisconnectExpected = false;
            return;
          }
          onError(error);
          if (!hideErrorDisplay) {
            // this.onError(error);
            this.characteristicMonitor?.remove();
          }
          return;
        }
        if (characteristic) {
          onCharacteristicReceived(characteristic);
        }
      },
      transactionId,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setupMonitor2 = (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    onCharacteristicReceived: (characteristic: Characteristic) => void,
    onError: (error: Error) => void,
    transactionId?: TransactionId,
    hideErrorDisplay?: boolean,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    this.characteristicMonitor = this.device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (
            error.errorCode === 2 &&
            this.isCharacteristicMonitorDisconnectExpected
          ) {
            this.isCharacteristicMonitorDisconnectExpected = false;
            return;
          }
          onError(error);
          if (!hideErrorDisplay) {
            this.onError(error);
            this.characteristicMonitor?.remove();
          }
          return;
        }
        if (characteristic) {
          onCharacteristicReceived(characteristic);
        }
      },
      transactionId,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setupCustomMonitor: BleManager['monitorCharacteristicForDevice'] = (
    ...args
  ) => this.manager.monitorCharacteristicForDevice(...args);

  finishMonitor = () => {
    this.isCharacteristicMonitorDisconnectExpected = true;
    this.characteristicMonitor?.remove();
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  writeDescriptorForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    descriptorUUID: UUID,
    data: Base64,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeDescriptorForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        descriptorUUID,
        data,
      )
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  readDescriptorForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    descriptorUUID: UUID,
  ) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .readDescriptorForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        descriptorUUID,
      )
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getServicesForDevice = () => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.servicesForDevice(this.device.id).catch(error => {
      this.onError(error);
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getCharacteristicsForDevice = (serviceUUID: UUID) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .characteristicsForDevice(this.device.id, serviceUUID)
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getDescriptorsForDevice = (serviceUUID: UUID, characteristicUUID: UUID) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      //  throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .descriptorsForDevice(this.device.id, serviceUUID, characteristicUUID)
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  descriptorsForService = (serviceUUID: UUID, characteristicUUID: UUID) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      //  throw new Error(deviceNotConnectedErrorText);
    }
    return this.device
      .descriptorsForService(serviceUUID, characteristicUUID)
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  isDeviceConnected = (id: DeviceId) => {
    return new Promise<boolean>((resolve, reject) => {
      this.manager
        .isDeviceConnected(id)
        .then(status => {
          resolve(status);
        })
        .catch(error => {
          resolve(false);
        });
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getConnectedDevices = (expectedServices: UUID[]) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.connectedDevices(expectedServices).catch(error => {
      this.onError(error);
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  requestMTUForDevice = (mtu: number) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .requestMTUForDevice(this.device.id, mtu)
      .catch(error => {
        this.onError(error);
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  onDeviceDisconnected = (
    listener: (error: BleError | null, device: Device | null) => void,
  ) => {
    if (!this.device) {
      // this.showErrorToast(deviceNotConnectedErrorText);
      navigateToDeviceSearch();
      return;
    }
    return this.manager.onDeviceDisconnected(this.device.id, listener);
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  onDeviceDisconnectedCustom: BleManager['onDeviceDisconnected'] = (...args) =>
    this.manager.onDeviceDisconnected(...args);

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  readRSSIForDevice = () => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.readRSSIForDevice(this.device.id).catch(error => {
      this.onError(error);
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getDevices = () => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.devices([this.device.id]).catch(error => {
      this.onError(error);
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  cancelTransaction = (transactionId: TransactionId) =>
    this.manager.cancelTransaction(transactionId);

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  enable = () =>
    this.manager.enable().catch(error => {
      this.onError(error);
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  disable = () =>
    this.manager.disable().catch(error => {
      this.onError(error);
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getState = () =>
    this.manager.state().catch(error => {
      this.onError(error);
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  onError = (error: BleError) => {
    switch (error.errorCode) {
      case BleErrorCode.BluetoothUnauthorized:
        this.requestBluetoothPermission();
        break;
      case BleErrorCode.LocationServicesDisabled:
        this.showErrorToast('Location services are disabled');
        break;
      case BleErrorCode.DeviceDisconnected:
        // this.showErrorToast('Device already disconnected');
        navigateToDeviceSearch();
        this.device = null;
        break;
      default:
      // this.showErrorToast(JSON.stringify(error, null, 4));
    }
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  requestConnectionPriorityForDevice = (priority: 0 | 1 | 2) => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.requestConnectionPriorityForDevice(
      this.device?.id,
      priority,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  cancelDeviceConnection = () => {
    if (!this.device) {
      navigateToDeviceSearch();
      return;
      // return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.cancelDeviceConnection(this.device?.id);
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (
      Platform.OS === 'android' &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }
    this.showErrorToast('Permission have not been granted');
    return false;
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  showErrorToast = (error: string) => {
    showMessage({
      type: 'danger',
      message: 'Error',
      description: error,
    });
    // console.error(error);
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  showSuccessToast = (info: string) => {
    showMessage({
      type: 'success',
      message: 'Success',
      description: info,
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  dispenseWater = async (characteristicHex: string = '') => {
    if (BLEService.deviceGeneration == 'gen1') {
      this.dispenseWaterGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      this.dispenseWaterGen2(characteristicHex);
    } else if (BLEService.deviceGeneration == 'gen3') {
      // Code need to be implemented
    } else if (BLEService.deviceGeneration == 'gen4') {
      // Code need to be implemented
    }
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  dispenseWaterGen1 = async () => {
    const writeCharacteristicWithResponseForDevice =
      await BLEService.writeCharacteristicWithResponseForDevice(
        BLE_CONSTANTS.GEN1.WATER_DISPENCE_SERVICE_UUID,
        BLE_CONSTANTS.GEN1.WATER_DISPENCE_CHARACTERISTIC_UUID,
        '1',
      );
    showMessage({
      type: 'success',
      message: 'Success',
      description: 'Water dispensed successfully',
    });
    consoleLog(
      'dispenseWater writeCharacteristicWithResponseForDevice==>',
      JSON.stringify(writeCharacteristicWithResponseForDevice),
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  dispenseWaterGen2 = async (
    characteristicHex: string = '720a01321400000001CF',
  ) => {
    const writableData = fromHexStringUint8Array(characteristicHex);
    const writeDataResponse =
      await BLEService.writeCharacteristicWithResponseForDevice2(
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_SERVICE_UUID,
        BLE_CONSTANTS.GEN2.DEVICE_DATA_INTEGER_CHARACTERISTIC_UUID,
        writableData,
      );

    consoleLog(
      'initlizeAppGen2 writeDataResponse==>',
      JSON.stringify(writeDataResponse),
    );

    showMessage({
      type: 'success',
      message: 'Success',
      description: 'Water dispensed successfully',
    });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  initProjectLevelFunctions = async () => {};

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getSetBatteryLevel = async () => {
    this.batteryLevel = await getBatteryLevel(
      BLE_CONSTANTS.GEN1.BATTERY_LEVEL_SERVICE_UUID,
      BLE_CONSTANTS.GEN1.BATTERY_LEVEL_CHARACTERISTIC_UUID,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getSetTotalWaterUsase = async () => {
    this.totalWaterUsase = await getTotalWaterUsase(
      BLE_CONSTANTS.GEN1.FLOW_RATE_SERVICE_UUID,
      BLE_CONSTANTS.GEN1.FLOW_RATE_CHARACTERISTIC_UUID,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  async setDeviceModelData() {
    var deviceStaticData = null;

    // localName have more relevant name indentification
    var deviceName = this.device?.localName ?? this.device?.name;
    if (deviceName) {
      const deviceGen = this.deviceGeneration;
      const deviceVer = this.deviceVersion;
      consoleLog('setDeviceModelData deviceGen==>', deviceGen);
      // // consoleLog('setDeviceModelData deviceVer==>', deviceVer);

      if (deviceGen && typeof BLE_DEVICE_MODELS[deviceGen] != 'undefined') {
        // const deviceVer = getBleDeviceVersion(this.device, deviceGen);
        // consoleLog('setDeviceModelData deviceVer==>', deviceVer);

        const deviceModel = BLE_DEVICE_MODELS[deviceGen];
        consoleLog('setDeviceModelData deviceModel==>', deviceModel);

        if (deviceModel && typeof deviceModel[deviceVer] != 'undefined') {
          deviceStaticData = deviceModel[deviceVer];
        }
      }
    }

    this.connectedDeviceStaticData = deviceStaticData;
  }

  initDeviceData = async () => {
    if (BLEService.deviceGeneration == 'gen1') {
      await this.initDeviceDataGen1();
    } else if (BLEService.deviceGeneration == 'gen2') {
      await this.initDeviceDataGen2();
    } else if (BLEService.deviceGeneration == 'gen3') {
      this.initDeviceDataGen3();
    } else if (BLEService.deviceGeneration == 'gen4') {
      await this.initDeviceDataGen4();
    }
  };

  initDeviceDataGen1 = async () => {
    await this.getSetBatteryLevel();
    await this.getSetTotalWaterUsase();
    await this.setDeviceModelData();
  };

  initDeviceDataGen2 = async () => {
    await intiGen2SecurityKey();
    await this.setDeviceModelData();
  };
  initDeviceDataGen3 = async () => {};
  initDeviceDataGen4 = async () => {};
}

const navigateToDeviceSearch = () => {
  if (NavigationService.getCurrentRoute()?.name != 'DeviceSearching') {
    NavigationService.resetAllAction('DeviceSearching');
  }
};
export const BLEService = new BLEServiceInstance();
