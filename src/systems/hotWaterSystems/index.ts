import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { HotWaterSystem, HotWaterSystemState } from './types';

const res = SystemType.hotWaterSystems;

export class HotWaterSystems extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {HotWaterSystem} a parsed item
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): HotWaterSystem {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[7]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      waterTemperatureSetPoint: tryParseFloat(values[2]),
      waterTemperatureTop: tryParseFloat(values[3]),
      waterTemperatureBottom: tryParseFloat(values[4]),
      collectorTemperature: tryParseFloat(values[5]),
      currentState: tryParseFloat(values[6]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<HotWaterSystem[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<HotWaterSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<HotWaterSystem>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<HotWaterSystem> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
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
   * @param {HotWaterSystemState} state the new state
   */
  public async setState(itemId: string, state: HotWaterSystemState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  /**
   * Sets the temperature.
   * @param {string} itemId  the item id
   * @param {number} temperatur the new state
   */
  public async setTemperature(itemId: string, temperatur: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `T${temperatur}`);
  }
}
