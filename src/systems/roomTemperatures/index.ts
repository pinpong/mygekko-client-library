import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from './types';

const res = SystemType.roomTemperatures;

export class RoomTemperatures extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {RoomTemperature} a parsed item
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
   * @returns {Promise<RoomTemperature[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<RoomTemperature[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<RoomTemperature>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<RoomTemperature> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(res, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param {string} itemId  the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  /**
   * Sets the temperature set point.
   * @param {string} itemId  the item id
   * @param {number} temperature the new temperature
   */
  public async setTemperaturSetPoint(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `S${temperature}`);
  }

  /**
   * Sets the temperature adjust.
   * @param {string} itemId  the item id
   * @param {number} temperature the new temperature adjust
   */
  public async setTemperatureAdjust(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `K${temperature}`);
  }

  /**
   * Sets the working mode.
   * @param {string} itemId  the item id
   * @param {RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx} mode the new working mode
   */
  public async setWorkingMode(
    itemId: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx
  ): Promise<void> {
    await this.client.changeRequest(res, itemId, `M${mode}`);
  }
}
