import { BaseSystemType } from '../base/types';

export type Load = BaseSystemType & {
  currentState: LoadState | null;
};

export enum LoadState {
  'off' = 0,
  'onImpulse' = 1,
  'onPermanent' = 2,
}
