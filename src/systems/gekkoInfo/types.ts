import { BaseSystemType } from '../base/types';

export type GekkoInfoItem = BaseSystemType & {
  gekkoName: string | null;
  language: string | null;
  version: number | null;
  hardware: string | null;
};
