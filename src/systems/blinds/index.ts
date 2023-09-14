import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { Blind, BlindState } from './types';

const res = SystemTypes.blinds;

export class Blinds extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): Blind {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      currentState: tryParseFloat(values[0]),
      position: tryParseFloat(values[1]),
      rotationLevel: tryParseFloat(values[2]),
      rotationRange: tryParseFloat(values[4]),
    };
  }

  public async getItems(): Promise<Blind[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Blind> {
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

  public async setState(itemId: string, state: BlindState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  public async setPosition(itemId: string, position: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `P${position}`);
  }

  public async setAngle(itemId: string, angle: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `S${angle}`);
  }
}
