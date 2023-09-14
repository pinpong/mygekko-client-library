import { BaseSystemType } from '../base/types';

export type EnergyManager = BaseSystemType & {
  netMeterState: NetState | null;
  solarPanelState: SolarState | null;
  batteryState: BatteryState | null;
  netMeterCurrentPower: number | null;
  currentPowerExportedToNet: number | null;
  currentPowerFromSolarPanels: number | null;
  currentPowerFromBattery: number | null;
  currentPowerChargingBattery: number | null;
  currentHomePowerConsumption: number | null;
  currentAlternativePowerConsumption: number | null;
  totalDailyImportedEnergyFromNet: number | null;
  totalDailyExportedEnergyToNet: number | null;
  totalDailyEnergyFromSolarPanels: number | null;
  totalDailyEnergyFromBattery: number | null;
  totalDailyEnergyChargingBattery: number | null;
  totalDailyHomeEnergyConsumption: number | null;
  loadSheddingState: LoadSheddingState | null;
  emsState: EMSState | null;
  batteryModel: BatteryType | null;
  batterySoCLevel: number | null;
  emsEnabledState: EMSEnabledState | null;
  maximumPowerConsumptionFromNet: number | null;
  maximumPowerExportToNet: number | null;
  maximumPowerSolarPanels: number | null;
  maximumPowerBattery: number | null;
};

export enum NetState {
  'notOk' = 0,
  'ok' = 1,
}

export enum SolarState {
  'notActive' = 0,
  'active' = 1,
}

export enum BatteryState {
  'notActive' = 0,
  'active' = 1,
}

export enum EMSState {
  'disabled' = 0,
  'enabled' = 1,
}

export enum EMSEnabledState {
  'disabled' = 0,
  'enabled' = 1,
}

export enum LoadSheddingState {
  'off' = 0,
  'on' = 1,
}

export enum BatteryType {
  'unavailable' = 0,
  'e3dc-s10' = 1,
  'byd' = 2,
  'vartastorage' = 3,
  'individual' = 4,
  'bySunSpecInverters' = 5,
}
