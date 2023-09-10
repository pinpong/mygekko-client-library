import { BaseSystem } from "../base/types";

export type ControlCircuit = BaseSystem & {
  sensorValue?: number;
  sensorType?: ControlCircuitSensorType;
  pump1WorkingPowerLevel?: number;
  pump2WorkingPowerLevel?: number;
  pump3WorkingPowerLevel?: number;
};

export enum ControlCircuitSensorType {
  "temperaturePT" = 0,
  "temperatureAnalog" = 1,
  "pressure" = 2,
  "humidity" = 3,
  "individual" = 4,
}
