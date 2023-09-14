import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { HotWaterCirculation, HotWaterCirculationState } from './types';

const res = SystemTypes.hotWaterCirculations;

export class HotWaterCirculations extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): HotWaterCirculation {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[4]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      pumpType: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      returnWaterTemperature: tryParseFloat(values[2]),
      returnWaterTemperatureSetPoint: tryParseFloat(values[3]),
    };
  }

  public async getItems(): Promise<HotWaterCirculation[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<HotWaterCirculation> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async setState(itemId: string, state: HotWaterCirculationState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
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
