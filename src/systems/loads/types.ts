import { BaseSystemType } from '../base/types';

export type Load = BaseSystemType & {
  /** The current state */
  currentState: LoadState | null;
};

/** The load states */
export enum LoadState {
  'off' = 0,
  'onImpulse' = 1,
  'onPermanent' = 2,
}
