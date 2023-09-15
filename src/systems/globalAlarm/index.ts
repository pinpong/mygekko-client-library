import { SystemStatusResponse } from '../../client';
import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { tryParseFloat } from '../../utils/numberUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { GlobalAlarmItem } from './types';

const res = SystemType.alarm;

export class GlobalAlarm extends BaseSystem {
  /**
   * Parses the item
   * @param {string} status the response from the status request
   * @returns {GlobalAlarmItem} a parsed item
   */
  private parseItem(status: SystemStatusResponse): GlobalAlarmItem {
    return {
      sumState: null,
      itemId: null,
      name: null,
      page: null,
      state: tryParseFloat(status['sumstate']['value']),
    };
  }

  /**
   * Returns the  item.
   * @returns {Promise<GlobalAlarmItem>} a item
   * @throws {Error}
   */
  public async getItem(): Promise<GlobalAlarmItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(res, startDate, endDate, count);
  }
}
