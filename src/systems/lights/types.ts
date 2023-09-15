import { BaseSystemType } from '../base/types';

export type Light = BaseSystemType & {
  /** The current state */
  currentState: LightState | null;
  /** The current dim level as 0-100 % */
  dimLevel: number | null;
  /** The current rgb color as decimal as [24bit->R:23-16|G:15-8|B:7-0] */
  rgbColor: number | null;
  /** The current tunable white level as 0-100 % */
  tunableWhiteLevel: number | null;
};

/** The light states */
export enum LightState {
  'off' = 0,
  'on' = 1,
}
