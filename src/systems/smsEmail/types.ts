import { BaseSystemType } from '../base/types';

export type SmsEmail = BaseSystemType & {
  currentState: SmsEmailState | null;
};

export enum SmsEmailState {
  'off' = 0,
  'on' = 1,
}
