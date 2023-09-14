import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Pool } from './types';

const res = SystemTypes.pools;

export class Pools extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): Pool {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      workingMode: tryParseFloat(values[0]),
      filteringState: tryParseFloat(values[1]),
      backwashState: tryParseFloat(values[2]),
      waterTemperature: tryParseFloat(values[4]),
    };
  }

  public async getItems(): Promise<Pool[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Pool> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }

  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  /// TODO: implement all other function

  public async setTemperatur(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `T${temperature}`);
  }
}
