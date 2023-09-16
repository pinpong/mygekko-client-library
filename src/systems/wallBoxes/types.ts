import { BaseSystemType } from '../base/types';

/** @group Systems */
export type WallBox = BaseSystemType & {
  /** The current plugged state */
  pluggedState: WallBoxPluggedState | null;
  /** The current charge state */
  chargeState: WallBoxChargeState | null;
  /** The current charge request state */
  chargeRequestState: WallBoxChargeRequestState | null;
  /** The current charging power as 1-100 kilowatt */
  currentChargingPower: number | null;
  /** The maximum charging power as 1-100 kilowatt */
  maximumChargingPower: number | null;
  /** The current charging set point power as 1-100 kilowatt */
  chargingPowerSetPoint: number | null;
  /** The current electric set point as 1-... Ampere */
  electricCurrentSetPoint: number | null;
  /** The current charging username */
  chargeUserName: string | null;
  /** The charging duration time as hh:mm:ss */
  chargeDurationTime: number | null;
  /** The current charging energy as 0-... Kilowatt hour */
  currentChargingEnergy: number | null;
  /** The charging start time as hh:mm:ss */
  chargeStartTime: string | null;
  /** The current charging user index */
  chargeUserIndex: number | null;
  /** The registered users */
  wallBoxUser: WallBoxUser[] | null;
};

/**
 * The wall box plugged states.
 * @group Systems
 */
export enum WallBoxPluggedState {
  'notPlugged' = 0,
  'plugged' = 1,
}

/**
 * The wall box charge states.
 * @group Systems
 */
export enum WallBoxChargeState {
  'off' = 0,
  'on' = 1,
  'paused' = 2,
}

/**
 * The wall box charge request states.
 * @group Systems
 */
export enum WallBoxChargeRequestState {
  'off' = 0,
  'on' = 1,
}

/** The wall box user */
/** @group Systems */
export type WallBoxUser = {
  /** The wall box user id */
  id: number | null;
  /** The wall box user total energy consumption */
  totalEnergy: number | null;
};
