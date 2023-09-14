import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { GekkoInfoItem } from './types';

const res = SystemTypes.network;

export class GekkoInfo extends BaseSystem {
  private parseItem(status: string): GekkoInfoItem {
    return {
      sumState: null,
      itemId: null,
      name: null,
      page: null,
      gekkoName: status['gekkoname']['value'],
      language: status['language']['value'],
      version: status['version']['value'],
      hardware: status['hardware']['value'],
    };
  }

  public async getItem(): Promise<GekkoInfoItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }
}
