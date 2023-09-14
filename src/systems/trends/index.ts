import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Analysis } from './types';

const res = SystemTypes.analyses;

export class Analyses extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): Analysis {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[20]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      analysisVariables: [
        {
          currentState: tryParseFloat(values[0]),
          type: tryParseFloat(values[1]),
          name: values[2],
          value: tryParseFloat(values[3]),
          unit: values[4],
        },
        {
          currentState: tryParseFloat(values[5]),
          type: tryParseFloat(values[6]),
          name: values[7],
          value: tryParseFloat(values[8]),
          unit: values[9],
        },
        {
          currentState: tryParseFloat(values[10]),
          type: tryParseFloat(values[11]),
          name: values[12],
          value: tryParseFloat(values[13]),
          unit: values[14],
        },
        {
          currentState: tryParseFloat(values[15]),
          type: tryParseFloat(values[16]),
          name: values[17],
          value: tryParseFloat(values[18]),
          unit: values[19],
        },
      ],
    };
  }

  public async getItems(): Promise<Analysis[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Analysis> {
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
