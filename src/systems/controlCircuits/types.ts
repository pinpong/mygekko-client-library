import { BaseSystemType } from '../base/types';

export type ControlCircuit = BaseSystemType & {
  sensorValue: number | null;
  sensorType: ControlCircuitSensorType | null;
  pump1WorkingPowerLevel: number | null;
  pump2WorkingPowerLevel: number | null;
  pump3WorkingPowerLevel: number | null;
};

export enum ControlCircuitSensorType {
  'temperaturePT' = 0,
  'temperatureAnalog' = 1,
  'pressure' = 2,
  'humidity' = 3,
  'individual' = 4,
}
