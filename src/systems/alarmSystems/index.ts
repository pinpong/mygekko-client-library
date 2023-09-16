import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { AlarmSystem } from './types';

const systemType = SystemType.alarmSystem;

/**
 * Parses the item.
 * @param config - The myGEKKO device configuration.
 * @param status - The response from the status request.
 * @param itemId - The item id.
 */
/**
 * @group Systems
 */
export class AlarmSystems extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<AlarmSystem[]> {
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
  public async getItemById(itemId: string): Promise<AlarmSystem> {
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
   * @param zone - The zone.
   * @throws {@link ClientError}
   */
  public async setSharped(itemId: string, zone: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `${zone}`);
  }
}
