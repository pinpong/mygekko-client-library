import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Vent = BaseSystemType & {
  /** The current vent level */
  ventLevel: VentLevel | null;
  /** The device model */
  deviceModel: VentDeviceModel | null;
  /** The current working mode */
  workingMode:
    | VentWorkingModeProxxonV1
    | VentWorkingModeProxxonV2
    | VentWorkingModeWestaflex
    | VentWorkingModeStiebelTecalor
    | VentWorkingModeIndividual
    | VentWorkingModePluggit
    | null;
  /** The current bypass state */
  bypassState: VentBypassState | null;
  /** The max vent level */
  maximumWorkingLevel: VentLevel | null;
  /** The current relative humidity level as 0-100 % */
  relativeHumidity: number | null;
  /** The current air quality level as 0-100 % */
  airQuality: number | null;
  /** The co2 as0-100000 ppm */
  co2: number | null;
  /** The current supply air temperature as -100-100 C° */
  supplyAirTemperature: number | null;
  /** The current exhaust air temperature as -100-100 C° */
  exhaustAirTemperature: number | null;
  /** The current outside air temperature as -100-100 C° */
  outsideAirTemperature: number | null;
  /** The current outgoing air temperature as -100-100 C° */
  outgoingAirTemperature: number | null;
  /** The current supply air working level as 0-100 % */
  supplyAirWorkingLevel: number | null;
  /** The current exhaust air working level as 0-100 % */
  exhaustAirWorkingLevel: number | null;
  /** The current sub working mode */
  subWorkingMode: VentSubWorkingModeProxxon | VentSubWorkingMode | null;
  /** The current cooling working mode state */
  coolingModeState: VentCoolingModeState | null;
  /** The current dehumidification state */
  dehumidificationState: VentDehumidificationState | null;
  /** The current bypass state */
  bypassMode: VentBypassState | null;
};

/**
 * The vent levels.
 * @group Systems
 */
export enum VentLevel {
  'off' = 0,
  'level1' = 1,
  'level2' = 2,
  'level3' = 3,
  'level4' = 4,
}

/**
 * The vent device models.
 * @group Systems
 */
export enum VentDeviceModel {
  'standard' = 0,
  'pluggit' = 1,
  'zimmermannV1' = 2,
  'westaflex' = 3,
  'stiebelLWZ' = 4,
  'zimmermannV2' = 5,
}

/**
 * The proxxon v1 device working modes.
 * @group Systems
 */
export enum VentWorkingModeProxxonV1 {
  'off' = 0,
  'on' = 1,
}

/**
 * The proxxon v2 device working modes.
 * @group Systems
 */
export enum VentWorkingModeProxxonV2 {
  'off' = 0,
  'ecoSummer' = 1,
  'ecoWinter' = 2,
  'comfort' = 3,
  'ovenOperation' = 4,
}

/**
 * The westaflex device working modes.
 * @group Systems
 */
export enum VentWorkingModeWestaflex {
  'off' = 0,
  'on' = 1,
}

/**
 * The stiebel tecalor device working modes.
 * @group Systems
 */
export enum VentWorkingModeStiebelTecalor {
  'off' = 0,
  'on' = 1,
}

/**
 * The individual device working modes.
 * @group Systems
 */
export enum VentWorkingModeIndividual {
  'off' = 0,
  'on' = 1,
}

/**
 * The pluggit device working modes.
 * @group Systems
 */
export enum VentWorkingModePluggit {
  'auto' = 0,
  'manual' = 1,
  'pluggitAuto' = 2,
  'pluggitWeek' = 3,
}

/**
 * The vent bypass states.
 * @group Systems
 */
export enum VentBypassState {
  'auto' = 0,
  'manual' = 1,
  'summer' = 2,
}

/**
 * The vent cooling mode states.
 * @group Systems
 */
export enum VentCoolingModeState {
  'off' = 0,
  'on' = 1,
}

/**
 * The proxxon v1 device sub working modes.
 * @group Systems
 */
export enum VentSubWorkingModeProxxon {
  'middleTemp+offset' = 0,
  'onlyOffset' = 1,
}

/**
 * The sub working modes.
 * @group Systems
 */
export enum VentSubWorkingMode {
  'exhaust' = 0,
  'exhaustAndSupply' = 1,
  'exhaustAndSupplyAndHeatRecovery' = 2,
}

/**
 * The dehumidification states.
 * @group Systems
 */
export enum VentDehumidificationState {
  'off' = 0,
  'on' = 1,
}
