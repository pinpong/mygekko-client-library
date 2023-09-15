import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Light, LightState } from './types';

const res = SystemType.lights;

export class Lights extends BaseSystem {
  /**
   * Parses the item.
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Light} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Light {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[4]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentState: tryParseFloat(values[0]),
      dimLevel: tryParseFloat(values[1]),
      rgbColor: tryParseFloat(values[2]),
      tunableWhiteLevel: tryParseFloat(values[3]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Light[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Light[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Light>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Light> {
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
   * Sets the state.
   * @param {string} itemId  the item id
   * @param {LightState} state the new state
   */
  public async setState(itemId: string, state: LightState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  /**
   * Sets the dim level.
   * @param {string} itemId  the item id
   * @param {number} dimLevel the new dim level
   */
  public async setDimLevel(itemId: string, dimLevel: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `D${dimLevel}`);
  }

  /**
   * Sets the tunable white level.
   * @param {string} itemId  the item id
   * @param {number} tunableWhiteLevel the new tunable white level
   */
  public async setTunableWhiteLevel(itemId: string, tunableWhiteLevel: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `TW${tunableWhiteLevel}`);
  }

  /**
   * Sets the color.
   * @param {string} itemId  the item id
   * @param {number} color the new color
   */
  public async setColor(itemId: string, color: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${color}`);
  }
}
