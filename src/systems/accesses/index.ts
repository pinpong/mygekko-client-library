import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Access, AccessState } from './types';

const res = SystemType.accesses;

export class Accesses extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Access} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Access {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[1]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[2]),
      gateRuntimePercentage: tryParseFloat(values[3]),
      accessType: tryParseFloat(values[4]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Accesses[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Access[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Access>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Access> {
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
   * @param {AccessState} state the new state
   * @throws {Error}
   */
  public async setOpenState(itemId: string, state: AccessState): Promise<void> {
    let value = -1;
    switch (state) {
      case AccessState.close:
        value = -1;
        break;
      case AccessState.open:
        value = 1;
        break;
      case AccessState.keepOpen:
        value = 2;
        break;
    }
    await this.client.changeRequest(res, itemId, `${value}`);
  }
}
