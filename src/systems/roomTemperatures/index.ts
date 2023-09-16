import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from './types';

const systemType = SystemType.roomTemperatures;

/**
 * @group Systems
 */
export class RoomTemperatures extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): RoomTemperature {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[6]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
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

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<RoomTemperature[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<RoomTemperature> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(systemType, itemId, startDate, endDate, count);
  }

  /**
   * Sets the temperature set point.
   * @param itemId - The item id.
   * @param temperature - The new temperature.
   */
  public async setTemperaturSetPoint(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `S${temperature}`);
  }

  /**
   * Sets the temperature adjust.
   * @param itemId - The item id.
   * @param temperature - The new temperature adjust.
   */
  public async setTemperatureAdjust(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `K${temperature}`);
  }

  /**
   * Sets the working mode.
   * @param itemId - The item id.
   * @param mode - The new working mode.
   */
  public async setWorkingMode(
    itemId: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx
  ): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `M${mode}`);
  }
}
