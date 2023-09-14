import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Light, LightState } from './types';

const res = SystemTypes.lights;

export class Lights extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): Light {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[4]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      currentState: tryParseFloat(values[0]),
      dimLevel: tryParseFloat(values[1]),
      rgbColor: tryParseFloat(values[2]),
      tunableWhiteLevel: tryParseFloat(values[3]),
    };
  }

  public async getItems(): Promise<Light[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Light> {
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

  public async setState(itemId: string, state: LightState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  public async setDimLevel(itemId: string, dimLevel: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `D${dimLevel}`);
  }

  public async setTunableWhiteLevel(itemId: string, tunableWhiteLevel: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `TW${tunableWhiteLevel}`);
  }

  public async setColor(itemId: string, color: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${color}`);
  }
}
