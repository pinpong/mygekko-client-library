import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Analysis } from './types';

const res = SystemType.analyses;

export class Analyses extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Analysis} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Analysis {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[20]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      analysisVariables: [
        {
          currentState: tryParseFloat(values[0]),
          type: tryParseFloat(values[1]),
          name: values[2],
          value: tryParseFloat(values[3]),
          unit: values[4],
        },
        {
          currentState: tryParseFloat(values[5]),
          type: tryParseFloat(values[6]),
          name: values[7],
          value: tryParseFloat(values[8]),
          unit: values[9],
        },
        {
          currentState: tryParseFloat(values[10]),
          type: tryParseFloat(values[11]),
          name: values[12],
          value: tryParseFloat(values[13]),
          unit: values[14],
        },
        {
          currentState: tryParseFloat(values[15]),
          type: tryParseFloat(values[16]),
          name: values[17],
          value: tryParseFloat(values[18]),
          unit: values[19],
        },
      ],
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Analysis[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Analysis[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Analysis>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Analysis> {
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
}
