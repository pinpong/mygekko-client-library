import { SystemStatusResponse } from '../../client';
import { throwErrorIfSystemIsNotEnabled } from '../../utils/errors/errorUtils';
import { tryParseInt } from '../../utils/extensions/numberUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { GekkoInfoItem } from './types';

const systemType = SystemType.network;

/**
 * @group Systems
 */
export class GekkoInfo extends BaseSystem {
  /**
   * Parses the item.
   * @param status - The response from the status request.
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
   * @throws {@link ClientError}
   */
  public async getItem(): Promise<GekkoInfoItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, systemType);

    const status = await this.client.systemStatusRequest(systemType);
    return this.parseItem(status);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
  }
}
