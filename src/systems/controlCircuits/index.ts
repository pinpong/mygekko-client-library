import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { ControlCircuit } from './types';

const res = SystemTypes.controlCircuits;

export class ControlCircuits extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): ControlCircuit {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[2]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      sensorValue: tryParseFloat(values[0]),
      sensorType: tryParseFloat(values[1]),
      pump1WorkingPowerLevel: tryParseFloat(values[3]),
      pump2WorkingPowerLevel: tryParseFloat(values[4]),
      pump3WorkingPowerLevel: tryParseFloat(values[5]),
    };
  }

  public async getItems(): Promise<ControlCircuit[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
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

  public async getItemById(itemId: string): Promise<ControlCircuit> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }
}
