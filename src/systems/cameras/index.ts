import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Camera } from './types';

const res = SystemTypes.cameras;

export class Cameras extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): Camera {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      newRecordCount: tryParseFloat(values[0]),
      imageUrl: config[key]['imagepath'] ?? null,
      streamUrl: config[key]['streampath'] ?? null,
      cgiUrl: config[key]['cgipath'] ?? null,
    };
  }

  public async getItems(): Promise<Camera[]> {
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

  public async getItemById(itemId: string): Promise<Camera> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }
}
