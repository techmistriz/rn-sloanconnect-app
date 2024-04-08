import {ReactFragment} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Device, Characteristic, Service} from 'react-native-ble-plx';

export type BLEDevice = Device;
export type BLEService = Service;
export type BLECharacteristic = Characteristic;

export type valueMapped = {
  [name: string]: string;
};
export type UUIDMappedProps = {
  [name: string]: string;
};
export type DeviceStaticData = {
  uuid: string;
  name: string;
  size: string;
  type: string;
  range: string;
  initialValue: string;
  properties: string[];
  sloanApp: string;
  remarks: string;
  prefix: string | null;
  postfix: string | null;
  valueMapped?: valueMapped;
  UUIDMapped?: UUIDMappedProps;
};
