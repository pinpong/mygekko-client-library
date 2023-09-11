import { BaseSystem } from '../base/types';

export type Cam = BaseSystem & {
  newRecordCount?: number;
  imageUrl?: string;
  streamUrl?: string;
  cgiUrl?: string;
};
