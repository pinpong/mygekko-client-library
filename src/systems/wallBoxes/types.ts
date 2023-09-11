import { BaseSystemType } from '../base/types';

export type WallBox = BaseSystemType & {
  pluggedState: WallBoxPluggedState | null;
  chargeState: WallBoxChargeState | null;
  chargeRequestState: WallBoxChargeRequestState | null;
  currentChargingPower: number | null;
  maximumChargingPower: number | null;
  chargingPowerSetPoint: number | null;
  electricCurrentSetPoint: number | null;
  chargeUserName: string | null;
  chargeDurationTime: number | null;
  currentChargingEnergy: number | null;
  chargeStartTime: string | null;
  chargeUserIndex: number | null;
  wallBoxUser: WallBoxUser[] | null;
};

export enum WallBoxPluggedState {
  'notPlugged' = 0,
  'plugged' = 1,
}

export enum WallBoxChargeState {
  'off' = 0,
  'on' = 1,
  'paused' = 2,
}

export enum WallBoxChargeRequestState {
  'off' = 0,
  'on' = 1,
}

export type WallBoxUser = {
  id: number | null;
  totalEnergy: number | null;
};
