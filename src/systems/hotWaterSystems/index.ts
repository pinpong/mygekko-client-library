import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { HotWaterSystem, HotWaterSystemState } from './types';

const res = SystemTypes.hotWaterSystems;

export class HotWaterSystems extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): HotWaterSystem {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[7]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      waterTemperatureSetPoint: tryParseFloat(values[2]),
      waterTemperatureTop: tryParseFloat(values[3]),
      waterTemperatureBottom: tryParseFloat(values[4]),
      collectorTemperature: tryParseFloat(values[5]),
      currentState: tryParseFloat(values[6]),
    };
  }

  public async getItems(): Promise<HotWaterSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<HotWaterSystem> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  public async setState(itemId: string, state: HotWaterSystemState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  public async setTemperature(itemId: string, temperatur: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `T${temperatur}`);
  }
}
