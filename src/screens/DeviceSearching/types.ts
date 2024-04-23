import {Device} from 'react-native-ble-plx';

export enum ScanningProps {
  Pending = 0,
  Scanning = 1,
  Stopped = 2,
  DeviceFound = 3,
  NoDevice = 4,
  Connecting = 5,
  ConnectingSucceded = 6,
  ConnectingFailed = 7,
}

export type DeviceExtendedProps = Device & {
  updateTimestamp?: number;
  modelStaticData?: any;
};
