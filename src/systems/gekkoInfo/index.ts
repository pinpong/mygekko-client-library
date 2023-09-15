import { SystemStatusResponse } from '../../client';
import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { tryParseInt } from '../../utils/numberUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { GekkoInfoItem } from './types';

const res = SystemType.network;

export class GekkoInfo extends BaseSystem {
  /**
   * Parses the item
   * @param {string} status the response from the status request
   * @returns {GekkoInfoItem} a parsed item
   */
  private parseItem(status: SystemStatusResponse): GekkoInfoItem {
    return {
      sumState: null,
      itemId: null,
      name: null,
      page: null,
      gekkoName: status['gekkoname']['value'],
      language: tryParseInt(status['language']['value']),
      version: tryParseInt(status['version']['value']),
      hardware: status['hardware']['value'],
    };
  }

  /**
   * Returns item.
   * @returns {Promise<GekkoInfoItem>} a item
   * @throws {Error}
   */
  public async getItem(): Promise<GekkoInfoItem> {
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
