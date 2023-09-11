import { BaseSystemType } from '../base/types';

export type Vent = BaseSystemType & {
  ventLevel: VentLevel | null;
  deviceModel: VentDeviceModel | null;
  workingMode:
    | VentWorkingModeProxxonV1
    | VentWorkingModeProxxonV2
    | VentWorkingModeWestaflex
    | VentWorkingModeStiebelTecalor
    | VentWorkingModeIndividual
    | VentWorkingModePluggit
    | null;
  bypassState: VentBypassState | null;
  maximumWorkingLevel: VentLevel | null;
  relativeHumidity: number | null;
  airQuality: number | null;
  co2: number | null;
  supplyAirTemperature: number | null;
  exhaustAirTemperature: number | null;
  outsideAirTemperature: number | null;
  outgoingAirTemperature: number | null;
  supplyAirWorkingLevel: number | null;
  exhaustAirWorkingLevel: number | null;
  subWorkingMode: SubWorkingModeProxxon | SubWorkingMode | null;
  coolingModeState: CoolingModeState | null;
  dehumidificationState: DehumidificationState | null;
  bypassMode: VentBypassState | null;
};

export enum VentLevel {
  'off' = 0,
  'level1' = 1,
  'level2' = 2,
  'level3' = 3,
  'level4' = 4,
}

export enum VentDeviceModel {
  'standard' = 0,
  'pluggit' = 1,
  'zimmermannV1' = 2,
  'westaflex' = 3,
  'stiebelLWZ' = 4,
  'zimmermannV2' = 5,
}

export enum VentWorkingModeProxxonV1 {
  'off' = 0,
  'on' = 1,
}

export enum VentWorkingModeProxxonV2 {
  'off' = 0,
  'ecoSummer' = 1,
  'ecoWinter' = 2,
  'comfort' = 3,
  'ovenOperation' = 4,
}

export enum VentWorkingModeWestaflex {
  'off' = 0,
  'on' = 1,
}

export enum VentWorkingModeStiebelTecalor {
  'off' = 0,
  'on' = 1,
}

export enum VentWorkingModeIndividual {
  'off' = 0,
  'on' = 1,
}

export enum VentWorkingModePluggit {
  'auto' = 0,
  'manual' = 1,
  'pluggitAuto' = 2,
  'pluggitWeek' = 3,
}

export enum VentBypassState {
  'auto' = 0,
  'manual' = 1,
  'summer' = 2,
}

export enum CoolingModeState {
  'off' = 0,
  'on' = 1,
}

export enum SubWorkingModeProxxon {
  'middleTemp+offset' = 0,
  'onlyOffset' = 1,
}

export enum SubWorkingMode {
  'exhaust' = 0,
  'exhaustAndSupply' = 1,
  'exhaustAndSupplyAndHeatRecovery' = 2,
}

export enum DehumidificationState {
  'off' = 0,
  'on' = 1,
}
