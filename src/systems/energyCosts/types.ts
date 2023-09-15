import { BaseSystemType } from '../base/types';

export type EnergyCost = BaseSystemType & {
  /** The current power 0-... as powerUnit */
  currentPower: number | null;
  /** The total energy today 0-... as energyUnit */
  totalEnergyToday: number | null;
  /** The total energy this month 0-... as energyUnit */
  totalEnergyMonth: number | null;
  /** The total energy 0-... as energyUnit */
  totalEnergy: number | null;
  /** The nominal power 0-... as powerUnit */
  nominalPower: number | null;
  /** The energy unit */
  energyUnit: string | null;
  /** The power unit */
  powerUnit: string | null;
  /** The total energy today from 00:00-06:00 0-... as energyUnit */
  totalEnergyToday0h6h: number | null;
  /** The total energy today from 06:00-12:00 0-... as energyUnit */
  totalEnergyToday6h12h: number | null;
  /** The total energy today from 12:00-18:00 0-... as energyUnit */
  totalEnergyToday12h18h: number | null;
  /** The total energy today from 18:00-24:00 0-... as energyUnit */
  totalEnergyToday18h24h: number | null;
  /** The total energy yesterday from 00:00-06:00 0-... as energyUnit */
  totalEnergyYesterday0h6h: number | null;
  /** The total energy yesterday from 06:00-12:00 0-... as energyUnit */
  totalEnergyYesterday6h12h: number | null;
  /** The total energy yesterday from 12:00-18:00 0-... as energyUnit */
  totalEnergyYesterday12h18h: number | null;
  /** The total energy yesterday from 18:00-24:00 0-... as energyUnit */
  totalEnergyYesterday18h24h: number | null;
  /** The total energy this year 0-... as energyUnit */
  totalEnergyThisYear: number | null;
  /** The total energy in period year 0-... as energyUnit */
  totalEnergyInPeriod: number | null;
  /** The start date for this period as dd.mm.yyyy hh:mm:ss */
  startDateTotalEnergyInPeriod: string | null;
  /** The counter direction */
  counterDirection: CounterDirection | null;
};

/** The energy costs counter direction */
export enum CounterDirection {
  'consumption' = 0,
  'production' = 1,
}
