import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Access, AccessState } from './types';

const systemType = SystemType.accesses;
/**
 * @group Systems
 */
export class Accesses extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<Access[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   */
  public async getItemById(itemId: string): Promise<Access> {
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
    await this.client.changeRequest(systemType, itemId, `${value}`);
  }
}
