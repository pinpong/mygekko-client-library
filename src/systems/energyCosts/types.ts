import { BaseSystemType } from '../base/types';

/** @group Systems */
export type EnergyCost = BaseSystemType & {
  /** The current power 0-... As powerUnit */
  currentPower: number | null;
  /** The total energy today 0-... As energyUnit */
  totalEnergyToday: number | null;
  /** The total energy this month 0-... As energyUnit */
  totalEnergyMonth: number | null;
  /** The total energy 0-... As energyUnit */
  totalEnergy: number | null;
  /** The nominal power 0-... As powerUnit */
  nominalPower: number | null;
  /** The energy unit */
  energyUnit: string | null;
  /** The power unit */
  powerUnit: string | null;
  /** The total energy today from 00:00-06:00 0-... As energyUnit */
  totalEnergyToday0h6h: number | null;
  /** The total energy today from 06:00-12:00 0-... As energyUnit */
  totalEnergyToday6h12h: number | null;
  /** The total energy today from 12:00-18:00 0-... As energyUnit */
  totalEnergyToday12h18h: number | null;
  /** The total energy today from 18:00-24:00 0-... As energyUnit */
  totalEnergyToday18h24h: number | null;
  /** The total energy yesterday from 00:00-06:00 0-... As energyUnit */
  totalEnergyYesterday0h6h: number | null;
  /** The total energy yesterday from 06:00-12:00 0-... As energyUnit */
  totalEnergyYesterday6h12h: number | null;
  /** The total energy yesterday from 12:00-18:00 0-... As energyUnit */
  totalEnergyYesterday12h18h: number | null;
  /** The total energy yesterday from 18:00-24:00 0-... As energyUnit */
  totalEnergyYesterday18h24h: number | null;
  /** The total energy this year 0-... As energyUnit */
  totalEnergyThisYear: number | null;
  /** The total energy in period year 0-... As energyUnit */
  totalEnergyInPeriod: number | null;
  /** The start date for this period as dd.mm.yyyy hh:mm:ss */
  startDateTotalEnergyInPeriod: string | null;
  /** The counter direction */
  counterDirection: EnergyCostsCounterDirection | null;
};

/**
 * The energy costs counter direction.
 * @group Systems
 */
export enum EnergyCostsCounterDirection {
  'consumption' = 0,
  'production' = 1,
}
