import { BaseSystem } from "../base/types";

export type WallBox = BaseSystem & {
  pluggedState?: WallBoxPluggedState;
  chargeState?: WallBoxChargeState;
  chargeRequestState?: WallBoxChargeRequestState;
  currentChargingPower?: number;
  maximumChargingPower?: number;
  chargingPowerSetPoint?: number;
  electricCurrentSetPoint?: number;
  chargeUserName?: string;
  chargeDurationTime?: number;
  currentChargingEnergy?: number;
  chargeStartTime?: string;
  chargeUserIndex?: number;
  wallBoxUser?: WallBoxUser[];
};

export enum WallBoxPluggedState {
  "notPlugged" = 0,
  "plugged" = 1,
}

export enum WallBoxChargeState {
  "off" = 0,
  "on" = 1,
  "paused" = 2,
}

export enum WallBoxChargeRequestState {
  "off" = 0,
  "on" = 1,
}

export type WallBoxUser = {
  id?: number;
  totalEnergy?: number;
};
