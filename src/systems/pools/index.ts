import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Pool } from './types';

const res = SystemType.pools;

export class Pools extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Pool} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Pool {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      workingMode: tryParseFloat(values[0]),
      filteringState: tryParseFloat(values[1]),
      backwashState: tryParseFloat(values[2]),
      waterTemperature: tryParseFloat(values[4]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Pool[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Pool[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Pool>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Pool> {
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

  /// TODO: implement all other function

  /**
   * Sets the temperature.
   * @param {string} itemId  the item id
   * @param {number} temperature the new temperature
   */
  public async setTemperatur(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `T${temperature}`);
  }
}
