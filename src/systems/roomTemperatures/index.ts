import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from './types';

const res = SystemTypes.roomTemperatures;

export class RoomTemperatures extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): RoomTemperature {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[6]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
      temperature: tryParseFloat(values[0]),
      temperatureSetPoint: tryParseFloat(values[1]),
      valveOpeningLevel: tryParseFloat(values[2]),
      workingMode: tryParseFloat(values[3]),
      reserved: values[4],
      temperatureAdjustment: tryParseFloat(values[5]),
      coolingModeState: tryParseFloat(values[7]),
      relativeHumidity: tryParseFloat(values[8]),
      airQualityLevel: tryParseFloat(values[8]),
      floorTemperature: tryParseFloat(values[10]),
      deviceModel: tryParseFloat(values[11]),
    };
  }

  public async getItems(): Promise<RoomTemperature[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<RoomTemperature> {
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

  public async setTemperaturSetPoint(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `S${temperature}`);
  }

  public async setTemperatureAdjust(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `K${temperature}`);
  }

  public async setWorkingMode(
    itemId: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx
  ): Promise<void> {
    await this.client.changeRequest(res, itemId, `M${mode}`);
  }
}
