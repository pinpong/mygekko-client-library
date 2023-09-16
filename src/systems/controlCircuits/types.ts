import { BaseSystemType } from '../base/types';

/** @group Systems */
export type ControlCircuit = BaseSystemType & {
  /** The current sensor value -10000,10000 */
  sensor: number | null;
  /** The sensor type */
  sensorType: ControlCircuitSensorType | null;
  /** The pump 1 working power level 0-100 as % */
  pump1WorkingPowerLevel: number | null;
  /** The pump 2 working power level 0-100 as % */
  pump2WorkingPowerLevel: number | null;
  /** The pump 3 working power level 0-100 as % */
  pump3WorkingPowerLevel: number | null;
};

/**
 * The control circuits sensor types.
 * @group Systems
 */
export enum ControlCircuitSensorType {
  'temperaturePT' = 0,
  'temperatureAnalog' = 1,
  'pressure' = 2,
  'humidity' = 3,
  'individual' = 4,
}
