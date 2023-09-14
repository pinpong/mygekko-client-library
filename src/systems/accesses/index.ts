import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Access, AccessState } from './types';

const res = SystemTypes.accesses;

export class Accesses extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): Access {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[1]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[2]),
      gateRuntimePercentage: tryParseFloat(values[3]),
      accessType: tryParseFloat(values[4]),
    };
  }

  public async getItems(): Promise<Access[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Access> {
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

  public async setOpenState(itemId: string, state: AccessState): Promise<void> {
    let value = -1;
    switch (state) {
      case AccessState.close:
        value = -1;
        break;
      case AccessState.open:
        value = 1;
        break;
      case AccessState.keepOpen:
        value = 2;
        break;
    }
    await this.client.changeRequest(res, itemId, `${value}`);
  }
}
