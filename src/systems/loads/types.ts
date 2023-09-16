import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Load = BaseSystemType & {
  /** The current state */
  currentState: LoadState | null;
};

/**
 * The load states.
 * @group Systems
 */
export enum LoadState {
  'off' = 0,
  'onImpulse' = 1,
  'onPermanent' = 2,
}
