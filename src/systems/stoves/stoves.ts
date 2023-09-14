import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Stove } from './types';

const res = SystemTypes.stoves;

export class Stoves extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): Stove {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[4]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      temperature: tryParseFloat(values[0]),
      flapOpeningLevel: tryParseFloat(values[1]),
      currentState: tryParseFloat(values[2]),
      workingState: tryParseFloat(values[3]),
    };
  }

  public async getItems(): Promise<Stove[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Stove> {
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
}
