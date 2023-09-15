import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { AlarmSystem } from './types';

const res = SystemType.alarmSystem;

/**
 * Parses the item.
 * @param {SystemConfig} config  the myGEKKO device configuration
 * @param {string} status the response from the status request
 * @param {string} itemId  the item id
 */
export class AlarmSystems extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {AlarmSystem} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): AlarmSystem {
    const values = valuesToStringList(status);

    return {
      sumState: null,
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      alarmSystemState: tryParseFloat(values[0]),
      alarmDevices: [
        {
          zone: '1',
          type: values[1],
          sharpState: tryParseFloat(values[2]),
          systemState: tryParseFloat(values[3]),
        },
        {
          zone: '2',
          type: values[4],
          sharpState: tryParseFloat(values[5]),
          systemState: tryParseFloat(values[6]),
        },
      ],
      deviceModel: tryParseFloat(values[7]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<AlarmSystem[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<AlarmSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<AlarmSystem>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<AlarmSystem> {
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
   * @param {string} zone the zone
   * @throws {Error}
   */
  public async setSharped(itemId: string, zone: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `${zone}`);
  }
}
