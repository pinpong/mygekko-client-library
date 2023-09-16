import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Blind, BlindState } from './types';

const systemType = SystemType.blinds;

/**
 * @group Systems
 */
export class Blinds extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<Blind[]> {
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
  public async getItemById(itemId: string): Promise<Blind> {
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
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   * @throws {@link ClientError}
   */
  public async setState(itemId: string, state: BlindState): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `${state}`);
  }

  /**
   * Sets the position.
   * @param itemId - The item id.
   * @param position - The new position.
   * @throws {@link ClientError}
   */
  public async setPosition(itemId: string, position: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `P${position}`);
  }

  /**
   * Sets the angle.
   * @param itemId - The item id.
   * @param angle - The new angle.
   * @throws {@link ClientError}
   */
  public async setAngle(itemId: string, angle: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `S${angle}`);
  }
}
