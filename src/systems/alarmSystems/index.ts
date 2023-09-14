import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { AlarmSystem } from './types';

const res = SystemTypes.alarmSystem;

export class AlarmSystems extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): AlarmSystem {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      alarmSystemState: tryParseFloat(values[0]),
      alarmDevices: [
        {
          zone: '1',
          type: values[1],
          sharpState: tryParseFloat(values[2]),
          systemState: tryParseFloat(values[3]),
        },
        {
          zone: '2',
          type: values[4],
          sharpState: tryParseFloat(values[5]),
          systemState: tryParseFloat(values[6]),
        },
      ],
      deviceModel: tryParseFloat(values[7]),
    };
  }

  public async getItems(): Promise<AlarmSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<AlarmSystem> {
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

  public async setSharped(itemId: string, zone: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `${zone}`);
  }
}
