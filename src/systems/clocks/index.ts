import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Clock, ClockState } from './types';

const res = SystemTypes.clocks;

export class Clocks extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): Clock {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[2]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[1]),
    };
  }

  public async getItems(): Promise<Clock[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Clock> {
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

  public async setState(itemId: string, state: ClockState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }
}
