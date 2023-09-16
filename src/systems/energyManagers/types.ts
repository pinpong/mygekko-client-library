import { BaseSystemType } from '../base/types';

/** @group Systems */
export type EnergyManager = BaseSystemType & {
  /** The current net meter state */
  netMeterState: NetState | null;
  /** The current solar panel state */
  solarPanelState: SolarState | null;
  /** The current battery state */
  batteryState: BatteryState | null;
  /** The current net power as Watt */
  netMeterCurrentPower: number | null;
  /** The current power exported to net as Watt */
  currentPowerExportedToNet: number | null;
  /** The current power from solar panels as Watt */
  currentPowerFromSolarPanels: number | null;
  /** The current power from battery as Watt */
  currentPowerFromBattery: number | null;
  /** The current battery charging power as Watt */
  currentPowerChargingBattery: number | null;
  /** The current power consumption as Watt */
  currentHomePowerConsumption: number | null;
  /** The current alternative power from solar panels as Watt */
  currentAlternativePowerConsumption: number | null;
  /** The total daily imported energy from net as Watt hours */
  totalDailyImportedEnergyFromNet: number | null;
  /** The total daily exported energy to net as Watt hours */
  totalDailyExportedEnergyToNet: number | null;
  /** The total daily produced energy from solar panels as Watt hours */
  totalDailyEnergyFromSolarPanels: number | null;
  /** The total daily exported energy from battery as Watt hours */
  totalDailyEnergyFromBattery: number | null;
  /** The total daily battery charged energy as Watt hours */
  totalDailyEnergyChargingBattery: number | null;
  /** The total daily energy consumption as Watt hours */
  totalDailyHomeEnergyConsumption: number | null;
  /** The current load shedding state */
  loadSheddingState: LoadSheddingState | null;
  /** The current ems state */
  emsState: EMSState | null;
  /** The battery model */
  batteryModel: BatteryType | null;
  /** The current battery soc as 0-100 % */
  batterySoCLevel: number | null;
  /** The ems enabled state */
  emsEnabledState: EMSEnabledState | null;
  /** The maximum power consumption from net as kilowatt */
  maximumPowerConsumptionFromNet: number | null;
  /** The maximum power exported to net as kilowatt */
  maximumPowerExportToNet: number | null;
  /** The maximum solar panels power as kilowatt */
  maximumPowerSolarPanels: number | null;
  /** The maximum battery power as kilowatt */
  maximumPowerBattery: number | null;
};

/**
 * The net states.
 * @group Systems
 */
export enum NetState {
  'notOk' = 0,
  'ok' = 1,
}

/**
 * The solar panels states.
 * @group Systems
 */
export enum SolarState {
  'notActive' = 0,
  'active' = 1,
}

/**
 * The battery states.
 * @group Systems
 */
export enum BatteryState {
  'notActive' = 0,
  'active' = 1,
}

/**
 * The ems states.
 * @group Systems
 */
export enum EMSState {
  'disabled' = 0,
  'enabled' = 1,
}

/**
 * The ems enabled states.
 * @group Systems
 */
export enum EMSEnabledState {
  'disabled' = 0,
  'enabled' = 1,
}

/**
 * The load shedding states.
 * @group Systems
 */
export enum LoadSheddingState {
  'off' = 0,
  'on' = 1,
}

/**
 * The battery types.
 * @group Systems
 */
export enum BatteryType {
  'unavailable' = 0,
  'e3dc-s10' = 1,
  'byd' = 2,
  'vartastorage' = 3,
  'individual' = 4,
  'bySunSpecInverters' = 5,
}
