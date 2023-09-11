import { BaseSystem } from '../base/types';

export type Load = BaseSystem & {
  currentState?: LoadState;
};

export enum LoadState {
  'off' = 0,
  'onImpulse' = 1,
  'onPermanent' = 2,
}
