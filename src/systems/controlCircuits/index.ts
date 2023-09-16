import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { ControlCircuit } from './types';

const systemType = SystemType.controlCircuits;

/**
 * @group Systems
 */
export class ControlCircuits extends BaseSystem {
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
  ): ControlCircuit {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[2]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      sensor: tryParseFloat(values[0]),
      sensorType: tryParseFloat(values[1]),
      pump1WorkingPowerLevel: tryParseFloat(values[3]),
      pump2WorkingPowerLevel: tryParseFloat(values[4]),
      pump3WorkingPowerLevel: tryParseFloat(values[5]),
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<ControlCircuit[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
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
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<ControlCircuit> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }
}
