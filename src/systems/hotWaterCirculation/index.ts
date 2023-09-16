import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { HotWaterCirculation, HotWaterCirculationState } from './types';

const systemType = SystemType.hotWaterCirculations;

/**
 * @group Systems
 */
export class HotWaterCirculations extends BaseSystem {
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
  ): HotWaterCirculation {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[4]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      pumpType: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      returnWaterTemperature: tryParseFloat(values[2]),
      returnWaterTemperatureSetPoint: tryParseFloat(values[3]),
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<HotWaterCirculation[]> {
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
  public async getItemById(itemId: string): Promise<HotWaterCirculation> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: HotWaterCirculationState): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `${state}`);
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
