import { BaseSystemType } from '../base/types';

export type GekkoInfoItem = BaseSystemType & {
  /** The Hostname of myGEKKO device. */
  gekkoName: string | null;
  /** Language of myGEKKO device. */
  language: Language | null;
  /** Software version of myGEKKO device. */
  version: number | null;
  /** Hardware version of myGEKKO device. */
  hardware: string | null;
};

/** The languages. */
export enum Language {
  'german' = 0,
  'italian' = 1,
  'english' = 2,
  'dutch' = 3,
  'spanish' = 4,
  'french' = 5,
  'czech' = 6,
}
