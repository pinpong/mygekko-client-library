import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { HeatingCircuit } from './types';

const systemType = SystemType.heatingCircuits;

/**
 * @group Systems
 */
export class HeatingCircuits extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): HeatingCircuit {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[8]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      deviceModel: tryParseFloat(values[0]),
      flowTemperature: tryParseFloat(values[1]),
      returnFlowTemperature: tryParseFloat(values[2]),
      dewPoint: tryParseFloat(values[3]),
      pumpWorkingLevel: tryParseFloat(values[4]),
      coolingModeState: tryParseFloat(values[5]),
      flowTemperatureSetPoint: tryParseFloat(values[6]),
      valveOpeningLevel: tryParseFloat(values[7]),
      currentState: tryParseFloat(values[9]),
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<HeatingCircuit[]> {
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
  public async getItemById(itemId: string): Promise<HeatingCircuit> {
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
}
