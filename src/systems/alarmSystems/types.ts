import { BaseSystemType } from '../base/types';

/** @group Systems */
export type AlarmSystem = BaseSystemType & {
  /** The alarm state */
  alarmSystemState: AlarmSystemState | null;
  /** The alarm devices */
  alarmDevices: AlarmDevice[] | null;
  /** The alarm device model */
  deviceModel: AlarmSystemDeviceModel | null;
};

/** The alarm device */
/** @group Systems */
export type AlarmDevice = {
  /** The alarm zone */
  zone: string | null;
  /** The alarm type */
  type: string | null;
  /** The alarm device system state */
  systemState: AlarmSystemDeviceState | null;
  /** The alarm device system sharp state */
  sharpState: AlarmSystemDeviceSharpState | null;
};

/**
 * The alarm system state.
 * @group Systems
 */
export enum AlarmSystemState {
  'ok' = 0,
  'alarm' = 1,
  'keepOpen' = 2,
}

/**
 * The alarm system device type state.
 * @group Systems
 */
export enum AlarmSystemDeviceState {
  'ok' = 0,
  'alarmButtonUnSharp' = 2,
  'alarm' = 3,
}

/**
 * The alarm system device sharp state.
 * @group Systems
 */
export enum AlarmSystemDeviceSharpState {
  'unSharp' = 0,
  'sharp' = 1,
}

/**
 * The alarm system device model.
 * @group Systems
 */
export enum AlarmSystemDeviceModel {
  'standard' = 1,
  'complex400_V1' = 2,
}
