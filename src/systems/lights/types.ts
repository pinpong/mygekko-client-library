import { BaseSystem } from "../base/types";

export type Light = BaseSystem & {
  currentState?: LightState;
  dimLevel?: number;
  rgbColor?: number;
  tunableWhiteLevel?: number;
};

export enum LightState {
  "off" = 0,
  "on" = 1,
}
