import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Sauna, SaunaWorkingMode } from './types';

const systemType = SystemType.saunas;

/**
 * @group Systems
 */
export class Saunas extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<Sauna[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<Sauna> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(systemType, itemId, startDate, endDate, count);
  }

  /**
   * Sets the mode.
   * @param itemId - The item id.
   * @param mode - The new mode.
   */
  public async setMode(itemId: string, mode: SaunaWorkingMode): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `${mode}`);
  }
}
