import { BaseSystem } from "../base/types";

export type AlarmSystem = BaseSystem & {
  alarmSystemState?: AlarmSystemState;
  alarmDevices?: AlarmDevice[];
  deviceModel?: AlarmSystemDeviceModel;
};

export type AlarmDevice = {
  zone?: string;
  type?: string;
  systemState?: AlarmSystemTypeState;
  sharpState?: AlarmSystemSharpState;
};

export enum AlarmSystemState {
  "ok" = 0,
  "alarm" = 1,
  "keepOpen" = 2,
}

export enum AlarmSystemTypeState {
  "ok" = 0,
  "alarmButtonUnSharp" = 2,
  "alarm" = 3,
}

export enum AlarmSystemSharpState {
  "unSharp" = 0,
  "sharp" = 1,
}

export enum AlarmSystemDeviceModel {
  "standard" = 1,
  "complex400_V1" = 2,
}
