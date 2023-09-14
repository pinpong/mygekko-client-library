import { BaseSystemType } from '../base/types';

export type AlarmSystem = BaseSystemType & {
  alarmSystemState: AlarmSystemState | null;
  alarmDevices: AlarmDevice[] | null;
  deviceModel: AlarmSystemDeviceModel | null;
};

export type AlarmDevice = {
  zone: string | null;
  type: string | null;
  systemState: AlarmSystemTypeState | null;
  sharpState: AlarmSystemSharpState | null;
};

export enum AlarmSystemState {
  'ok' = 0,
  'alarm' = 1,
  'keepOpen' = 2,
}

export enum AlarmSystemTypeState {
  'ok' = 0,
  'alarmButtonUnSharp' = 2,
  'alarm' = 3,
}

export enum AlarmSystemSharpState {
  'unSharp' = 0,
  'sharp' = 1,
}

export enum AlarmSystemDeviceModel {
  'standard' = 1,
  'complex400_V1' = 2,
}
