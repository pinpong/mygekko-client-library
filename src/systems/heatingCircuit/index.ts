import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { HeatingCircuit } from './types';

const res = SystemTypes.heatingCircuits;

export class HeatingCircuits extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): HeatingCircuit {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[8]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      deviceModel: tryParseFloat(values[0]),
      flowTemperature: tryParseFloat(values[1]),
      returnFlowTemperature: tryParseFloat(values[2]),
      dewPoint: tryParseFloat(values[3]),
      pumpWorkingLevel: tryParseFloat(values[4]),
      coolingModeState: tryParseFloat(values[5]),
      flowTemperatureSetPoint: tryParseFloat(values[6]),
      valveOpeningLevel: tryParseFloat(values[7]),
      currentState: tryParseFloat(values[9]),
    };
  }

  public async getItems(): Promise<HeatingCircuit[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<HeatingCircuit> {
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
