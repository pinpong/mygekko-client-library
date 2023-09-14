import { Client } from '../../client';
import {
  throwErrorIfItemIdIsNoAvailable,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotAvailable,
} from '../../utils/errorUtils';
import { SystemTypes, Trend, TrendItem } from './types';

export class BaseSystem {
  protected readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  protected async getCompleteStatus(res: SystemTypes): Promise<string> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    return await this.client.systemStatusRequest(res);
  }

  protected async getStatusById(res: SystemTypes, itemId: string): Promise<string> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);
    throwErrorIfItemIdIsNoAvailable(this.client.trendConfig, res, itemId);

    return await this.client.itemStatusRequest(res, itemId);
  }

  private async parseItemTrend(
    res: SystemTypes,
    item: string,
    key: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item['trends'])) {
      const response = await this.client.getTrend(res, trendId, startDate, endDate, count);

      trendItems.push({
        trendId: trendId,
        data: response['trendData'],
        dataCount: response['datacount'],
        description: item['description'],
        endDate: endDate,
        startDate: startDate,
        unit: response['unit'],
      });
    }
    return {
      itemId: key,
      name: item['name'],
      trends: trendItems,
    };
  }

  protected async getTrendsStatus(
    res: SystemTypes,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend[]> {
    throwErrorIfTrendIsNotAvailable(this.client.trendConfig, res);

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

  protected async getTrendStatus(
    res: SystemTypes,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    throwErrorIfTrendIsNotAvailable(this.client.trendConfig, res);
    throwErrorIfItemIdIsNoAvailable(this.client.trendConfig, res, itemId);

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
