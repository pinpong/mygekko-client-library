import { ItemStatusResponse, LocalClient, RemoteClient, SystemStatusResponse } from '../../client';
import {
  throwErrorIfItemIdIsNoFound,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotEnabled,
} from '../../utils/errors/errorUtils';
import { SystemType, Trend, TrendItem } from './types';

/**
 *
 */
export class BaseSystem {
  /** The client instance */
  protected readonly client: LocalClient | RemoteClient;

  /**
   * The base system constructor.
   * @param client - The client.
   */
  public constructor(client: LocalClient | RemoteClient) {
    this.client = client;
  }

  /**
   * Return the complete status by system.
   * @param systemType - The system type.
   * @throws {@link ClientError}
   */
  protected async getCompleteStatus(systemType: SystemType): Promise<SystemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, systemType);

    return await this.client.systemStatusRequest(systemType);
  }

  /**
   * Return the status by system and item id.
   * @param systemType - The system type.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  protected async getStatusById(
    systemType: SystemType,
    itemId: string
  ): Promise<ItemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, systemType);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, systemType, itemId);

    return await this.client.itemStatusRequest(systemType, itemId);
  }

  /**
   * Return a parsed trend.
   * @param systemType - The system type.
   * @param item - The item.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  private async parseItemTrend(
    systemType: SystemType,
    item: string,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item['trends'])) {
      const response = await this.client.getTrendByItemId(
        systemType,
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
   * @param systemType - The system type.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  protected async getTrendsStatuses(
    systemType: SystemType,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend[]> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, systemType);

    const items: Trend[] = [];
    for (const key of Object.keys(this.client.trendConfig[systemType])) {
      items.push(
        await this.parseItemTrend(
          systemType,
          this.client.trendConfig[systemType][key],
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
   * @param systemType - The system type.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  protected async getTrendStatus(
    systemType: SystemType,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, systemType);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, systemType, itemId);

    return await this.parseItemTrend(
      systemType,
      this.client.trendConfig[systemType][itemId],
      itemId,
      startDate,
      endDate,
      count
    );
  }
}
