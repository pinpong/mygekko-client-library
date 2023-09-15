import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { ControlCircuit } from './types';

const res = SystemType.controlCircuits;

export class ControlCircuits extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {ControlCircuit} a parsed item
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): ControlCircuit {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[2]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      sensor: tryParseFloat(values[0]),
      sensorType: tryParseFloat(values[1]),
      pump1WorkingPowerLevel: tryParseFloat(values[3]),
      pump2WorkingPowerLevel: tryParseFloat(values[4]),
      pump3WorkingPowerLevel: tryParseFloat(values[5]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<ControlCircuit[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<ControlCircuit[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
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
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<ControlCircuit>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<ControlCircuit> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }
}
