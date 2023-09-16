import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Light = BaseSystemType & {
  /** The current state */
  currentState: LightState | null;
  /** The current dim level as 0-100 % */
  dimLevel: number | null;
  /** The current rgb color as decimal as 24 bit rgb */
  rgbColor: number | null;
  /** The current tunable white level as 0-100 % */
  tunableWhiteLevel: number | null;
};

/**
 * The light states.
 * @group Systems
 */
export enum LightState {
  'off' = 0,
  'on' = 1,
}
