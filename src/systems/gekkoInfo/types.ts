import { BaseSystem } from '../base/types';

export type GekkoInfoItem = BaseSystem & {
  gekkoName?: string;
  language?: string;
  version?: number;
  hardware?: string;
};
