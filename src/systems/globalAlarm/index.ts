import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { tryParseFloat } from '../../utils/numberUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { GlobalAlarmItem } from './types';

const res = SystemTypes.alarm;

export class GlobalAlarm extends BaseSystem {
  private parseItem(status: string): GlobalAlarmItem {
    return {
      sumState: null,
      itemId: null,
      name: null,
      page: null,
      state: tryParseFloat(status['sumstate']['value']),
    };
  }

  public async getItem(): Promise<GlobalAlarmItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }
}
