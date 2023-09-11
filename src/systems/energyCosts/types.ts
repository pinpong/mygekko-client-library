import { BaseSystemType } from '../base/types';

export type EnergyCost = BaseSystemType & {
  currentPower: number | null;
  totalEnergyToday: number | null;
  totalEnergyMonth: number | null;
  totalEnergy: number | null;
  nominalPower: number | null;
  energyUnit: string | null;
  powerUnit: string | null;
  totalEnergyToday0h6h: number | null;
  totalEnergyToday6h12h: number | null;
  totalEnergyToday12h18h: number | null;
  totalEnergyToday18h24h: number | null;
  totalEnergyYesterday0h6h: number | null;
  totalEnergyYesterday6h12h: number | null;
  totalEnergyYesterday12h18h: number | null;
  totalEnergyYesterday18h24h: number | null;
  totalEnergyThisYear: number | null;
  totalEnergyInPeriod: number | null;
  startDateTotalEnergyInPeriod: string | null;
  counterDirection: CounterDirection | null;
};

export enum CounterDirection {
  'consumption' = 0,
  'production' = 1,
}
