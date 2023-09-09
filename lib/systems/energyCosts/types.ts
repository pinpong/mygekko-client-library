import { BaseSystem } from "../base/types";

export type EnergyCost = BaseSystem & {
  currentPower?: number;
  totalEnergyToday?: number;
  totalEnergyMonth?: number;
  totalEnergy?: number;
  nominalPower?: number;
  energyUnit?: string;
  powerUnit?: string;
  totalEnergyToday0h6h?: number;
  totalEnergyToday6h12h?: number;
  totalEnergyToday12h18h?: number;
  totalEnergyToday18h24h?: number;
  totalEnergyYesterday0h6h?: number;
  totalEnergyYesterday6h12h?: number;
  totalEnergyYesterday12h18h?: number;
  totalEnergyYesterday18h24h?: number;
  totalEnergyThisYear?: number;
  totalEnergyInPeriod?: number;
  startDateTotalEnergyInPeriod?: string;
  counterDirection?: CounterDirection;
};

export enum CounterDirection {
  "consumption" = 0,
  "production" = 1,
}
