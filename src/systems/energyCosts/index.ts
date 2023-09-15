import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { EnergyCost } from './types';

const res = SystemType.energyCosts;

export class EnergyCosts extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {EnergyCost} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): EnergyCost {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[15]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentPower: tryParseFloat(values[0]),
      totalEnergyToday: tryParseFloat(values[1]),
      totalEnergyMonth: tryParseFloat(values[2]),
      totalEnergy: tryParseFloat(values[3]),
      nominalPower: tryParseFloat(values[4]),
      energyUnit: values[5],
      powerUnit: values[6],
      totalEnergyToday0h6h: tryParseFloat(values[7]),
      totalEnergyToday6h12h: tryParseFloat(values[8]),
      totalEnergyToday12h18h: tryParseFloat(values[9]),
      totalEnergyToday18h24h: tryParseFloat(values[10]),
      totalEnergyYesterday0h6h: tryParseFloat(values[11]),
      totalEnergyYesterday6h12h: tryParseFloat(values[12]),
      totalEnergyYesterday12h18h: tryParseFloat(values[13]),
      totalEnergyYesterday18h24h: tryParseFloat(values[14]),
      totalEnergyThisYear: tryParseFloat(values[15]),
      totalEnergyInPeriod: tryParseFloat(values[16]),
      startDateTotalEnergyInPeriod: values[17],
      counterDirection: tryParseFloat(values[18]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<EnergyCost[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<EnergyCost[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<EnergyCost>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<EnergyCost> {
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
