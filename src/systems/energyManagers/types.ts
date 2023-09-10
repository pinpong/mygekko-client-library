import { BaseSystem } from "../base/types";

export type EnergyManager = BaseSystem & {
  netMeterState?: NetState;
  solarPanelState?: SolarState;
  batteryState?: BatteryState;
  netMeterCurrentPower?: number;
  currentPowerExportedToNet?: number;
  currentPowerFromSolarPanels?: number;
  currentPowerFromBattery?: number;
  currentPowerChargingBattery?: number;
  currentHomePowerConsumption?: number;
  currentAlternativePowerConsumption?: number;
  totalDailyImportedEnergyFromNet?: number;
  totalDailyExportedEnergyToNet?: number;
  totalDailyEnergyFromSolarPanels?: number;
  totalDailyEnergyFromBattery?: number;
  totalDailyEnergyChargingBattery?: number;
  totalDailyHomeEnergyConsumption?: number;
  loadSheddingState?: LoadSheddingState;
  emsState?: EMSState;
  batteryModel?: BatteryType;
  batterySoCLevel?: number;
  emsEnabledState?: EMSEnabledState;
  maximumPowerConsumptionFromNet?: number;
  maximumPowerExportToNet?: number;
  maximumPowerSolarPanels?: number;
  maximumPowerBattery?: number;
};

export enum NetState {
  "notOk" = 0,
  "ok" = 1,
}

export enum SolarState {
  "notActive" = 0,
  "active" = 1,
}

export enum BatteryState {
  "notActive" = 0,
  "active" = 1,
}

export enum EMSState {
  "disabled" = 0,
  "enabled" = 1,
}

export enum EMSEnabledState {
  "disabled" = 0,
  "enabled" = 1,
}

export enum LoadSheddingState {
  "off" = 0,
  "on" = 1,
}

export enum BatteryType {
  "unavailable" = 0,
  "e3dc-s10" = 1,
  "byd" = 2,
  "vartastorage" = 3,
  "individual" = 4,
  "bySunSpecInverters" = 5,
}
