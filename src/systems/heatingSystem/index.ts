import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { HeatingSystem } from './types';

const res = SystemTypes.heatingSystems;

export class HeatingSystems extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): HeatingSystem {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[5]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      flowTemperatureValue: tryParseFloat(values[2]),
      flowTemperatureSetPoint: tryParseFloat(values[3]),
      currentState: tryParseFloat(values[4]),
    };
  }

  public async getItems(): Promise<HeatingSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<HeatingSystem> {
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
