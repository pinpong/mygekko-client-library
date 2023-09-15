import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Sauna, SaunaWorkingMode } from './types';

const res = SystemType.saunas;

export class Saunas extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Sauna} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Sauna {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      workingMode: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      errorState: tryParseFloat(values[4]),
      roomTemperature: tryParseFloat(values[5]),
      roomTemperatureSetPoint: tryParseFloat(values[6]),
      burnerTemperature: tryParseFloat(values[7]),
      roomRelativeHumidityLevel: tryParseFloat(values[8]),
      roomRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Sauna[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Sauna[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Sauna>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Sauna> {
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
   * Sets the mode.
   * @param {string} itemId  the item id
   * @param {SaunaWorkingMode} mode the new mode
   */
  public async setMode(itemId: string, mode: SaunaWorkingMode): Promise<void> {
    await this.client.changeRequest(res, itemId, `${mode}`);
  }
}
