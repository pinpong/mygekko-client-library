import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Blind, BlindState } from './types';

const res = SystemType.blinds;

export class Blinds extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Blind} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Blind {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[3]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentState: tryParseFloat(values[0]),
      position: tryParseFloat(values[1]),
      rotationLevel: tryParseFloat(values[2]),
      rotationRange: tryParseFloat(values[4]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Blind[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Blind[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Blind>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Blind> {
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
   * @param {BlindState} state the new state
   * @throws {Error}
   */
  public async setState(itemId: string, state: BlindState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  /**
   * Sets the position.
   * @param {string} itemId  the item id
   * @param {number} position the new position
   * @throws {Error}
   */
  public async setPosition(itemId: string, position: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `P${position}`);
  }

  /**
   * Sets the angle.
   * @param {string} itemId  the item id
   * @param {number} angle the new angle
   * @throws {Error}
   */
  public async setAngle(itemId: string, angle: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `S${angle}`);
  }
}
