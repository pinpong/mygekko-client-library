import { BaseSystemType } from '../base/types';

export type Light = BaseSystemType & {
  currentState: LightState | null;
  dimLevel: number | null;
  rgbColor: number | null;
  tunableWhiteLevel: number | null;
};

export enum LightState {
  'off' = 0,
  'on' = 1,
}
