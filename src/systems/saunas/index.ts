import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Sauna, SaunaWorkingMode } from './types';

const res = SystemTypes.saunas;

export class Saunas extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): Sauna {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      workingMode: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      errorState: tryParseFloat(values[4]),
      roomTemperature: tryParseFloat(values[5]),
      roomTemperatureSetPoint: tryParseFloat(values[6]),
      burnerTemperature: tryParseFloat(values[7]),
      roomRelativeHumidityLevel: tryParseFloat(values[8]),
      roomRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
    };
  }

  public async getItems(): Promise<Sauna[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Sauna> {
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

  public async setMode(itemId: string, mode: SaunaWorkingMode): Promise<void> {
    await this.client.changeRequest(res, itemId, `${mode}`);
  }
}
