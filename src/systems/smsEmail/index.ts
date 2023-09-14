import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { SmsEmail, SmsEmailState } from './types';

const res = SystemTypes.smsEmail;

export class SmsEmails extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): SmsEmail {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      currentState: tryParseFloat(values[0]),
    };
  }

  public async getItems(): Promise<SmsEmail[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<SmsEmail> {
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

  public async setState(itemId: string, state: SmsEmailState): Promise<void> {
    let value = -1;
    switch (state) {
      case SmsEmailState.off:
        value = -1;
        break;
      case SmsEmailState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(res, itemId, `${value}`);
  }
}
