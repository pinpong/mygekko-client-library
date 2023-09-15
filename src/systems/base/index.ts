import { ItemStatusResponse, LocalClient, RemoteClient, SystemStatusResponse } from '../../client';
import {
  throwErrorIfItemIdIsNoFound,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotEnabled,
} from '../../utils/errorUtils';
import { SystemType, Trend, TrendItem } from './types';

export class BaseSystem {
  /** The client instance */
  protected readonly client: LocalClient | RemoteClient;

  /**
   * The base system constructor.
   * @param {LocalClient | RemoteClient} client the client.
   */
  public constructor(client: LocalClient | RemoteClient) {
    this.client = client;
  }

  /**
   * Return the complete status by system.
   * @param {SystemType} res the system type
   * @returns {string} the response
   * @throws {Error}
   */
  protected async getCompleteStatus(res: SystemType): Promise<SystemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    return await this.client.systemStatusRequest(res);
  }

  /**
   * Return the status by system and item id.
   * @param {SystemType} res the system type
   * @param {string} itemId the item id
   * @returns {string} the response
   * @throws {Error}
   */
  protected async getStatusById(res: SystemType, itemId: string): Promise<ItemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, res, itemId);

    return await this.client.itemStatusRequest(res, itemId);
  }

  /**
   * Return a parsed trend.
   * @param {SystemType} res the system type
   * @param {string} item the item
   * @param {string} itemId the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} the response
   * @throws {Error}
   */
  private async parseItemTrend(
    res: SystemType,
    item: string,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item['trends'])) {
      const response = await this.client.getTrendByItemId(
        res,
        itemId,
        trendId,
        startDate,
        endDate,
        count
      );

      trendItems.push({
        trendId: trendId,
        data: response.trendData,
        dataCount: response.datacount,
        description: item['trends'][trendId]['description'],
        endDate: endDate,
        startDate: startDate,
        unit: item['trends'][trendId]['unit'],
      });
    }
    return {
      itemId: itemId,
      name: item['name'],
      trends: trendItems,
    };
  }

  /**
   * Return parsed trends.
   * @param {SystemType} res the system type
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend[]>} the response
   * @throws {Error}
   */
  protected async getTrendsStatuses(
    res: SystemType,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend[]> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, res);

    const items: Trend[] = [];
    for (const key of Object.keys(this.client.trendConfig[res])) {
      items.push(
        await this.parseItemTrend(
          res,
          this.client.trendConfig[res][key],
          key,
          startDate,
          endDate,
          count
        )
      );
    }
    return items;
  }

  /**
   * Return a parsed trend item.
   * @param {SystemType} res the system type
   * @param {string} itemId the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {string} the response
   * @throws {Error}
   */
  protected async getTrendStatus(
    res: SystemType,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, res);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, res, itemId);

    return await this.parseItemTrend(
      res,
      this.client.trendConfig[res][itemId],
      itemId,
      startDate,
      endDate,
      count
    );
  }
}
