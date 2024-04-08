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
} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {base64EncodeDecode, consoleLog} from 'src/utils/Helpers/HelperFunction';
import {
  getBatteryLevel,
  getBleDeviceGeneration,
  getBleDeviceVersion,
  getDeviceModelData,
  getTotalWaterUsase,
} from 'src/utils/Helpers/project';
import {BLE_DEVICE_MODELS} from 'src/utils/StaticData/BLE_DEVICE_MODELS';
import NavigationService from 'src/services/NavigationService/NavigationService';
import {isObjectEmpty} from 'src/utils/Helpers/array';

const deviceNotConnectedErrorText = 'Device is not connected';

class BLEServiceInstance {
  manager: BleManager;

  device: Device | null;

  batteryLevel: number;

  totalWaterUsase: number;

  connectedDeviceStaticData: any;

  characteristicMonitor: Subscription | null;

  isCharacteristicMonitorDisconnectExpected = false;

  constructor() {
    this.device = null;
    this.batteryLevel = 0;
    this.totalWaterUsase = 0;
    this.connectedDeviceStaticData = null;
    this.characteristicMonitor = null;
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
            this.showErrorToast('');
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            this.manager.enable().catch((error: BleError) => {
              if (error?.errorCode === BleErrorCode?.BluetoothUnauthorized) {
                this.requestBluetoothPermission();
              }
            });
            break;
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            // this.onBluetoothPowerOn();
            resolve();
            subscription.remove();
            break;
          default:
            console.error('Unsupported state: ', state);
        }
      }, true);
    });

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  disconnectDevice = (showToast: boolean = true) => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .cancelDeviceConnection(this.device.id)
      .then(() => {
        this.device = null;
        showToast && this.showSuccessToast('Device disconnected');
        // NavigationService.resetAllAction('DeviceSearching');
      })
      .catch(error => {
        if (error?.code !== BleErrorCode.DeviceDisconnected) {
          this.onError(error);
        }
      });
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  disconnectDeviceById = (id: DeviceId) =>
    this.manager
      .cancelDeviceConnection(id)
      .then(() => this.showSuccessToast('Device disconnected'))
      .catch(error => {
        if (error?.code !== BleErrorCode.DeviceDisconnected) {
          this.onError(error);
        }
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
    onDeviceFound: (device: Device & {modelStaticData: any}) => void,
    UUIDs: UUID[] | null = null,
    legacyScan?: boolean,
  ) => {
    this.manager.startDeviceScan(UUIDs, {legacyScan}, (error, device) => {
      if (error) {
        this.onError(error);
        this.manager.stopDeviceScan();
        return;
      }
      const deviceName = device?.localName ?? device?.name;
      if (!isObjectEmpty(device) && deviceName) {
        if (
          deviceName?.toUpperCase()?.includes('FAUCET') ||
          deviceName?.toUpperCase()?.includes('SL')
        ) {
          const deviceStaticData = getDeviceModelData(
            device,
            BLE_DEVICE_MODELS,
          );
          const __extendedDevice = {
            ...device,
            modelStaticData: deviceStaticData,
          };
          // consoleLog('__extendedDevice', JSON.stringify(__extendedDevice));
          onDeviceFound(__extendedDevice);
        }
      }
    });
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
          var __deviceLocalName = __device?.localName ?? __device?.name;
          device.localName = __deviceLocalName;
          this.device = device;
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
        this.showErrorToast(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
      }
      this.manager
        .discoverAllServicesAndCharacteristicsForDevice(this.device.id)
        .then(device => {
          resolve(device);
          consoleLog(
            'discoverAllServicesAndCharacteristicsForDevice device==>',
            JSON.stringify(device),
          );
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
        this.showErrorToast(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
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
          // this.onError(error);
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
    time: Base64 | string,
  ) => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        base64EncodeDecode(time),
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
    time: Base64 | string,
  ) => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithoutResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        base64EncodeDecode(time),
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
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
      this.device?.id,
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
  isDeviceConnected = () => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.isDeviceConnected(this.device.id);
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  isDeviceWithIdConnected = (id: DeviceId) =>
    this.manager.isDeviceConnected(id).catch(console.error);

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  getConnectedDevices = (expectedServices: UUID[]) => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
      // throw new Error(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
        this.showErrorToast('Device already disconnected');
        this.device = null;
        break;
      default:
        this.showErrorToast(JSON.stringify(error, null, 4));
    }
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  requestConnectionPriorityForDevice = (priority: 0 | 1 | 2) => {
    if (!this.device) {
      return this.showErrorToast(deviceNotConnectedErrorText);
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
      return this.showErrorToast(deviceNotConnectedErrorText);
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
    console.error(error);
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
  dispenseWater = async (serviceUUID: string, characteristicUUID: string) => {
    const writeCharacteristicWithResponseForDevice =
      await BLEService.writeCharacteristicWithResponseForDevice(
        serviceUUID,
        characteristicUUID,
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

  initProjectLevelFunctions = async () => {};
  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setBatteryLevel = async () => {
    const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a19-0000-1000-8000-00805f9b34fb';
    this.batteryLevel = await getBatteryLevel(serviceUUID, characteristicUUID);
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setTotalWaterUsase = async () => {
    const serviceUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c940';
    const characteristicUUID = 'd0aba888-fb10-4dc9-9b17-bdd8f490c949';

    this.totalWaterUsase = await getTotalWaterUsase(
      serviceUUID,
      characteristicUUID,
    );
  };

  /**
   * project level function for BLE devices
   * @param serviceUUID
   * @param characteristicUUID
   */
  setDeviceModelData(connectedDevice: any, BLE_DEVICE_MODELS: any) {
    var deviceStaticData = null;

    // localName have more relevant name indentification
    var __deviceName = connectedDevice?.localName ?? connectedDevice?.name;
    if (__deviceName) {
      const deviceGen = getBleDeviceGeneration(__deviceName);
      // consoleLog('deviceGen', deviceGen);

      if (deviceGen && typeof BLE_DEVICE_MODELS[deviceGen] != 'undefined') {
        const deviceVersion = getBleDeviceVersion(__deviceName, deviceGen);
        // consoleLog('deviceVersion', deviceVersion);

        const deviceModel = BLE_DEVICE_MODELS[deviceGen];
        // consoleLog('deviceModel', deviceModel);

        if (deviceModel && typeof deviceModel[deviceVersion] != 'undefined') {
          deviceStaticData = deviceModel[deviceVersion];
        }
      }
    }

    this.connectedDeviceStaticData = deviceStaticData;
  }
}

export const BLEService = new BLEServiceInstance();
